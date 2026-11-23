// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ReactElement } from "react";
import { useContext } from "react";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";
import type { DropDownItem } from "@com.mgmtp.a12.widgets/widgets-core/lib/dropdown/main/template/dropdown.tpl.api.js";

import { RESOURCE_KEYS } from "../../../../../../../back-end/localization/internal/languages/keys.js";
import { getLocalizedResource } from "../../../../../../../back-end/localization/internal/localize.js";
import { ModelSelectors } from "../../../../../../../back-end/store/index.js";
import type { StringValueDataType } from "../../../../../../../models/internal/utils/document-model-utils.js";
import type { Inputs } from "../../../../../configuration/engine-configuration.js";
import { WidgetMapContext } from "../../../../../configuration/widget-map-context.js";
import { EnumerableHelper } from "../../../../../utilities/enumerable/enumerableHelper.js";
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

	const allowAddingNewItem = EnumerableHelper.isCustomValuesAllowed(fce);
	const caseSensitive = allowAddingNewItem && EnumerableHelper.isCaseSensitive(fce);

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
