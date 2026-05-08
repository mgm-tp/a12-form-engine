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
 * 1. Open-Source License – EUPL v1.2
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

import type {
	EntityInstancePath,
	GroupInstance
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import { RepeatData } from "../../../../../data/internal/repeat.js";
import { findElementByFormModelPath, FormModel } from "../../../../../models/index.js";
import { DocumentModelUtils } from "../../../../../models/internal/utils/document-model-utils.js";
import {
	DocumentPath,
	DocumentUtils
} from "../../../../../models/internal/utils/document-utils.js";
import { ReadonlyObjectMap } from "../../../../../models/internal/utils/json.js";
import { ModelUtils } from "../../../../../models/internal/utils/model-utils.js";
import { getDocumentPath } from "../../../../utils/internal/path.js";
import { Commands, Events } from "../../actions.js";
import { KernelComputation } from "../../computation.js";
import type { Change } from "../../documentChange.js";
import { ChangeMapCreators } from "../../documentChange.js";
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
			const changes: Change[] = [];
			let firstNewRowPath: EntityInstancePath | undefined = undefined;

			if (action.payload.toBeReplaced) {
				for (let i = 0; i < action.payload.toBeReplaced.length; i++) {
					const entry = action.payload.toBeReplaced[i];

					if (i === 0) {
						firstNewRowPath = entry.path.slice(0, entry.path.length - 1);
					}

					newDocument = DocumentUtils.setValue(newDocument, entry.path, entry.value, documentModel);

					const changesForAttachment = ReadonlyObjectMap.values(
						createChangesForAttachment(entry.path, entry.value)
					);

					changes.push(...changesForAttachment);
				}
			}

			for (let i = 0; i < action.payload.toBeAdded.length; i++) {
				const attachment = action.payload.toBeAdded[i];
				const row = ModelUtils.createGroupInstance(group, formModel, action.payload.path);
				const newRowPath = [
					...DocumentPath.parentPath(groupDocumentPath),
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

				changes.push({ type: "GroupAdded", path: groupDocumentPath });
			}

			const changeEntries = ChangeMapCreators.fromList(changes);

			/**
			 * TODO: Should this work like the other value change middlewares?
			 * We don't consider relevant fields here?
			 */
			const updatedResult = KernelComputation.internalComputeThenValidate({
				document: newDocument,
				messages,
				middlewareOptions,
				state,
				existingChanges: changeEntries
			});

			// separate the changes from computation because there might be
			// multiple "group added" changes and they all have the same path
			// (pointing to the repeatable group context, not the added row!) -
			// internalComputeThenValidate merges both sets in a single map with
			// key=path, which would loose those group changes!
			const changesFromComputations = ChangeMapCreators.difference(
				updatedResult.changes,
				changeEntries
			);

			newDocument = updatedResult.document;
			const newMessages = updatedResult.messages;

			dispatch(
				Commands.setDocument({
					document: newDocument,
					changes: [...changes, ...ReadonlyObjectMap.values(changesFromComputations)]
				})
			);

			dispatch(Commands.setMessageState({ messages: newMessages }));

			updateDataDirtyState(dispatch, state);

			const repeatFormModelPath = action.payload.repeatFormModelPath;

			if (repeatFormModelPath) {
				const repeatStateEntry = repeatFormModelPath
					? UiStateSelectors.repeatInstanceStateEntry(repeatFormModelPath)(state)
					: undefined;
				const currentScreenLocation = UiStateSelectors.currentScreenLocation()(state);

				const repeat = findElementByFormModelPath(formModel, repeatFormModelPath);

				const { page } =
					repeat && FormModel.Repeat.isInstance(repeat) && firstNewRowPath
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
