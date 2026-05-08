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

import { type ReactElement } from "react";

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import type {
	Localizable,
	Localizer,
	ValueConversion
} from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import { createLocalizableFactory } from "../../../../back-end/localization/internal/localization.js";
import { ModelSelectors } from "../../../../back-end/store/internal/selectors/models.js";
import { UiStateSelectors } from "../../../../back-end/store/internal/selectors/ui-state.js";
import { getExpressionValue } from "../../../../data/internal/expression-cell-value.js";
import { FormModel } from "../../../../models/internal/form-model.js";
import type { ComponentMap } from "../../configuration/componentMap/component-map.js";
import type { FormModelMap } from "../../configuration/engine-configuration.js";
import { isFieldRequired } from "../../../../back-end/store/internal/kernel-adapter.js";

import { type HtmlTextProps } from "../widgets/form-engine/text.js";

/**
 * Returns the localized title label or undefined.
 *
 * By default, expressions will be parsed as html as they could
 * contain formatting instructions.
 * @internal
 */
export function getTitleLabel<
	T extends boolean,
	R = string | undefined | (T extends false ? never : ReactElement<HtmlTextProps>)
>(
	options: FormModelMap.RenderOptions,
	element: FormModel.TitledComponent,
	formModelPath: ModelPath,
	dataContext: EntityInstancePath,
	localizer: Localizer,
	converter: ValueConversion,
	componentMap: ComponentMap,
	parseExpressionAsHtml: T = true as T
): R {
	if (element.title?.type === "Expression" && element.title.expressionTree) {
		const expressionValue = getExpressionValue({
			converter,
			dataContext,
			localizer,
			expressionTree: element.title.expressionTree,
			state: options.state,
			externalEnumerationProvider: options.config.externalEnumerationProvider,
			noMarkup: true
		});

		return (
			parseExpressionAsHtml ? (
				<componentMap.HtmlTextSpan content={expressionValue} />
			) : (
				expressionValue
			)
		) as R;
	}

	const localizableFactory = createLocalizableFactory(
		ModelSelectors.documentModel()(options.state),
		ModelSelectors.formModel()(options.state)
	);
	const localizable = localizableFactory.componentTitle(element, formModelPath);
	return localizer(...localizable) as R;
}

/** @internal */
export function getSubtitle(
	options: FormModelMap.RenderOptions,
	model: FormModel,
	localizer: Localizer,
	converter: ValueConversion,
	componentMap: ComponentMap,
	parseExpressionAsHtml = true
): ReactElement<HtmlTextProps> | string | undefined {
	if (model.content.subtitle?.type === "Expression" && model.content.subtitle.expressionTree) {
		const expressionValue = getExpressionValue({
			converter,
			dataContext: [],
			localizer,
			expressionTree: model.content.subtitle.expressionTree,
			state: options.state,
			externalEnumerationProvider: options.config.externalEnumerationProvider,
			noMarkup: true
		});

		return parseExpressionAsHtml ? (
			<componentMap.HtmlTextSpan content={expressionValue} />
		) : (
			expressionValue
		);
	}

	const localizableFactory = createLocalizableFactory(
		ModelSelectors.documentModel()(options.state),
		ModelSelectors.formModel()(options.state)
	);
	const localizable = localizableFactory.modelSubtitle(model);
	return localizer(...localizable);
}

/**
 * Returns the localized label or undefined
 * @internal
 */
export function getLabel(props: {
	options: FormModelMap.RenderOptions;
	element: FormModel.LabeledComponent;
	formModelPath: ModelPath;
	dataContext: EntityInstancePath;
	localizer: Localizer;
	converter: ValueConversion;
	fce?: FormModel.FieldConfigurationEntry;
}): string | undefined {
	const { options, element, formModelPath, dataContext, localizer, converter, fce } = props;
	const label =
		FormModel.ButtonType.isInstance(element) || FormModel.RowAction.isInstance(element)
			? element.buttonStyling?.label
			: element.label;
	const expressionTree =
		label?.type === "Expression"
			? label.expressionTree
			: !label &&
				  fce?.label?.type === "Expression" &&
				  !FormModel.RepeatOverviewColumn.isInstance(element)
				? fce.label.expressionTree
				: undefined;

	if (expressionTree) {
		return getExpressionValue({
			converter,
			dataContext,
			localizer,
			expressionTree,
			state: options.state,
			externalEnumerationProvider: options.config.externalEnumerationProvider,
			noMarkup: true
		});
	} else {
		const localizableFactory = createLocalizableFactory(
			ModelSelectors.documentModel()(options.state),
			ModelSelectors.formModel()(options.state)
		);

		let localizables: Localizable[] = [];

		if (FormModel.FieldBasedInputType.isInstance(element)) {
			localizables = UiStateSelectors.InputLocalization.labelLocalizables(
				formModelPath,
				element
			)(options.state);
		} else if (FormModel.RepeatOverviewColumn.isInstance(element)) {
			localizables = localizableFactory.repeatOverviewColumnTitle(element, formModelPath);
		} else if (FormModel.RowAction.isInstance(element)) {
			localizables = localizableFactory.repeatRowActionLabel(formModelPath, element);
		} else {
			localizables = localizableFactory.componentLabel(element, formModelPath);
		}

		return localizer(...localizables);
	}
}

