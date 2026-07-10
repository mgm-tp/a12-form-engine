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
