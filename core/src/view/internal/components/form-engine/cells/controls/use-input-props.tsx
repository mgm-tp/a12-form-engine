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

import type { ReactNode } from "react";
import { useContext, useMemo } from "react";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import type { Localizable, Localizer } from "@com.mgmtp.a12.utils/utils-localization";

import { RESOURCE_KEYS } from "../../../../../../back-end/localization/index.js";
import { createResourceLocalizable } from "../../../../../../back-end/localization/internal/factory.js";
import { ModelSelectors } from "../../../../../../back-end/store/internal/selectors/models.js";
import { UiStateSelectors } from "../../../../../../back-end/store/internal/selectors/ui-state.js";
import { UiId } from "../../../../../../back-end/utils/internal/generateUiId.js";
import { findElementByFormModelPath } from "../../../../../../models/internal/findElementByFormModelPath.js";
import type { StringValueDataType } from "../../../../../../models/internal/utils/document-model-utils.js";
import { ComponentMapContext } from "../../../../configuration/componentMap/component-map-context.js";
import type { FormModelMap, Inputs } from "../../../../configuration/engine-configuration.js";
import {
	EnumerableHelper,
	InternalEnumerableHelper
} from "../../../../utilities/enumerable/enumerableHelper.js";
import type { EnumerationValue } from "../../../../utilities/enumerable/enumValue.js";
import { nmTokensToString } from "../../../../utilities/nmtokens.js";
import type { Value } from "../../../../utilities/value.js";
import { getScreenReaderCellId } from "../../repeat/components/row-actions/getScreenReaderCellId.js";
import { isFormModelRepeat } from "../../../../../../models/index.js";

import type { ControlProps } from "./input-props.js";

/**
 * @internal
 * Function to put together the props all inputs have in common.
 * It should only use the given InputProps and make no calculations
 * as this is done in input-control already.
 * - still we should avoid this getProps function style
 */
export function useBaseProps(
	inputProps: Inputs.InputProps<DocumentModel.FieldType | DocumentModel.Group>
): ControlProps {
	const { renderConfiguration, uiId } = inputProps;
	const options = renderConfiguration.renderOptions;

	const { MessageList, Suffix, Tooltips } = useContext(ComponentMapContext);

	const isDisabled = inputProps.modelElement.disabled || UiStateSelectors.disabled()(options.state);

	const htmlInputProps = useMemo(
		() =>
			inputProps.modelElement.required || inputProps.modelElement.autoComplete
				? {
						"aria-required": inputProps.modelElement.required,
						autoComplete: inputProps.modelElement.autoComplete
					}
				: undefined,
		[inputProps.modelElement.required, inputProps.modelElement.autoComplete]
	);

	const showValidationMessagesAsTooltips = inputProps.modelElement.messageExposition === "TOOLTIP";

	const errorMessages = inputProps.validationMessages.errors;
	const warningMessages = inputProps.validationMessages.warnings;
	const infoMessages = inputProps.validationMessages.infos;

	const errorMessage =
		errorMessages.length > 0
			? {
					id: UiId.generateForErrorTooltip({ inputId: uiId }),
					content: <MessageList messages={errorMessages} id={uiId + "-error"} />
				}
			: undefined;

	const warningMessage =
		warningMessages.length > 0
			? {
					id: UiId.generateForWarningTooltip({ inputId: uiId }),
					content: <MessageList messages={warningMessages} id={uiId + "-warning"} />
				}
			: undefined;

	const infoMessage =
		infoMessages.length > 0
			? {
					id: UiId.generateForInfoTooltip({ inputId: uiId }),
					content: <MessageList messages={infoMessages} id={uiId + "-info"} />
				}
			: undefined;

	const hintTooltip = inputProps.modelElement.hintText
		? {
				id: UiId.generateForHintTooltip({ inputId: uiId }),
				content: inputProps.modelElement.hintText
			}
		: undefined;

	const validationMessagesTooltip =
		showValidationMessagesAsTooltips && (errorMessage || warningMessage || infoMessage)
			? { errorTooltip: errorMessage, warningTooltip: warningMessage, infoTooltip: infoMessage }
			: undefined;

	const tooltips =
		hintTooltip || validationMessagesTooltip ? (
			<Tooltips
				disabled={inputProps.modelElement.disabled}
				{...validationMessagesTooltip}
				hintTooltip={hintTooltip}
			/>
		) : undefined;

	const ariaDescribedBy: string[] = [];
	const suffixId = UiId.generateForSuffix({ inputId: uiId });
	if (inputProps.modelElement.suffix) {
		ariaDescribedBy.push(suffixId);
	}

	if (showValidationMessagesAsTooltips) {
		if (errorMessage) {
			ariaDescribedBy.push(errorMessage.id);
		}
		if (warningMessage) {
			ariaDescribedBy.push(warningMessage.id);
		}
		if (infoMessage) {
			ariaDescribedBy.push(infoMessage.id);
		}
	}

	if (hintTooltip) {
		ariaDescribedBy.push(hintTooltip.id);
	}

	return {
		label: inputProps.modelElement.label,
		readonly: inputProps.modelElement.readonly,
		disabled: isDisabled,
		suffixes: inputProps.modelElement.suffix && (
			<Suffix
				id={suffixId}
				suffix={inputProps.modelElement.suffix}
				truncateSuffix={inputProps.modelElement.truncateSuffix}
			/>
		),
		id: inputProps.uiId,
		error: errorMessages.length > 0,
		warning: warningMessages.length > 0,
		info: infoMessages.length > 0,
		...(!showValidationMessagesAsTooltips
			? {
					errorMessage: errorMessage?.content,
					warningMessage: warningMessage?.content,
					infoMessage: infoMessage?.content
				}
			: {}),
		addonAfter: tooltips,
		hideLabel: inputProps.modelElement.labelHiddenButRead,
		truncateSuffix: inputProps.modelElement.truncateSuffix,
		placeholder: inputProps.modelElement.placeholder,
		htmlInputProps,
		ariaDescribedby: nmTokensToString(ariaDescribedBy),
		helperText: inputProps.modelElement.helperText
	};
}

