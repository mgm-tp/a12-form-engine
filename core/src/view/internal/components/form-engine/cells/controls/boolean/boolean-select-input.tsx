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

import { useContext } from "react";

import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";
import type { SelectItem } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/select/main/select.api.js";

import type { Inputs } from "../../../../../configuration/engine-configuration.js";
import { WidgetMapContext } from "../../../../../configuration/widget-map-context.js";

import { useBasePropsForBooleanSelect } from "../use-input-props.js";

/** @internal */
export function BooleanSelectInput(
	props: Inputs.InputProps<DocumentModel.BooleanType>
): React.ReactElement {
	const localizer = useContext(LocalizerContext).localizer;
	const options = props.renderConfiguration.renderOptions;
	const { booleanOptions, selectedValue, htmlInputProps, ...inputProps } =
		useBasePropsForBooleanSelect(props);

	const items: SelectItem[] = booleanOptions.map((option, index) => {
		const item = {
			label: option.label ? (localizer(option.label) ?? "") : "",
			value: option.value,
			key: String(index)
		};
		return item;
	});

	const SelectComponent = useContext(WidgetMapContext).Select;

	const stringToNullishableBoolean = (s: string): null | boolean => {
		if (s === "") {
			return null;
		} else {
			return s === "true";
		}
	};

	return (
		<SelectComponent
			{...inputProps}
			items={items}
			value={selectedValue ? selectedValue.value : undefined}
			onValueChanged={(v: string) => {
				const item = booleanOptions.find(i => i.value === v);
				const newValue = item ? stringToNullishableBoolean(item.value) : null;
				options.eventHandlers.onValueChange(props.value.path, newValue, props.formModelPath);
			}}
			inputProps={htmlInputProps}
			selectRef={element => {
				if (props.inputRef) {
					props.inputRef.current = element;
				}
			}}
		/>
	);
}
