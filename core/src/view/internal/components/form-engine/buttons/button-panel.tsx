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
import { useContext } from "react";

import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react";
import type { ButtonGroupProps } from "@com.mgmtp.a12.widgets/widgets-core";

import { UiStateSelectors } from "../../../../../back-end/store/index.js";
import { UiId } from "../../../../../back-end/utils/internal/generateUiId.js";
import type { FormModel } from "../../../../../models/index.js";
import { stylableToClassName } from "../../../../../models/internal/stylableToClassName.js";
import { FormModelPath } from "../../../../../models/internal/utils/form-model-path.js";
import { ComponentMapContext } from "../../../configuration/componentMap/component-map-context.js";
import type { FormModelMap } from "../../../configuration/engine-configuration.js";
import { WidgetMapContext } from "../../../configuration/widget-map-context.js";
import { HelperClasses } from "../../../utilities/css-classes.js";
import { isHidden } from "../../../utilities/enablements/hidden.js";
import { AriaLevelContext } from "../../content-box/AriaLevelContext.js";

import { BUTTON_PANEL } from "../data-roles.js";
import { createButton } from "../model-components.js";
import { getTitleLabel } from "../model-element-labels.js";

type Alignment = "left" | "right" | undefined;

/** @internal */
export function createButtonPanelProps(
	element: FormModel.ButtonPanel,
	config: FormModelMap.RenderConfiguration
): ButtonGroupProps {
	const { renderOptions: options } = config;

	const id = UiId.generate({ element: element, uiIdPrefix: options.config.uiIdPrefix });
	let alignment: Alignment;

	if (element.style && element.style.findIndex(s => s.name === HelperClasses.FLOAT_LEFT) > -1) {
		alignment = "left";
	} else if (
		element.style &&
		element.style.findIndex(s => s.name === HelperClasses.FLOAT_RIGHT) > -1
	) {
		alignment = "right";
	}

	return {
		id: id,
		alignment,
		className: stylableToClassName(element)
	};
}

/** @internal */
export function ButtonPanel(props: {
	modelElement: FormModel.ButtonPanel;
	config: FormModelMap.RenderConfiguration;
}): ReactElement | null {
	const { config, modelElement } = props;
	const { renderOptions: options } = config;

	const { localizer, conversion } = useContext(LocalizerContext);

	const { ButtonGroup, Clearfix } = useContext(WidgetMapContext);
	const componentMap = useContext(ComponentMapContext);
	const { Title } = componentMap;

	const currentScreenLocation = UiStateSelectors.currentScreenLocation()(options.state);
	const dataContext = currentScreenLocation.path;
	const isButtonPanelHidden = isHidden({
		formModelElement: modelElement,
		dataContext,
		state: options.state
	});
	if (isButtonPanelHidden) {
		return null;
	}

	const buttonPanelWidgetProps = createButtonPanelProps(modelElement, config);
	const buttons = modelElement.button;
	if (buttons !== undefined) {
		const formModelPath = FormModelPath.extend(config.parentPath, modelElement);
		const children = buttons
			.map(button => {
				return createButton(button, {
					...config,
					parentPath: formModelPath
				});
			})
			.filter(el => el !== null);
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
			<div data-role={BUTTON_PANEL}>
				{titleLabel && (
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
				)}
				<Clearfix key="clearfix">
					<ButtonGroup key={buttonPanelWidgetProps.id} {...buttonPanelWidgetProps}>
						{children}
					</ButtonGroup>
				</Clearfix>
			</div>
		);
	}

	return null;
}
