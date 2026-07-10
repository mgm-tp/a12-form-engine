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

import type { JSX } from "react";
import { Fragment, useContext } from "react";

import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react";
import { addPrefix } from "@com.mgmtp.a12.widgets/widgets-core";

import { UiId } from "../../../../../back-end/utils/internal/generateUiId.js";
import type { FormModel } from "../../../../../models/index.js";
import { FormModelPath } from "../../../../../models/index.js";
import { stylableToClassName } from "../../../../../models/internal/stylableToClassName.js";
import { ComponentMapContext } from "../../../configuration/componentMap/component-map-context.js";
import type { FormModelMap } from "../../../configuration/engine-configuration.js";
import { WidgetMapContext } from "../../../configuration/widget-map-context.js";
import { isHidden } from "../../../utilities/enablements/hidden.js";
import { AriaLevelContext } from "../../content-box/AriaLevelContext.js";

import { DataContext } from "../data-context.js";
import { CUSTOM_CELL, CUSTOM_SCREEN_ELEMENT } from "../data-roles.js";
import { getTitleLabel } from "../model-element-labels.js";

/** @internal */
export function CustomCell(
	props: FormModelMap.FormModelComponentProps<FormModel.CustomCell>
): JSX.Element | null {
	const { config, modelElement } = props;
	const { id, name } = modelElement;

	const dataContext = useContext(DataContext);

	const isCustomCellHidden = isHidden({
		formModelElement: modelElement,
		dataContext,
		state: config.renderOptions.state
	});
	if (isCustomCellHidden) {
		return null;
	}

	const customHeight = {
		height: "70px"
	};

	return (
		<div
			id={id}
			data-role={CUSTOM_CELL}
			style={customHeight}
			className={addPrefix("-u-border-solid -u-padding-l-sm -u-margin-b-sm")}
		>
			<div>{name}</div>
		</div>
	);
}

/** @internal */
export function CustomScreenElement(
	props: FormModelMap.FormModelComponentProps<FormModel.CustomScreenElement>
): JSX.Element | null {
	const { config, modelElement } = props;
	const { id, height } = modelElement;

	const dataContext = useContext(DataContext);
	const { localizer, conversion } = useContext(LocalizerContext);
	const { TypographySection } = useContext(WidgetMapContext);
	const componentMap = useContext(ComponentMapContext);
	const { Title } = componentMap;

	const isCustomScreenElementHidden = isHidden({
		formModelElement: modelElement,
		dataContext,
		state: config.renderOptions.state
	});
	if (isCustomScreenElementHidden) {
		return null;
	}

	const formModelPath = FormModelPath.extend(config.parentPath, modelElement);

	const customHeight = {
		height: `${height ?? 328}px`
	};

	const { key, ...containerProps } = createCustomScreenContainerProps(modelElement, config);
	const titleLabel = getTitleLabel(
		config.renderOptions,
		modelElement,
		formModelPath,
		dataContext,
		localizer,
		conversion,
		componentMap
	);
	const titleProps = {
		text: titleLabel,
		initialAriaLevel: config.renderOptions.config.ariaLevel,
		collapsed: undefined,
		onCollapsingChange: undefined
	};

	const titleIdForTesting = UiId.generateForTitle({
		id: modelElement.id,
		uiIdPrefix: config.renderOptions.config.uiIdPrefix
	});

	return (
		<div
			id={id}
			data-role={CUSTOM_SCREEN_ELEMENT}
			style={customHeight}
			className={addPrefix("-u-border-solid -u-padding-l-sm -u-margin-b-sm")}
		>
			<TypographySection key={key} {...containerProps}>
				{
					<AriaLevelContext.Consumer>
						{value => (
							<Fragment>
								<Title
									{...titleProps}
									ariaLevel={value.ariaLevel}
									data-testid={titleIdForTesting}
								/>
								{
									<p>
										{height
											? `height: ${customHeight.height}`
											: `default height: ${customHeight.height}`}
									</p>
								}
							</Fragment>
						)}
					</AriaLevelContext.Consumer>
				}
			</TypographySection>
		</div>
	);
}

/** @internal */
interface CustomScreenContainerProps {
	readonly className?: string;
	readonly key?: string;
	readonly id?: string;
	readonly role?: string;
}

/**
 * Maps a Section from the Form-Model to a RenderModel.Div element
 * @param element The form-model element
 * @param config The render configuration
 */
function createCustomScreenContainerProps(
	element: FormModel.CustomScreenElement,
	config: FormModelMap.RenderConfiguration
): CustomScreenContainerProps {
	const { renderOptions: options } = config;
	const uiId = UiId.generate({ element: element, uiIdPrefix: options.config.uiIdPrefix });
	return {
		key: uiId,
		id: uiId,
		className: stylableToClassName(element)
	};
}
