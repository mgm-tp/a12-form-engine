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

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type { GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import { findElementByFormModelPath, FormModel } from "../../../../../models/index.js";
import { DocumentModelUtils } from "../../../../../models/internal/utils/document-model-utils.js";
import {
	createInitialRows,
	DocumentPath,
	DocumentUtils
} from "../../../../../models/internal/utils/document-utils.js";
import { ReadonlyObjectMap } from "../../../../../models/internal/utils/json.js";
import { ModelUtils } from "../../../../../models/internal/utils/model-utils.js";
import { Commands, Events } from "../../actions.js";
import { KernelComputation } from "../../computation.js";
import { DataSelectors } from "../../selectors/data.js";
import { ModelSelectors } from "../../selectors/models.js";
import { UiStateSelectors } from "../../selectors/ui-state.js";
import type { EngineStore } from "../../store.js";

import type { Conversion, Localization, MiddlewareOptions } from "../middleware-options.js";
import { updateDataDirtyState } from "../updateDirtyState.js";

import { collapseAllExpandedRowsActions } from "./collapseAllExpandedRows.js";

/**
 * @internal
 *
 * Listens to Events.Repeat.addButton.
 *
 * If the action got dispatched by a DetachedRepeat a Commands.pushBackup action
 * is dispatched to create a backup of the data.
 *
 * After a new group instance is created and added as a new row to the document.
 * The new document is then set by dispatching the Commands.setDocument action.
 *
 * If the action got triggered by a DetachedRepeat the screen is then changed
 * by dispatching the Commands.pushScreen action.
 *
 * If the action got triggered by an InlineRepeat the state of the repeat state
 * is changed by dispatching the Commands.pushScreen action.
 *
 * FIXME: dependency to model internals
 */
export function addButtonRepeatMiddlewareFactory(
	options: Localization & Conversion & Pick<MiddlewareOptions, "externalEnumerationProvider">
): Middleware {
	return api => next => action => {
		const result = next(action);

		if (Events.Repeat.addRow.match(action)) {
			const state = api.getState();
			const messages = UiStateSelectors.messages()(state);
			const document = DataSelectors.document()(state) as GroupInstance;
			const formModel = ModelSelectors.formModel()(state);
			const documentModel = ModelSelectors.documentModel()(state);

			const currentScreenLocation = UiStateSelectors.currentScreenLocation()(state);
			const repeatFormModelPath = action.payload.repeatFormModelPath;
			const repeatInstanceStateEntry =
				UiStateSelectors.repeatInstanceStateEntry(repeatFormModelPath)(state);

			const repeat = findElementByFormModelPath(formModel, repeatFormModelPath);

			if (repeat === undefined) {
				throw new Error(
					"Could not find element with path: " + ModelPath.toString(repeatFormModelPath)
				);
			}

			const group = DocumentModelUtils.findByPath(documentModel, action.payload.path);
			const row = ModelUtils.createGroupInstance(group, formModel, action.payload.path);

			const documentPath = DataSelectors.documentPath(action.payload.path)(state);
			let newDocument = DocumentUtils.addNewRow(
				document,
				documentPath,
				row,
				documentModel,
				formModel
			);

			const rows = DocumentUtils.getRows(newDocument, documentPath);
			const rowCount = rows !== undefined ? rows.length : 0;
			if (FormModel.DetachedRepeat.isInstance(repeat)) {
				api.dispatch(Commands.pushBackup({ messages: messages, document: document }));
			}

			const newRowPath = [
				...DocumentPath.parentPath(documentPath),
				{ elementName: documentPath[documentPath.length - 1].elementName, index: rowCount }
			];

			const element = findElementByFormModelPath(formModel, repeatFormModelPath);
			const pageSize =
				element && FormModel.Repeat.isInstance(element) ? element.pageSize : undefined;

			newDocument = createInitialRows({
				documentModel,
				formModel,
				document: newDocument,
				rowPathOuterGroup: newRowPath
			});

			const updatedResult = KernelComputation.internalComputeThenValidate({
				document: newDocument,
				messages,
				middlewareOptions: options,
				state
			});

			api.dispatch(
				Commands.setDocument({
					document: updatedResult.document,
					changes: [
						{ type: "GroupAdded", path: documentPath },
						...ReadonlyObjectMap.values(updatedResult.changes)
					]
				})
			);

			api.dispatch(Commands.setMessageState({ messages: updatedResult.messages }));

			if (
				FormModel.InlineRepeat.isInstance(repeat) ||
				FormModel.EmbeddedRepeat.isInstance(repeat)
			) {
				updateDataDirtyState(api.dispatch, state);
			}

			api.dispatch(
				Commands.changeRepeatInstanceStateEntry({
					locationPath: currentScreenLocation.locationPath,
					repeatFormModelPath: action.payload.repeatFormModelPath,
					entry: {
						...repeatInstanceStateEntry,
						page: pageSize === undefined ? 1 : Math.ceil(rowCount / pageSize),
						newRow: {
							rowPath: newRowPath,
							rowState: "workingOn"
						},
						...(FormModel.EmbeddedRepeat.isInstance(repeat)
							? ({
									expandedRowPath: newRowPath,
									tableInteractionDocument: updatedResult.document
								} satisfies EngineStore.Repeat.InstanceState)
							: undefined)
					}
				})
			);

			const screenLocationStack = UiStateSelectors.screenLocationStack()(api.getState());

			if (FormModel.InlineRepeat.isInstance(repeat)) {
				api.dispatch(
					Commands.changeScreenState({
						index: screenLocationStack.length - 1,
						focusedComponent: {
							formModelPath: action.payload.repeatFormModelPath,
							index: rowCount - 1
						}
					})
				);
			} else if (FormModel.EmbeddedRepeat.isInstance(repeat)) {
				api.dispatch(
					Commands.changeScreenState({
						index: screenLocationStack.length - 1,
						focusedComponent: {
							formModelPath: action.payload.repeatFormModelPath,
							index: rowCount - 1,
							subElement: "expanded-row"
						}
					})
				);
			} else if (FormModel.DetachedRepeat.isInstance(repeat)) {
				collapseAllExpandedRowsActions(api.getState()).forEach(api.dispatch);

				api.dispatch(
					Commands.changeScreenState({
						index: screenLocationStack.length - 1,
						focusedComponent: {
							formModelPath: action.payload.repeatFormModelPath,
							subElement: "repeat-add"
						}
					})
				);

				api.dispatch(
					Commands.pushScreen({
						locationPath: [
							...action.payload.repeatFormModelPath,
							{ elementName: repeat.detailScreen.name }
						],
						path: [
							...DocumentPath.parentPath(documentPath),
							{ elementName: documentPath[documentPath.length - 1].elementName, index: rowCount }
						]
					})
				);

				api.dispatch(
					Commands.changeScreenState({
						index: UiStateSelectors.screenLocationStack()(api.getState()).length - 1,
						focusedComponent: { formModelPath: [], subElement: "current-screen" }
					})
				);
			}
		}
		return result;
	};
}
