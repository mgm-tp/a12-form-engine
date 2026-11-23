// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import type {
	Localizer,
	ValueConversion
} from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import { getExpressionValue } from "../../../../../../data/internal/expression-cell-value.js";
import type { FormModel } from "../../../../../../models/index.js";
import type { FormModelMap } from "../../../../configuration/engine-configuration.js";

/**
 * TODO: This is called twice now in case the expression cell is in an repeat
 * Once when the data is retrieved and sorted and then once again when the widget is built.
 * Is there a better way?
 */
/** @internal */
export function getExpressionCellValueInUI(
	options: FormModelMap.RenderOptions,
	modelElement: FormModel.ExpressionCell | FormModel.ExpressionOverviewColumn,
	localizer: Localizer,
	converter: ValueConversion,
	dataContext?: EntityInstancePath
): string {
	return getExpressionValue({
		converter,
		dataContext,
		localizer,
		expressionTree: modelElement.expressionTree,
		state: options.state,
		externalEnumerationProvider: options.config.externalEnumerationProvider
	});
}
