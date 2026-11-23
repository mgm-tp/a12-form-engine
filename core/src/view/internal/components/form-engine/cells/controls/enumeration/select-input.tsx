// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ReactElement } from "react";
import { useContext } from "react";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";
import type { SelectItem } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/select/main/select.api.js";

import { ModelSelectors } from "../../../../../../../back-end/store/index.js";
import { isFieldRequired } from "../../../../../../../back-end/store/internal/kernel-adapter.js";
import type { StringValueDataType } from "../../../../../../../models/internal/utils/document-model-utils.js";
import type { Inputs } from "../../../../../configuration/engine-configuration.js";
import { WidgetMapContext } from "../../../../../configuration/widget-map-context.js";

import { useEnumerationBaseProps } from "../use-input-props.js";

/** @internal */
export function DropDownInput(props: Inputs.InputProps<StringValueDataType>): ReactElement | null {
	const { localizer } = useContext(LocalizerContext);

	const { inputRef } = props;
	const options = props.renderConfiguration.renderOptions;
	const { enumerationOptions, selectedValue, htmlInputProps, ...inputProps } =
		useEnumerationBaseProps(props, localizer);

	const formModel = ModelSelectors.formModel()(options.state);
	const fce =
		formModel.content.fieldConfiguration.fieldMap[
			ModelPath.toString(props.modelElement.elementPath)
		];

	const isRequired = isFieldRequired(
		props.value.path,
		ModelSelectors.validationCode()(options.state)
	);

	const emptyOption = !isRequired || !fce?.initialValue;
	// In case a placeholder is defined: Only show empty option if a value is selected
	if (emptyOption && (inputProps.placeholder === undefined || selectedValue !== undefined)) {
		enumerationOptions.unshift({ value: "", label: "" });
	}

	const items: SelectItem[] = enumerationOptions.map((option, index) => {
		return {
			label: option.label,
			value: option.value,
			disabled: inputProps.disabled || option.disabled,
			key: String(index)
		};
	});

	const SelectComponent = useContext(WidgetMapContext).Select;

	return (
		<SelectComponent
			{...inputProps}
			items={items}
			value={selectedValue?.value}
			onValueChanged={(v: string) => {
				const item = enumerationOptions.find(i => i.value === v);
				const newValue = item ? item.value : null;
				options.eventHandlers.onValueChange(
					props.value.path,
					newValue || null,
					props.formModelPath
				);
			}}
			// Only show the placeholder if no value is selected
			placeholder={emptyOption && selectedValue === undefined ? inputProps.placeholder : undefined}
			inputProps={htmlInputProps}
			selectRef={element => {
				if (inputRef) {
					inputRef.current = element;
				}
			}}
		/>
	);
}
