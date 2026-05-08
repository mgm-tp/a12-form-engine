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

import type { ReactElement } from "react";
import { useContext } from "react";

import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";

import { WidgetMapContext } from "../../../../../configuration/widget-map-context.js";

import { useBasePropsForSwitch } from "../use-input-props.js";

import { getDisplayLabels } from "./display-label.js";
import type { BooleanOrConfirmInputProps } from "./types.js";

/** @internal */
export function SwitchInput(props: BooleanOrConfirmInputProps): ReactElement {
	const localizer = useContext(LocalizerContext).localizer;

	const options = props.renderConfiguration.renderOptions;
	const value = props.value;
	const { htmlInputProps, ...inputProps } = useBasePropsForSwitch(props);
	const showValues = props.modelElement.exposition === "SWITCH_WITH_VALUES";
	const { checkedOption, uncheckedOption } = showValues
		? getDisplayLabels(props.renderConfiguration.renderOptions, value, props.coalescing)
		: { checkedOption: undefined, uncheckedOption: undefined };
	const specificHorizontalAlignment = props.modelElement.specificHorizontalAlignment?.body;

	const SwitchComponent = useContext(WidgetMapContext).Switch;

	return (
		<SwitchComponent
			{...inputProps}
			onChange={() => {
				options.eventHandlers.onValueChange(
					value.path,
					props.coalescing ? !value.data || null : !value.data,
					props.formModelPath
				);
			}}
			checkedOption={checkedOption ? localizer(...checkedOption) : undefined}
			uncheckedOption={uncheckedOption ? localizer(...uncheckedOption) : undefined}
			inputProps={htmlInputProps}
			fitToParent={
				specificHorizontalAlignment === "center" || specificHorizontalAlignment === "right"
					? false
					: undefined
			}
		/>
	);
}
