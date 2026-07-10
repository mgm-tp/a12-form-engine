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

import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import type { LayoutGridProps } from "@com.mgmtp.a12.widgets/widgets-core";

import { UiStateSelectors } from "../../../../back-end/store/internal/selectors/ui-state.js";
import { UiId } from "../../../../back-end/utils/internal/generateUiId.js";
import type { FormModel } from "../../../../models/internal/form-model.js";
import {
	isFormModelButtonPanel,
	isFormModelButtonType,
	isFormModelControl,
	isFormModelControlGrid,
	isFormModelCustomCell,
	isFormModelCustomScreenElement,
	isFormModelDetachedRepeat,
	isFormModelEmbeddedRepeat,
	isFormModelExpressionCell,
	isFormModelInlineRepeat,
	isFormModelMultiColumnSection,
	isFormModelNavigationButton,
	isFormModelSection,
	isFormModelTextCell
} from "../../../../models/internal/FormModelGuards.js";
import { FormModelPath } from "../../../../models/internal/utils/form-model-path.js";
import type { FormModelMap } from "../../configuration/engine-configuration.js";
import { isHidden } from "../../utilities/enablements/hidden.js";

/**
 * @internal
 *
 * Maps Form-Model elements based on their type to RenderModel elements
 */
export function createFormModelElement(
	element: object,
	renderConfiguration: FormModelMap.RenderConfiguration
): ReactElement | null {
	if (isFormModelSection(element)) {
		return createSection(element, renderConfiguration);
	}
	if (isFormModelButtonType(element)) {
		return createButton(element, renderConfiguration);
	}
	if (isFormModelButtonPanel(element)) {
		return createButtonPanel(element, renderConfiguration);
	}
	if (isFormModelControl(element)) {
		return createControl(element, renderConfiguration);
	}
	if (isFormModelControlGrid(element)) {
		return createControlGrid(element, renderConfiguration);
	}
	if (isFormModelDetachedRepeat(element)) {
		return createDetachedRepeat(element, renderConfiguration);
	}
	if (isFormModelInlineRepeat(element)) {
		return createInlineRepeat(element, renderConfiguration);
	}
	if (isFormModelEmbeddedRepeat(element)) {
		return createEmbeddedRepeat(element, renderConfiguration);
	}
	if (isFormModelTextCell(element)) {
		return createTextCell(element, renderConfiguration);
	}
	if (isFormModelExpressionCell(element)) {
		return createExpressionCell(element, renderConfiguration);
	}
	if (isFormModelMultiColumnSection(element)) {
		return createMultiColumnSection(element, renderConfiguration);
	}
	if (isFormModelCustomScreenElement(element)) {
		return createCustomScreenElement(element, renderConfiguration);
	}
	if (isFormModelCustomCell(element)) {
		return createCustomCell(element, renderConfiguration);
	}

	// eslint-disable-next-line no-console
	console.warn("Unknown FormModel Element! ", element);
	return null;
}

/** @internal */
export function createRow(
	element: FormModel.Row,
	renderConfiguration: FormModelMap.RenderConfiguration,
	layout: LayoutGridProps.ResponsiveConfig
): ReactElement | null {
	const Row = renderConfiguration.renderOptions.config.formModelMap.Row.component;
	const id = UiId.generate({
		element: element,
		uiIdPrefix: renderConfiguration.renderOptions.config.uiIdPrefix
	});
	return <Row key={id} modelElement={element} config={renderConfiguration} layout={layout} />;
}

/** @internal */
export function createButtonPanel(
	element: FormModel.ButtonPanel,
	renderConfiguration: FormModelMap.RenderConfiguration
): ReactElement | null {
	const Component = renderConfiguration.renderOptions.config.formModelMap.ButtonPanel.component;
	const id = UiId.generate({
		element: element,
		uiIdPrefix: renderConfiguration.renderOptions.config.uiIdPrefix
	});
	return <Component key={id} modelElement={element} config={renderConfiguration} />;
}

