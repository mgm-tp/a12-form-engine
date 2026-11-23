// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Middleware } from "redux";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";

import { RepeatData } from "../../../../../data/internal/repeat.js";
import {
	findElementByFormModelPath,
	FormModel,
	FormModelPath
} from "../../../../../models/index.js";
import { Commands, Events } from "../../actions.js";
import { collectRelevantFields } from "../../collectRelevantFields.js";
import { validatePartlyWithFocusHandling } from "../../partial-validation.js";
import { ModelSelectors } from "../../selectors/models.js";
import { UiStateSelectors } from "../../selectors/ui-state.js";

import type { Conversion, Localization, MiddlewareOptions } from "../middleware-options.js";

/** @internal */
export function closeEmbeddedRepeatRowMiddleware(
	options: Conversion &
		Localization &
		Pick<MiddlewareOptions, "externalEnumerationProvider" | "disableRepeatValidationOnLeaving">
): Middleware {
	return api => next => action => {
		const result = next(action);
		if (Events.Repeat.closeEmbeddedRepeatRow.match(action)) {
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

			if (!FormModel.EmbeddedRepeat.isInstance(repeat)) {
				throw new Error("This Action is only applicable for embedded repeats!");
			}

			const repeatInstanceStateEntry = UiStateSelectors.repeatInstanceStateEntry(
				repeatFormModelPath
			)(api.getState());

			if (repeatInstanceStateEntry?.expandedRowPath !== undefined) {
				const currentScreenLocation = UiStateSelectors.currentScreenLocation()(api.getState());
				const localizer = options.localizer(api.getState());
				const converter = options.converter(api.getState());

				const { page } = repeatInstanceStateEntry.newRow
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
							...repeatInstanceStateEntry,
							page: repeatInstanceStateEntry.newRow ? page : repeatInstanceStateEntry?.page || 1,
							expandedRowPath: undefined,
							newRow: repeatInstanceStateEntry.newRow
								? { ...repeatInstanceStateEntry.newRow, rowState: "recentlyAdded" }
								: undefined
						}
					})
				);

				const touchedRow =
					repeatInstanceStateEntry.expandedRowPath[
						repeatInstanceStateEntry.expandedRowPath.length - 1
					].index;
				api.dispatch(
					Commands.changeScreenState({
						index: 0,
						focusedComponent: {
							formModelPath: action.payload.repeatFormModelPath,
							index: touchedRow - 1
						}
					})
				);

				if (!options.disableRepeatValidationOnLeaving) {
					const initialFormModelPath = FormModelPath.extend(
						repeatFormModelPath,
						repeat.controlGrid
					);
					const relevantElements = collectRelevantFields(
						api.getState(),
						initialFormModelPath,
						repeatInstanceStateEntry.expandedRowPath
					);

					validatePartlyWithFocusHandling({
						dispatch: api.dispatch,
						state: api.getState(),
						middlewareOptions: options,
						relevantElements
					});
				}
			}
		}
		return result;
	};
}
