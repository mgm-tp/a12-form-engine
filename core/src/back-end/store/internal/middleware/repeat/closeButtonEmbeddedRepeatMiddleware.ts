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

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";

import { RepeatData } from "../../../../../data/internal/repeat.js";
import { findElementByFormModelPath, FormModelPath } from "../../../../../models/index.js";
import { isFormModelEmbeddedRepeat } from "../../../../../models/internal/FormModelGuards.js";
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

			if (!isFormModelEmbeddedRepeat(repeat)) {
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
