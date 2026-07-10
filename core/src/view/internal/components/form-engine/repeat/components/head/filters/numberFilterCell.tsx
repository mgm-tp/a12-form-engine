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

import type { ReactElement } from "react";
import { useContext } from "react";

import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react";

import { RESOURCE_KEYS } from "../../../../../../../../back-end/localization/internal/languages/keys.js";
import { getLocalizedResource } from "../../../../../../../../back-end/localization/internal/localize.js";
import { ModelSelectors } from "../../../../../../../../back-end/store/internal/selectors/models.js";
import { UiStateSelectors } from "../../../../../../../../back-end/store/internal/selectors/ui-state.js";
import type {
	FilterParseError,
	NumberRepeatFilter,
	RangeFilterParseError
} from "../../../../../../../../back-end/store/internal/store.js";
import { UiId } from "../../../../../../../../back-end/utils/internal/generateUiId.js";
import { getDocumentPath } from "../../../../../../../../back-end/utils/internal/path.js";
import * as DocumentModelUtils from "../../../../../../../../models/internal/utils/document-model-utils.js";

import { EmptyFilterInput } from "./emptyFilterInput.js";
import type { FilterCellProps } from "./filter-cell.js";
import { TextFilter } from "./textFilter.js";

/** @internal */
export interface NumberFilterCellProps extends FilterCellProps {
	readonly filter?: NumberRepeatFilter;
}

/** @internal */
export function NumberFilterCell(props: NumberFilterCellProps): ReactElement {
	const { localizer, conversion } = useContext(LocalizerContext);
	const { options, element, filter, repeatFormModelPath } = props;

	const disabled = UiStateSelectors.disabled()(options.state);
	const documentModel = ModelSelectors.documentModel()(options.state);
	const context = UiStateSelectors.currentScreenLocation()(options.state).path;
	const columnDocumentPath = getDocumentPath(documentModel, element.elementPath, context);
	const conversionConfig = DocumentModelUtils.useConversionConfig(
		documentModel,
		columnDocumentPath
	);

	const fromFilterValue =
		filter?.from?.data !== undefined
			? {
					ui: conversion.formatValue(filter.from.data, conversionConfig),
					data: filter.from.data as number
				}
			: undefined;
	const toFilterValue =
		filter?.to?.data !== undefined
			? {
					ui: conversion.formatValue(filter.to.data, conversionConfig),
					data: filter.to.data as number
				}
			: undefined;

	const idFrom = UiId.generateForFieldOverviewColumnFilter({
		id: element.id,
		uiIdPrefix: options.config.uiIdPrefix,
		suffix: "-from"
	});
	const idTo = UiId.generateForFieldOverviewColumnFilter({
		id: element.id,
		uiIdPrefix: options.config.uiIdPrefix,
		suffix: "-to"
	});

	const validateAndParseFilterValue = (value: string) => {
		const valueWithoutLeadingZeros = value.replace(/^0+(?!$)/, "");
		const result = conversion.parseValue(valueWithoutLeadingZeros, conversionConfig);

		return result;
	};

	const handleFilterValueChange = (value: string, type: "from" | "to") => {
		const { value: parsedValue, parseError } = validateAndParseFilterValue(value);

		if (!parseError) {
			const newFilterValue =
				type === "from"
					? {
							...filter,
							from: parsedValue !== null ? { data: parsedValue as number } : null,
							to: toFilterValue ?? null
						}
					: {
							...filter,
							from: fromFilterValue ?? null,
							to: parsedValue !== null ? { data: parsedValue as number } : null
						};

			options.eventHandlers.repeat.onFilterValueChange(
				repeatFormModelPath,
				element.id,
				newFilterValue
			);
			return;
		}

		const filterParseError: FilterParseError = {
			type: "FilterParseError",
			value: value,
			error: parseError
		};

		const error: RangeFilterParseError = {
			type: "RangeFilterParseError",
			fromError: type === "from" ? filterParseError : undefined,
			toError: type === "to" ? filterParseError : undefined
		};

		options.eventHandlers.repeat.onFilterParseError(element.id, repeatFormModelPath, error);
	};

	const handleEmptyFilterSelection = () => {
		options.eventHandlers.repeat.onFilterValueChange(repeatFormModelPath, element.id, {
			from: filter?.from ?? null,
			to: filter?.to ?? null,
			filterNull: !filter?.filterNull
		} as NumberRepeatFilter);
	};

	return (
		<>
			<EmptyFilterInput
				options={options}
				element={element}
				repeatFormModelPath={repeatFormModelPath}
				filter={filter}
				onChange={handleEmptyFilterSelection}
			/>
			{!filter?.filterNull && (
				<>
					<TextFilter
						onFilterChange={value => handleFilterValueChange(value, "from")}
						alignment={"right"}
						initialValue={fromFilterValue?.ui}
						message={filter?.from?.message}
						label={getLocalizedResource(RESOURCE_KEYS.repeat.filter.number.from, localizer) ?? ""}
						id={idFrom}
						disabled={disabled}
						options={options}
					/>

					<TextFilter
						onFilterChange={value => handleFilterValueChange(value, "to")}
						alignment={"right"}
						initialValue={toFilterValue?.ui}
						message={filter?.to?.message}
						label={getLocalizedResource(RESOURCE_KEYS.repeat.filter.number.to, localizer) ?? ""}
						id={idTo}
						disabled={disabled}
						options={options}
					/>
				</>
			)}
		</>
	);
}