/** @internal */
export function createScreen(
	element: FormModel.Screen,
	renderConfiguration: FormModelMap.RenderConfiguration
): ReactElement | null {
	const Component = renderConfiguration.renderOptions.config.formModelMap.Screen.component;
	const id = UiId.generate({
		element: element,
		uiIdPrefix: renderConfiguration.renderOptions.config.uiIdPrefix
	});
	return <Component key={id} modelElement={element} config={renderConfiguration} />;
}

/** @internal */
export function createButton(
	button: FormModel.ButtonType,
	renderConfiguration: FormModelMap.RenderConfiguration,
	dataTestId?: string
): ReactElement | null {
	const currentLocation = UiStateSelectors.currentScreenLocation()(
		renderConfiguration.renderOptions.state
	);
	const dataContext = currentLocation.path;

	const isButtonHidden = isHidden({
		formModelElement: button,
		dataContext,
		state: renderConfiguration.renderOptions.state,
		enablements: { buttons: renderConfiguration.renderOptions.config.enablements?.byButtonName }
	});

	if (isButtonHidden) {
		return null;
	}

	const id = UiId.generate({
		element: button,
		uiIdPrefix: renderConfiguration.renderOptions.config.uiIdPrefix
	});

	const formModelPath = FormModelPath.extend(renderConfiguration.parentPath, button);
	const c = {
		...renderConfiguration,
		currentPath: formModelPath
	};

	if (isFormModelNavigationButton(button)) {
		const Component =
			renderConfiguration.renderOptions.config.formModelMap.NavigationButton.component;
		return <Component modelElement={button} config={c} key={id} data-testid={dataTestId} />;
	} else {
		const Component = renderConfiguration.renderOptions.config.formModelMap.EventButton.component;
		return <Component modelElement={button} config={c} key={id} data-testid={dataTestId} />;
	}
}

/** @internal */
export function createControlGrid(
	element: FormModel.ControlGrid,
	renderConfiguration: FormModelMap.RenderConfiguration
): ReactElement | null {
	const Component = renderConfiguration.renderOptions.config.formModelMap.ControlGrid.component;
	const id = UiId.generate({
		element: element,
		uiIdPrefix: renderConfiguration.renderOptions.config.uiIdPrefix
	});
	return <Component key={id} modelElement={element} config={renderConfiguration} />;
}

/** @internal */
export function createSection(
	element: FormModel.Section,
	renderConfiguration: FormModelMap.RenderConfiguration
): ReactElement | null {
	const Component = renderConfiguration.renderOptions.config.formModelMap.Section.component;
	const id = UiId.generate({
		element: element,
		uiIdPrefix: renderConfiguration.renderOptions.config.uiIdPrefix
	});
	return <Component key={id} modelElement={element} config={renderConfiguration} />;
}

/** @internal */
export function createControl(
	element: FormModel.Control,
	renderConfiguration: FormModelMap.RenderConfiguration
): ReactElement | null {
	const Component = renderConfiguration.renderOptions.config.formModelMap.Control.component;
	const id = UiId.generate({
		element: element,
		uiIdPrefix: renderConfiguration.renderOptions.config.uiIdPrefix
	});
	return <Component key={id} modelElement={element} config={renderConfiguration} />;
}

/** @internal */
export function createExpressionCell(
	element: FormModel.ExpressionCell,
	renderConfiguration: FormModelMap.RenderConfiguration,
	context?: EntityInstancePath
): ReactElement | null {
	const Component = renderConfiguration.renderOptions.config.formModelMap.ExpressionCell.component;
	const id = UiId.generate({
		element: element,
		uiIdPrefix: renderConfiguration.renderOptions.config.uiIdPrefix
	});
	return (
		<Component key={id} modelElement={element} config={renderConfiguration} context={context} />
	);
}

