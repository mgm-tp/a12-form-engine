// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ReactElement } from "react";
import { useContext } from "react";

import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";
import { provider as DeviceDetector } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/device-detector.js";

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
	const { MultiSelect } = useContext(WidgetMapContext);

	const { inputRef } = props;
	const options = props.renderConfiguration.renderOptions;

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
		<MultiSelect
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
