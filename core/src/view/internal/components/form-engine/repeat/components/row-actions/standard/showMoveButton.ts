// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { UiStateSelectors } from "../../../../../../../../back-end/store/internal/selectors/ui-state.js";
import type { FormModel } from "../../../../../../../../models/internal/form-model.js";
import type { FormModelMap } from "../../../../../../configuration/engine-configuration.js";
import { RepeatUtils } from "../../repeat-utils.js";

/** @internal */
export function showMoveButton(
	config: FormModelMap.RenderConfiguration,
	repeat: FormModel.Repeat
): boolean {
	const sortingState = UiStateSelectors.getCurrentSortingState(config.parentPath)(
		config.renderOptions.state
	);

	const isSorted = sortingState ? sortingState.sorting !== "none" : false;
	const hasActiveFilter = RepeatUtils.hasActiveFilters(config);
	const hasFilterExpression = repeat.filterExpressionTree !== undefined;

	return repeat.enableReorder === true && !isSorted && !hasActiveFilter && !hasFilterExpression;
}