/** @internal */
export interface TextInputProps extends ControlProps {
	readonly value: string;
	readonly tooltips?: ReactNode;
}

/**
 * @internal
 * Function to put together the props for a text input.
 * It should only use the given InputProps and make no calculations
 * as this is done in input-control already.
 */
export function useBasePropsForTextInputs(
	props: Inputs.InputProps<DocumentModel.FieldType | DocumentModel.Group>
): TextInputProps {
	const { addonAfter, ...inputProps } = useBaseProps(props);

	return {
		...inputProps,
		value: props.value.ui,
		addonAfter: props.modelElement.tooltipsOnTop !== true ? addonAfter : undefined,
		tooltips: props.modelElement.tooltipsOnTop ? addonAfter : undefined
	};
}

/** @internal */
interface BooleanOption {
	readonly value: string;
	readonly label?: Localizable;
}

/** @internal */
export interface BooleanSelectInputProps extends Pick<
	ControlProps,
	Exclude<keyof ControlProps, "addonAfter" | "suffixes" | "truncateSuffix">
> {
	readonly booleanOptions: BooleanOption[];
	readonly tooltips: React.ReactNode;
	readonly breakTooltipsToNewLine?: boolean;
	readonly selectedValue?: BooleanOption;
}

/**
 * @internal
 * Function to put together the props for a boolean input.
 * It should only use the given InputProps and make no calculations
 * as this is done in input-control already.
 */
export function useBasePropsForBooleanSelect(
	props: Inputs.InputProps<DocumentModel.FieldType | DocumentModel.Group>
): BooleanSelectInputProps {
	const value = props.value;

	const dropDownItems = [
		{
			value: ""
		},
		{
			label: createResourceLocalizable(RESOURCE_KEYS.true),
			value: "true"
		},
		{
			label: createResourceLocalizable(RESOURCE_KEYS.false),
			value: "false"
		}
	];

	const booleanOptions = dropDownItems;

	const { addonAfter, suffixes, truncateSuffix, ...inputProps } = useBaseProps(props);
	const selectedValue = booleanOptions.find(op => op.value === String(value.data));
	return {
		...inputProps,
		selectedValue,
		booleanOptions,
		tooltips: addonAfter,
		breakTooltipsToNewLine: props.modelElement.tooltipsOnTop
	};
}

/** @internal */
export interface CheckboxInputProps extends Pick<
	ControlProps,
	Exclude<keyof ControlProps, "addonAfter" | "suffixes" | "truncateSuffix" | "placeholder">
> {
	readonly tooltips: ReactNode;
	readonly breakTooltipsToNewLine?: boolean;
	readonly checked: boolean;
}

/**
 * @internal
 * Function to put together the props for a checkbox input.
 * It should only use the given InputProps and make no calculations
 * as this is done in input-control already.
 */
