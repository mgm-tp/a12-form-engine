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
import type { SelectItem } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/select/main/select.api.js";

import type { BaseControlProps } from "../../../types/controlProps.js";
import { WidgetMapContext } from "../../../widgetMap/widgetMap-context.js";
import { createElementModule } from "../../createElementModule.js";
import { USE_COMMON_CONTROL_SETTINGS_WRAPPER } from "../../elementConfiguration/useCommonControlSettings.js";
import { USE_COMMON_WIDGET_SETTINGS_WRAPPER } from "../../elementConfiguration/useCommonWidgetSettings.js";
import { USE_LOCALIZED_ENUMERATION_VALUES_WRAPPER } from "../../elementConfiguration/useLocalizedEnumerationValues.js";
import { useFocus } from "../../focus.js";
import { nmTokensToString } from "../../nmtokens.js";

import type { SelectNode } from "./selectNode.js";
import { SELECT_TYPE } from "./selectNode.js";
import { selectValidator } from "./selectValidator.js";

/** @internal */
export const SelectModule = createElementModule<SelectNode>({
	type: SELECT_TYPE,
	renderer: SelectRenderer,
	validator: selectValidator
});

function SelectRenderer(
	props: NodeRendererProps<ContentModel.Node<BaseControlProps>>
): JSX.Element | null {
	const { Select } = useContext(WidgetMapContext);
	const { conversion } = useContext(LocalizerContext);
	const inputRef = useRef<HTMLSelectElement>(null);
	const { onValueChanged } = useDocumentContext(c => c.event);

	const { node } = props;

	const commonControlSettings = USE_COMMON_CONTROL_SETTINGS_WRAPPER.useCommonControlSettings(node);
	const {
		uiId,
		placeholder,
		dataReference,
		conversionConfig,
		dmElement,
		notRelevant,
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

	// TODO: The FE sets false if required and initial value <- do we want this here, too?
	const emptyOption = true;

	// In case a placeholder is defined: Only show empty option if a value is selected
	if (emptyOption && (placeholder === undefined || selectedValue !== undefined)) {
		enumerationOptions.unshift({ value: "", label: "" });
	}

	const items: SelectItem[] = enumerationOptions.map((option, index) => ({
		label: option.label,
		value: option.value,
		key: String(index)
	}));

	const handleValueChange = (newValue: string) => {
		// FIXME: handle parseError? => formally incorrect values should not be possible
		// TODO: always call conversion without checking for the type?
		const parsedValue =
			conversionConfig?.type === "BooleanType"
				? conversion.parseValue(newValue, conversionConfig).value
				: newValue || null;

		onValueChanged({ path: dataReference, value: parsedValue, userValue: newValue });
	};

	return (
		<Select
			id={uiId}
			items={items}
			value={selectedValue ? selectedValue.value : ""}
			label={label}
			hideLabel={hideLabel}
			// Only show the placeholder if no value is selected
			placeholder={emptyOption && selectedValue === undefined ? placeholder : undefined}
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
			inputProps={inputProps}
			selectRef={(ref: HTMLSelectElement) => {
				inputRef.current = ref;
			}}
			ariaDescribedby={ariaDescribedBy ? nmTokensToString(ariaDescribedBy) : undefined}
		/>
	);
}
