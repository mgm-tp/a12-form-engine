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
import type { DropDownItem } from "@com.mgmtp.a12.widgets/widgets-core";

import { createResourceLocalizable } from "../../../localization/createResourceLocalizable.js";
import { RESOURCE_KEYS } from "../../../localization/resources.js";
import type { BaseControlProps } from "../../../types/controlProps.js";
import { WidgetMapContext } from "../../../widgetMap/widgetMap-context.js";
import { createElementModule } from "../../createElementModule.js";
import { USE_COMMON_CONTROL_SETTINGS_WRAPPER } from "../../elementConfiguration/useCommonControlSettings.js";
import { USE_COMMON_WIDGET_SETTINGS_WRAPPER } from "../../elementConfiguration/useCommonWidgetSettings.js";
import { USE_LOCALIZED_ENUMERATION_VALUES_WRAPPER } from "../../elementConfiguration/useLocalizedEnumerationValues.js";
import { useFocus } from "../../focus.js";
import { nmTokensToString } from "../../nmtokens.js";

import type { AutoCompleteNode } from "./autocompleteNode.js";
import { AUTO_COMPLETE_TYPE } from "./autocompleteNode.js";
import { autocompleteValidator } from "./autocompleteValidator.js";
import { getNewAutocompleteValue } from "./getNewAutocompleteValue.js";

/** @internal */
export const AutoCompleteModule = createElementModule<AutoCompleteNode>({
	type: AUTO_COMPLETE_TYPE,
	renderer: AutoCompleteRenderer,
	validator: autocompleteValidator
});

function AutoCompleteRenderer(
	props: NodeRendererProps<ContentModel.Node<BaseControlProps>>
): JSX.Element | null {
	const { Autocomplete } = useContext(WidgetMapContext);
	const { localizer } = useContext(LocalizerContext);
	const inputRef = useRef<HTMLInputElement>(null);
	const { onValueChanged } = useDocumentContext(c => c.event);

	const { node } = props;

	const commonControlSettings = USE_COMMON_CONTROL_SETTINGS_WRAPPER.useCommonControlSettings(node);
	const { uiId, placeholder, dataReference, dmElement, notRelevant, ungroupedValidationMessages } =
		commonControlSettings;

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

	const isStringWithHintList =
		dmElement.type === "Field" &&
		dmElement.fieldType.type === "StringType" &&
		dmElement.fieldType.hintList !== undefined;

	// TODO: also relevant for external enums
	const allowAddingNewItem = isStringWithHintList;

	const enumerationOptions =
		USE_LOCALIZED_ENUMERATION_VALUES_WRAPPER.useLocalizedEnumerationValues(dataReference);

	if (notRelevant) {
		return null;
	}

	const selectedValue =
		typeof value === "string"
			? getNewAutocompleteValue(value, enumerationOptions, allowAddingNewItem)
			: undefined;

	const items: DropDownItem[] = enumerationOptions.map((option, index) => ({
		label: option.label,
		value: option.value,
		key: String(index)
	}));

	const hintTemplate = localizer(
		createResourceLocalizable(RESOURCE_KEYS.autocomplete.hintTemplate)
	);

	const handleValueChange = (value: string | DropDownItem) => {
		const newValue = getNewAutocompleteValue(value, enumerationOptions, allowAddingNewItem);
		onValueChanged({ path: dataReference, value: newValue, userValue: newValue ?? undefined });
	};

	// TODO: suffixes??? not modelable in the FMM, but they are handled by the Form Engine?
	return (
		<Autocomplete
			id={uiId}
			label={label}
			hideLabel={hideLabel}
			value={selectedValue ?? ""}
			items={items}
			readonly={readonly}
			hintTemplate={hintTemplate ?? ""}
			caseSensitive={isStringWithHintList} // FIXME: also relevant for ext enums with custom values => shouldn't this setting always be available?
			allowAddingNewItem={allowAddingNewItem}
			onValueChange={handleValueChange}
			inputPlaceHolder={placeholder}
			helperText={helperText}
			tooltips={tooltips}
			breakTooltipsToNewLine={tooltipsOnTop}
			error={error}
			errorMessage={errors}
			warning={warning}
			warningMessage={warnings}
			info={info}
			infoMessage={infos}
			inputProps={inputProps}
			inputRef={(ref: HTMLInputElement) => {
				inputRef.current = ref;
			}}
			ariaDescribedby={ariaDescribedBy.length ? nmTokensToString(ariaDescribedBy) : undefined}
		/>
	);
}
