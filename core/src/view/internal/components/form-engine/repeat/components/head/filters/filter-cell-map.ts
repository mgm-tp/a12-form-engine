// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { createContext } from "react";
import type { ComponentType } from "react";

import { BooleanFilterCell } from "./booleanFilterCell.js";
import type { BooleanFilterCellProps } from "./booleanFilterCell.js";
import { ConfirmFilterCell } from "./confirmFilterCell.js";
import type { ConfirmFilterCellProps } from "./confirmFilterCell.js";
import { DateFilterCell } from "./dateFilters/dateFilterCell.js";
import { EnumerationFilterCell } from "./enumerationFilterCell.js";
import type { EnumerationFilterCellProps } from "./enumerationFilterCell.js";
import type { DateFilterCellProps, StringFilterCellProps } from "./filter-cell.js";
import { MultiSelectFilterCell } from "./multiSelectFilterCell.js";
import type { MultiSelectFilterStateProps } from "./multiSelectFilterCell.js";
import { NumberFilterCell } from "./numberFilterCell.js";
import type { NumberFilterCellProps } from "./numberFilterCell.js";
import { StringFilterCell } from "./stringFilterCell.js";

/**@internal */
export interface FilterCellMap {
	BooleanFilterCell: ComponentType<BooleanFilterCellProps>;
	ConfirmFilterCell: ComponentType<ConfirmFilterCellProps>;
	DateFilterCell: ComponentType<DateFilterCellProps>;
	EnumerationFilterCell: ComponentType<EnumerationFilterCellProps>;
	MultiSelectFilterCell: ComponentType<MultiSelectFilterStateProps>;
	NumberFilterCell: ComponentType<NumberFilterCellProps>;
	StringFilterCell: ComponentType<StringFilterCellProps>;
}

/**@internal */
export const DefaultFilterCellMap: FilterCellMap = {
	BooleanFilterCell,
	ConfirmFilterCell,
	DateFilterCell,
	EnumerationFilterCell,
	MultiSelectFilterCell,
	NumberFilterCell,
	StringFilterCell
};

/**@internal */
export const FilterCellMapContext = createContext<FilterCellMap>(DefaultFilterCellMap);