/** @internal */
export function createExpressionColumn(
	element: FormModel.ExpressionOverviewColumn,
	renderConfiguration: FormModelMap.RenderConfiguration,
	context?: EntityInstancePath,
	displayPartialText?: boolean
): ReactElement | null {
	const Component =
		renderConfiguration.renderOptions.config.formModelMap.ExpressionOverviewColumn.component;
	const id = UiId.generate({
		element: element,
		uiIdPrefix: renderConfiguration.renderOptions.config.uiIdPrefix
	});

	return (
		<Component
			key={id}
			modelElement={element}
			config={renderConfiguration}
			context={context}
			displayPartialText={displayPartialText}
		/>
	);
}

/** @internal */
export function createInlineRepeat(
	element: FormModel.InlineRepeat,
	renderConfiguration: FormModelMap.RenderConfiguration
): ReactElement | null {
	const Component = renderConfiguration.renderOptions.config.formModelMap.InlineRepeat.component;
	const id = UiId.generate({
		element: element,
		uiIdPrefix: renderConfiguration.renderOptions.config.uiIdPrefix
	});
	return <Component key={id} modelElement={element} config={renderConfiguration} />;
}

/** @internal */
export function createDetachedRepeat(
	element: FormModel.DetachedRepeat,
	renderConfiguration: FormModelMap.RenderConfiguration
): ReactElement | null {
	const Component = renderConfiguration.renderOptions.config.formModelMap.DetachedRepeat.component;
	const id = UiId.generate({
		element: element,
		uiIdPrefix: renderConfiguration.renderOptions.config.uiIdPrefix
	});
	return <Component key={id} modelElement={element} config={renderConfiguration} />;
}

/** @internal */
export function createEmbeddedRepeat(
	element: FormModel.EmbeddedRepeat,
	renderConfiguration: FormModelMap.RenderConfiguration
): ReactElement | null {
	const Component = renderConfiguration.renderOptions.config.formModelMap.EmbeddedRepeat.component;
	const id = UiId.generate({
		element: element,
		uiIdPrefix: renderConfiguration.renderOptions.config.uiIdPrefix
	});
	return <Component key={id} modelElement={element} config={renderConfiguration} />;
}

/** @internal */
export function createMultiColumnSection(
	element: FormModel.MultiColumnSection,
	renderConfiguration: FormModelMap.RenderConfiguration
): ReactElement | null {
	const Component =
		renderConfiguration.renderOptions.config.formModelMap.MultiColumnSection.component;
	const id = UiId.generate({
		element: element,
		uiIdPrefix: renderConfiguration.renderOptions.config.uiIdPrefix
	});
	return <Component key={id} modelElement={element} config={renderConfiguration} />;
}

/** @internal */
export function createTextCell(
	element: FormModel.TextCell,
	renderConfiguration: FormModelMap.RenderConfiguration
): ReactElement | null {
	const Component = renderConfiguration.renderOptions.config.formModelMap.TextCell.component;
	const id = UiId.generate({
		element: element,
		uiIdPrefix: renderConfiguration.renderOptions.config.uiIdPrefix
	});
	return <Component key={id} modelElement={element} config={renderConfiguration} />;
}

/** @internal */
export function createCustomCell(
	element: FormModel.CustomCell,
	renderConfiguration: FormModelMap.RenderConfiguration
): ReactElement | null {
	// TODO: remove !
	const Component = renderConfiguration.renderOptions.config.formModelMap.CustomCell!.component;
	const id = UiId.generate({
		element: element,
		uiIdPrefix: renderConfiguration.renderOptions.config.uiIdPrefix
	});
	return <Component key={id} modelElement={element} config={renderConfiguration} />;
}

/** @internal */
export function createCustomScreenElement(
	element: FormModel.CustomScreenElement,
	renderConfiguration: FormModelMap.RenderConfiguration
): ReactElement | null {
	// TODO: remove !
	const Component =
		renderConfiguration.renderOptions.config.formModelMap.CustomScreenElement!.component;
	const id = UiId.generate({
		element: element,
		uiIdPrefix: renderConfiguration.renderOptions.config.uiIdPrefix
	});
	return <Component key={id} modelElement={element} config={renderConfiguration} />;
}