export function useBasePropsForCheckbox(
	props: Inputs.InputProps<DocumentModel.FieldType | DocumentModel.Group>
): CheckboxInputProps {
	const { addonAfter, suffixes, truncateSuffix, placeholder, ...inputProps } = useBaseProps(props);

	const formModel = ModelSelectors.formModel()(props.renderConfiguration.renderOptions.state);

	const parent = findElementByFormModelPath(formModel, props.formModelPath.slice(0, -1));

	const cellId = isFormModelRepeat(parent)
		? getScreenReaderCellId(
				parent,
				props.value.path,
				props.renderConfiguration.renderOptions.config.uiIdPrefix
			)
		: undefined;

	return {
		...inputProps,
		tooltips: addonAfter,
		breakTooltipsToNewLine: props.modelElement.tooltipsOnTop,
		checked: props.value.data === true,
		htmlInputProps: {
			...inputProps.htmlInputProps,
			"aria-labelledby": cellId ? `${inputProps.id} ${cellId}` : inputProps.id,
			"aria-label":
				typeof props.modelElement.label === "string" ? props.modelElement.label : undefined
		}
	};
}

/** @internal */
export interface SwitchInputProps extends Pick<
	ControlProps,
	Exclude<keyof ControlProps, "suffixes" | "truncateSuffix" | "placeholder">
> {
	readonly checked: boolean;
	readonly tooltips?: ReactNode;
}

/**
 * @internal
 * Function to put together the props for a switch input.
 * It should only use the given InputProps and make no calculations
 * as this is done in input-control already.
 */
export function useBasePropsForSwitch(
	props: Inputs.InputProps<DocumentModel.FieldType | DocumentModel.Group>
): SwitchInputProps {
	const { addonAfter, suffixes, truncateSuffix, placeholder, ...inputProps } = useBaseProps(props);

	return {
		...inputProps,
		addonAfter: props.modelElement.tooltipsOnTop !== true ? addonAfter : undefined,
		tooltips: props.modelElement.tooltipsOnTop ? addonAfter : undefined,
		checked: props.value.data === true
	};
}

/** @internal */
export interface RadioInputProps extends Pick<
	ControlProps,
	Exclude<keyof ControlProps, "addonAfter" | "suffixes" | "truncateSuffix" | "placeholder">
> {
	readonly checked: boolean | null;
	readonly tooltips: ReactNode;
	readonly breakTooltipsToNewLine?: boolean;
}

/**
 * @internal
 * Function to put together the props for a boolean radio input.
 * It should only use the given InputProps and make no calculations
 * as this is done in input-control already.
 */
export function useBasePropsForBooleanRadio(
	props: Inputs.InputProps<DocumentModel.FieldType | DocumentModel.Group>
): RadioInputProps {
	const { addonAfter, suffixes, truncateSuffix, placeholder, ...inputProps } = useBaseProps(props);
	return {
		...inputProps,
		checked: props.value.data === true ? true : props.value.data === false ? false : null,
		tooltips: addonAfter,
		breakTooltipsToNewLine: props.modelElement.tooltipsOnTop
	};
}

/** @internal */
export interface EnumerationBaseProps extends Pick<
	ControlProps,
	Exclude<keyof ControlProps, "addonAfter" | "suffixes" | "truncateSuffix">
> {
	readonly enumerationOptions: EnumerationValue[];
	readonly tooltips: ReactNode;
	readonly breakTooltipsToNewLine?: boolean;
	readonly selectedValue?: EnumerationValue;
}

/**
 * @internal
 * Function to put together the props for an enumeration input.
 * It should only use the given InputProps and make no calculations
 * as this is done in input-control already.
 */
export function useEnumerationBaseProps(
	props: Inputs.InputProps<StringValueDataType>,
	localizer: Localizer
): EnumerationBaseProps {
	const options = props.renderConfiguration.renderOptions;
	const value = props.value;
	const enumerationOptions = EnumerableHelper.getLocalizedDependentEnumerationValues(
		options,
		value.path,
		localizer
	);
	const hideCustomValue = props.renderConfiguration.renderOptions.config.hideCustomEnumerationValue;
	const newOptions = hideCustomValue
		? enumerationOptions
		: addCustomValueToEnumeration(value, enumerationOptions, options);

	const { addonAfter, suffixes, truncateSuffix, ...inputProps } = useBaseProps(props);
	const selectedValue = newOptions.find(op => op.value === value.data);

	return {
		...inputProps,
		selectedValue,
		enumerationOptions: newOptions,
		tooltips: addonAfter,
		breakTooltipsToNewLine: props.modelElement.tooltipsOnTop
	};
}

function addCustomValueToEnumeration(
	value: Value,
	enumerationOptions: EnumerationValue[],
	options: FormModelMap.RenderOptions
): EnumerationValue[] {
	const result = [...enumerationOptions];
	if (typeof value.data === "string" && !enumerationOptions.some(o => o.value === value.data)) {
		const formModel = ModelSelectors.formModel()(options.state);
		const fce = formModel.content.fieldConfiguration.fieldMap[ModelPath.toString(value.path)];
		const customValueAllowed = InternalEnumerableHelper.isCustomValuesAllowed(fce);
		result.push({
			value: value.data,
			label: value.data,
			disabled: !customValueAllowed
		});
	}
	return result;
}
