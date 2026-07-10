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

import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react";

import type { Inputs } from "../../../../../configuration/engine-configuration.js";
import { WidgetMapContext } from "../../../../../configuration/widget-map-context.js";

import { useEnumerationBaseProps } from "../use-input-props.js";

/** @internal */
export function RadioInput(props: Inputs.InputProps<DocumentModel.EnumerationType>): ReactElement {
	const { localizer } = useContext(LocalizerContext);
	const options = props.renderConfiguration.renderOptions;
	const { inputRef } = props;
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
							if (inputRef) {
								inputRef.current = element;
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
