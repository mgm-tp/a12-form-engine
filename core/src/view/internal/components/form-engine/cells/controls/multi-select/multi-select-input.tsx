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
import { provider as DeviceDetector } from "@com.mgmtp.a12.widgets/widgets-core";

import { RESOURCE_KEYS } from "../../../../../../../back-end/localization/index.js";
import { getLocalizedResource } from "../../../../../../../back-end/localization/internal/localize.js";
import type { Inputs } from "../../../../../configuration/engine-configuration.js";
import { WidgetMapContext } from "../../../../../configuration/widget-map-context.js";
import {
	getLocalizedMultiSelectValue,
	mapSelectedValues
} from "../../../../../utilities/multi-select-helper.js";

import { useBaseProps } from "../use-input-props.js";

/** @internal */
export function MultiSelectInput(props: Inputs.InputProps<DocumentModel.Group>): ReactElement {
	const { localizer } = useContext(LocalizerContext);
	const { Multiselect } = useContext(WidgetMapContext);

	const options = props.renderConfiguration.renderOptions;
	const { inputRef } = props;
	const { addonAfter, truncateSuffix, error, warning, htmlInputProps, ...remainingProps } =
		useBaseProps(props);

	const enumerationOptions = getLocalizedMultiSelectValue(
		props.renderConfiguration.renderOptions,
		props.value.path,
		localizer
	);
	const hintTemplate = getLocalizedResource(RESOURCE_KEYS.multiselect.hintTemplate, localizer);

	const selectedValues = mapSelectedValues(props.value.data);

	const msFieldName = props.documentElementDataType.elements[0].name;

	return (
		<Multiselect
			mobile={DeviceDetector.get() === "phone"}
			hintTemplate={hintTemplate ?? ""}
			selectAllText={getLocalizedResource(RESOURCE_KEYS.multiselect.selectAllText, localizer)}
			mobileHeadingTitle={getLocalizedResource(
				RESOURCE_KEYS.multiselect.mobileHeadingText,
				localizer
			)}
			tooltips={addonAfter}
			breakTooltipsToNewLine={props.modelElement.tooltipsOnTop}
			onChange={newItems => {
				const newInput = enumerationOptions.flatMap(enumerationOption =>
					newItems.some(item => enumerationOption.value === item.id)
						? [{ [msFieldName]: enumerationOption.value }]
						: []
				);

				options.eventHandlers.onMultiSelectValueChange(
					props.value.path,
					newInput,
					props.formModelPath
				);
			}}
			items={enumerationOptions.map(o => {
				return {
					id: o.value,
					value: o.value,
					label: o.label,
					selected: selectedValues.some(e => e === o.value)
				};
			})}
			{...remainingProps}
			inputRef={element => {
				if (inputRef) {
					inputRef.current = element;
				}
			}}
		/>
	);
}
