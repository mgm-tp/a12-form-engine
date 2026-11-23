// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Middleware } from "redux";

import { findElementByFormModelPath } from "../../../../../models/internal/findElementByFormModelPath.js";
import { FormModel } from "../../../../../models/internal/form-model.js";
import { FormModelPath } from "../../../../../models/internal/utils/form-model-path.js";
import { Events } from "../../actions.js";
import { collectRelevantFields } from "../../collectRelevantFields.js";
import { validatePartlyWithFocusHandling } from "../../partial-validation.js";
import { ModelSelectors } from "../../selectors/models.js";

import type { MiddlewareOptions } from "../middleware-options.js";

import { updateRepeatStateOnLeavingRow } from "./updateRepeatState.js";

/**
 * @internal
 *
 * Listens to Events.Repeat.leaveRepeatTable
 */
export function onLeaveRowMiddlewareFactory(options: MiddlewareOptions): Middleware {
	return api => next => action => {
		const result = next(action);
		if (Events.Repeat.leaveRepeatRow.match(action)) {
			const state = api.getState();
			const formModel = ModelSelectors.formModel()(api.getState());

			const repeatFormModelPath = action.payload.repeatFormModelPath;
			const repeat = findElementByFormModelPath(formModel, repeatFormModelPath);

			if (!repeat || !FormModel.Repeat.isInstance(repeat)) {
				throw new Error("Expected to get path to a repeat!");
			}

			const leftRow = action.payload.rowPath;
			updateRepeatStateOnLeavingRow({
				dispatch: api.dispatch,
				middlewareOptions: options,
				repeat,
				row: leftRow,
				repeatFormModelPath,
				state: api.getState()
			});

			if (
				!options.disableRepeatValidationOnLeaving &&
				(FormModel.InlineRepeat.isInstance(repeat) || FormModel.EmbeddedRepeat.isInstance(repeat))
			) {
				const initialFormModelPath = FormModel.InlineRepeat.isInstance(repeat)
					? repeatFormModelPath
					: FormModelPath.extend(repeatFormModelPath, repeat.controlGrid);

				const relevantElements = collectRelevantFields(
					state,
					initialFormModelPath,
					action.payload.rowPath
				);

				validatePartlyWithFocusHandling({
					dispatch: api.dispatch,
					state,
					middlewareOptions: options,
					relevantElements
				});
			}
		}
		return result;
	};
}
