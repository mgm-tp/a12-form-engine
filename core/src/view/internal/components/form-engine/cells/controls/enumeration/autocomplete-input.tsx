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

import type { ReactElement } from "react";
import { useContext } from "react";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react";
import type { DropDownItem } from "@com.mgmtp.a12.widgets/widgets-core";

import { RESOURCE_KEYS } from "../../../../../../../back-end/localization/internal/languages/keys.js";
import { getLocalizedResource } from "../../../../../../../back-end/localization/internal/localize.js";
import { ModelSelectors } from "../../../../../../../back-end/store/index.js";
import type { StringValueDataType } from "../../../../../../../models/internal/utils/document-model-utils.js";
import type { Inputs } from "../../../../../configuration/engine-configuration.js";
import { WidgetMapContext } from "../../../../../configuration/widget-map-context.js";
import { InternalEnumerableHelper } from "../../../../../utilities/enumerable/enumerableHelper.js";
import type { EnumerationValue } from "../../../../../utilities/enumerable/enumValue.js";

import { useEnumerationBaseProps } from "../use-input-props.js";

/** @internal */
export function AutoCompleteInput(props: Inputs.InputProps<StringValueDataType>): ReactElement {
	const { localizer } = useContext(LocalizerContext);
	const { inputRef } = props;
	const options = props.renderConfiguration.renderOptions;
	const { enumerationOptions, selectedValue, placeholder, htmlInputProps, ...inputProps } =
		useEnumerationBaseProps(props, localizer);

	const formModel = ModelSelectors.formModel()(options.state);
	const fce =
		formModel.content.fieldConfiguration.fieldMap[
			ModelPath.toString(props.modelElement.elementPath)
		];

	const allowAddingNewItem = InternalEnumerableHelper.isCustomValuesAllowed(fce);
	const caseSensitive = allowAddingNewItem && InternalEnumerableHelper.isCaseSensitive(fce);

	const hintTemplate = getLocalizedResource(RESOURCE_KEYS.autocomplete.hintTemplate, localizer);
	const items = enumerationOptions.map<DropDownItem>(op => ({
		label: op.label,
		value: op.value,
		disabled: inputProps.disabled || op.disabled
	}));
	const selected = items.find(i => i.value === selectedValue?.value);
	const AutocompleteComponent = useContext(WidgetMapContext).Autocomplete;
	return (
		<AutocompleteComponent
			{...inputProps}
			value={selected}
			items={items}
			hintTemplate={hintTemplate ?? ""}
			caseSensitive={caseSensitive}
			allowAddingNewItem={allowAddingNewItem}
			onValueChange={value => {
				const newValue = getNewAutocompleteValue(value, enumerationOptions, allowAddingNewItem);
				options.eventHandlers.onValueChange(props.value.path, newValue, props.formModelPath);
			}}
			inputPlaceHolder={placeholder}
			inputProps={htmlInputProps}
			inputRef={element => {
				if (inputRef) {
					inputRef.current = element;
				}
			}}
		/>
	);
}

/**
 * Returns null for empty strings or if value is not known and adding custom values is not allowed.
 * The default widget never invokes onValueChange for these cases, but custom widgets might.
 */
function getNewAutocompleteValue(
	selectedValue: string | DropDownItem,
	items: EnumerationValue[],
	allowAddingNewItem?: boolean
): string | null {
	// if its a string, then label and value are identical
	// if its a DropDownItem, then a value is set if it's a known item or just the label otherwise
	const stringValue =
		typeof selectedValue === "string"
			? selectedValue.trim()
			: (selectedValue.value ?? selectedValue.label.trim());

	// unset autocomplete when entered an empty string
	const value = stringValue === "" ? null : stringValue;
	if (allowAddingNewItem) {
		return value;
	} else {
		// unset autocomplete if value is not amongst the known items
		const item = items.find(i => i.value === value);
		return item ? item.value : null;
	}
}
