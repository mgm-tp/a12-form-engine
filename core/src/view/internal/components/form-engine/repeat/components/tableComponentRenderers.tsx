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

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";
import type {
	TableComponentRenderers,
	TableRenderPropsType
} from "@com.mgmtp.a12.widgets/widgets-core/lib/table/new-api/table-renderer.api.js";

import { RESOURCE_KEYS } from "../../../../../../back-end/localization/index.js";
import { getLocalizedResource } from "../../../../../../back-end/localization/internal/localize.js";
import {
	DataSelectors,
	ModelSelectors,
	UiStateSelectors
} from "../../../../../../back-end/store/index.js";
import { UiId } from "../../../../../../back-end/utils/internal/generateUiId.js";
import { getDocumentPath } from "../../../../../../back-end/utils/internal/path.js";
import { DocumentPath, FormModel } from "../../../../../../models/index.js";
import { ComponentMapContext } from "../../../../configuration/componentMap/component-map-context.js";
import { DefaultRepeatButtonNames } from "../../../../configuration/engine-configuration.js";
import { WidgetMapContext } from "../../../../configuration/widget-map-context.js";
import {
	isDownloadButtonDisabled,
	isStandardRowActionDisabled
} from "../../../../utilities/enablements/disabled-row-actions.js";
import { DataContext } from "../../data-context.js";
import { createExpressionColumn } from "../../model-components.js";
import { getLabelAsHtml } from "../../model-element-labels.js";

import type { TableWidgetMap } from "../table-widget-map.js";
import { TableWidgetMapContext } from "../table-widget-map.js";

import { EmptyTablePlaceholder } from "./footer/emptyTablePlaceholder.js";
import { NewRowFilteredMessage } from "./footer/newRowFilteredMessage.js";
import { Summary } from "./footer/summary.js";
import { FilterContent } from "./head/filterContent.js";
import { MenuContext } from "./MenuContext.js";
import { RepeatUtils } from "./repeat-utils.js";
import type { RepeatTableProps } from "./repeatProps.js";
import { RowActionButtons } from "./row-actions/RowActionButtons.js";
import type { RepeatRow } from "./tableColumnTypes.js";
import { RepeatTableColumn } from "./tableColumnTypes.js";

