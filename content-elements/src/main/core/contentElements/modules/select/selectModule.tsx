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

import type { JSX } from "react";
import { useContext, useRef } from "react";

import { useDocumentContext } from "@com.mgmtp.a12.contentengine/contentengine-core";
import type {
	ContentModel,
	NodeRendererProps
} from "@com.mgmtp.a12.contentengine/contentengine-core";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react";
import type { SelectItem } from "@com.mgmtp.a12.widgets/widgets-core";

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
