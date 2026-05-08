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

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import type {
	BaseColumnType,
	Column
} from "@com.mgmtp.a12.widgets/widgets-core/lib/table/new-api/column.api.js";

import type { FormModel } from "../../../../../../models/internal/form-model.js";
import type { Value } from "../../../../utilities/value.js";

/** @internal */
export interface RepeatRow {
	readonly path: EntityInstancePath;
	readonly values: Value[];
	readonly rowIndexInDocument: number;
}

const ColumnTypes = ["expression", "field", "action", "validation"] as const;

type ColumnType = (typeof ColumnTypes)[number];

/** @internal */
export interface AbstractRepeatTableColumn extends BaseColumnType<RepeatRow> {
	readonly type: ColumnType;
	readonly label: string | undefined;
}

/** @internal */
export type RepeatTableColumn =
	| RepeatTableActionColumn
	| FieldRepeatTableColumn
	| ExpressionRepeatTableColumn
	| RepeatTableValidationColumn;

/** @internal */
export namespace RepeatTableColumn {
	export function isInstance(column: unknown): column is RepeatTableColumn {
		return ColumnTypes.includes((column as RepeatTableColumn).type);
	}

	export function isFieldColumn(column: RepeatTableColumn): column is FieldRepeatTableColumn {
		return column.type === "field";
	}

	export function isExpressionColumn(
		column: RepeatTableColumn
	): column is ExpressionRepeatTableColumn {
		return column.type === "expression";
	}

	export type ColumnWithModelElement = BaseColumnType & {
		modelElement: FormModel.RepeatOverviewColumn;
	};

	export function isColumnWithModelElement(col: unknown): col is ColumnWithModelElement {
		return (
			RepeatTableColumn.isInstance(col) &&
			(RepeatTableColumn.isFieldColumn(col as RepeatTableColumn) ||
				RepeatTableColumn.isExpressionColumn(col as RepeatTableColumn))
		);
	}

	export function isActionColumn(column: RepeatTableColumn): column is RepeatTableActionColumn {
		return column.type === "action";
	}

	export function isValidationColumn(
		column: RepeatTableColumn
	): column is RepeatTableValidationColumn {
		return column.type === "validation";
	}
}

/** @internal */
export interface FieldRepeatTableColumn extends AbstractRepeatTableColumn {
	type: "field";
	modelElement: FormModel.FieldOverviewColumn;
	modelPath: ModelPath;
	valueGetter(params: { row: RepeatRow }): Value;
	dataGetter(params: { rowIndex: number; row: RepeatRow }): string;
	width: Column.Width;
	hintText?: string;
	showCommaSeparated?: boolean;
	sum?: number;
}

/** @internal */
export interface ExpressionRepeatTableColumn extends AbstractRepeatTableColumn {
	type: "expression";
	modelElement: FormModel.ExpressionOverviewColumn;
	modelPath: ModelPath;
	dataGetter(params: { rowIndex: number; row: RepeatRow }): string;
	width: Column.Width;
}

/** @internal */
export interface RepeatTableActionColumn extends AbstractRepeatTableColumn {
	type: "action";
}

/** @internal */
export interface RepeatTableValidationColumn extends AbstractRepeatTableColumn {
	type: "validation";
}
