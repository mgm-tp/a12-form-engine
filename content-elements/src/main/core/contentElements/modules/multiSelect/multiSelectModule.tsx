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
import { provider as DeviceDetector } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/device-detector.js";
import type { MultiselectProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/multiselect/main/multiselect.api.js";

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

import type { MultiSelectNode } from "./multiSelectNode.js";
import { MULTI_SELECT_TYPE } from "./multiSelectNode.js";
import { multiSelectValidator } from "./multiSelectValidator.js";

/** @internal */
export const MultiSelectModule = createElementModule<MultiSelectNode>({
	type: MULTI_SELECT_TYPE,
	renderer: MultiSelectRenderer,
	validator: multiSelectValidator
});

function MultiSelectRenderer(
	props: NodeRendererProps<ContentModel.Node<BaseControlProps>>
): JSX.Element | null {
	const { MultiSelect } = useContext(WidgetMapContext);
	const { localizer } = useContext(LocalizerContext);
	const inputRef = useRef<HTMLInputElement>(null);
	const { onValueChanged } = useDocumentContext(c => c.event);

	const { node } = props;

	const commonControlSettings = USE_COMMON_CONTROL_SETTINGS_WRAPPER.useCommonControlSettings(node);
	const { uiId, placeholder, dataReference, dmElement, notRelevant, ungroupedValidationMessages } =
		commonControlSettings;

	const {
		value,
		label,
		hideLabel,
		helperText,
		readonly,
		errors,
		warnings,
		infos,
		tooltips,
		tooltipsOnTop,
		inputProps,
		ariaDescribedBy
	} = USE_COMMON_WIDGET_SETTINGS_WRAPPER.useCommonWidgetSettings(commonControlSettings);

	const msFieldName = getMultiSelectValueField(dmElement)?.name;
	const msFieldDataReference = DataReference.resolveWithIndex(dataReference, msFieldName ?? "", 1);

	useFocus({
		uiId,
		dataReference: msFieldDataReference,
		ref: inputRef,
		messages: ungroupedValidationMessages
	});

	const enumerationOptions =
		USE_LOCALIZED_ENUMERATION_VALUES_WRAPPER.useLocalizedEnumerationValues(msFieldDataReference);

	if (notRelevant) {
		return null;
	}

	const selectedValues = isMultiSelectData(value) ? value.map(d => Object.values(d)[0]) : [];

	const items = enumerationOptions.map(o => ({
		id: o.value,
		value: o.value,
		label: o.label,
		selected: selectedValues.some(e => e === o.value)
	}));

	const hintTemplate = localizer(createResourceLocalizable(RESOURCE_KEYS.multiSelect.hintTemplate));
	const selectAllText = localizer(
		createResourceLocalizable(RESOURCE_KEYS.multiSelect.selectAllText)
	);
	const mobileHeadingTitle = localizer(
		createResourceLocalizable(RESOURCE_KEYS.multiSelect.mobileHeadingText)
	);

	/**
	 * TODO: should a clear lead to [] or null?
	 * The FE sets an empty array in this case, but removing the array might
	 * make more sense?
	 */
	const handleValueChange = (newItems: MultiselectProps.Item[]) => {
		if (msFieldName) {
			const newInput = enumerationOptions.flatMap(enumerationOption =>
				newItems.some(item => enumerationOption.value === item.id)
					? [{ [msFieldName]: enumerationOption.value }]
					: []
			);

			onValueChanged({ path: dataReference, value: newInput });
		}
	};

	// TODO: MultiSelect does not support error, warning, info props
	//  => create bug ticket?
	return (
		<MultiSelect
			mobile={DeviceDetector.get() === "phone"}
			id={uiId}
			items={items}
			label={label}
			placeholder={placeholder}
			hideLabel={hideLabel}
			readonly={readonly}
			helperText={helperText}
			tooltips={tooltips}
			breakTooltipsToNewLine={tooltipsOnTop}
			hintTemplate={hintTemplate ?? ""}
			selectAllText={selectAllText}
			mobileHeadingTitle={mobileHeadingTitle}
			errorMessage={errors}
			warningMessage={warnings}
			infoMessage={infos}
			inputProps={inputProps}
			inputRef={(ref: HTMLInputElement) => {
				inputRef.current = ref;
			}}
			ariaDescribedby={ariaDescribedBy ? nmTokensToString(ariaDescribedBy) : undefined}
			onChange={handleValueChange}
		/>
	);
}
