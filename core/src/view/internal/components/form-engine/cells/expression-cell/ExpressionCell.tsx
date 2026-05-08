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

import type { ReactElement } from "react";
import { useContext } from "react";

import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";

import { RESOURCE_KEYS } from "../../../../../../back-end/localization/index.js";
import { getLocalizedResource } from "../../../../../../back-end/localization/internal/localize.js";
import { type FormModel } from "../../../../../../models/index.js";
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
