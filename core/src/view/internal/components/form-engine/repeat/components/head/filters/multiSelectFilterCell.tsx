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

import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";

import { RESOURCE_KEYS } from "../../../../../../../../back-end/localization/internal/languages/keys.js";
import { getLocalizedResource } from "../../../../../../../../back-end/localization/internal/localize.js";
import { UiStateSelectors } from "../../../../../../../../back-end/store/internal/selectors/ui-state.js";
import type { MultiSelectRepeatFilter } from "../../../../../../../../back-end/store/internal/store.js";
import { UiId } from "../../../../../../../../back-end/utils/internal/generateUiId.js";
import { isObjectEmpty } from "../../../../../../../../back-end/utils/internal/guards.js";
import { ReadonlyObjectMap } from "../../../../../../../../models/internal/utils/json.js";
import { WidgetMapContext } from "../../../../../../configuration/widget-map-context.js";
import { getLocalizedMultiSelectValue } from "../../../../../../utilities/multi-select-helper.js";

import { EmptyFilterInput } from "./emptyFilterInput.js";
import type { FilterCellProps } from "./filter-cell.js";
import { FilterMode } from "./filterMode.js";

/** @internal */
export interface MultiSelectFilterStateProps extends FilterCellProps {
	readonly isPopupButtonActive?: boolean;
	readonly filter?: MultiSelectRepeatFilter;
}

/** @internal */
export function MultiSelectFilterCell(props: MultiSelectFilterStateProps): JSX.Element {
	const { options, element, filter, repeatFormModelPath } = props;
	const { CheckboxGroup, CheckboxGroupItem } = useContext(WidgetMapContext);
	const { localizer } = useContext(LocalizerContext);

	const disabled = UiStateSelectors.disabled()(options.state);
	const enumerationOptions = getLocalizedMultiSelectValue(options, element.elementPath, localizer);
	const values = filter?.values ?? {};

	const newFilter = (
		optionValue: string | null,
		filter?: MultiSelectRepeatFilter
	): MultiSelectRepeatFilter | undefined => {
		const values = filter?.values ?? {};
		const filterMode = filter?.mode ?? "or";

		if (optionValue === null) {
			return isObjectEmpty(values) && filter?.filterNull
				? undefined
				: {
						...filter,
						values,
						mode: filterMode,
						filterNull: !filter?.filterNull
					};
		}

		const newValue = !values[optionValue];
		const newValues = newValue
			? { ...values, [optionValue]: newValue }
			: ReadonlyObjectMap.removeByKey(values, optionValue);

		return isObjectEmpty(newValues) && !filter?.filterNull
			? undefined
			: { ...filter, values: newValues, mode: filterMode };
	};

	const handleFilterChange = (optionValue: string | null) => {
		options.eventHandlers.repeat.onFilterValueChange(
			repeatFormModelPath,
			element.id,
			newFilter(optionValue, filter)
		);
	};

	return (
		<CheckboxGroup
			disabled={disabled}
			label={
				<>
					{getLocalizedResource(RESOURCE_KEYS.repeat.filter.enumeration.title, localizer)}
					<FilterMode
						disabled={disabled}
						filter={filter}
						options={options}
						repeatFormModelPath={repeatFormModelPath}
						elementId={element.id}
					/>
				</>
			}
			fitToParent={false}
		>
			<EmptyFilterInput
				options={options}
				element={element}
				repeatFormModelPath={repeatFormModelPath}
				filter={filter}
				onChange={() => handleFilterChange(null)}
				presentation="checkbox"
			/>

			{enumerationOptions.map(option => {
				const id = UiId.generateForFieldOverviewColumnFilter({
					id: element.id,
					uiIdPrefix: options.config.uiIdPrefix,
					suffix: `-${option.value}`
				});
				const value = values[option.value];

				return (
					<CheckboxGroupItem
						id={id}
						key={id}
						selected={value === true}
						value={option.value}
						onChange={() => handleFilterChange(option.value)}
						label={option.label}
						disabled={disabled}
					/>
				);
			})}
		</CheckboxGroup>
	);
}
