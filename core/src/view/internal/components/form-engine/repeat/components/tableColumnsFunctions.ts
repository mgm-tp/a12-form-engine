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

import type { ComponentType, ReactElement } from "react";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import type { Localizer, ValueConversion } from "@com.mgmtp.a12.utils/utils-localization";
import type { Column } from "@com.mgmtp.a12.widgets/widgets-core";

import { createLocalizableFactory } from "../../../../../../back-end/localization/internal/localization.js";
import { ModelSelectors } from "../../../../../../back-end/store/internal/selectors/models.js";
import { UiStateSelectors } from "../../../../../../back-end/store/internal/selectors/ui-state.js";
import type { FormModel } from "../../../../../../models/internal/form-model.js";
import {
	isFormModelEmbeddedRepeat,
	isFormModelExpressionOverviewColumn,
	isFormModelFieldOverviewColumn,
	isFormModelInlineRepeat
} from "../../../../../../models/internal/FormModelGuards.js";
import * as DocumentModelUtils from "../../../../../../models/internal/utils/document-model-utils.js";
import { FormModelPath } from "../../../../../../models/internal/utils/form-model-path.js";
import type { FormModelMap } from "../../../../configuration/engine-configuration.js";
import { DefaultRepeatButtonNames } from "../../../../configuration/engine-configuration.js";
import type { RowActionHidden } from "../../../../utilities/enablements/hidden-row-actions.js";
import {
	isCustomRowActionHidden,
	isStandardRowActionHidden
} from "../../../../utilities/enablements/hidden-row-actions.js";
import { isReadonly } from "../../../../utilities/enablements/readonly.js";
import type { Value } from "../../../../utilities/value.js";
import { getLabel, getLabelWithAsterisk, shouldShowAsterisk } from "../../model-element-labels.js";
import { InternalDocumentPath } from "../../../../../../models/internal/utils/document-utils.js";

import type { PaginatedRepeatData } from "./repeat-data.js";
import { showMoveButton } from "./row-actions/standard/showMoveButton.js";
import type { RowActionButtonsProps } from "./row-actions/standard/StandardRowActionButtons.js";
import type {
	ExpressionRepeatTableColumn,
	FieldRepeatTableColumn,
	RepeatRow,
	RepeatTableColumn
} from "./tableColumnTypes.js";

/** @internal */
export function computeColumns(
	parentPath: ModelPath,
	repeat: FormModel.Repeat,
	config: FormModelMap.RenderConfiguration,
	localizer: Localizer,
	converter: ValueConversion,
	defaultColumnVerticalAlignment: "top" | "middle" | "bottom",
	processedData: PaginatedRepeatData,
	EditViewButton?: ComponentType<RowActionButtonsProps>,
	actionColumnWidth?: number
): RepeatTableColumn[] {
	const columns: RepeatTableColumn[] = [];
	const defaultSpecificVerticalAlignment: FormModel.SpecificVerticalAlignment = {
		body: defaultColumnVerticalAlignment
	};
	let filterableColumnExists = false;

	const columnWidths = UiStateSelectors.columnWidths()(config.renderOptions.state);

	if (repeat.repeatOverviewColumn) {
		for (const column of repeat.repeatOverviewColumn) {
			const formModelElementPath = FormModelPath.extend(parentPath, column);
			const specificVerticalAlignment = {
				head: column.specificVerticalAlignment?.head,
				body: column.specificVerticalAlignment?.body ?? defaultSpecificVerticalAlignment.body
			};

			const defaultHorizontalAlignment = getDefaultHorizontalAlignment(column, config);
			const specificHorizontalAlignment: FormModel.SpecificHorizontalAlignment = {
				head: column.specificHorizontalAlignment?.head ?? defaultHorizontalAlignment,
				body: defaultHorizontalAlignment
			};

			if (column.filterable) {
				filterableColumnExists = true;
			}

			if (isFormModelFieldOverviewColumn(column)) {
				const localizableFactory = createLocalizableFactory(
					ModelSelectors.documentModel()(config.renderOptions.state),
					ModelSelectors.formModel()(config.renderOptions.state)
				);

				const hintText = localizer(
					...localizableFactory.repeatOverviewColumnHint(column, formModelElementPath)
				);

				columns.push({
					type: "field",
					label: computeLabel(column, repeat, config, localizer, converter),
					sortable: column.sortable,
					pinning: computePinning(column),
					specificVerticalAlignment,
					specificHorizontalAlignment,
					width: columnWidths[ModelPath.toString(formModelElementPath)] || computeWidth(column),
					dataGetter: dataGetter(column, config),
					valueGetter: valueGetter(column),
					modelElement: column,
					modelPath: formModelElementPath,
					fixedWidth: column.fixedWidth,
					hintText,
					showCommaSeparated: column.showCommaSeparated,
					sum: processedData.summaryResult?.[column.id]
				} as FieldRepeatTableColumn);
			} else if (isFormModelExpressionOverviewColumn(column)) {
				const formModelElementPath = FormModelPath.extend(parentPath, column);
				columns.push({
					type: "expression",
					label: computeLabel(column, repeat, config, localizer, converter),
					sortable: column.sortable,
					pinning: computePinning(column),
					specificVerticalAlignment,
					specificHorizontalAlignment,
					width: columnWidths[ModelPath.toString(formModelElementPath)] || computeWidth(column),
					dataGetter: dataGetter(column, config),
					modelElement: column,
					modelPath: formModelElementPath,
					fixedWidth: column.fixedWidth
				} as ExpressionRepeatTableColumn);
			} else {
				throw new Error("unknown model column type encountered!");
			}
		}
	}

	// add the action column on the right side if necessary
	if (
		showActionColumn({
			config,
			repeat: repeat,
			repeatFormModelPath: parentPath,
			filterableColumnExists,
			processedData,
			EditViewButton
		})
	) {
		columns.push({
			type: "action",
			label: "Actions",
			sortable: false,
			pinning: "right",
			specificVerticalAlignment: defaultSpecificVerticalAlignment,
			horizontalAlignment: "right",
			width: actionColumnWidth,
			fixedWidth: actionColumnWidth !== undefined,
			actionColumn: actionColumnWidth === undefined
		});
	}

	return columns;
}

