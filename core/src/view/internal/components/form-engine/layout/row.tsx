// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ReactElement } from "react";
import { useContext } from "react";

import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";
import type { LayoutGridProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/layout/layout-grid/main/layout-grid.api.js";

import { UiId } from "../../../../../back-end/utils/internal/generateUiId.js";
import { FormModel } from "../../../../../models/index.js";
import { FormModelPath } from "../../../../../models/internal/utils/form-model-path.js";
import { ComponentMapContext } from "../../../configuration/componentMap/component-map-context.js";
import type { FormModelMap } from "../../../configuration/engine-configuration.js";
import { WidgetMapContext } from "../../../configuration/widget-map-context.js";
import { isHidden } from "../../../utilities/enablements/hidden.js";
import { AriaLevelContext } from "../../content-box/AriaLevelContext.js";

import { createCell } from "../cells/cell.js";
import { DataContext } from "../data-context.js";
import { getTitleLabel } from "../model-element-labels.js";

/**
 * @internal
 *
 * Maps a Row from the Form-Model to a RenderModel.SizeContainer element
 *
 * @param modelElement The row from the form model
 * @param config The render configuration
 * @param layout The layout of the parent control grid
 * @param offsets The offsets of all row children
 * @param spans The spans of all row children
 */
export function createRow(
	modelElement: FormModel.Row,
	config: FormModelMap.RenderConfiguration,
	layout: LayoutGridProps.ResponsiveConfig,
	offsets: LayoutGridProps.ResponsiveConfig,
	spans: LayoutGridProps.ResponsiveConfig
): LayoutGridProps.RowProps {
	const { renderOptions: options } = config;
	const id = UiId.generate({ element: modelElement, uiIdPrefix: options.config.uiIdPrefix });
	return {
		className: FormModel.stylableToClassName(modelElement),
		id,
		layoutConfig: {
			layout,
			offsets,
			spans
		}
	};
}

/** @internal */
export function Row(props: {
	modelElement: FormModel.Row;
	config: FormModelMap.RenderConfiguration;
	layout: LayoutGridProps.ResponsiveConfig;
}): ReactElement | null {
	const { modelElement, config, layout } = props;
	const { renderOptions: options } = config;

	const componentMap = useContext(ComponentMapContext);
	const { SizeContainer, SizeContainerRow, SizeContainerColumn } = useContext(WidgetMapContext);
	const { localizer, conversion } = useContext(LocalizerContext);
	const dataContext = useContext(DataContext);

	const isRowHidden = isHidden({
		formModelElement: modelElement,
		dataContext,
		state: options.state
	});
	if (isRowHidden) {
		return null;
	}

	const formModelPath = FormModelPath.extend(config.parentPath, modelElement);
	const { Title } = componentMap;

	function getAsColumnNumber(
		sizeClass: "lg" | "md" | "sm",
		fallBack: LayoutGridProps.ColumnNumber,
		property?: FormModel.SizedNumber
	): LayoutGridProps.ColumnNumber {
		return property && property[sizeClass]
			? (property[sizeClass] as LayoutGridProps.ColumnNumber)
			: fallBack;
	}

	const offsetsForWidget: LayoutGridProps.ResponsiveConfig = { lg: [], md: [], sm: [] };
	if (modelElement.cell) {
		for (const cell of modelElement.cell) {
			offsetsForWidget.lg.push(getAsColumnNumber("lg", 0, cell.offset));
			offsetsForWidget.md!.push(getAsColumnNumber("md", 0, cell.offset));
			offsetsForWidget.sm!.push(getAsColumnNumber("sm", 0, cell.offset));
		}
	}

	const spansForWidget: LayoutGridProps.ResponsiveConfig = { lg: [], md: [], sm: [] };
	if (modelElement.cell) {
		for (const cell of modelElement.cell) {
			spansForWidget.lg.push(getAsColumnNumber("lg", 1, cell.span));
			spansForWidget.md!.push(getAsColumnNumber("md", 1, cell.span));
			spansForWidget.sm!.push(getAsColumnNumber("sm", 1, cell.span));
		}
	}

	const sizeContainerRowProps = createRow(
		modelElement,
		config,
		layout,
		offsetsForWidget,
		spansForWidget
	);

	const cells = modelElement.cell
		? modelElement.cell.map((cell: FormModel.CellType, index: number) => {
				return createCell({
					element: cell,
					config: {
						...config,
						parentPath: formModelPath
					},
					currentIndex: index,
					SizeContainerColumn
				});
			})
		: [];

	if (cells.length === 0) {
		return null;
	}

	const titleLabel = getTitleLabel(
		options,
		modelElement,
		formModelPath,
		dataContext,
		localizer,
		conversion,
		componentMap
	);
	const titleIdForTesting = UiId.generateForTitle({
		id: modelElement.id,
		uiIdPrefix: options.config.uiIdPrefix
	});

	return (
		<>
			{titleLabel && (
				<SizeContainer
					key={sizeContainerRowProps.id + "-title-row"}
					id={sizeContainerRowProps.id + "-title-row"}
				>
					<AriaLevelContext.Consumer>
						{value => (
							<Title
								text={titleLabel}
								ariaLevel={value.ariaLevel}
								initialAriaLevel={options.config.ariaLevel}
								data-testid={titleIdForTesting}
							/>
						)}
					</AriaLevelContext.Consumer>
				</SizeContainer>
			)}
			<SizeContainerRow
				key={sizeContainerRowProps.id}
				{...sizeContainerRowProps}
				className={sizeContainerRowProps.className}
			>
				{cells}
			</SizeContainerRow>
		</>
	);
}
