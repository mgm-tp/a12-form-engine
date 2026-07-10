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
import { Fragment, useContext } from "react";

import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react";
import type { LayoutGridProps } from "@com.mgmtp.a12.widgets/widgets-core";

import { UiId } from "../../../../../back-end/utils/internal/generateUiId.js";
import type { FormModel } from "../../../../../models/index.js";
import { stylableToClassName } from "../../../../../models/internal/stylableToClassName.js";
import { FormModelPath } from "../../../../../models/internal/utils/form-model-path.js";
import { ComponentMapContext } from "../../../configuration/componentMap/component-map-context.js";
import type { FormModelMap } from "../../../configuration/engine-configuration.js";
import { WidgetMapContext } from "../../../configuration/widget-map-context.js";
import { isHidden } from "../../../utilities/enablements/hidden.js";
import { AriaLevelContext } from "../../content-box/AriaLevelContext.js";

import { DataContext } from "../data-context.js";
import { createRow } from "../model-components.js";
import { getTitleLabel } from "../model-element-labels.js";

import { transformToColumnNumbers } from "./transformToColumnNumbers.js";

/**
 * @internal
 *
 * Maps a GridLayout from the form-model to a RenderModel.LayoutGrid element
 */
export function createGridLayout(
	element: FormModel.ControlGrid,
	config: FormModelMap.RenderConfiguration
): LayoutGridProps.LayoutGridProps | null {
	const { renderOptions: options } = config;
	const id = UiId.generate({
		element: element,
		uiIdPrefix: options.config.uiIdPrefix
	});
	return {
		id: id,
		className: stylableToClassName(element)
	};
}

/** @internal  */
export function ControlGrid(props: {
	modelElement: FormModel.ControlGrid;
	config: FormModelMap.RenderConfiguration;
}): ReactElement | null {
	const { modelElement, config } = props;
	const { renderOptions: options } = config;

	const { localizer, conversion } = useContext(LocalizerContext);
	const componentMap = useContext(ComponentMapContext);
	const { LayoutGrid } = useContext(WidgetMapContext);
	const dataContext = useContext(DataContext);

	const { Title } = componentMap;

	const isControlGridHidden = isHidden({
		formModelElement: modelElement,
		dataContext,
		state: options.state
	});
	if (isControlGridHidden) {
		return null;
	}

	const layoutGridProps = createGridLayout(modelElement, config);
	if (layoutGridProps === null) {
		return null;
	}

	const formModelPath = FormModelPath.extend(config.parentPath, modelElement);

	const layoutStrings = modelElement.layout ? modelElement.layout : { lg: "12" };
	const layout: LayoutGridProps.ResponsiveConfig = {
		lg: transformToColumnNumbers(layoutStrings.lg)!,
		md: transformToColumnNumbers(layoutStrings.md),
		sm: transformToColumnNumbers(layoutStrings.sm)
	};

	const children: ReactElement[] = [];
	if (modelElement.row) {
		for (const row of modelElement.row) {
			const mappedRow = createRow(row, { ...config, parentPath: formModelPath }, layout);
			if (mappedRow !== null) {
				children.push(mappedRow);
			}
		}
	}

	if (children.length === 0) {
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
		<LayoutGrid
			key={layoutGridProps.id}
			{...layoutGridProps}
			verticalAlignment={getVerticalAlignment(modelElement.verticalAlignment)}
		>
			{titleLabel ? (
				<AriaLevelContext.Consumer>
					{value => (
						<Fragment>
							<Title
								text={titleLabel}
								ariaLevel={value.ariaLevel}
								initialAriaLevel={options.config.ariaLevel}
								data-testid={titleIdForTesting}
							/>
							<AriaLevelContext.Provider value={{ ariaLevel: value.ariaLevel + 1 }}>
								{children}
							</AriaLevelContext.Provider>
						</Fragment>
					)}
				</AriaLevelContext.Consumer>
			) : (
				children
			)}
		</LayoutGrid>
	);
}

function getVerticalAlignment(
	alignment?: FormModel.ControlGridVerticalAlignment
): "top" | "middle" | "bottom" | undefined {
	switch (alignment) {
		case "TOP":
			return "top";
		case "BOTTOM":
			return "bottom";
		case "MIDDLE":
			return "middle";
		default:
			return undefined;
	}
}
