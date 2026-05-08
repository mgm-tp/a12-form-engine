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
