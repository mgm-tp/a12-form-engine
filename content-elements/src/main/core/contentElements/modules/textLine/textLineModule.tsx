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

import { DocumentPath } from "@com.mgmtp.a12.client/client-data/lib/core/api/path/documentPath.js";
import {
	useDocumentContext,
	type ContentModel,
	type NodeRendererProps
} from "@com.mgmtp.a12.contentengine/contentengine-core";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";

import type { BaseControlProps } from "../../../types/controlProps.js";
import { ComponentMapContext } from "../../componentMap/componentMapContext.js";
import { createElementModule } from "../../createElementModule.js";
import { createParseError } from "../../createParseError.js";
import { USE_COMMON_CONTROL_SETTINGS_WRAPPER } from "../../elementConfiguration/useCommonControlSettings.js";
import { USE_COMMON_WIDGET_SETTINGS_WRAPPER } from "../../elementConfiguration/useCommonWidgetSettings.js";
import { nmTokensToString } from "../../nmtokens.js";
import { useFocus } from "../../focus.js";

import type { TextLineNode } from "./textLineNode.js";
import { TEXT_LINE_TYPE } from "./textLineNode.js";
import { textLineValidator } from "./textLineValidator.js";

/** @internal */
export const TextLineModule = createElementModule<TextLineNode>({
	type: TEXT_LINE_TYPE,
	renderer: TextLineRenderer,
	validator: textLineValidator
});

/**
 * @internal
 * exported, because it is re-used for date fragments
 */
export function TextLineRenderer(
	props: NodeRendererProps<ContentModel.Node<BaseControlProps>>
): JSX.Element | null {
	const { BufferedTextLine } = useContext(ComponentMapContext);
	const { onValueChanged, onParsingFailed } = useDocumentContext(c => c.event);

	const { conversion } = useContext(LocalizerContext);
	const inputRef = useRef<HTMLInputElement>(null);

	const { node } = props;

	const commonControlSettings = USE_COMMON_CONTROL_SETTINGS_WRAPPER.useCommonControlSettings(node);
	const {
		uiId,
		placeholder,
		conversionConfig,
		dataReference,
		notRelevant,
		ungroupedValidationMessages
	} = commonControlSettings;

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
		suffixes,
		inputProps,
		ariaDescribedBy
	} = USE_COMMON_WIDGET_SETTINGS_WRAPPER.useCommonWidgetSettings(commonControlSettings);

	if (notRelevant) {
		return null;
	}

	const documentPath = DocumentPath.fromString(dataReference);

	const handleValueChange = (value: string | undefined) => {
		const trimmedValue = value?.trim();

		const conversionResult =
			trimmedValue && conversionConfig
				? conversion.parseValue(trimmedValue, conversionConfig)
				: undefined;

		if (conversionResult?.parseError) {
			onParsingFailed({
				dataReference,
				// value must be defined when a conversion error exists
				parseError: createParseError(conversionResult.parseError, documentPath, value!)
			});
		} else {
			const valueToSet = conversionResult ? conversionResult.value : trimmedValue || null;
			onValueChanged({ path: dataReference, value: valueToSet, userValue: trimmedValue });
		}
	};

	return (
		<BufferedTextLine
			id={uiId}
			label={label}
			readonly={readonly}
			hideLabel={hideLabel}
			addonAfter={tooltipsOnTop ? undefined : tooltips}
			tooltips={tooltipsOnTop ? tooltips : undefined}
			helperText={helperText}
			placeholder={placeholder}
			suffixes={suffixes}
			value={formattedValue}
			error={error}
			errorMessage={errors}
			warning={warning}
			warningMessage={warnings}
			info={info}
			infoMessage={infos}
			inputProps={inputProps}
			ariaDescribedby={ariaDescribedBy.length ? nmTokensToString(ariaDescribedBy) : undefined}
			onValueSubmit={handleValueChange}
			inputRef={(ref: HTMLInputElement) => {
				inputRef.current = ref;
			}}
		/>
	);
}
