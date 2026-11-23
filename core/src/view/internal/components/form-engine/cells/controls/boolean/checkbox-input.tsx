// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ReactElement } from "react";
import { useContext } from "react";

import { WidgetMapContext } from "../../../../../configuration/widget-map-context.js";

import { useBasePropsForCheckbox } from "../use-input-props.js";

import type { BooleanOrConfirmInputProps } from "./types.js";

/** @internal */
export function CheckboxInput(props: BooleanOrConfirmInputProps): ReactElement {
	const { inputRef } = props;
	const options = props.renderConfiguration.renderOptions;
	const value = props.value;
	const { htmlInputProps, ...inputProps } = useBasePropsForCheckbox(props);
	const specificHorizontalAlignment = props.modelElement.specificHorizontalAlignment?.body;

	const { Checkbox } = useContext(WidgetMapContext);

	return (
		<Checkbox
			{...inputProps}
			onChange={() => {
				options.eventHandlers.onValueChange(
					value.path,
					props.coalescing ? !value.data || null : !value.data,
					props.formModelPath
				);
			}}
			inputProps={htmlInputProps}
			fitToParent={
				specificHorizontalAlignment === "center" || specificHorizontalAlignment === "right"
					? false
					: undefined
			}
			inputRef={element => {
				if (inputRef) {
					inputRef.current = element;
				}
			}}
		/>
	);
}
