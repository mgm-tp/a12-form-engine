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

import type { JSX, ReactElement, ReactNode } from "react";
import { Fragment, useContext } from "react";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";

import { UiStateSelectors } from "../../../../../back-end/store/index.js";
import { UiId } from "../../../../../back-end/utils/internal/generateUiId.js";
import { FormModel } from "../../../../../models/index.js";
import { FormModelPath } from "../../../../../models/internal/utils/form-model-path.js";
import { ComponentMapContext } from "../../../configuration/componentMap/component-map-context.js";
import type { FormModelMap } from "../../../configuration/engine-configuration.js";
import { WidgetMapContext } from "../../../configuration/widget-map-context.js";
import { UtilityClasses } from "../../../utilities/css-classes.js";
import { isHidden } from "../../../utilities/enablements/hidden.js";
import { nmTokensToString } from "../../../utilities/nmtokens.js";
import { AriaLevelContext } from "../../content-box/AriaLevelContext.js";
import type { TitleProps } from "../../widgets/form-engine/title.js";

import { createFormModelElement } from "../model-components.js";
import { getTitleLabel } from "../model-element-labels.js";

/** @internal  */
export function Section(props: {
	modelElement: FormModel.Section;
	config: FormModelMap.RenderConfiguration;
}): ReactElement | null {
	const { modelElement, config } = props;
	const { renderOptions: options, parentPath } = config;

	const componentMap = useContext(ComponentMapContext);
	const widgetMap = useContext(WidgetMapContext);
	const { localizer, conversion } = useContext(LocalizerContext);

	const currentScreenLocation = UiStateSelectors.currentScreenLocation()(options.state);
	const dataContext = currentScreenLocation.path;

	const isSectionHidden = isHidden({
		formModelElement: modelElement,
		dataContext,
		state: options.state
	});
	if (isSectionHidden) {
		return null;
	}

	const formModelPath = FormModelPath.extend(parentPath, modelElement);
	const plainFormModelPath = ModelPath.toString(formModelPath);

	const sectionClosed = UiStateSelectors.sectionState()(options.state)[plainFormModelPath];
	const collapsed =
		sectionClosed !== undefined
			? sectionClosed
			: modelElement.collapsible && modelElement.initiallyCollapsed;

	const children =
		collapsed === false || collapsed === undefined
			? [
					...(modelElement.screenElements
						? modelElement.screenElements
								.map(screenElement =>
									createFormModelElement(screenElement, {
										...config,
										parentPath: formModelPath
									})
								)
								.filter(el => el !== undefined && el !== null)
						: [])
				]
			: undefined;

	if ((children === undefined || children.length === 0) && collapsed === false) {
		return null;
	}
	const { key, ...containerProps } = createContainerProps(modelElement, config);
	const titleLabel = getTitleLabel(
		options,
		modelElement,
		formModelPath,
		dataContext,
		localizer,
		conversion,
		componentMap
	);
	const titleProps: TitleProps = {
		text: titleLabel,
		initialAriaLevel: options.config.ariaLevel,
		collapsed: modelElement.collapsible ? collapsed === true : undefined,
		onCollapsingChange:
			modelElement.collapsible !== true
				? undefined
				: () => {
						config.renderOptions.eventHandlers.onCollapseSection(
							collapsed !== undefined ? !collapsed : !modelElement.initiallyCollapsed,
							formModelPath
						);
					},
		"data-testid": UiId.generateForTitle({
			id: modelElement.id,
			uiIdPrefix: options.config.uiIdPrefix
		})
	};

	return (
		<widgetMap.TypographySection key={key} {...containerProps}>
			{modelElement.collapsible === false || modelElement.collapsible === undefined ? (
				<PlainSection {...{ titleProps, children }} />
			) : (
				<CollapsibleSection {...{ titleProps, children }} />
			)}
		</widgetMap.TypographySection>
	);
}

function PlainSection(props: { titleProps: TitleProps; children?: ReactNode }): JSX.Element {
	const { titleProps, children } = props;

	const { TypographyBody } = useContext(WidgetMapContext);
	const { Title } = useContext(ComponentMapContext);

	const key = "content";

	// Setting margin-bottom: 0 to the TypographyBody (Section content) to prevent
	// changing the form spacing compared to the plain div used previously
	// Followup: A12E-3180
	const sectionContentClasses = nmTokensToString([UtilityClasses.MARGIN_BOTTOM_0]);

	return titleProps.text ? (
		<AriaLevelContext.Consumer>
			{value => (
				<Fragment>
					<Title {...titleProps} ariaLevel={value.ariaLevel} />
					{children ? (
						<AriaLevelContext.Provider value={{ ariaLevel: value.ariaLevel + 1 }}>
							<TypographyBody key={key} className={sectionContentClasses}>
								{children}
							</TypographyBody>
						</AriaLevelContext.Provider>
					) : null}
				</Fragment>
			)}
		</AriaLevelContext.Consumer>
	) : (
		<Fragment>
			{children ? (
				<TypographyBody key={key} className={sectionContentClasses}>
					{children}
				</TypographyBody>
			) : null}
		</Fragment>
	);
}

function CollapsibleSection(props: { titleProps: TitleProps; children?: ReactNode }): JSX.Element {
	const { titleProps, children } = props;

	const { TypographyBody } = useContext(WidgetMapContext);
	const { Title } = useContext(ComponentMapContext);

	const key = "content";

	// Setting margin-bottom: 0 to the TypographyBody (Section content) to prevent
	// changing the form spacing compared to the plain div used previously
	// Followup: A12E-3180
	const sectionContentClasses = nmTokensToString([UtilityClasses.MARGIN_BOTTOM_0]);

	return titleProps.text ? (
		<AriaLevelContext.Consumer>
			{value => (
				<Fragment>
					<Title {...titleProps} ariaLevel={value.ariaLevel} />
					{children ? (
						<AriaLevelContext.Provider value={{ ariaLevel: value.ariaLevel + 1 }}>
							<TypographyBody key={key} className={sectionContentClasses}>
								{children}
							</TypographyBody>
						</AriaLevelContext.Provider>
					) : null}
				</Fragment>
			)}
		</AriaLevelContext.Consumer>
	) : (
		<Fragment>
			<Title {...titleProps} />
			{children ? (
				<TypographyBody key={key} className={sectionContentClasses}>
					{children}
				</TypographyBody>
			) : null}
		</Fragment>
	);
}

/** @internal */
interface ContainerProps {
	readonly children?: ReactNode;
	readonly className?: string;
	readonly key?: string;
	readonly id?: string;
	readonly role?: string;
}

/**
 * Maps a Section from the Form-Model to a RenderModel.CollapsiblePanel or RenderModel.Div element
 * @param element The form-model element
 * @param config The render configuration
 */
function createContainerProps(
	element: FormModel.Section,
	config: FormModelMap.RenderConfiguration
): ContainerProps {
	const { renderOptions: options } = config;
	const uiId = UiId.generate({ element: element, uiIdPrefix: options.config.uiIdPrefix });
	return {
		key: uiId,
		id: uiId,
		className: FormModel.stylableToClassName(element)
	};
}
