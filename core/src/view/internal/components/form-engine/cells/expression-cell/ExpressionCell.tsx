// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ReactElement } from "react";
import { useContext } from "react";

import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";

import { RESOURCE_KEYS } from "../../../../../../back-end/localization/index.js";
import { getLocalizedResource } from "../../../../../../back-end/localization/internal/localize.js";
import type { FormModel } from "../../../../../../models/index.js";
import { FormModelPath } from "../../../../../../models/internal/utils/form-model-path.js";
import { ComponentMapContext } from "../../../../configuration/componentMap/component-map-context.js";
import type { FormModelMap } from "../../../../configuration/engine-configuration.js";
import { WidgetMapContext } from "../../../../configuration/widget-map-context.js";
import { isHidden } from "../../../../utilities/enablements/hidden.js";
import { DataContext } from "../../data-context.js";
import { getLabel, getLabelAsHtml } from "../../model-element-labels.js";

import { getExpressionCellValueInUI } from "./getExpressionCellValueInUI.js";

/** @internal */
export function ExpressionCell(props: {
	modelElement: FormModel.ExpressionCell;
	config: FormModelMap.RenderConfiguration;
	context?: EntityInstancePath;
}): ReactElement | null {
	const { modelElement, config, context: contextFromProps } = props;

	const { localizer, conversion } = useContext(LocalizerContext);

	const componentMap = useContext(ComponentMapContext);
	const { HtmlTextDiv } = componentMap;
	const { TextOutput } = useContext(WidgetMapContext);

	/*
	 * For Expression Cells it is possible to optionally provide a data context
	 * via the props. This is also reflected in the FormModelMap interface used
	 * for customization. If this context is provided, it takes precedence over
	 * the context provided by the DataContext, to not break existing
	 * customizations.
	 */
	const contextFromContext = useContext(DataContext);
	const dataContext = contextFromProps ?? contextFromContext;

	const { renderOptions: options, parentPath } = config;

	const formModelPath = FormModelPath.extend(parentPath, modelElement);

	const isExpressionCellHidden = isHidden({
		formModelElement: modelElement,
		dataContext,
		state: config.renderOptions.state
	});
	if (isExpressionCellHidden) {
		return null;
	}

	const labelText = getLabel({
		options,
		element: modelElement,
		formModelPath,
		dataContext,
		localizer,
		converter: conversion
	});

	const expressionValue = getExpressionCellValueInUI(
		options,
		modelElement,
		localizer,
		conversion,
		dataContext
	);
	const noData = expressionValue === "";
	const noDataString = getLocalizedResource(RESOURCE_KEYS.textOutput.noData, localizer);
	return (
		<TextOutput
			key="expression"
			data-testid={`${modelElement.id}-textOutput`}
			noData={noData && !!noDataString}
			label={getLabelAsHtml(labelText, modelElement, componentMap)}
			// note: we cannot have a paragraph wrap the div that we render below since that is not a valid nesting
			disableParagraphWrapping
		>
			{noData ? (
				noDataString
			) : (
				<HtmlTextDiv
					key="expression"
					data-testid={`${modelElement.id}-htmlTextDiv`}
					content={expressionValue}
				/>
			)}
		</TextOutput>
	);
}