/** @internal */
export function useTableComponentRenderers(
	repeatTableProps: RepeatTableProps
): Partial<TableComponentRenderers<RepeatRow, RepeatTableColumn>> {
	const {
		config,
		modelElement,
		infiniteScrolling,
		tableStyleOptions,
		readonly,
		totalNumberOfRows,
		BodyContentCell,
		ErrorHintButton,
		EditViewButton
	} = repeatTableProps;

	const componentMap = useContext(ComponentMapContext);
	const tableWidgetMap = useContext(TableWidgetMapContext) as unknown as TableWidgetMap<
		RepeatRow,
		RepeatTableColumn
	>;
	const { ContentWithNewLines } = componentMap;
	const { Button, ButtonGroup, Clearfix, HiddenText, HintTooltip, Icon, List } =
		useContext(WidgetMapContext);
	const { localizer } = useContext(LocalizerContext);

	function headFilterContentRenderer(
		props: TableRenderPropsType.HeadContentProps<RepeatTableColumn>
	) {
		return <FilterContent column={props.column} renderConfiguration={config} />;
	}

	function headContentRenderer(
		rendererProps: TableRenderPropsType.HeadContentProps<RepeatTableColumn>
	) {
		const { renderOptions: options, parentPath: repeatFormModelPath } = config;

		const disabled = UiStateSelectors.disabled()(options.state);
		const modelColumns = modelElement.repeatOverviewColumn;

		if (RepeatTableColumn.isActionColumn(rendererProps.column)) {
			const filterTitleOpen = getLocalizedResource(
				RESOURCE_KEYS.repeat.filter.button.title.open,
				localizer
			);
			const filterTitleClose = getLocalizedResource(
				RESOURCE_KEYS.repeat.filter.button.title.close,
				localizer
			);
			const filterButtonTitle = RepeatUtils.isFilterRowOpen(config)
				? filterTitleClose
				: filterTitleOpen;

			return modelColumns?.some(col => col.filterable) ? (
				<Button
					key="filter"
					disabled={UiStateSelectors.disabled()(options.state)}
					active={RepeatUtils.hasActiveFilters(config)}
					onClick={() => {
						options.eventHandlers.repeat.onShowFilter(
							repeatFormModelPath,
							!RepeatUtils.isFilterRowOpen(config)
						);
					}}
					icon={<Icon>filter_list</Icon>}
					title={filterButtonTitle}
					data-testid={toggleFilterButtonTestId(repeatFormModelPath)}
				/>
			) : null;
		} else if (RepeatTableColumn.isValidationColumn(rendererProps.column)) {
			return null;
		} else {
			const hintText = RepeatTableColumn.isFieldColumn(rendererProps.column)
				? rendererProps.column.hintText
				: undefined;
			const hint = hintText ? <HintTooltip text={hintText} key="hint" disabled={disabled} /> : null;

			const icon = rendererProps.column.modelElement.icon;
			const labelHidden = rendererProps.column.modelElement.labelHidden ?? false;
			const label = rendererProps.column.label ? (
				labelHidden ? (
					<HiddenText data-testid={`${rendererProps.column.modelElement.id}-hiddenText`}>
						{rendererProps.column.label}
					</HiddenText>
				) : (
					getLabelAsHtml(
						rendererProps.column.label,
						rendererProps.column.modelElement,
						componentMap
					)
				)
			) : undefined;

			const wrapHeaderCellTextAndIcon = (
				<>
					{icon ? (
						<Icon
							title={labelHidden ? rendererProps.column.label : undefined}
							iconTheme={icon.theme}
							data-testid={`${rendererProps.column.modelElement.id}-icon`}
						>
							{icon.name}
						</Icon>
					) : null}
					{icon && labelHidden ? undefined : typeof label === "string" ? (
						<ContentWithNewLines
							content={label}
							data-testid={`${rendererProps.column.modelElement.id}-contentWithNewLines`}
						/>
					) : (
						label
					)}
				</>
			);

			return (
				<>
					{rendererProps.column.sortable && hintText ? (
						<div role="button">{wrapHeaderCellTextAndIcon}</div>
					) : (
						wrapHeaderCellTextAndIcon
					)}
					{hint}
				</>
			);
		}
	}

	function headCellRenderer(rendererProps: TableRenderPropsType.HeadCellProps<RepeatTableColumn>) {
		const { column } = rendererProps;

		const className =
			RepeatTableColumn.isFieldColumn(column) || RepeatTableColumn.isExpressionColumn(column)
				? FormModel.styleToClassName(column.modelElement.headerStyle)
				: undefined;

		const testModelElementId = RepeatTableColumn.isColumnWithModelElement(column)
			? column.modelElement.id
			: undefined;

		const contentWrapperRole = !(RepeatTableColumn.isFieldColumn(column) && column.hintText);

		return tableWidgetMap.headCellRenderer({
			...rendererProps,
			className,
			contentWrapperRole,
			htmlAttributes: {
				"data-testid": testModelElementId
			} as React.HTMLAttributes<HTMLElement>
		});
	}

	function bodyContentRenderer(
		rendererProps: TableRenderPropsType.BodyContentProps<RepeatRow, RepeatTableColumn>
	) {
		const { row, column } = rendererProps;

		if (RepeatTableColumn.isFieldColumn(column)) {
			return (
				<BodyContentCell
					column={column}
					row={row}
					repeat={modelElement}
					config={config}
					displayPartialText={
						infiniteScrolling !== undefined || tableStyleOptions?.rowHeight !== undefined
					}
				/>
			);
		} else if (RepeatTableColumn.isExpressionColumn(column)) {
			const displayPartialText =
				infiniteScrolling !== undefined || tableStyleOptions?.rowHeight !== undefined;
			return createExpressionColumn(column.modelElement, config, row.path, displayPartialText);
		} else if (RepeatTableColumn.isValidationColumn(column)) {
			return ErrorHintButton ? (
				<ErrorHintButton
					config={config}
					readonly={readonly}
					repeat={modelElement}
					row={row}
					totalNumberOfRows={totalNumberOfRows}
				/>
			) : null;
		} else {
			return (
				<Clearfix>
					<ButtonGroup alignment="right">
						<RowActionButtons
							config={config}
							readonly={readonly}
							repeat={modelElement}
							row={row}
							totalNumberOfRows={totalNumberOfRows}
							EditViewButton={EditViewButton}
						/>
					</ButtonGroup>
				</Clearfix>
			);
		}
	}

	function bodyCellRenderer(
		rendererProps: TableRenderPropsType.BodyCellProps<RepeatRow, RepeatTableColumn>
	) {
		const { row, column } = rendererProps;

		const label = config.renderOptions.config.cardView ? column.label : undefined;

		if (RepeatTableColumn.isActionColumn(column) || RepeatTableColumn.isValidationColumn(column)) {
			return tableWidgetMap.bodyCellRenderer({
				...rendererProps,
				label,
				horizontalAlignment: column.specificHorizontalAlignment?.body
			});
		} else {
			const className =
				RepeatTableColumn.isFieldColumn(column) || RepeatTableColumn.isExpressionColumn(column)
					? FormModel.stylableToClassName(column.modelElement)
					: undefined;
			const uiId = UiId.generateForRepeatTableBodyCell({
				id: column.modelElement.id,
				uiIdPrefix: config.renderOptions.config.uiIdPrefix,
				rowIndex: row.rowIndexInDocument
			});

			return tableWidgetMap.bodyCellRenderer({
				...rendererProps,
				label: getLabelAsHtml(label, column.modelElement, componentMap),
				className,
				horizontalAlignment: column.specificHorizontalAlignment?.body,
				relativeWidth: column.width,
				id: uiId
			});
		}
	}

	function bodyRowRenderer(rendererProps: TableRenderPropsType.BodyRowProps<RepeatRow>) {
		const { key, ...rest } = rendererProps;
		return <TableBodyRow key={key} {...rest} {...repeatTableProps} />;
	}

	function bodyRenderer(rendererProps: TableRenderPropsType.BodyProps<RepeatRow>) {
		return emptyBodyRenderer(rendererProps) ?? tableWidgetMap.bodyRenderer(rendererProps);
	}

	function infiniteScrollBodyRenderer(
		rendererProps: TableRenderPropsType.InfiniteScrollBodyProps<RepeatRow>
	) {
		return (
			emptyBodyRenderer(rendererProps) ?? tableWidgetMap.infiniteScrollBodyRenderer(rendererProps)
		);
	}

	function emptyBodyRenderer(rendererProps: TableRenderPropsType.BodyProps) {
		if (repeatTableProps.processedData.rows.length > 0) {
			return null;
		}

		const isRepeatWithFilterExpression =
			repeatTableProps.modelElement.filterExpression !== undefined;

		return (
			// the body contains no rows, so it should not get the default role "rowgroup"
			<tableWidgetMap.TableTemplate.Body {...rendererProps} role={false}>
				<EmptyTablePlaceholder
					config={config}
					isRepeatWithFilterExpression={isRepeatWithFilterExpression}
					totalNumberOfProcessedDataRows={repeatTableProps.processedData.rows.length}
					totalNumberOfRows={totalNumberOfRows}
				/>
			</tableWidgetMap.TableTemplate.Body>
		);
	}

	function footRenderer(rendererProps?: TableRenderPropsType.FootProps) {
		if (repeatTableProps.processedData.newRowShown === false) {
			return (
				// the footer contains no rows, so it should not get the default role "rowgroup"
				<tableWidgetMap.TableTemplate.Foot {...rendererProps} role={false}>
					<NewRowFilteredMessage tableId={repeatTableProps.uiId} />
				</tableWidgetMap.TableTemplate.Foot>
			);
		}
		return tableWidgetMap.footRenderer(rendererProps);
	}

	function contextMenuRenderer(props: TableRenderPropsType.ContextMenuProps<RepeatRow>) {
		const { row } = props;

		return (
			<List border paddedLeft>
				<MenuContext.Provider value={{ renderAsListItem: true }}>
					<RowActionButtons
						config={config}
						readonly={readonly}
						repeat={modelElement}
						row={row}
						totalNumberOfRows={totalNumberOfRows}
						EditViewButton={EditViewButton}
					/>
				</MenuContext.Provider>
			</List>
		);
	}

	function footContentRenderer(
		rendererProps: TableRenderPropsType.FootContentProps<RepeatTableColumn>
	) {
		return (
			RepeatTableColumn.isFieldColumn(rendererProps.column) &&
			rendererProps.column.sum !== undefined && (
				<Summary
					modelPath={rendererProps.column.modelElement.elementPath}
					sum={rendererProps.column.sum}
					alignment={rendererProps.column.specificHorizontalAlignment?.body}
					renderOptions={config.renderOptions}
				/>
			)
		);
	}

	return {
		headFilterContentRenderer,
		headContentRenderer,
		headCellRenderer,
		bodyRowRenderer,
		bodyCellRenderer,
		bodyContentRenderer,
		bodyRenderer,
		infiniteScrollBodyRenderer,
		contextMenuRenderer,
		footRenderer,
		footContentRenderer
	};
}

