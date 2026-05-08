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

import type { JSX } from "react";
import { useContext } from "react";

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";
import type { Column } from "@com.mgmtp.a12.widgets/widgets-core/lib/table/new-api/column.api.js";

import {
	FormModelSelectors,
	ModelSelectors,
	UiStateSelectors
} from "../../../../../../../back-end/store/index.js";
import { getDocumentPath } from "../../../../../../../back-end/utils/internal/path.js";
import { DocumentModelUtils } from "../../../../../../../models/internal/utils/document-model-utils.js";
import type { FormModelMap } from "../../../../../configuration/engine-configuration.js";
import { WidgetMapContext } from "../../../../../configuration/widget-map-context.js";

const KERNEL_LIMIT = 15;

function isInBounds(sum: number): boolean {
	return -1e15 < sum && sum < 1e15;
}

/**
 * Used to round the sum to stay within the kernel limit for fractional digits
 *
 * TODO: Simplify (or even remove) the rounding/formatting logic after A12-13904
 */
const numberFormatter = new Intl.NumberFormat("en", {
	maximumSignificantDigits: KERNEL_LIMIT,
	useGrouping: false
});

interface SummaryProps {
	readonly renderOptions: FormModelMap.RenderOptions;
	readonly sum: number;
	readonly modelPath: ModelPath;
	readonly alignment?: Column.HorizontalAlignment;
}

/**
 * Displays a summary result for given column if necessary.
 *
 * NOTES:
 * - the sum is rounded to stay within kernel limits, e.g. 0.1 + 0.2 produces
 * a number with 17 fractional digits, which already exceeds kernel limit
 * - if the sum exceeds the upper/lower bounds (>= 1e15 or <= -1e15), a placeholder
 * is shown instead
 *
 * @internal
 * */
export function Summary({
	modelPath,
	sum,
	renderOptions,
	alignment
}: SummaryProps): JSX.Element | null {
	const { localizer, conversion } = useContext(LocalizerContext);
	const { Icon, TextOutput } = useContext(WidgetMapContext);

	const documentModel = ModelSelectors.documentModel()(renderOptions.state);
	const formContext = UiStateSelectors.currentScreenLocation()(renderOptions.state);
	const suffix = FormModelSelectors.suffix(modelPath, localizer)(renderOptions.state);

	const columnPath = getDocumentPath(documentModel, modelPath, formContext.path);
	const roundedSum = parseFloat(numberFormatter.format(sum));

	const conversionConfig = DocumentModelUtils.useConversionConfig(documentModel, columnPath);

	return (
		<TextOutput alignment={alignment} disableParagraphWrapping>
			<Icon title="functions">functions</Icon>
			{isInBounds(roundedSum) ? (
				`${conversion.formatValue(roundedSum, conversionConfig)}${suffix ? " " + suffix : ""}`
			) : (
				<Icon title="Sum out of bounds">all_inclusive</Icon>
			)}
		</TextOutput>
	);
}
