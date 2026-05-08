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

import type { JSX } from "react";
import { useContext, useRef } from "react";

import { DataReference } from "@com.mgmtp.a12.client/client-data/lib/core/api/data-reference.js";
import {
	getMultiSelectValueField,
	isMultiSelectData
} from "@com.mgmtp.a12.client/client-data/lib/kernel-extension/multiSelect.js";
import {
	useDocumentContext,
	type ContentModel,
	type NodeRendererProps
} from "@com.mgmtp.a12.contentengine/contentengine-core";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";

import { createResourceLocalizable } from "../../../localization/createResourceLocalizable.js";
import { RESOURCE_KEYS } from "../../../localization/resources.js";
import type { BaseControlProps } from "../../../types/controlProps.js";
import { WidgetMapContext } from "../../../widgetMap/widgetMap-context.js";
import { createElementModule } from "../../createElementModule.js";
import { USE_COMMON_CONTROL_SETTINGS_WRAPPER } from "../../elementConfiguration/useCommonControlSettings.js";
import { USE_COMMON_WIDGET_SETTINGS_WRAPPER } from "../../elementConfiguration/useCommonWidgetSettings.js";
import { USE_LOCALIZED_ENUMERATION_VALUES_WRAPPER } from "../../elementConfiguration/useLocalizedEnumerationValues.js";
import { useFocus } from "../../focus.js";
import { nmTokensToString } from "../../nmtokens.js";

import type { CheckboxGroupNode } from "./checkboxGroupNode.js";
import { CHECKBOX_GROUP_TYPE } from "./checkboxGroupNode.js";
import { checkboxGroupValidator } from "./checkboxGroupValidator.js";

/** @internal */
export const CheckboxGroupModule = createElementModule<CheckboxGroupNode>({
	type: CHECKBOX_GROUP_TYPE,
	renderer: CheckboxGroupRenderer,
	validator: checkboxGroupValidator
});

function CheckboxGroupRenderer(
	props: NodeRendererProps<ContentModel.Node<BaseControlProps>>
): JSX.Element | null {
	const { CheckboxGroup, CheckboxGroupItem, CheckboxIndeterminate } = useContext(WidgetMapContext);
	const { localizer } = useContext(LocalizerContext);
	const inputRef = useRef<HTMLInputElement>(null);
	const { onValueChanged } = useDocumentContext(c => c.event);

	const { node } = props;

	const commonControlSettings = USE_COMMON_CONTROL_SETTINGS_WRAPPER.useCommonControlSettings(node);
	const {
		uiId,
		enableSelectAll,
		dataReference,
		dmElement,
		notRelevant,
		ungroupedValidationMessages
	} = commonControlSettings;

	const {
		value,
		label,
		hideLabel,
		helperText,
		readonly,
		error,
		warning,
		info,
		errors,
		warnings,
		infos,
		tooltips,
		tooltipsOnTop,
		inline,
		ariaDescribedBy
	} = USE_COMMON_WIDGET_SETTINGS_WRAPPER.useCommonWidgetSettings(commonControlSettings);

	const msFieldName = getMultiSelectValueField(dmElement)?.name;
	// TODO: move this handling into useLocalizedEnumerationValues ???
	const msFieldDataReference = DataReference.resolveWithIndex(dataReference, msFieldName ?? "", 1);

	useFocus({
		uiId,
		dataReference,
		ref: inputRef,
		messages: ungroupedValidationMessages
	});

	const enumerationOptions =
		USE_LOCALIZED_ENUMERATION_VALUES_WRAPPER.useLocalizedEnumerationValues(msFieldDataReference);

	if (notRelevant) {
		return null;
	}

	const selectedValues = isMultiSelectData(value) ? value.map(d => Object.values(d)[0]) : [];

	const checkboxGroupChildren = [];

	if (enableSelectAll && msFieldName) {
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
				label={
					<b>{localizer(createResourceLocalizable(RESOURCE_KEYS.multiSelect.selectAllText))}</b>
				}
				onChange={checked => {
					const newValue = checked ? enumerationOptions.map(e => ({ [msFieldName]: e.value })) : [];
					onValueChanged({ path: dataReference, value: newValue });
				}}
			/>
		);
	}

	checkboxGroupChildren.push(
		...enumerationOptions.map((o, index) => (
			<CheckboxGroupItem
				key={index}
				label={o.label}
				value={o.value}
				inputRef={
					index === 0
						? (ref: HTMLInputElement) => {
								inputRef.current = ref;
							}
						: undefined
				}
				selected={selectedValues.some(e => e === o.value)}
			/>
		))
	);

	const handleValueChange = (v: string) => {
		if (msFieldName) {
			const index = selectedValues.indexOf(v);
			const newSelectedValues =
				index < 0
					? [...selectedValues, v]
					: [...selectedValues.slice(0, index), ...selectedValues.slice(index + 1)];

			const newValue = enumerationOptions
				.filter(e => newSelectedValues.indexOf(e.value) >= 0)
				.map(e => ({ [msFieldName]: e.value }));

			onValueChanged({ path: dataReference, value: newValue });
		}
	};

	return (
		<CheckboxGroup
			inline={inline}
			id={uiId}
			label={label}
			hideLabel={hideLabel}
			readonly={readonly}
			helperText={helperText}
			tooltips={tooltips}
			breakTooltipsToNewLine={tooltipsOnTop}
			error={error}
			errorMessage={errors}
			warning={warning}
			warningMessage={warnings}
			info={info}
			infoMessage={infos}
			ariaDescribedby={ariaDescribedBy ? nmTokensToString(ariaDescribedBy) : undefined}
			onValueChanged={handleValueChange}
		>
			{checkboxGroupChildren}
		</CheckboxGroup>
	);
}
