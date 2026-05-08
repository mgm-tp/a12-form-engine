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

import type { JSX } from "react";
import { useContext, useRef } from "react";

import {
	useDocumentContext,
	type ContentModel,
	type NodeRendererProps
} from "@com.mgmtp.a12.contentengine/contentengine-core";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";

import type { BaseControlProps } from "../../../types/controlProps.js";
import { assertCondition } from "../../../utils/assertions.js";
import { WidgetMapContext } from "../../../widgetMap/widgetMap-context.js";
import { createElementModule } from "../../createElementModule.js";
import { USE_COMMON_CONTROL_SETTINGS_WRAPPER } from "../../elementConfiguration/useCommonControlSettings.js";
import { USE_COMMON_WIDGET_SETTINGS_WRAPPER } from "../../elementConfiguration/useCommonWidgetSettings.js";
import { USE_LOCALIZED_ENUMERATION_VALUES_WRAPPER } from "../../elementConfiguration/useLocalizedEnumerationValues.js";
import { nmTokensToString } from "../../nmtokens.js";
import { useFocus } from "../../focus.js";

import type { RadioNode } from "./radioNode.js";
import { RADIO_TYPE } from "./radioNode.js";
import { radioValidator } from "./radioValidator.js";

/** @internal */
export const RadioModule = createElementModule<RadioNode>({
	type: RADIO_TYPE,
	renderer: RadioRenderer,
	validator: radioValidator
});

function RadioRenderer(
	props: NodeRendererProps<ContentModel.Node<BaseControlProps>>
): JSX.Element | null {
	const { RadioItem, Radio } = useContext(WidgetMapContext);
	const { conversion } = useContext(LocalizerContext);
	const inputRef = useRef<HTMLInputElement>(null);
	const { onValueChanged } = useDocumentContext(c => c.event);

	const { node } = props;

	const commonControlSettings = USE_COMMON_CONTROL_SETTINGS_WRAPPER.useCommonControlSettings(node);
	const {
		uiId,
		dataReference,
		notRelevant,
		dmElement,
		conversionConfig,
		ungroupedValidationMessages
	} = commonControlSettings;

	useFocus({
		uiId,
		dataReference,
		ref: inputRef,
		messages: ungroupedValidationMessages
	});

	const {
		value,
		label,
		hideLabel,
		helperText,
		readonly,
		error,
		warning,
		info,
		errors,
		warnings,
		infos,
		tooltips,
		tooltipsOnTop,
		inline,
		inputProps,
		ariaDescribedBy
	} = USE_COMMON_WIDGET_SETTINGS_WRAPPER.useCommonWidgetSettings(commonControlSettings);

	const enumerationOptions =
		USE_LOCALIZED_ENUMERATION_VALUES_WRAPPER.useLocalizedEnumerationValues(dataReference);

	if (notRelevant) {
		return null;
	}

	/**
	 * The enumeration options contain the data value for enum fields, but for
	 * boolean fields they contain the stringified value, because the SelectItem
	 * typing only allows string values.
	 */
	const valueForEnumerationOption =
		dmElement.type === "Field" && dmElement.fieldType.type === "BooleanType" ? "" + value : value;
	const selectedValue = enumerationOptions.find(op => op.value === valueForEnumerationOption);

	const items = enumerationOptions.map((option, index) => (
		<RadioItem
			readonly={readonly}
			label={option.label}
			value={option.value}
			key={String(index)}
			inputRef={
				index === 0
					? (ref: HTMLInputElement) => {
							inputRef.current = ref;
						}
					: undefined
			}
		/>
	));

	const handleValueChange = (newValue: string) => {
		const index = enumerationOptions.findIndex(item => item.value === newValue);

		assertCondition(index >= 0, `The value ${newValue} was not found in the enumeration options.`);

		const parsedValue =
			conversionConfig?.type === "BooleanType"
				? conversion.parseValue(newValue, conversionConfig).value
				: newValue;

		onValueChanged({ path: dataReference, value: parsedValue, userValue: newValue });
	};

	return (
		<Radio
			inline={inline}
			id={uiId}
			value={selectedValue ? selectedValue.value : ""}
			label={label}
			hideLabel={hideLabel}
			readonly={readonly}
			helperText={helperText}
			tooltips={tooltips}
			breakTooltipsToNewLine={tooltipsOnTop}
			error={error}
			errorMessage={errors}
			warning={warning}
			warningMessage={warnings}
			info={info}
			infoMessage={infos}
			onValueChanged={handleValueChange}
			groupDOMProps={inputProps}
			ariaDescribedby={ariaDescribedBy ? nmTokensToString(ariaDescribedBy) : undefined}
		>
			{items}
		</Radio>
	);
}
