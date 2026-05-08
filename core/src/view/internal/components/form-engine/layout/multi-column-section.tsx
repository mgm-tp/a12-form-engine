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

import type { ComponentType, ReactElement } from "react";
import { Fragment, useContext } from "react";

import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";
import type { LayoutGridProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/layout/layout-grid/main/layout-grid.api.js";

import { UiStateSelectors } from "../../../../../back-end/store/index.js";
import { UiId } from "../../../../../back-end/utils/internal/generateUiId.js";
import { FormModel } from "../../../../../models/index.js";
import { FormModelPath } from "../../../../../models/internal/utils/form-model-path.js";
import { ComponentMapContext } from "../../../configuration/componentMap/component-map-context.js";
import type { FormModelMap } from "../../../configuration/engine-configuration.js";
import { WidgetMapContext } from "../../../configuration/widget-map-context.js";
import { isHidden } from "../../../utilities/enablements/hidden.js";
import { AriaLevelContext } from "../../content-box/AriaLevelContext.js";

import { createFormModelElement } from "../model-components.js";
import { getTitleLabel } from "../model-element-labels.js";

import { transformToColumnNumbers } from "./transformToColumnNumbers.js";

/**
 * @internal
 *
 * Maps a MultiColumnSection from the Form-Model to a RenderModel.SizeContainer element
 *
 * @param config The render configuration
 */
export function createMultiColumnSection(
	element: FormModel.MultiColumnSection,
	config: FormModelMap.RenderConfiguration
): LayoutGridProps.LayoutGridProps {
	const { renderOptions: options } = config;
	const id = UiId.generate({ element: element, uiIdPrefix: options.config.uiIdPrefix });
	return {
		id: id,
		className: FormModel.stylableToClassName(element)
	};
}

/** @internal  */
export function MultiColumnSection(props: {
	modelElement: FormModel.MultiColumnSection;
	config: FormModelMap.RenderConfiguration;
}): ReactElement | null {
	const { modelElement, config } = props;
	const { renderOptions: options } = config;

	const { localizer, conversion } = useContext(LocalizerContext);
	const componentMap = useContext(ComponentMapContext);
	const { SizeContainer, SizeContainerRow, SizeContainerColumn } = useContext(WidgetMapContext);

	const { Title } = componentMap;

	const currentScreenLocation = UiStateSelectors.currentScreenLocation()(options.state);
	const dataContext = currentScreenLocation.path;

	const isMultiColumnSectionHidden = isHidden({
		formModelElement: modelElement,
		dataContext,
		state: options.state
	});
	if (isMultiColumnSectionHidden) {
		return null;
	}

	const multiColumnSectionProps = createMultiColumnSection(modelElement, config);

	const formModelPath = FormModelPath.extend(config.parentPath, modelElement);
	const layout: LayoutGridProps.ResponsiveConfig = {
		lg: transformToColumnNumbers(modelElement.layout.lg)!,
		md: transformToColumnNumbers(modelElement.layout.md),
		sm: transformToColumnNumbers(modelElement.layout.sm)
	};

	const columns = modelElement.screenElements
		? modelElement.screenElements
				.map(entry => {
					return createColumn(
						entry,
						{
							...config,
							parentPath: formModelPath
						},
						SizeContainerColumn
					);
				})
				.filter(el => el !== null)
		: [];

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

	const row = (
		<SizeContainerRow layoutConfig={{ layout }} data-testid={multiColumnSectionProps.id + "-row"}>
			{columns}
		</SizeContainerRow>
	);

	return (
		<SizeContainer {...multiColumnSectionProps}>
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
								{row}
							</AriaLevelContext.Provider>
						</Fragment>
					)}
				</AriaLevelContext.Consumer>
			) : (
				row
			)}
		</SizeContainer>
	);
}

function createColumn(
	element: FormModel.ScreenElement,
	config: FormModelMap.RenderConfiguration,
	Column: ComponentType<LayoutGridProps.ColumnProps>
): ReactElement | null {
	const { renderOptions: options } = config;

	const id = UiId.generate({
		element: element,
		uiIdPrefix: options.config.uiIdPrefix,
		suffix: "-column"
	});

	const cellInput = createFormModelElement(element, config);

	return cellInput ? (
		<Column key={id} id={id} className="">
			{cellInput}
		</Column>
	) : null;
}
