// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { useContext } from "react";
import type { ReactElement } from "react";

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
				// oxlint-disable-next-line typescript/no-deprecated
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
				// oxlint-disable-next-line typescript/no-deprecated
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
