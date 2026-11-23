// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
