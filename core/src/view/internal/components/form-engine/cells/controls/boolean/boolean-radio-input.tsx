// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { useContext } from "react";
import type { ReactElement } from "react";

import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";

import type { Inputs } from "../../../../../configuration/engine-configuration.js";
import { WidgetMapContext } from "../../../../../configuration/widget-map-context.js";

import { useBasePropsForBooleanRadio } from "../use-input-props.js";

import { getDisplayLabels } from "./display-label.js";

/** @internal */
export function BooleanRadioInput(
	props: Inputs.InputProps<DocumentModel.BooleanType>
): ReactElement {
	const localizer = useContext(LocalizerContext).localizer;
	const options = props.renderConfiguration.renderOptions;
	const { checked, htmlInputProps, ...inputProps } = useBasePropsForBooleanRadio(props);
	const { Radio, RadioItem } = useContext(WidgetMapContext);
	const { checkedOption, uncheckedOption } = getDisplayLabels(
		props.renderConfiguration.renderOptions,
		props.value
	);

	const items = [true, false].map((option, index) => {
		return (
			<RadioItem
				key={index}
				readonly={inputProps.readonly}
				disabled={inputProps.disabled}
				label={option ? localizer(...checkedOption) : localizer(...uncheckedOption)}
				onChange={() => {
					options.eventHandlers.onValueChange(props.value.path, option, props.formModelPath);
				}}
				value={String(option)}
				inputRef={
					index === 0
						? element => {
								if (props.inputRef) {
									props.inputRef.current = element;
								}
							}
						: undefined
				}
			/>
		);
	});

	return (
		<Radio
			{...inputProps}
			inline={props.modelElement.exposition === "INLINE"}
			value={String(checked)}
			groupDOMProps={htmlInputProps}
		>
			{items}
		</Radio>
	);
}
