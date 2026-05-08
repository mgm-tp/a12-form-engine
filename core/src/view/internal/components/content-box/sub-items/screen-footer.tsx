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

import { useContext, type ReactElement } from "react";

import { ModelSelectors, UiStateSelectors } from "../../../../../back-end/store/index.js";
import { UiId } from "../../../../../back-end/utils/internal/generateUiId.js";
import { ComponentMapContext } from "../../../configuration/componentMap/component-map-context.js";
import { WidgetMapContext } from "../../../configuration/widget-map-context.js";
import { createButton } from "../../form-engine/model-components.js";

import type { ScreenFooterProps } from "./screen-footer-props.js";
import { getButtonsFromHeaderFooterType, isNotNull } from "./utils.js";

/** @internal */
export function ScreenFooter({ element, config }: ScreenFooterProps): ReactElement | null {
	const { renderOptions } = config;
	const { locationPath } = UiStateSelectors.currentScreenLocation()(renderOptions.state);

	const { ButtonGroupContainer } = useContext(WidgetMapContext);
	const { ContentBoxFooter } = useContext(ComponentMapContext);

	const { footerBox } = ModelSelectors.formModel()(renderOptions.state).content;

	const majorButtons = [
		// All major buttons provided by the form footerBox
		...getButtonsFromHeaderFooterType(footerBox, "major")
			.map(button =>
				createButton(
					button,
					{ ...config, parentPath: [{ elementName: footerBox.id }] },
					"screen-footer-right"
				)
			)
			.filter(isNotNull),
		// All major buttons provided by the screen footerBox
		...getButtonsFromHeaderFooterType(element.footerBox, "major")
			.map(button =>
				createButton(
					button,
					{
						...config,
						parentPath: [...locationPath, { elementName: element.footerBox!.id }]
					},
					"screen-footer-right"
				)
			)
			.filter(isNotNull)
	];
	const minorButtons = [
		// All minor buttons provided by the form footerBox
		...getButtonsFromHeaderFooterType(footerBox, "minor")
			.map(button =>
				createButton(
					button,
					{ ...config, parentPath: [{ elementName: footerBox.id }] },
					"screen-footer-left"
				)
			)
			.filter(isNotNull),
		// All minor buttons provided by the screen footerBox
		...getButtonsFromHeaderFooterType(element.footerBox, "minor")
			.map(button =>
				createButton(
					button,
					{
						...config,
						parentPath: [...locationPath, { elementName: element.footerBox!.id }]
					},
					"screen-footer-left"
				)
			)
			.filter(isNotNull)
	];

	if (minorButtons.length === 0 && majorButtons.length === 0) {
		return null;
	}

	return (
		<ContentBoxFooter>
			<ButtonGroupContainer
				responsive
				// eslint-disable-next-line @typescript-eslint/no-deprecated
				leftSlot={minorButtons.length > 0 ? minorButtons : undefined}
				leftSlotProps={
					minorButtons.length > 0
						? {
								id: UiId.generateForBtnGroup({
									id: ModelSelectors.formModel()(renderOptions.state).content.footerBox.id,
									uiIdPrefix: renderOptions.config.uiIdPrefix,
									alignment: "left"
								})
							}
						: undefined
				}
				// eslint-disable-next-line @typescript-eslint/no-deprecated
				rightSlot={majorButtons.length > 0 ? majorButtons : undefined}
				rightSlotProps={
					majorButtons.length > 0
						? {
								id: UiId.generateForBtnGroup({
									id: ModelSelectors.formModel()(renderOptions.state).content.footerBox.id,
									uiIdPrefix: renderOptions.config.uiIdPrefix,
									alignment: "right"
								})
							}
						: undefined
				}
			/>
		</ContentBoxFooter>
	);
}
