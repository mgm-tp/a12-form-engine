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

import { DataUtils } from "../../../../utils/internal/edit-document-utils.js";
import { Commands, Events } from "../../actions.js";
import { messageStateIsEqual } from "../../messageStateIsEqual.js";
import { DataSelectors } from "../../selectors/data.js";
import { ModelSelectors } from "../../selectors/models.js";
import { UiStateSelectors } from "../../selectors/ui-state.js";
import type { EngineState } from "../../store.js";

import { updateDataDirtyState } from "../updateDirtyState.js";

/**
 * @internal
 *
 * Listens to Events.Repeat.moveRowTriggered.
 */
export const moveRepeatRowMiddleware: Middleware<{}, EngineState> = api => next => action => {
	const result = next(action);

	if (Events.Repeat.moveRowTriggered.match(action)) {
		const document = DataSelectors.document()(api.getState()) as GroupInstance;
		const messages = UiStateSelectors.messages()(api.getState());
		const documentModel = ModelSelectors.documentModel()(api.getState());

		const rowIndex = action.payload.rowPath[action.payload.rowPath.length - 1].index;
		if (rowIndex === undefined) {
			throw new Error("Internal error: RowIndex is corrupted!");
		}
		const documentPath = DataSelectors.documentPath(action.payload.rowPath)(api.getState());
		const updateResult = DataUtils.moveRow(
			document,
			documentPath,
			action.payload.delta,
			messages,
			documentModel
		);

		api.dispatch(
			Commands.setDocument({
				document: updateResult.document,
				changes: [
					{
						type: "GroupMoved",
						path: documentPath,
						delta: action.payload.delta
					}
				]
			})
		);
		updateDataDirtyState(api.dispatch, api.getState());

		if (!messageStateIsEqual(messages, updateResult.messages)) {
			api.dispatch(Commands.setMessageState({ messages: updateResult.messages }));
		}
		const repeatFormModelPath = action.payload.repeatFormModelPath;
		const repeatStateEntry = UiStateSelectors.repeatInstanceStateEntry(repeatFormModelPath)(
			api.getState()
		);
		const currentScreenLocation = UiStateSelectors.currentScreenLocation()(api.getState());

		api.dispatch(
			Commands.changeRepeatInstanceStateEntry({
				locationPath: currentScreenLocation.locationPath,
				repeatFormModelPath,
				entry: {
					...repeatStateEntry,
					newRow: undefined,
					expandedRowPath: undefined
				}
			})
		);
	}
	return result;
};
