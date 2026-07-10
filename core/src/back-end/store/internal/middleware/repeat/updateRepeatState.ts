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

import type { Dispatch } from "redux";

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import { RepeatData } from "../../../../../data/internal/repeat.js";
import type { FormModel } from "../../../../../models/internal/form-model.js";
import { DocumentPath } from "../../../../../models/internal/utils/document-utils.js";
import { Commands } from "../../actions.js";
import { UiStateSelectors } from "../../selectors/ui-state.js";
import type { EngineState } from "../../store.js";

import type { MiddlewareOptions } from "../middleware-options.js";

/**
 * @internal
 */
export function updateRepeatStateOnLeavingRow(options: {
	state: EngineState;
	dispatch: Dispatch;
	repeatFormModelPath: ModelPath;
	repeat: FormModel.Repeat;
	row?: EntityInstancePath;
	middlewareOptions: MiddlewareOptions;
}): void {
	const { state, repeatFormModelPath, row, middlewareOptions, dispatch, repeat } = options;
	const currentScreenLocation = UiStateSelectors.currentScreenLocation()(state);
	const repeatInstanceStateEntry =
		UiStateSelectors.repeatInstanceStateEntry(repeatFormModelPath)(state);

	const newRow = repeatInstanceStateEntry ? repeatInstanceStateEntry.newRow : undefined;

	if (!newRow || (row && !DocumentPath.equal(row, newRow.rowPath))) {
		return;
	}

	const localizer = middlewareOptions.localizer(state);
	const converter = middlewareOptions.converter(state);

	const { page } = RepeatData.getPageOfNewRow({
		converter,
		localizer,
		repeatFormModelPath: repeatFormModelPath,
		state,
		repeat,
		externalEnumerationProvider: middlewareOptions.externalEnumerationProvider
	});

	dispatch(
		Commands.changeRepeatInstanceStateEntry({
			locationPath: currentScreenLocation.locationPath,
			repeatFormModelPath: repeatFormModelPath,
			entry: {
				...repeatInstanceStateEntry,
				page,
				newRow: { ...newRow, rowState: "recentlyAdded" },
				// when switching pages, close any expanded row
				expandedRowPath:
					repeatInstanceStateEntry?.page !== page
						? undefined
						: repeatInstanceStateEntry?.expandedRowPath
			}
		})
	);
}
