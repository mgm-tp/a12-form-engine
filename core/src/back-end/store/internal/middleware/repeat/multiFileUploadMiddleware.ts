/*
 * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
 *
 * Copyright (c) 2012-2026 mgm technology partners GmbH
 *
 * Dual License
 * ------------
 * This source file is part of the mgm A12 Platform and available under
 * a choice of two different licenses:
 *
 * 1. Open-Source License - EUPL v1.2
 *    You may redistribute and/or modify this file under the terms of the
 *    European Union Public License, version 1.2 - see https://eupl.eu/.
 *
 * 2. Commercial License
 *    Alternatively, you may obtain a commercial license from
 *    mgm technology partners GmbH, that permits use of this software
 *    under different terms (including support and maintenance services).
 *
 *    Please contact a12-license@mgm-tp.com for more information.
 *
 * You must select and comply with exactly one of the above license options.
 *
 * Warranty Disclaimer (applies to either option)
 * ----------------------------------------------
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF ANY KIND,
 * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE
 * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.
 */

import type { Middleware } from "redux";

import type { EntityInstancePath, GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import { RepeatData } from "../../../../../data/internal/repeat.js";
import { findElementByFormModelPath } from "../../../../../models/index.js";
import { isFormModelRepeat } from "../../../../../models/internal/FormModelGuards.js";
import * as DocumentModelUtils from "../../../../../models/internal/utils/document-model-utils.js";
import {
	DocumentPath,
	DocumentUtils,
	InternalDocumentPath
} from "../../../../../models/internal/utils/document-utils.js";
import { ReadonlyObjectMap } from "../../../../../models/internal/utils/json.js";
import { createGroupInstance } from "../../../../../models/internal/utils/model-utils.js";
import { getDocumentPath } from "../../../../utils/internal/path.js";
import { Commands, Events } from "../../actions.js";
import { validateChangesAndUpdateMessages } from "../../change-validation.js";
import { KernelComputation } from "../../computation.js";
import { ChangeMapCreators } from "../../documentChange.js";
import type { Change } from "../../documentChange.js";
import { DataSelectors } from "../../selectors/data.js";
import { ModelSelectors } from "../../selectors/models.js";
import { UiStateSelectors } from "../../selectors/ui-state.js";

import type { MiddlewareOptions } from "../middleware-options.js";
import { updateDataDirtyState } from "../updateDirtyState.js";
import { createChangesForAttachment } from "../value-change/handleAttachmentValueChange.js";

/**
 * @internal
 *
 * Listens to Events.Repeat.multiFileUpload and implements the semantics of this action by
 * adding and/or replacing the attachments into the document.
 * Also includes all further steps after document changes like validation or updating message, dirty and screen state.
 */
export function multiFileUploadMiddlewareFactory(middlewareOptions: MiddlewareOptions): Middleware {
	return api => next => action => {
		const result = next(action);

		if (Events.Repeat.multiFileUpload.match(action)) {
			const state = api.getState();
			const dispatch = api.dispatch;

			const messages = UiStateSelectors.messages()(state);
			const document = DataSelectors.document()(state) as GroupInstance;
			const formModel = ModelSelectors.formModel()(state);
			const documentModel = ModelSelectors.documentModel()(state);

			const group = DocumentModelUtils.findByPath(documentModel, action.payload.path);

			const groupDocumentPath = DataSelectors.documentPath(action.payload.path)(state);

			const rows = DocumentUtils.getRows(document, groupDocumentPath);
			const rowCountBefore = rows !== undefined ? rows.length : 0;

			let newDocument = document;
			/*
			 * Parallel document used as a baseline for validation comparison:
			 * new rows added via addNewRow (with initial values) but WITHOUT attachment values.
			 * Used to identify which validation errors appear specifically because attachment
			 * values were set — not merely because a new row was created.
			 */
			let newDocumentWithOnlyGroupsAdded = document;
			const changes: Change[] = [];
			const attachmentPaths: EntityInstancePath[] = [];
			const attachmentAddedChanges: Change[] = [];
			let firstNewRowPath: EntityInstancePath | undefined = undefined;

			if (action.payload.toBeReplaced) {
				for (let i = 0; i < action.payload.toBeReplaced.length; i++) {
					const entry = action.payload.toBeReplaced[i];

					if (i === 0) {
						firstNewRowPath = entry.path.slice(0, entry.path.length - 1);
					}

					newDocument = DocumentUtils.setValue(newDocument, entry.path, entry.value, documentModel);
					newDocumentWithOnlyGroupsAdded = DocumentUtils.setValue(
						newDocumentWithOnlyGroupsAdded,
						entry.path,
						entry.value,
						documentModel
					);

					const changesForAttachment = ReadonlyObjectMap.values(
						createChangesForAttachment(entry.path, entry.value)
					);

					changes.push(...changesForAttachment);
					attachmentPaths.push(entry.path);
				}
			}

			for (let i = 0; i < action.payload.toBeAdded.length; i++) {
				const attachment = action.payload.toBeAdded[i];
				const row = createGroupInstance(group, formModel, action.payload.path);
				const newRowPath = [
					...InternalDocumentPath.parentPath(groupDocumentPath),
					{
						elementName: groupDocumentPath[groupDocumentPath.length - 1].elementName,
						index: rowCountBefore + i + 1
					}
				];
				const newAttachmentPath = getDocumentPath(
					documentModel,
					action.payload.attachmentModelPath,
					newRowPath
				);

				if (i === 0) {
					firstNewRowPath = newRowPath;
				}

				newDocument = DocumentUtils.addNewRow(
					newDocument,
					groupDocumentPath,
					row,
					documentModel,
					formModel
				);
				newDocument = DocumentUtils.setValue(
					newDocument,
					newAttachmentPath,
					attachment,
					documentModel
				);

				// Groups-only baseline: add the row (with initial values) but do NOT set attachment values.
				// This lets us later compare validation results to find errors triggered by attachment upload.
				newDocumentWithOnlyGroupsAdded = DocumentUtils.addNewRow(
					newDocumentWithOnlyGroupsAdded,
					groupDocumentPath,
					row,
					documentModel,
					formModel
				);

				changes.push({ type: "GroupAdded", path: groupDocumentPath });
				attachmentPaths.push(newAttachmentPath);
				attachmentAddedChanges.push(
					...ReadonlyObjectMap.values(createChangesForAttachment(newAttachmentPath, attachment))
				);
			}

			// Changes produced by adding / changing group instances via multi file upload
			const changeEntries = ChangeMapCreators.fromList(changes);

			let computedDocument: GroupInstance;
			let changesFromComputations: ReturnType<typeof ChangeMapCreators.difference>;
			let finalMessages: typeof messages;

			if (action.payload.toBeAdded.length === 0) {
				/*
				 * Fast path: pure attachment replacement (no rows added).
				 *
				 * Without new rows there is nothing to defer: existing rows already have
				 * their other fields in their previously-validated state. We can use the
				 * bundled compute+validate helper, matching the pattern used by other
				 * repeat middlewares (add/clone/remove) and the pre-A12E-3602 behaviour.
				 */
				const updatedResult = KernelComputation.internalComputeThenValidate({
					document: newDocument,
					messages,
					middlewareOptions,
					state,
					existingChanges: changeEntries
				});

				computedDocument = updatedResult.document;
				finalMessages = updatedResult.messages;
				changesFromComputations = ChangeMapCreators.difference(
					updatedResult.changes,
					changeEntries
				);
			} else {
				/*
				 * Slow path: at least one new row is added. We need to distinguish
				 * validation errors triggered by attachment values from errors caused
				 * merely by group addition, so that errors only relevant to the new row's
				 * non-attachment fields are deferred to on-leave validation.
				 */
				const models = {
					documentModel,
					formModel,
					validatorProvider: ModelSelectors.validationCode()(state)
				};
				const kernelOptions = middlewareOptions.kernelOptionsProvider?.(state);

				/*
				 * Baseline computation: evaluate computations and dependencies on only-groups-added document (no attachment values).
				 * Used to establish which validation errors exist purely from group addition — e.g. from
				 * initial values or computations that depend on group structure, not on attachment field values.
				 */
				const { document: computedDocumentWithOnlyGroupsAdded } =
					KernelComputation.computeAndEvaluateDependencies({
						models,
						document: newDocumentWithOnlyGroupsAdded,
						kernelOptions,
						changes: changeEntries
					});

				// Full computation: evaluate all computations and dependencies after group additions and attachment value changes
				const {
					document: fullComputedDocument,
					changes: computationChanges,
					parseErrors
				} = KernelComputation.computeAndEvaluateDependencies({
					models,
					document: newDocument,
					kernelOptions,
					changes: changeEntries
				});

				/*
				 * Changes from the multi file upload changed instances and
				 * additional changes from triggered computations or dependencies
				 *
				 * Also include attachment field changes for toBeAdded rows. These
				 * are not included in the changes for setDocument, since there the
				 * groupAdded changes are sufficient, but they are needed for
				 * field-level validation.
				 */
				const allChanges = ChangeMapCreators.union(
					ChangeMapCreators.union(changeEntries, computationChanges),
					ChangeMapCreators.fromList(attachmentAddedChanges)
				);

				/*
				 * Separate the changes from computation because there might be
				 * multiple "group added" changes and they all have the same path
				 * (pointing to the repeatable group context, not the added row!).
				 *
				 * ChangeMapCreators.union merges both sets in a single map with
				 * key=path, which would lose those group changes!
				 */
				changesFromComputations = ChangeMapCreators.difference(computationChanges, changeEntries);

				/*
				 * Validation comparison: find which validation errors appear specifically
				 * because attachment values were set — not just because a row was added.
				 *
				 * Baseline: validate all changed fields against the computed only-groups-added document (no attachment values).
				 * Full: validate all changed fields against the computed document (attachment values present).
				 *
				 * Fields present in full messages but absent from baseline have attachment-triggered
				 * validation errors and should be validated immediately after upload.
				 * This also catches fields whose initial values cause rule violations only when an
				 * attachment field is also filled.
				 */
				const baselineValidationMessages = validateChangesAndUpdateMessages({
					changes: allChanges,
					document: computedDocumentWithOnlyGroupsAdded,
					initialMessages: {},
					kernelOptions,
					models
				});

				const fullValidationMessages = validateChangesAndUpdateMessages({
					changes: allChanges,
					document: fullComputedDocument,
					initialMessages: {},
					kernelOptions,
					models
				});

				const baselineKeys = new Set(ReadonlyObjectMap.keys(baselineValidationMessages));
				const validationTriggeredPaths = ReadonlyObjectMap.keys(fullValidationMessages)
					.filter(key => !baselineKeys.has(key))
					.map(key => DocumentPath.fromString(key));

				/*
				 * Some paths in validationTriggeredPaths (e.g. fields with initial values whose
				 * validation rules reference attachment fields) may not appear in allChanges because
				 * they were set by addNewRow, not by a kernel computation. We add them as synthetic
				 * ValueChanged entries so that categorizeChanges called within validateChangesAndUpdateMessages
				 * includes them in relevantPaths.
				 */
				const allChangesForFinalValidation = ChangeMapCreators.union(
					allChanges,
					ChangeMapCreators.createValueChanges(validationTriggeredPaths)
				);

				// Validate immediately for attachment fields and attachment-value-triggered validation fields.
				// Other added-group fields (e.g. required-but-empty, fields with initial values unrelated
				// to the attachment) are deferred to on-leave validation.
				finalMessages = validateChangesAndUpdateMessages({
					changes: allChangesForFinalValidation,
					document: fullComputedDocument,
					initialMessages: messages,
					kernelOptions,
					models,
					parsingErrorsAfterComputation: parseErrors,
					relevantFieldPaths: [...attachmentPaths, ...validationTriggeredPaths]
				});

				computedDocument = fullComputedDocument;
			}

			dispatch(
				Commands.setDocument({
					document: computedDocument,
					changes: [...changes, ...ReadonlyObjectMap.values(changesFromComputations)]
				})
			);

			dispatch(Commands.setMessageState({ messages: finalMessages }));

			updateDataDirtyState(dispatch, state);

			const repeatFormModelPath = action.payload.repeatFormModelPath;

			if (repeatFormModelPath) {
				const repeatStateEntry = repeatFormModelPath
					? UiStateSelectors.repeatInstanceStateEntry(repeatFormModelPath)(state)
					: undefined;
				const currentScreenLocation = UiStateSelectors.currentScreenLocation()(state);

				const repeat = findElementByFormModelPath(formModel, repeatFormModelPath);

				const { page } =
					repeat && isFormModelRepeat(repeat) && firstNewRowPath
						? RepeatData.getPageOfNewRow({
								converter: middlewareOptions.converter(state),
								localizer: middlewareOptions.localizer(state),
								repeatFormModelPath: repeatFormModelPath,
								state: api.getState(),
								repeat,
								repeatStateEntry: {
									...repeatStateEntry,
									newRow: { rowPath: firstNewRowPath, rowState: "workingOn" }
								},
								externalEnumerationProvider: middlewareOptions.externalEnumerationProvider
							})
						: { page: undefined };

				dispatch(
					Commands.changeRepeatInstanceStateEntry({
						locationPath: currentScreenLocation.locationPath,
						repeatFormModelPath,
						entry: {
							...repeatStateEntry,
							page,
							newRow: firstNewRowPath
								? {
										rowPath: firstNewRowPath,
										rowState: "recentlyAdded"
									}
								: undefined
						}
					})
				);

				const screenLocationStack = UiStateSelectors.screenLocationStack()(state);

				dispatch(
					Commands.changeScreenState({
						index: screenLocationStack.length - 1,
						focusedComponent: { formModelPath: repeatFormModelPath, index: rowCountBefore }
					})
				);
			}
		}

		return result;
	};
}
