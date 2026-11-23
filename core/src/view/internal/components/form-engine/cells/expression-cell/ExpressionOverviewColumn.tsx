// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ReactElement } from "react";
import { useContext } from "react";

import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";

import { UiId } from "../../../../../../back-end/utils/internal/generateUiId.js";
import { getExpressionValue } from "../../../../../../data/internal/expression-cell-value.js";
import { DocumentPath } from "../../../../../../models/index.js";
import type { FormModel } from "../../../../../../models/index.js";
import { ComponentMapContext } from "../../../../configuration/componentMap/component-map-context.js";
import type { FormModelMap } from "../../../../configuration/engine-configuration.js";
import { WidgetMapContext } from "../../../../configuration/widget-map-context.js";
import { isHidden } from "../../../../utilities/enablements/hidden.js";
import { DataContext } from "../../data-context.js";

/** @internal */
export function ExpressionOverviewColumn(props: {
	modelElement: FormModel.ExpressionOverviewColumn;
	config: FormModelMap.RenderConfiguration;
	context?: EntityInstancePath;
	displayPartialText?: boolean;
}): ReactElement | null {
	const { config, context: contextFromProps, modelElement, displayPartialText } = props;

	const { localizer, conversion } = useContext(LocalizerContext);
	const { HtmlTextDiv } = useContext(ComponentMapContext);
	const { CssEllipsis } = useContext(WidgetMapContext);

	/*
	 * For Expression Columns it is possible to optionally provide a data
	 * context via the props. This is also reflected in the FormModelMap
	 * interface used for customization. If this context is provided, it takes
	 * precedence over the context provided by the DataContext, to not break
	 * existing customizations.
	 */
	const contextFromContext = useContext(DataContext);
	const dataContext = contextFromProps ?? contextFromContext;

	const isExpressionColumnHidden = isHidden({
		formModelElement: modelElement,
		dataContext,
		state: config.renderOptions.state
	});
	if (isExpressionColumnHidden) {
		return null;
	}

	const value = getExpressionValue({
		state: config.renderOptions.state,
		converter: conversion,
		localizer,
		expressionTree: modelElement.expressionTree,
		dataContext,
		externalEnumerationProvider: config.renderOptions.config.externalEnumerationProvider
	});

	const uiId = UiId.generate({
		element: modelElement,
		uiIdPrefix: config.renderOptions.config.uiIdPrefix,
		rowIndex: DocumentPath.rowIndex(dataContext)! - 1
	});

	return displayPartialText ? (
		<CssEllipsis useTooltip>
			<HtmlTextDiv id={uiId} content={value} />
		</CssEllipsis>
	) : (
		<HtmlTextDiv id={uiId} content={value} />
	);
}
