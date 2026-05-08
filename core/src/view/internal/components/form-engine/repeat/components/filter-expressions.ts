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

import type {
	DocumentModel,
	EntityInstancePath,
	FieldInstanceValue,
	GroupInstance
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type * as RepeatExpressionFilter from "../../../../../../models/internal/jison/repeatfilter.cjs";
import { DocumentModelUtils } from "../../../../../../models/internal/utils/document-model-utils.js";
import { DocumentUtils } from "../../../../../../models/internal/utils/document-utils.js";
import type { Value } from "../../../../utilities/value.js";

import type { RepeatRow } from "./tableColumnTypes.js";

type FilteredRows = { path: EntityInstancePath; values: Value[]; rowIndexInDocument: number }[];

/** @internal */
export function filterRowsByFilterExpression(
	rows: ReadonlyArray<RepeatRow>,
	expression: RepeatExpressionFilter.ParsedFilterNode,
	documentModel: DocumentModel,
	document: GroupInstance
): FilteredRows {
	return rows.reduce<FilteredRows>((filteredRows, row) => {
		const visible = evalFilterExpression(
			documentModel,
			document,
			row.path,
			expression.context,
			expression.content,
			expression.operation
		);

		if (visible) {
			filteredRows.push(row);
		}

		return filteredRows;
	}, []);
}

function evalFilterExpression(
	documentModel: DocumentModel,
	document: GroupInstance,
	path: EntityInstancePath,
	node: RepeatExpressionFilter.Node | undefined,
	filterValue: FieldInstanceValue,
	filterOperation: "=" | "!="
): boolean {
	if (node === undefined) {
		return false;
	}

	if (node.type === "field" && node.name) {
		const value = DocumentUtils.getValue({
			document,
			path: [...path, { elementName: node.name, index: 1 }]
		}) as GroupInstance | FieldInstanceValue;
		if (DocumentUtils.isGroupInstance(value)) {
			return false;
		}

		const isEqual = DocumentUtils.isValueEqual(value, filterValue);
		return filterOperation === "=" ? isEqual : !isEqual;
	} else if (node.type === "group" && node.name) {
		const elementModelPath = [...path, { elementName: node.name }];
		const element = DocumentModelUtils.findByPath(documentModel, elementModelPath);

		if (element.type === "Group" && element.repeatability > 1) {
			const newDocPath = [...path, { elementName: node.name, index: 0 }];
			const rows = DocumentUtils.getRows(document, newDocPath);
			if (rows.length <= 0) {
				return false;
			}

			return rows
				.map((group, i) =>
					evalFilterExpression(
						documentModel,
						document,
						[
							...newDocPath.slice(0, newDocPath.length - 1),
							{ elementName: newDocPath[newDocPath.length - 1].elementName, index: i + 1 }
						],
						node.context,
						filterValue,
						filterOperation
					)
				)
				.reduce((previousValue, currentValue) => previousValue || currentValue);
		} else {
			const newDocPath = [...path, { elementName: node.name, index: 1 }];

			return evalFilterExpression(
				documentModel,
				document,
				newDocPath,
				node.context,
				filterValue,
				filterOperation
			);
		}
	} else {
		throw new Error("unknown filter expression type:" + node.type);
	}
}
