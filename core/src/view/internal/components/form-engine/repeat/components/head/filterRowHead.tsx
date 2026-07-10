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

import { useContext } from "react";
import type { ReactElement } from "react";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";

import type {
	BooleanRepeatFilter,
	ConfirmRepeatFilter,
	DateRangeRepeatFilter,
	DateRepeatFilter,
	EnumerationRepeatFilter,
	MultiSelectRepeatFilter,
	NumberRepeatFilter,
	StringRepeatFilter
} from "../../../../../../../back-end/store/index.js";
import { ModelSelectors } from "../../../../../../../back-end/store/index.js";
import type { FormModel } from "../../../../../../../models/index.js";
import { isFormModelExpressionOverviewColumn } from "../../../../../../../models/internal/FormModelGuards.js";
import * as DocumentModelUtils from "../../../../../../../models/internal/utils/document-model-utils.js";
import { FormModelUtils } from "../../../../../../../models/internal/utils/form-model-utils.js";
import type { FormModelMap } from "../../../../../configuration/engine-configuration.js";
import {
	isEnumerationWithStringExposition,
	isExternalEnumerationWithDefaultExposition
} from "../../../../../utilities/filtering.js";
import { InternalUiStateSelectors } from "../../../../../../../back-end/store/internal/selectors/ui-state.js";

import { FilterCellMapContext } from "./filters/filter-cell-map.js";

/** @internal */
export function FilterRowHead(props: {
	formModelElement: FormModel.RepeatOverviewColumn;
	repeatFormModelPath: ModelPath;
	renderOptions: FormModelMap.RenderOptions;
}): ReactElement | null {
	const { formModelElement, repeatFormModelPath, renderOptions } = props;
	const {
		BooleanFilterCell,
		ConfirmFilterCell,
		DateFilterCell,
		EnumerationFilterCell,
		MultiSelectFilterCell,
		NumberFilterCell,
		StringFilterCell
	} = useContext(FilterCellMapContext);

	const isExpressionColumn = isFormModelExpressionOverviewColumn(formModelElement);
	const columnId = isExpressionColumn ? formModelElement.name : formModelElement.id;

	const filter = InternalUiStateSelectors.repeatFilterById(
		columnId,
		repeatFormModelPath
	)(renderOptions.state);

	if (isExpressionColumn) {
		return (
			<StringFilterCell
				element={formModelElement}
				repeatFormModelPath={repeatFormModelPath}
				filter={filter as StringRepeatFilter | undefined}
				options={renderOptions}
			/>
		);
	}

	const dm = ModelSelectors.documentModel()(renderOptions.state);
	const documentModelElement = DocumentModelUtils.findByPath(dm, formModelElement.elementPath);

	if (!documentModelElement) {
		return null;
	}

	switch (documentModelElement?.type) {
		case "Field": {
			const dataType = documentModelElement.fieldType;

			if (dataType.type === "NumberType") {
				return (
					<NumberFilterCell
						element={formModelElement}
						repeatFormModelPath={repeatFormModelPath}
						filter={filter as NumberRepeatFilter | undefined}
						options={renderOptions}
					/>
				);
			}
			if (dataType.type === "BooleanType") {
				return (
					<BooleanFilterCell
						element={formModelElement}
						repeatFormModelPath={repeatFormModelPath}
						filter={filter as BooleanRepeatFilter | undefined}
						options={renderOptions}
					/>
				);
			}
			if (dataType.type === "ConfirmType") {
				return (
					<ConfirmFilterCell
						element={formModelElement}
						repeatFormModelPath={repeatFormModelPath}
						filter={filter as ConfirmRepeatFilter | undefined}
						options={renderOptions}
					/>
				);
			}
			if (
				dataType.type === "DateType" ||
				dataType.type === "TimeType" ||
				dataType.type === "DateTimeType" ||
				dataType.type === "DateFragmentType" ||
				dataType.type === "DateRangeType"
			) {
				return (
					<DateFilterCell
						element={formModelElement}
						dataType={dataType}
						repeatFormModelPath={repeatFormModelPath}
						filter={filter as DateRepeatFilter | DateRangeRepeatFilter | undefined}
						options={renderOptions}
					/>
				);
			}

			const formModel = ModelSelectors.formModel()(renderOptions.state);
			const fieldConfigEntry =
				formModel.content.fieldConfiguration.fieldMap[
					ModelPath.toString(formModelElement.elementPath)
				];

			const isEnumerationWithDefaultExposition =
				dataType.type === "EnumerationType" &&
				(formModelElement.filterExposition === undefined ||
					formModelElement.filterExposition === "FULL");
			const isExternalEnumWithFullExposition =
				FormModelUtils.isExternalEnum(dataType, fieldConfigEntry) &&
				formModelElement?.filterExposition === "FULL";

			if (isEnumerationWithDefaultExposition || isExternalEnumWithFullExposition) {
				return (
					<EnumerationFilterCell
						element={formModelElement}
						repeatFormModelPath={repeatFormModelPath}
						enumerationFilterValues={filter as EnumerationRepeatFilter | undefined}
						options={renderOptions}
					/>
				);
			}

			if (
				dataType.type === "StringType" ||
				dataType.type === "CustomFieldType" ||
				isExternalEnumerationWithDefaultExposition(
					documentModelElement.fieldType,
					formModelElement,
					fieldConfigEntry
				) ||
				isEnumerationWithStringExposition(documentModelElement.fieldType, formModelElement)
			) {
				return (
					<StringFilterCell
						element={formModelElement}
						repeatFormModelPath={repeatFormModelPath}
						filter={filter as StringRepeatFilter | undefined}
						options={renderOptions}
					/>
				);
			}

			return null;
		}
		case "Group": {
			if (DocumentModelUtils.isMultiSelect(documentModelElement)) {
				return (
					<MultiSelectFilterCell
						element={formModelElement}
						repeatFormModelPath={repeatFormModelPath}
						filter={filter as MultiSelectRepeatFilter | undefined}
						options={renderOptions}
					/>
				);
			}

			return null;
		}
		default:
			return null;
	}
}
