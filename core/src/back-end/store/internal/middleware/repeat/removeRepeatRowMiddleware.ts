// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
