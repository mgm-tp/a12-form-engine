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

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import type { ActionContentboxProps } from "@com.mgmtp.a12.widgets/widgets-core";

import { ModelSelectors } from "../../../../../back-end/store/internal/selectors/models.js";
import { UiStateSelectors } from "../../../../../back-end/store/internal/selectors/ui-state.js";
import type { FormModel } from "../../../../../models/index.js";
import { WidgetMapContext } from "../../../configuration/widget-map-context.js";
import { isHidden } from "../../../utilities/enablements/hidden.js";
import { createButton } from "../../form-engine/model-components.js";

import type { ContentBoxRenderConfiguration } from "../content-box-render-configuration.js";

import { getButtonsFromHeaderFooterType } from "./utils.js";

/** @internal */
export interface ActionButtonsProps {
	readonly element?: FormModel.HeaderFooterType;
	readonly config: ContentBoxRenderConfiguration;
}

/** @internal */
export function ActionButtons(props: ActionButtonsProps): ReactElement | null {
	const { element, config } = props;
	const { renderOptions } = config;
	const { ButtonGroupContainer, Clearfix } = useContext(WidgetMapContext);

	const currentScreenLocation = UiStateSelectors.currentScreenLocation()(renderOptions.state);
	const currentLocationPath = currentScreenLocation.locationPath;
	const subHeaderBox = ModelSelectors.formModel()(renderOptions.state).content.subHeaderBox;

	const majorButtons = getEventButtons({
		screenSubHeaderBox: subHeaderBox,
		screenBox: element,
		config,
		currentLocationPath,
		type: "major",
		dataTestId: "action-button-left"
	});
	const minorButtons = getEventButtons({
		screenSubHeaderBox: subHeaderBox,
		screenBox: element,
		config,
		currentLocationPath,
		type: "minor",
		dataTestId: "action-button-right"
	});

	if (minorButtons.length === 0 && majorButtons.length === 0) {
		return null;
	}

	return (
		<Clearfix key="clearfix">
			{
				<ButtonGroupContainer
					collapsingDirection="right-to-left"
					// eslint-disable-next-line @typescript-eslint/no-deprecated
					leftSlot={majorButtons}
					// eslint-disable-next-line @typescript-eslint/no-deprecated
					rightSlot={minorButtons}
					responsive
				/>
			}
		</Clearfix>
	);
}

interface GetEventButtonParams {
	screenSubHeaderBox?: FormModel.HeaderFooterType;
	screenBox?: FormModel.HeaderFooterType;
	config: ContentBoxRenderConfiguration;
	currentLocationPath?: ModelPath;
	type?: "minor" | "major";
	dataTestId?: string;
}

function getEventButtons({
	screenSubHeaderBox,
	screenBox,
	config,
	currentLocationPath,
	type,
	dataTestId
}: GetEventButtonParams): React.ReactElement[] {
	return [
		...getButtonsFromHeaderFooterType(screenSubHeaderBox, type).flatMap(button =>
			button.type !== "NAVIGATION" && screenSubHeaderBox
				? (createButton(
						button,
						{
							...config,
							parentPath: [{ elementName: screenSubHeaderBox.id }]
						},
						dataTestId
					) ?? [])
				: []
		),
		...getButtonsFromHeaderFooterType(screenBox, type).flatMap(button =>
			button.type !== "NAVIGATION" && currentLocationPath
				? (createButton(
						button,
						{
							...config,
							parentPath: [
								...currentLocationPath,
								{ elementName: screenBox === undefined ? "not-in-form-model" : screenBox.id }
							]
						},
						dataTestId
					) ?? [])
				: []
		)
	];
}

/**
 * @internal
 */
export function isActionButtonsVisible({
	element,
	config
}: {
	readonly element?: FormModel.HeaderFooterType;
	readonly config: ContentBoxRenderConfiguration;
}): boolean {
	const { path } = UiStateSelectors.currentScreenLocation()(config.renderOptions.state);
	const { subHeaderBox } = ModelSelectors.formModel()(config.renderOptions.state).content;

	function isVisible(button: FormModel.ButtonType): boolean {
		return !isHidden({
			formModelElement: button,
			dataContext: path,
			state: config.renderOptions.state,
			enablements: { buttons: config.renderOptions.config.enablements?.byButtonName }
		});
	}

	// Check the visibility all non-navigation buttons provided by the form subHeaderBox
	const isASubHeaderBoxButtonVisible = getButtonsFromHeaderFooterType(subHeaderBox)
		.filter(({ type }) => type !== "NAVIGATION")
		.some(isVisible);

	// Check the visibility all non-navigation buttons provided by the screen subHeaderBox
	const isAScreenHeaderBoxButtonVisible = getButtonsFromHeaderFooterType(element)
		.filter(({ type }) => type !== "NAVIGATION")
		.some(isVisible);

	return isASubHeaderBoxButtonVisible || isAScreenHeaderBoxButtonVisible;
}

/**
 * @internal
 */
export function getButtonConfiguration(
	props: GetEventButtonParams
): ActionContentboxProps.ButtonConfiguration[] {
	const { screenSubHeaderBox, config } = props;
	const { renderOptions } = config;

	const currentLocationPath = UiStateSelectors.currentScreenLocation()(
		renderOptions.state
	).locationPath;
	const formSubHeaderBox = ModelSelectors.formModel()(renderOptions.state).content.subHeaderBox;

	function createButtonConfiguration<T extends "form" | "screen">(
		headerFooterType: T extends "form"
			? FormModel.HeaderFooterType
			: FormModel.HeaderFooterType | undefined,
		subHeaderType: T,
		type: "minor" | "major"
	) {
		return getButtonsFromHeaderFooterType(headerFooterType, type).flatMap(button => {
			if (button.type === "NAVIGATION") {
				return [];
			}
			const renderConfig = {
				...config,
				parentPath:
					subHeaderType === "screen"
						? [
								...currentLocationPath,
								{
									elementName: headerFooterType ? headerFooterType.id : "not-in-form-model"
								}
							]
						: [{ elementName: headerFooterType!.id }]
			};

			const buttonComponent = createButton(
				{ ...button, buttonStyling: { ...button.buttonStyling, labelHidden: false } },
				renderConfig
			);

			return {
				align: "left",
				button: buttonComponent!
			} as const;
		});
	}

	return [
		...createButtonConfiguration(formSubHeaderBox, "form", "major"),
		...createButtonConfiguration(screenSubHeaderBox, "screen", "major"),
		...createButtonConfiguration(formSubHeaderBox, "form", "minor"),
		...createButtonConfiguration(screenSubHeaderBox, "screen", "minor")
	];
}
