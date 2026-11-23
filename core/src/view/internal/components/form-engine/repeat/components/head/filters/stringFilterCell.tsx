// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ReactElement } from "react";
import { useContext } from "react";

import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";

import { RESOURCE_KEYS } from "../../../../../../../../back-end/localization/internal/languages/keys.js";
import { getLocalizedResource } from "../../../../../../../../back-end/localization/internal/localize.js";
import type { StringRepeatFilter } from "../../../../../../../../back-end/store/index.js";
import { UiStateSelectors } from "../../../../../../../../back-end/store/internal/selectors/ui-state.js";
import { UiId } from "../../../../../../../../back-end/utils/internal/generateUiId.js";
import { FormModel } from "../../../../../../../../models/index.js";

import { EmptyFilterInput } from "./emptyFilterInput.js";
import type { StringFilterCellProps } from "./filter-cell.js";
import { TextFilter } from "./textFilter.js";

/** @internal */
export function StringFilterCell(props: StringFilterCellProps): ReactElement {
	const { options, element, filter, repeatFormModelPath } = props;
	const { localizer } = useContext(LocalizerContext);

	const disabled = UiStateSelectors.disabled()(options.state);
	const label = getLocalizedResource(RESOURCE_KEYS.repeat.filter.string.title, localizer);
	const id = UiId.generateForFieldOverviewColumnFilter({
		id: element.id,
		uiIdPrefix: options.config.uiIdPrefix
	});

	// for expressions, name "wins" over id
	const columnId = FormModel.ExpressionOverviewColumn.isInstance(element)
		? element.name
		: element.id;

	const isFilterNullActive = !!filter?.filterNull;

	const handleEmptyFilterChange = () => {
		const isOnlyEmptyFilterSelected = !filter?.filterValue && filter?.filterNull;
		const filterValues: StringRepeatFilter | undefined = isOnlyEmptyFilterSelected
			? undefined
			: {
					...filter,
					filterValue: filter?.filterValue ?? "",
					filterNull: !filter?.filterNull
				};

		options.eventHandlers.repeat.onFilterValueChange(repeatFormModelPath, columnId, filterValues);
	};

	const handleFilterChange = (value: string) => {
		const newFilterValue =
			value.length > 0
				? {
						...filter,
						filterValue: value
					}
				: undefined;

		options.eventHandlers.repeat.onFilterValueChange(repeatFormModelPath, columnId, newFilterValue);
	};

	return (
		<>
			<EmptyFilterInput
				options={options}
				element={element}
				repeatFormModelPath={repeatFormModelPath}
				filter={filter}
				onChange={handleEmptyFilterChange}
			/>

			{!isFilterNullActive && (
				<TextFilter
					onFilterChange={handleFilterChange}
					initialValue={filter?.filterValue}
					label={label ?? ""}
					id={id}
					disabled={disabled}
					options={options}
				/>
			)}
		</>
	);
}
