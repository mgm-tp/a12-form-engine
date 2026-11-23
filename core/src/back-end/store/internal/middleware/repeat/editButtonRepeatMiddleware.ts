// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Middleware, MiddlewareAPI } from "redux";
import type { Action } from "typescript-fsa";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type { GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import { findElementByFormModelPath, FormModel } from "../../../../../models/index.js";
import { Commands, Events } from "../../actions.js";
import { DataSelectors } from "../../selectors/data.js";
import { ModelSelectors } from "../../selectors/models.js";
import { UiStateSelectors } from "../../selectors/ui-state.js";
import type { EngineState, EngineStore } from "../../store.js";

import { collapseAllExpandedRowsActions } from "./collapseAllExpandedRows.js";

/**
 * @internal
 *
 * Listens to Events.Repeat.enterRow.
 *
 * The middleware first creates a backup of the current document and error state by dispatching
 * the Command.pushBackup action.
 *
 * After the screen is changed to the details screen of the DetachedRepeat by dispatching
 * the Commands.pushScreen action.
 */
export const editButtonRepeatMiddleware: Middleware<{}, EngineState> = api => next => action => {
	const result = next(action);
	if (Events.Repeat.enterRow.match(action)) {
		const state = api.getState();

		const rowIndex = action.payload.rowPath[action.payload.rowPath.length - 1].index;
		if (rowIndex === undefined) {
			throw new Error("Internal error: RowIndex is corrupted!");
		}

		const repeatFormModelPath = action.payload.repeatFormModelPath;
		const repeat = findElementByFormModelPath(
			ModelSelectors.formModel()(api.getState()),
			repeatFormModelPath
		);

		if (repeat === undefined) {
			throw new Error(
				"Could not find element with path: " + ModelPath.toString(repeatFormModelPath)
			);
		}

		if (
			!FormModel.DetachedRepeat.isInstance(repeat) &&
			!FormModel.EmbeddedRepeat.isInstance(repeat)
		) {
			throw new Error("This Action is only applicable for detached and embedded repeats!");
		}

		if (FormModel.DetachedRepeat.isInstance(repeat)) {
			openDetachedRepeatScreen(api, state, action, repeat);
		}

		if (FormModel.EmbeddedRepeat.isInstance(repeat)) {
			editRowInEmbeddedRepeat(api, state, action, rowIndex);
		}
	}
	return result;
};

function editRowInEmbeddedRepeat(
	api: MiddlewareAPI,
	state: EngineState,
	action: Action<Events.Repeat.EnterRowPayload>,
	rowIndex: number
): void {
	const currentScreenLocation = UiStateSelectors.currentScreenLocation()(state);
	const repeatInstanceStateEntry = UiStateSelectors.repeatInstanceStateEntry(
		action.payload.repeatFormModelPath
	)(api.getState());

	api.dispatch(
		Commands.changeRepeatInstanceStateEntry({
			locationPath: currentScreenLocation.locationPath,
			repeatFormModelPath: action.payload.repeatFormModelPath,
			entry: {
				...repeatInstanceStateEntry,
				newRow: undefined,
				expandedRowPath: action.payload.rowPath,
				// this should be done in the reducer when setting expandedRowPath!
				tableInteractionDocument: DataSelectors.document()(state) as GroupInstance
			}
		})
	);

	const currentScreenLocationIndex =
		UiStateSelectors.screenLocationStack()(api.getState()).length - 1;
	api.dispatch(
		Commands.changeScreenState({
			index: currentScreenLocationIndex,
			focusedComponent: {
				formModelPath: action.payload.repeatFormModelPath,
				index: rowIndex - 1,
				subElement: "expanded-row"
			}
		})
	);
}

function openDetachedRepeatScreen(
	api: MiddlewareAPI,
	state: EngineState,
	action: Action<Events.Repeat.EnterRowPayload>,
	repeat: FormModel.DetachedRepeat
): void {
	const messages = UiStateSelectors.messages()(state);
	const document = DataSelectors.document()(state) as GroupInstance;

	const currentScreenLocation = UiStateSelectors.currentScreenLocation()(state);
	const repeatFormModelPath = action.payload.repeatFormModelPath;
	const currentRepeatStateEntry = UiStateSelectors.repeatInstanceStateEntry(repeatFormModelPath)(
		api.getState()
	);
	const screenLocationStack = UiStateSelectors.screenLocationStack()(api.getState());

	api.dispatch(
		Commands.changeRepeatInstanceStateEntry({
			locationPath: currentScreenLocation.locationPath,
			repeatFormModelPath,
			entry: {
				...currentRepeatStateEntry,
				newRow: undefined
			}
		})
	);

	collapseAllExpandedRowsActions(api.getState()).forEach(api.dispatch);

	api.dispatch(Commands.pushBackup({ messages: messages, document: document }));

	const touchedRow = action.payload.rowPath[action.payload.rowPath.length - 1].index - 1;
	const focusedComponent: Partial<EngineStore.FocusedComponent> =
		action.payload.triggerElement === "row"
			? {
					index: touchedRow
				}
			: {
					subElement: "repeat-edit",
					index: touchedRow
				};

	api.dispatch(
		Commands.changeScreenState({
			index: screenLocationStack.length - 1,
			focusedComponent: {
				formModelPath: action.payload.repeatFormModelPath,
				...focusedComponent
			}
		})
	);

	api.dispatch(
		Commands.pushScreen({
			locationPath: [
				...action.payload.repeatFormModelPath,
				{ elementName: repeat.detailScreen.name }
			],
			path: action.payload.rowPath
		})
	);

	const currentScreenLocationIndex =
		UiStateSelectors.screenLocationStack()(api.getState()).length - 1;
	api.dispatch(
		Commands.changeScreenState({
			index: currentScreenLocationIndex,
			focusedComponent: { formModelPath: [], subElement: "current-screen" }
		})
	);
}
