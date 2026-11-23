// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Dispatch } from "redux";

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

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
