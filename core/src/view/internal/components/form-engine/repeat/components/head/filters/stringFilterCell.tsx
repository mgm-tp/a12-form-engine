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

import type { ReactElement } from "react";
import { useContext } from "react";

import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";

import { RESOURCE_KEYS } from "../../../../../../../../back-end/localization/internal/languages/keys.js";
import { getLocalizedResource } from "../../../../../../../../back-end/localization/internal/localize.js";
import { UiStateSelectors } from "../../../../../../../../back-end/store/internal/selectors/ui-state.js";
import { UiId } from "../../../../../../../../back-end/utils/internal/generateUiId.js";
import { FormModel } from "../../../../../../../../models/index.js";
import type { StringRepeatFilter } from "../../../../../../../../back-end/store/index.js";

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
