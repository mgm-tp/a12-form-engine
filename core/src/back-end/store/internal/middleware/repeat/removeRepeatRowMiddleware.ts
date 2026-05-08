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

import type { GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import { findElementByFormModelPath, FormModel } from "../../../../../models/index.js";
import { DocumentUtils } from "../../../../../models/internal/utils/document-utils.js";
import { ReadonlyObjectMap } from "../../../../../models/internal/utils/json.js";
import { DataUtils } from "../../../../utils/internal/edit-document-utils.js";
import { Commands, Events } from "../../actions.js";
import { removeRowEntriesInMessages } from "../../change-validation.js";
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
 * Listens to Events.Repeat.removeRow
 *
 * It removes a row of the document and sets the new document by dispatching
 * the Commands.setDocument action.
 */
export function removeRepeatRowMiddleware(
	middlewareOptions: Localization & Conversion
): Middleware {
	return api => next => action => {
		const result = next(action);
		if (Events.Repeat.removeRow.match(action)) {
			const document = DataSelectors.document()(api.getState()) as GroupInstance;
			const messages = UiStateSelectors.messages()(api.getState());
			const formModel = ModelSelectors.formModel()(api.getState());
			const documentModel = ModelSelectors.documentModel()(api.getState());

			const documentPath = DataSelectors.documentPath(action.payload.rowPath)(api.getState());

			const { document: newDocument } = DataUtils.removeRow(documentPath, document, documentModel);
			const newMessages = removeRowEntriesInMessages(documentPath, messages, documentModel);

			const updatedResult = KernelComputation.internalComputeThenValidate({
				document: newDocument,
				messages: newMessages,
				middlewareOptions,
				state: api.getState()
			});

			api.dispatch(
				Commands.setDocument({
					document: updatedResult.document,
					changes: [
						...ReadonlyObjectMap.values(updatedResult.changes),
						{ type: "GroupRemoved", path: documentPath }
					]
				})
			);

			if (api.getState().ui.validationBar.visible) {
				api.dispatch(Commands.validateFull());
			} else if (!messageStateIsEqual(messages, updatedResult.messages)) {
				api.dispatch(Commands.setMessageState({ messages: updatedResult.messages }));
			}

			updateDataDirtyState(api.dispatch, api.getState());

			const currentScreenLocation = UiStateSelectors.currentScreenLocation()(api.getState());
			const repeatFormModelPath = action.payload.repeatFormModelPath;
			const repeatStateEntry = UiStateSelectors.repeatInstanceStateEntry(repeatFormModelPath)(
				api.getState()
			);

			const lastPathSegment = documentPath[documentPath.length - 1];
			const repeatPath = [
				...documentPath.slice(0, documentPath.length - 1),
				...[{ elementName: lastPathSegment.elementName, index: 0 }]
			];

			const element = findElementByFormModelPath(formModel, repeatFormModelPath);
			const pageSize =
				element && FormModel.Repeat.isInstance(element) ? element.pageSize : undefined;
			const rows = DocumentUtils.getRows(updatedResult.document, repeatPath);
			const count = rows !== undefined ? rows.length : 0;

			// If pageSize is not defined in the model, page number will always be 1.
			const oldPageNumber = repeatStateEntry ? repeatStateEntry.page || 1 : 1;
			const maxPageNumber = pageSize && count > 0 ? Math.ceil(count / pageSize) : 1;
			// If the biggest senseful page number is smaller than the current page number,
			// it becomes the new current page number.
			const newPageNumber = maxPageNumber < oldPageNumber ? maxPageNumber : oldPageNumber;

			api.dispatch(
				Commands.changeRepeatInstanceStateEntry({
					locationPath: currentScreenLocation.locationPath,
					repeatFormModelPath,
					entry: {
						...repeatStateEntry,
						newRow: undefined,
						page: newPageNumber,
						expandedRowPath: undefined
					}
				})
			);

			api.dispatch(
				Commands.changeScreenState({
					index: UiStateSelectors.screenLocationStack()(api.getState()).length - 1,
					focusedComponent: { formModelPath: repeatFormModelPath }
				})
			);
		}
		return result;
	};
}