/**
 * Treats `labelContent` as html if it's
 * an expression (as defined by `element` or `fce`)
 * and returns a react component in that case.
 *
 * Otherwise, `labelContent` is returned as is.
 * @internal
 */
export function getLabelAsHtml(
	labelContent: string | undefined,
	element: FormModel.LabeledComponent,
	componentMap: ComponentMap,
	fce?: FormModel.FieldConfigurationEntry
): ReactElement<HtmlTextProps> | string | undefined {
	const label =
		FormModel.ButtonType.isInstance(element) || FormModel.RowAction.isInstance(element)
			? element.buttonStyling?.label
			: element.label;

	// same condition as for `getLabel()`
	return labelContent &&
		(label?.type === "Expression" ||
			(!label &&
				fce?.label?.type === "Expression" &&
				!FormModel.RepeatOverviewColumn.isInstance(element))) ? (
		<componentMap.HtmlTextSpan
			content={labelContent}
			data-testid={"id" in element ? `${element.id}-htmlTextSpan` : undefined}
		/>
	) : (
		labelContent
	);
}

/**
 * Returns the localized description of the given element or undefined
 * @internal
 */
export function getDescription(props: {
	options: FormModelMap.RenderOptions;
	element: FormModel.ComponentWithDescription;
	formModelPath: ModelPath;
	localizer: Localizer;
}): string | undefined {
	const { options, element, formModelPath, localizer } = props;

	const localizableFactory = createLocalizableFactory(
		ModelSelectors.documentModel()(options.state),
		ModelSelectors.formModel()(options.state)
	);

	const localizables = FormModel.RowAction.isInstance(element)
		? localizableFactory.repeatRowActionDescription(formModelPath, element)
		: localizableFactory.componentDescription(element, formModelPath);

	return localizer(...localizables);
}

/**
 * Returns the aria-label string for a button / menu item based on the given params
 * @internal
 */
export function calculateAriaLabel(params: {
	label?: string;
	description?: string;
	fallbackLabel?: string;
}): string | undefined {
	const { label, description, fallbackLabel } = params;
	return (label || fallbackLabel) && description
		? `${label ?? fallbackLabel} - ${description}`
		: (label ?? fallbackLabel ?? description);
}

/**
 * @internal
 * Returns the label combined with an asterisk
 */
export function getLabelWithAsterisk(label?: ReactElement | string): ReactElement | string {
	return typeof label === "string" ? (
		`${label}*`
	) : (
		<>
			{label}
			{"*"}
		</>
	);
}

type InputForAsterisk = {
	readonly label?: ReactElement | string;
	readonly elementPath: ModelPath;
	readonly markingOfRequiredFields?: FormModel.MarkingOfRequiredFields;
	readonly readonly?: boolean;
	readonly disabled?: boolean;
};

/**
 * @internal
 * Checks if an asterisk should be displayed based on form model settings and kernel evaluation
 */
export function shouldShowAsterisk(
	modelElement: InputForAsterisk,
	options: FormModelMap.RenderOptions,
	formModel: FormModel
): boolean {
	if (modelElement.label === undefined || modelElement.readonly || modelElement.disabled) {
		return false;
	} else if (formModel.content.markingOfRequiredFields === "ALWAYS") {
		return true;
	} else if (formModel.content.markingOfRequiredFields === "NONE") {
		return false;
	} else if (modelElement.markingOfRequiredFields === "ALWAYS") {
		return true;
	} else if (modelElement.markingOfRequiredFields === "NONE") {
		return false;
	} else {
		return isFieldRequired(
			modelElement.elementPath,
			ModelSelectors.validationCode()(options.state)
		);
	}
}
