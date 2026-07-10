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

import type { GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import { findElementByFormModelPath } from "../../../../../models/index.js";
import { isFormModelRepeat } from "../../../../../models/internal/FormModelGuards.js";
import { DocumentUtils } from "../../../../../models/internal/utils/document-utils.js";
import { ReadonlyObjectMap } from "../../../../../models/internal/utils/json.js";
import { Commands, Events } from "../../actions.js";
import { KernelComputation } from "../../computation.js";
import { messageStateIsEqual } from "../../messageStateIsEqual.js";
import { DataSelectors } from "../../selectors/data.js";
import { ModelSelectors } from "../../selectors/models.js";
import { UiStateSelectors } from "../../selectors/ui-state.js";

import type { Conversion, Localization } from "../middleware-options.js";
import { updateDataDirtyState } from "../updateDirtyState.js";

/**
 * @internal
 *
 * Listens to Events.Repeat.cloneRowTriggered.
 */
export function cloneButtonRepeatMiddlewareFactory(options: Conversion & Localization): Middleware {
	return api => next => action => {
		const result = next(action);

		if (Events.Repeat.cloneRowTriggered.match(action)) {
			const state = api.getState();
			const document = DataSelectors.document()(state) as GroupInstance;
			const currentScreenLocation = UiStateSelectors.currentScreenLocation()(state);
			const formModel = ModelSelectors.formModel()(state);
			const documentModel = ModelSelectors.documentModel()(state);
			const messages = UiStateSelectors.messages()(state);

			const rowPath = action.payload.rowPath;
			const newPath = [
				...rowPath.slice(0, rowPath.length - 1),
				{ elementName: rowPath[rowPath.length - 1].elementName, index: 0 }
			];
			const rows = DocumentUtils.getRows(document, newPath);

			if (rows === undefined) {
				throw new Error("This should not happen!");
			}

			const rowIndex = action.payload.rowPath[action.payload.rowPath.length - 1].index - 1;
			if (rowIndex === undefined) {
				throw new Error("Internal error: RowIndex is corrupted!");
			}

			const documentPath = DataSelectors.documentPath(action.payload.rowPath)(api.getState());
			const row = rows[rowIndex];

			if (row === undefined) {
				throw new Error("Internal Error: Row index not contained in array of rows");
			}

			const newDoc = DocumentUtils.addNewRow(document, documentPath, row, documentModel, formModel);
			const updatedResult = KernelComputation.internalComputeThenValidate({
				document: newDoc,
				messages,
				middlewareOptions: options,
				state
			});

			const count = rows !== undefined ? rows.length + 1 : 0;

			api.dispatch(
				Commands.setDocument({
					document: updatedResult.document,
					changes: [
						{ type: "GroupAdded", path: documentPath },
						...ReadonlyObjectMap.values(updatedResult.changes)
					]
				})
			);
			updateDataDirtyState(api.dispatch, state);

			const messageState = updatedResult.messages;
			if (!messageStateIsEqual(messages, messageState)) {
				api.dispatch(Commands.setMessageState({ messages: messageState }));
			}

			// Update Repeat State
			const repeatFormModelPath = action.payload.repeatFormModelPath;

			const repeatInstanceStateEntry = UiStateSelectors.repeatInstanceStateEntry(
				repeatFormModelPath
			)(api.getState());

			const element = findElementByFormModelPath(formModel, action.payload.repeatFormModelPath);
			const pageSize = element && isFormModelRepeat(element) ? element.pageSize : undefined;

			api.dispatch(
				Commands.changeRepeatInstanceStateEntry({
					locationPath: currentScreenLocation.locationPath,
					repeatFormModelPath: action.payload.repeatFormModelPath,
					entry: {
						...repeatInstanceStateEntry,
						newRow: {
							rowPath: [
								...documentPath.slice(0, documentPath.length - 1),
								{ elementName: documentPath[documentPath.length - 1].elementName, index: count }
							],
							rowState: "recentlyAdded"
						},
						page: pageSize === undefined ? 1 : Math.ceil(count / pageSize),
						expandedRowPath: undefined
					}
				})
			);

			const screenLocationStack = UiStateSelectors.screenLocationStack()(api.getState());
			api.dispatch(
				Commands.changeScreenState({
					index: screenLocationStack.length - 1,
					focusedComponent: {
						formModelPath: action.payload.repeatFormModelPath,
						index: rows.length
					}
				})
			);
		}
		return result;
	};
}
