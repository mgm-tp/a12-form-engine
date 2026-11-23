// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ReactElement } from "react";
import { useContext } from "react";

import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";

import { RESOURCE_KEYS } from "../../../../../../../back-end/localization/index.js";
import { getLocalizedResource } from "../../../../../../../back-end/localization/internal/localize.js";
import type { Inputs } from "../../../../../configuration/engine-configuration.js";
import { WidgetMapContext } from "../../../../../configuration/widget-map-context.js";
import { EnumerableHelper } from "../../../../../utilities/enumerable/enumerableHelper.js";
import { mapSelectedValues } from "../../../../../utilities/multi-select-helper.js";

import { useBaseProps } from "../use-input-props.js";

/** @internal */
export function CheckboxGroupInput(props: Inputs.InputProps<DocumentModel.Group>): ReactElement {
	const { localizer } = useContext(LocalizerContext);

	const { inputRef } = props;
	const options = props.renderConfiguration.renderOptions;
	const { CheckboxGroup, CheckboxGroupItem, CheckboxIndeterminate } = useContext(WidgetMapContext);

	const { addonAfter, truncateSuffix, error, warning, placeholder, ...inputProps } =
		useBaseProps(props);

	const msFieldName = props.documentElementDataType.elements[0].name;

	const enumerationOptions = EnumerableHelper.getLocalizedEnumerationValues(
		props.renderConfiguration.renderOptions,
		[...props.value.path, { elementName: msFieldName }],
		localizer
	);

	const selectedValues = mapSelectedValues(props.value.data);

	const checkboxGroupChildren = [];
	const useCheckboxIndeterminate =
		props.modelElement.enableSelectAll &&
		(props.modelElement.exposition === "INLINE" || props.modelElement.exposition === "FULL");

	if (useCheckboxIndeterminate) {
		const checkAll =
			selectedValues.length === enumerationOptions.length
				? true
				: selectedValues.length > 0
					? "mixed"
					: false;

		checkboxGroupChildren.push(
			<CheckboxIndeterminate
				key="select-all"
				checked={checkAll}
				label={<b>{getLocalizedResource(RESOURCE_KEYS.multiselect.selectAllText, localizer)}</b>}
				onChange={checked => {
					const newValue = checked ? enumerationOptions.map(e => ({ [msFieldName]: e.value })) : [];
					options.eventHandlers.onMultiSelectValueChange(
						props.value.path,
						newValue,
						props.formModelPath
					);
				}}
				buttonRef={element => {
					if (inputRef) {
						inputRef.current = element;
					}
				}}
			/>
		);
	}

	checkboxGroupChildren.push(
		...enumerationOptions.map((o, index) => {
			return (
				<CheckboxGroupItem
					key={index}
					label={o.label}
					value={o.value}
					selected={selectedValues.some(e => e === o.value)}
					inputRef={
						!useCheckboxIndeterminate && index === 0
							? element => {
									if (inputRef) {
										inputRef.current = element;
									}
								}
							: undefined
					}
				/>
			);
		})
	);

	return (
		<CheckboxGroup
			onValueChanged={v => {
				const index = selectedValues.indexOf(v);
				const newSelectedValues =
					index < 0
						? [...selectedValues, v]
						: [...selectedValues.slice(0, index), ...selectedValues.slice(index + 1)];

				const newValue = enumerationOptions
					.filter(e => newSelectedValues.includes(e.value))
					.map(e => ({ [msFieldName]: e.value }));

				options.eventHandlers.onMultiSelectValueChange(
					props.value.path,
					newValue,
					props.formModelPath
				);
			}}
			inline={props.modelElement.exposition === "INLINE"}
			tooltips={addonAfter}
			breakTooltipsToNewLine={props.modelElement.tooltipsOnTop}
			{...inputProps}
		>
			{checkboxGroupChildren}
		</CheckboxGroup>
	);
}
