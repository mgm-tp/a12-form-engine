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

import type { HTMLProps, JSX } from "react";
import { useContext, useRef } from "react";

import {
	useDocumentContext,
	useTableScreenReaderContext,
	type ContentModel,
	type NodeRendererProps
} from "@com.mgmtp.a12.contentengine/contentengine-core";

import type { BaseControlProps } from "../../../types/controlProps.js";
import { WidgetMapContext } from "../../../widgetMap/widgetMap-context.js";
import { createElementModule } from "../../createElementModule.js";
import { USE_COMMON_CONTROL_SETTINGS_WRAPPER } from "../../elementConfiguration/useCommonControlSettings.js";
import { USE_COMMON_WIDGET_SETTINGS_WRAPPER } from "../../elementConfiguration/useCommonWidgetSettings.js";
import { nmTokensToString } from "../../nmtokens.js";
import { useFocus } from "../../focus.js";

import type { CheckboxNode } from "./checkboxNode.js";
import { CHECKBOX_TYPE } from "./checkboxNode.js";
import { checkboxValidator } from "./checkboxValidator.js";

/** @internal */
export const CheckboxModule = createElementModule<CheckboxNode>({
	type: CHECKBOX_TYPE,
	renderer: CheckboxRenderer,
	validator: checkboxValidator
});

function CheckboxRenderer(
	props: NodeRendererProps<ContentModel.Node<BaseControlProps>>
): JSX.Element | null {
	const { Checkbox } = useContext(WidgetMapContext);
	const inputRef = useRef<HTMLInputElement>(null);
	const { onValueChanged } = useDocumentContext(c => c.event);

	const { node } = props;

	const commonControlSettings = USE_COMMON_CONTROL_SETTINGS_WRAPPER.useCommonControlSettings(node);
	const { uiId, dataReference, notRelevant, conversionConfig, ungroupedValidationMessages } =
		commonControlSettings;

	useFocus({
		uiId,
		dataReference,
		ref: inputRef,
		messages: ungroupedValidationMessages
	});

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
		inputProps,
		ariaDescribedBy
	} = USE_COMMON_WIDGET_SETTINGS_WRAPPER.useCommonWidgetSettings(commonControlSettings);

	const cellId = useTableScreenReaderContext(c => c.screenReaderCellId);

	const finalInputProps = cellId
		? ({
				...inputProps,
				"aria-labelledby": `${uiId} ${cellId}`
			} satisfies HTMLProps<HTMLInputElement>)
		: inputProps;

	const handleValueChange = (newValue: boolean) => {
		if (conversionConfig?.type === "ConfirmType" && newValue === false) {
			onValueChanged({ path: dataReference, value: null });
		} else {
			onValueChanged({ path: dataReference, value: newValue });
		}
	};

	if (notRelevant) {
		return null;
	}

	return (
		<Checkbox
			id={uiId}
			checked={value === true}
			label={label}
			readonly={readonly}
			hideLabel={hideLabel}
			tooltips={tooltips}
			breakTooltipsToNewLine={tooltipsOnTop}
			helperText={helperText}
			error={error}
			errorMessage={errors}
			warning={warning}
			warningMessage={warnings}
			info={info}
			infoMessage={infos}
			inputProps={finalInputProps}
			inputRef={(ref: HTMLInputElement) => {
				inputRef.current = ref;
			}}
			ariaDescribedby={ariaDescribedBy.length ? nmTokensToString(ariaDescribedBy) : undefined}
			onChange={handleValueChange}
		/>
	);
}
