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

import type { Middleware, MiddlewareAPI } from "redux";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";

import { RepeatData } from "../../../../../data/internal/repeat.js";
import type { FormModel } from "../../../../../models/index.js";
import { findElementByFormModelPath } from "../../../../../models/index.js";
import { isFormModelRepeat } from "../../../../../models/internal/FormModelGuards.js";
import { Commands, Events } from "../../actions.js";
import { collectRelevantFields } from "../../collectRelevantFields.js";
import { ModelSelectors } from "../../selectors/models.js";
import { UiStateSelectors } from "../../selectors/ui-state.js";
import type { EngineStore } from "../../store.js";
import { valid } from "../../validation.js";

import type { Conversion, Localization, MiddlewareOptions } from "../middleware-options.js";
import { updateDataDirtyState } from "../updateDirtyState.js";

/** @internal */
export function leaveDetachedRepeatRowMiddleware(
	options: Conversion & Localization & Pick<MiddlewareOptions, "externalEnumerationProvider">
): Middleware {
	return api => next => action => {
		const result = next(action);
		if (Events.Repeat.leaveDetachedRepeatRow.match(action)) {
			const { cancel: cancelDetachedScreen } = action.payload;

			const formModel = ModelSelectors.formModel()(api.getState());
			const screenLocationBeforeLeave = UiStateSelectors.currentScreenLocation()(api.getState());
			const locationPath = screenLocationBeforeLeave.locationPath;
			const repeatFormModelPath = ModelPath.parentPath(locationPath);

			const repeat = findElementByFormModelPath(formModel, repeatFormModelPath);
			if (!repeat || !isFormModelRepeat(repeat)) {
				throw new Error("Expected to get path to a repeat!");
			}

			let screenWasDropped: boolean;

			if (!cancelDetachedScreen) {
				screenWasDropped = applyScreenChanges({
					api,
					options,
					repeat,
					repeatFormModelPath
				});
			} else {
				cancelScreenChanges({ api, repeatFormModelPath });
				screenWasDropped = true;
			}

			if (screenWasDropped) {
				updateFocusedComponent({
					api,
					repeatFormModelPath,
					screenLocationBeforeUpdate: screenLocationBeforeLeave,
					cancelDetachedScreen
				});
			}
		}

		return result;
	};
}

/**
 * Returns whether the changes on the current screen could be successfully
 * applied.
 * The changes will be applied, if the screen does not contain any parsing
 * errors or validation messages with severity 'ERROR'.
 */
function applyScreenChanges(params: {
	repeatFormModelPath: ModelPath;
	api: MiddlewareAPI;
	options: Conversion & Localization & Pick<MiddlewareOptions, "externalEnumerationProvider">;
	repeat: FormModel.Repeat;
}): boolean {
	const { api, repeatFormModelPath, options, repeat } = params;
	const currentScreenLocation = UiStateSelectors.currentScreenLocation()(api.getState());

	api.dispatch(Commands.validatePart({ focusFirstError: true }));
	const successful = valid(
		UiStateSelectors.messages()(api.getState()),
		collectRelevantFields(api.getState()).map(field => field.documentPath)
	);

	if (!successful) {
		return false;
	}

	api.dispatch(Commands.dropScreen());

	const repeatStateEntryAfterUpdate = UiStateSelectors.repeatInstanceStateEntry(
		repeatFormModelPath
	)(api.getState());
	const newRow = repeatStateEntryAfterUpdate ? repeatStateEntryAfterUpdate.newRow : undefined;

	const localizer = options.localizer(api.getState());
	const converter = options.converter(api.getState());

	const { page } = newRow
		? RepeatData.getPageOfNewRow({
				converter,
				localizer,
				repeatFormModelPath: repeatFormModelPath,
				state: api.getState(),
				repeat,
				externalEnumerationProvider: options.externalEnumerationProvider
			})
		: { page: undefined };

	api.dispatch(
		Commands.changeRepeatInstanceStateEntry({
			locationPath: currentScreenLocation.locationPath,
			repeatFormModelPath: repeatFormModelPath,
			entry: {
				...repeatStateEntryAfterUpdate,
				page: newRow
					? page
					: repeatStateEntryAfterUpdate?.page
						? repeatStateEntryAfterUpdate?.page
						: 1,
				newRow: newRow ? { ...newRow, rowState: "recentlyAdded" } : undefined
			}
		})
	);

	api.dispatch(Commands.dropBackup({ trigger: "apply" }));

	updateDataDirtyState(api.dispatch, api.getState());

	return true;
}

function cancelScreenChanges(params: { api: MiddlewareAPI; repeatFormModelPath: ModelPath }): void {
	const { api, repeatFormModelPath } = params;
	const backup = UiStateSelectors.currentBackup()(api.getState());
	const currentScreenLocation = UiStateSelectors.currentScreenLocation()(api.getState());
	api.dispatch(Commands.dropScreen());

	const repeatStateEntry = UiStateSelectors.repeatInstanceStateEntry(repeatFormModelPath)(
		api.getState()
	);

	if (backup.document !== api.getState().data.document) {
		api.dispatch(
			Commands.setDocument({ document: backup.document, changes: [{ type: "Revert" }] })
		);
	}
	if (backup.messages !== api.getState().ui.messages) {
		api.dispatch(Commands.setMessageState({ messages: backup.messages }));
	}

	api.dispatch(
		Commands.changeRepeatInstanceStateEntry({
			locationPath: currentScreenLocation.locationPath,
			repeatFormModelPath: repeatFormModelPath,
			entry: {
				...repeatStateEntry,
				newRow: undefined
			}
		})
	);

	api.dispatch(Commands.dropBackup({ trigger: "cancel" }));
}

function updateFocusedComponent(params: {
	api: MiddlewareAPI;
	repeatFormModelPath: ModelPath;
	screenLocationBeforeUpdate: EngineStore.ScreenState;
	cancelDetachedScreen?: boolean;
}): void {
	const { repeatFormModelPath, api, screenLocationBeforeUpdate, cancelDetachedScreen } = params;

	// If the screen changes were applied we need to focus the changed row instead of the trigger element
	if (!cancelDetachedScreen) {
		const touchedRow =
			screenLocationBeforeUpdate.path[screenLocationBeforeUpdate.path.length - 1].index - 1;
		const screenLocationStack = UiStateSelectors.screenLocationStack()(api.getState());
		api.dispatch(
			Commands.changeScreenState({
				index: screenLocationStack.length - 1,
				focusedComponent: {
					formModelPath: repeatFormModelPath,
					index: touchedRow
				}
			})
		);
	}
}
