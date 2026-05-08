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

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";

import { RESOURCE_KEYS } from "../../../../../../../back-end/localization/internal/languages/keys.js";
import { getLocalizedResource } from "../../../../../../../back-end/localization/internal/localize.js";
import { UiStateSelectors } from "../../../../../../../back-end/store/internal/selectors/ui-state.js";
import type { FormModelMap } from "../../../../../configuration/engine-configuration.js";
import { WidgetMapContext } from "../../../../../configuration/widget-map-context.js";

import { RepeatUtils } from "../repeat-utils.js";
import { RepeatTableColumn } from "../tableColumnTypes.js";

import { FilterRowHead } from "./filterRowHead.js";

interface FilterContentProps {
	readonly column: RepeatTableColumn;
	readonly renderConfiguration: FormModelMap.RenderConfiguration;
}

/** @internal */
export function FilterContent({
	column,
	renderConfiguration
}: FilterContentProps): JSX.Element | null {
	const { renderOptions: options, parentPath: repeatFormModelPath } = renderConfiguration;
	const { Button, Icon } = useContext(WidgetMapContext);
	const localizer = useContext(LocalizerContext).localizer;

	const clearButtonTitle = getLocalizedResource(RESOURCE_KEYS.repeat.filter.clear, localizer);

	if (
		RepeatTableColumn.isValidationColumn(column) ||
		(!RepeatTableColumn.isActionColumn(column) && !column.modelElement.filterable)
	) {
		return null;
	}

	if (RepeatTableColumn.isActionColumn(column)) {
		return RepeatUtils.hasActiveFilters(renderConfiguration) ? (
			<Button
				disabled={UiStateSelectors.disabled()(options.state)}
				active
				onClick={() => {
					options.eventHandlers.repeat.onClearFilters(repeatFormModelPath);
				}}
				icon={<Icon iconTheme="custom">clear_filter</Icon>}
				title={clearButtonTitle}
				data-testid={`${ModelPath.toString(repeatFormModelPath)}-clear_filter`}
			/>
		) : null;
	}

	return (
		<FilterRowHead
			formModelElement={column.modelElement}
			repeatFormModelPath={renderConfiguration.parentPath}
			renderOptions={options}
		/>
	);
}