function computePinning(column: FormModel.RepeatOverviewColumn): "left" | "right" | undefined {
	return column.pinDirection
		? (column.pinDirection.toLocaleLowerCase() as Column.Pinning)
		: undefined;
}

function computeWidth(column: FormModel.RepeatOverviewColumn): Column.Width {
	return column.width ? (column.width as Column.Width) : 1;
}

function valueGetter(column: FormModel.FieldOverviewColumn): (params: { row: RepeatRow }) => Value {
	if (isFormModelFieldOverviewColumn(column)) {
		return params => {
			const row = params.row;
			const value = row.values.find(v => ModelPath.equal(v.path, column.elementPath));
			if (!value) {
				throw new Error("There must always be a value for each field overview column.");
			}
			return value;
		};
	}
	throw new Error("unsupported column type - only field overview columns are allowed!");
}

function dataGetter(
	column: FormModel.RepeatOverviewColumn,
	config: FormModelMap.RenderConfiguration
): (params: { rowIndex: number; row: RepeatRow }) => string {
	if (isFormModelFieldOverviewColumn(column)) {
		return fieldColumnValue(column);
	} else if (isFormModelExpressionOverviewColumn(column)) {
		return expressionColumnValue(column, config);
	} else {
		throw new Error("unsupported column type!");
	}
}

function fieldColumnValue(
	column: FormModel.FieldOverviewColumn
): (params: { rowIndex: number; row: RepeatRow }) => string {
	return (params: { rowIndex: number; row: RepeatRow }) => {
		const value = params.row.values.find(v => ModelPath.equal(v.path, column.elementPath));
		return value ? value.ui : "";
	};
}

function expressionColumnValue(
	column: FormModel.ExpressionOverviewColumn,
	config: FormModelMap.RenderConfiguration
): (params: { rowIndex: number; row: RepeatRow }) => string {
	return (params: { rowIndex: number; row: RepeatRow }) => {
		const formModelPath = FormModelPath.extend(config.parentPath, column);
		const value = params.row.values.find(
			v => !!v.formModelPath && ModelPath.equal(v.formModelPath, formModelPath)
		);
		return value ? value.ui : "";
	};
}

function computeLabel(
	column: FormModel.RepeatOverviewColumn,
	repeat: FormModel.Repeat,
	config: FormModelMap.RenderConfiguration,
	localizer: Localizer,
	converter: ValueConversion
): ReactElement | string | undefined {
	const options = config.renderOptions;
	const repeatFormModelPath = config.parentPath;
	const columnPath: ModelPath = FormModelPath.extend(repeatFormModelPath, column);
	const currentScreenLocation = UiStateSelectors.currentScreenLocation()(options.state);
	const formModel = ModelSelectors.formModel()(options.state);

	const label = getLabel({
		options,
		element: column,
		formModelPath: columnPath,
		dataContext: currentScreenLocation.path,
		localizer,
		converter
	});

	if (!isFormModelFieldOverviewColumn(column) || !isFormModelInlineRepeat(repeat)) {
		return label;
	}

	const readonly = isReadonly({
		formModelPath: columnPath,
		dataContext: currentScreenLocation.path,
		state: options.state
	});
	const disabled = UiStateSelectors.disabled()(options.state);
	const updatedLabel = {
		...column,
		label,
		readonly,
		disabled
	};
	const showAsterisk = shouldShowAsterisk(updatedLabel, options, formModel);
	return showAsterisk ? getLabelWithAsterisk(label) : label;
}

