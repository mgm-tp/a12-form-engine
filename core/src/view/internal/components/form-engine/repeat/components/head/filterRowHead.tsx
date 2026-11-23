// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { useContext } from "react";
import type { ReactElement } from "react";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";

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
import { ModelSelectors, UiStateSelectors } from "../../../../../../../back-end/store/index.js";
import { FormModel } from "../../../../../../../models/index.js";
import { DocumentModelUtils } from "../../../../../../../models/internal/utils/document-model-utils.js";
import { FormModelUtils } from "../../../../../../../models/internal/utils/form-model-utils.js";
import type { FormModelMap } from "../../../../../configuration/engine-configuration.js";
import {
	isEnumerationWithStringExposition,
	isExternalEnumerationWithDefaultExposition
} from "../../../../../utilities/filtering.js";

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

	const isExpressionColumn = FormModel.ExpressionOverviewColumn.isInstance(formModelElement);
	const columnId = isExpressionColumn ? formModelElement.name : formModelElement.id;

	const filter = UiStateSelectors.repeatFilterById(
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
