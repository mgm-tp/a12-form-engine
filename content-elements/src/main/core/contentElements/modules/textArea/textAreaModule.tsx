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

import type { ContentModel } from "@com.mgmtp.a12.contentengine/contentengine-core";
import {
	useDocumentContext,
	type NodeRendererProps
} from "@com.mgmtp.a12.contentengine/contentengine-core";

import type { BaseControlProps } from "../../../types/controlProps.js";
import { ComponentMapContext } from "../../componentMap/componentMapContext.js";
import { createElementModule } from "../../createElementModule.js";
import { USE_COMMON_CONTROL_SETTINGS_WRAPPER } from "../../elementConfiguration/useCommonControlSettings.js";
import { USE_COMMON_WIDGET_SETTINGS_WRAPPER } from "../../elementConfiguration/useCommonWidgetSettings.js";
import { nmTokensToString } from "../../nmtokens.js";
import { useFocus } from "../../focus.js";

import type { TextAreaNode } from "./textAreaNode.js";
import { TEXT_AREA_TYPE } from "./textAreaNode.js";
import { textAreaValidator } from "./textAreaValidator.js";

/** @internal */
export const TextAreaModule = createElementModule<TextAreaNode>({
	type: TEXT_AREA_TYPE,
	renderer: TextAreaRenderer,
	validator: textAreaValidator
});

function TextAreaRenderer(
	props: NodeRendererProps<ContentModel.Node<BaseControlProps>>
): JSX.Element | null {
	const { BufferedTextArea } = useContext(ComponentMapContext);
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const { onValueChanged } = useDocumentContext(c => c.event);

	const { node } = props;

	const commonControlSettings = USE_COMMON_CONTROL_SETTINGS_WRAPPER.useCommonControlSettings(node);
	const { uiId, autoExpand, placeholder, dataReference, notRelevant, ungroupedValidationMessages } =
		commonControlSettings;

	useFocus({
		uiId,
		dataReference,
		ref: inputRef,
		messages: ungroupedValidationMessages
	});

	const {
		formattedValue,
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

	if (notRelevant) {
		return null;
	}

	const handleValueChange = (value: string | undefined) => {
		const trimmedValue = value?.trim();
		const valueToSet = trimmedValue || null;

		onValueChanged({ path: dataReference, value: valueToSet, userValue: trimmedValue });
	};

	return (
		<BufferedTextArea
			id={uiId}
			label={label}
			placeholder={placeholder}
			readonly={readonly}
			hideLabel={hideLabel}
			addonAfter={tooltipsOnTop ? undefined : tooltips}
			tooltips={tooltipsOnTop ? tooltips : undefined}
			helperText={helperText}
			value={formattedValue}
			error={error}
			errorMessage={errors}
			warning={warning}
			warningMessage={warnings}
			info={info}
			infoMessage={infos}
			autoExpand={autoExpand}
			onValueSubmit={handleValueChange}
			inputProps={inputProps}
			inputRef={(ref: HTMLTextAreaElement) => {
				inputRef.current = ref;
			}}
			ariaDescribedby={ariaDescribedBy.length ? nmTokensToString(ariaDescribedBy) : undefined}
		/>
	);
}
