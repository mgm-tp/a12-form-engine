// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX } from "react";
import { useContext, useRef } from "react";

import { useDocumentContext } from "@com.mgmtp.a12.contentengine/contentengine-core";
import type {
	ContentModel,
	NodeRendererProps
} from "@com.mgmtp.a12.contentengine/contentengine-core";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";

import type { BaseControlProps } from "../../../types/controlProps.js";
import { assertCondition } from "../../../utils/assertions.js";
import { WidgetMapContext } from "../../../widgetMap/widgetMap-context.js";
import { createElementModule } from "../../createElementModule.js";
import { USE_COMMON_CONTROL_SETTINGS_WRAPPER } from "../../elementConfiguration/useCommonControlSettings.js";
import { USE_COMMON_WIDGET_SETTINGS_WRAPPER } from "../../elementConfiguration/useCommonWidgetSettings.js";
import { USE_LOCALIZED_ENUMERATION_VALUES_WRAPPER } from "../../elementConfiguration/useLocalizedEnumerationValues.js";
import { useFocus } from "../../focus.js";
import { nmTokensToString } from "../../nmtokens.js";

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
