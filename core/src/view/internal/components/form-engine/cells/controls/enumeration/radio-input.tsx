// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ReactElement } from "react";
import { useContext } from "react";

import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";

import type { Inputs } from "../../../../../configuration/engine-configuration.js";
import { WidgetMapContext } from "../../../../../configuration/widget-map-context.js";

import { useEnumerationBaseProps } from "../use-input-props.js";

/** @internal */
export function RadioInput(props: Inputs.InputProps<DocumentModel.EnumerationType>): ReactElement {
	const { localizer } = useContext(LocalizerContext);
	const options = props.renderConfiguration.renderOptions;
	const { enumerationOptions, selectedValue, placeholder, htmlInputProps, ...inputProps } =
		useEnumerationBaseProps(props, localizer);
	const { Radio, RadioItem } = useContext(WidgetMapContext);

	const items = enumerationOptions.map((option, index) => (
		<RadioItem
			readonly={inputProps.readonly}
			disabled={inputProps.disabled || option.disabled}
			label={option.label}
			value={option.value}
			onChange={() => {
				options.eventHandlers.onValueChange(props.value.path, option.value, props.formModelPath);
			}}
			key={String(index)}
			inputRef={
				index === 0
					? element => {
							if (props.inputRef) {
								props.inputRef.current = element;
							}
						}
					: undefined
			}
			data-testid={`${props.uiId}.${option.value}`}
		/>
	));

	return (
		<Radio
			{...inputProps}
			inline={props.modelElement.exposition === "INLINE"}
			value={selectedValue?.value}
			onValueChanged={(newValue: string) => {
				const index = enumerationOptions.findIndex(item => item.label === newValue);
				if (index >= 0) {
					options.eventHandlers.onValueChange(
						props.value.path,
						enumerationOptions[index].value,
						props.formModelPath
					);
				}
				options.eventHandlers.onValueChange(props.value.path, newValue, props.formModelPath);
			}}
			groupDOMProps={htmlInputProps}
		>
			{items}
		</Radio>
	);
}