function getDefaultHorizontalAlignment(
	column: FormModel.RepeatOverviewColumn,
	config: FormModelMap.RenderConfiguration
): Column.HorizontalAlignment {
	// by default, specific body alignment changes the head as well
	if (column.specificHorizontalAlignment?.body) {
		return column.specificHorizontalAlignment?.body;
	} else if (isFormModelFieldOverviewColumn(column)) {
		const documentElement = DocumentModelUtils.findByPath(
			ModelSelectors.documentModel()(config.renderOptions.state),
			column.elementPath
		);
		if (
			documentElement.type === "Field" &&
			documentElement.fieldType.type === "NumberType" &&
			(column.style === undefined || column.style.length === 0)
		) {
			return "right";
		}
	}

	return "left";
}

/**
 * @internal
 * Determines if the row action column should be added to the list of columns.
 *
 * A Repeat might only show the row action column, if at least one of the following is true:
 *
 * * At least one of the standard row actions is shown in a visible row.
 * Although set in the model, they could be hidden by the enablement api.
 * * At least one custom row action is shown in a visible row.
 * Although set in the model, they could be hidden by the enablement api.
 * * The repeat has a filterable column, hence the filter button needs to be shown.
 *
 * @param options Parameter object containing:
 * * config: The render config
 * * repeat: The repeat from the model
 * * repeatFormModelPath: The path of the repeat in the form model
 * * filterableColumnExists: A flag telling if at least one of the other repeat columns can be filtered
 * * processedData: The data containing the visible repeat rows
 * * EditViewButton: The component shown as the edit/view button on the repeat. Optional.
 * @returns true if the action column should be added to the table columns, false otherwise
 */
export function showActionColumn(options: {
	config: FormModelMap.RenderConfiguration;
	repeat: FormModel.Repeat;
	repeatFormModelPath: ModelPath;
	filterableColumnExists: boolean;
	processedData: PaginatedRepeatData;
	EditViewButton?: ComponentType<RowActionButtonsProps>;
}): boolean {
	const {
		config,
		repeat,
		repeatFormModelPath,
		filterableColumnExists,
		processedData,
		EditViewButton
	} = options;

	if (filterableColumnExists) {
		return true;
	}

	let standardRowActionsShown = false;
	let customRowActionsShown = false;

	for (const row of processedData.rows) {
		const partialRowActionHidden: Omit<RowActionHidden, "eventName"> = {
			rowIndex: InternalDocumentPath.rowIndex(row.path),
			state: config.renderOptions.state,
			byRow: config.renderOptions.config.enablements?.byRow || {},
			repeat
		};

		// standard row actions
		const moveButtonHidden = isStandardRowActionHidden({
			...partialRowActionHidden,
			eventName: DefaultRepeatButtonNames.move,
			enabledInModel: showMoveButton(config, repeat)
		});

		if (!moveButtonHidden) {
			standardRowActionsShown = true;
			break;
		}

		const copyButtonHidden = isStandardRowActionHidden({
			...partialRowActionHidden,
			eventName: DefaultRepeatButtonNames.copy,
			enabledInModel: repeat.enableCopy
		});

		if (!copyButtonHidden) {
			standardRowActionsShown = true;
			break;
		}

		const deleteButtonHidden = isStandardRowActionHidden({
			...partialRowActionHidden,
			eventName: DefaultRepeatButtonNames.delete,
			enabledInModel: repeat.enableRemove
		});

		if (!deleteButtonHidden) {
			standardRowActionsShown = true;
			break;
		}

		const editOrViewButtonHidden = isStandardRowActionHidden({
			...partialRowActionHidden,
			eventName: DefaultRepeatButtonNames.edit,
			enabledInModel: true
		});

		if (!editOrViewButtonHidden && !!EditViewButton) {
			standardRowActionsShown = true;
			break;
		}

		const downloadButtonHidden =
			isFormModelInlineRepeat(repeat) || isFormModelEmbeddedRepeat(repeat)
				? isStandardRowActionHidden({
						...partialRowActionHidden,
						eventName: DefaultRepeatButtonNames.download,
						enabledInModel: repeat.multiFileUploadOptions?.enableDownload
					})
				: true;

		if (!downloadButtonHidden) {
			standardRowActionsShown = true;
			break;
		}

		// custom row actions
		if (repeat.rowActionGroup?.action && repeat.rowActionGroup.action?.length > 0) {
			for (const customRowAction of repeat.rowActionGroup.action) {
				const customRowActionHidden = isCustomRowActionHidden({
					...partialRowActionHidden,
					eventName: customRowAction.event,
					repeatFormModelPath,
					scope: customRowAction.scope
				});

				if (!customRowActionHidden) {
					customRowActionsShown = true;
					break;
				}
			}
		}

		if (customRowActionsShown) {
			break;
		}
	}

	return standardRowActionsShown || customRowActionsShown;
}