type TableBodyRowProps = RepeatTableProps & TableRenderPropsType.BodyRowProps<RepeatRow>;

function TableBodyRow(props: TableBodyRowProps): JSX.Element {
	const { modelElement, row, rowIndex, config } = props;
	const { renderOptions: options, parentPath: repeatFormModelPath } = config;

	const repeatInstanceStateEntry = UiStateSelectors.repeatInstanceStateEntry(repeatFormModelPath)(
		options.state
	);
	const repeatStaticStateEntry = UiStateSelectors.repeatStaticStateEntry(repeatFormModelPath)(
		options.state
	);

	const unassignedIds = DataSelectors.Attachments.unassignedIds(options.state);

	const uiId = UiId.generateForRepeatTableBodyRow({
		id: modelElement.id,
		uiIdPrefix: options.config.uiIdPrefix,
		rowIndex: row.rowIndexInDocument
	});

	const newRow = repeatInstanceStateEntry?.newRow;

	const isNewRow =
		DocumentPath.equal(row.path, newRow?.rowPath ?? []) && newRow?.rowState !== undefined;

	const documentModel = ModelSelectors.documentModel()(options.state);
	const attachmentDocumentPath =
		(FormModel.InlineRepeat.isInstance(modelElement) ||
			FormModel.EmbeddedRepeat.isInstance(modelElement)) &&
		modelElement.multiFileUploadOptions
			? getDocumentPath(documentModel, modelElement.multiFileUploadOptions.elementPath, row.path)
			: undefined;

	const disabledDefaultRowAction = props.defaultRowAction
		? props.defaultRowAction.eventName === DefaultRepeatButtonNames.download
			? isDownloadButtonDisabled({
					byRow: options.config.enablements?.byRow ?? {},
					eventName: props.defaultRowAction.eventName,
					rowIndex,
					state: options.state,
					repeat: modelElement,
					attachmentDocumentPath,
					unassignedIds
				})
			: isStandardRowActionDisabled({
					byRow: options.config.enablements?.byRow ?? {},
					eventName: props.defaultRowAction.eventName,
					rowIndex: DocumentPath.rowIndex(row.path),
					state: options.state,
					repeat: modelElement
				})
		: false;

	return (
		<DataContext.Provider value={row.path} key={DocumentPath.toString(row.path)}>
			<props.BodyRow
				key={row.rowIndexInDocument}
				id={uiId}
				config={config}
				row={props.row}
				rowIndex={rowIndex}
				repeatState={{ ...repeatInstanceStateEntry, ...repeatStaticStateEntry }}
				focus={isNewRow}
				highlighted={isNewRow}
				defaultRowAction={!disabledDefaultRowAction ? props.defaultRowAction : undefined}
				style={{ ...props.style, height: props.tableStyleOptions?.rowHeight }}
				readonly={props.readonly}
				totalNumberOfRows={props.totalNumberOfRows}
			/>
		</DataContext.Provider>
	);
}

/** @internal */
export function toggleFilterButtonTestId(repeatPath: ModelPath): string {
	return `${ModelPath.toString(repeatPath)}-toggle_filter`;
}
