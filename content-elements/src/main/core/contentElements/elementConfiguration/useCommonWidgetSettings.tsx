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

import { useContext } from "react";

import { MessageTransformers } from "@com.mgmtp.a12.client/client-data";
import type { Message } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import type { Localizable } from "@com.mgmtp.a12.utils/utils-localization";

import type { BaseControlSettings } from "../../types/controlSettings.js";
import type { BaseWidgetSettings } from "../../types/widgetSettings.js";

import { ComponentMapContext } from "../componentMap/componentMapContext.js";
import { UiId } from "../generateUiId.js";
import { messageHtmlId } from "../messageHtmlId.js";

/** @internal */
export const USE_COMMON_WIDGET_SETTINGS_WRAPPER = {
	useCommonWidgetSettings
};

/**
 * TODO: Should this be internal? It shouldn't be necessary for customization,
 * because the Widget props can be modified via the WidgetMap.
 *
 * FIXME: This method returns some of its inputs unchanged.
 * Should it stay like that?
 *
 * Note: This is subject to change.
 */
export function useCommonWidgetSettings(
	commonControlSettings: BaseControlSettings
): BaseWidgetSettings {
	const { Tooltips, Suffix, ValidationMessages } = useContext(ComponentMapContext);

	const {
		uiIdPrefix,
		uiId,
		value,
		formattedValue,
		messageGroupId,
		groupedValidationMessages: rawGroupedValidationMessages,
		ungroupedValidationMessages: rawUngroupedValidationMessages,
		required,
		readonly,
		label,
		hideLabel,
		hint,
		helperText,
		showMessagesAsTooltip,
		tooltipsOnTop,
		suffix,
		truncateSuffix,
		autoComplete,
		uncheckedLabel,
		checkedLabel,
		secret,
		inline
	} = commonControlSettings;

	const groupedValidationMessages = rawGroupedValidationMessages.map(MessageTransformers.transform);
	const ungroupedValidationMessages = rawUngroupedValidationMessages.map(
		MessageTransformers.transform
	);

	// messages
	const error =
		groupedValidationMessages.some(m => m.severity === "ERROR") ||
		ungroupedValidationMessages.some(m => m.severity === "ERROR");

	const warning =
		groupedValidationMessages.some(m => m.severity === "WARNING") ||
		ungroupedValidationMessages.some(m => m.severity === "WARNING");

	const info =
		groupedValidationMessages.some(m => m.severity === "INFO") ||
		ungroupedValidationMessages.some(m => m.severity === "INFO");

	const messageLocalizables = getRelevantMessageLocalizables(ungroupedValidationMessages);

	const errors =
		messageLocalizables.error?.length > 0
			? {
					id: UiId.generateForErrorTooltip({ inputId: uiId }),
					content: <ValidationMessages messages={messageLocalizables.error} id={uiId + "-error"} />
				}
			: undefined;
	const warnings =
		messageLocalizables.warning?.length > 0
			? {
					id: UiId.generateForWarningTooltip({ inputId: uiId }),
					content: (
						<ValidationMessages messages={messageLocalizables.warning} id={uiId + "-warning"} />
					)
				}
			: undefined;
	const infos =
		messageLocalizables.info?.length > 0
			? {
					id: UiId.generateForInfoTooltip({ inputId: uiId }),
					content: <ValidationMessages messages={messageLocalizables.info} id={uiId + "-info"} />
				}
			: undefined;

	// tooltips
	const hintTooltip = hint
		? {
				id: UiId.generateForHintTooltip({ inputId: uiId }),
				content: hint
			}
		: undefined;
	const validationMessagesTooltip =
		showMessagesAsTooltip && (errors || warnings || infos)
			? {
					errorTooltip: errors,
					warningTooltip: warnings,
					infoTooltip: infos
				}
			: undefined;

	const tooltips =
		hintTooltip || (showMessagesAsTooltip && validationMessagesTooltip) ? (
			<Tooltips {...validationMessagesTooltip} hintTooltip={hintTooltip} />
		) : undefined;

	// suffix
	const suffixId = UiId.generateForSuffix({ inputId: uiId });

	const suffixes = suffix ? (
		<Suffix id={suffixId} suffix={suffix} truncateSuffix={truncateSuffix} />
	) : undefined;

	// ariaDescribedBy
	const ariaDescribedBy = messageGroupId
		? groupedValidationMessages.map(msg => messageHtmlId(messageGroupId, msg, uiIdPrefix))
		: [];

	if (hintTooltip) {
		ariaDescribedBy.push(hintTooltip.id);
	}

	if (showMessagesAsTooltip) {
		if (errors) {
			ariaDescribedBy.push(errors.id);
		}
		if (warnings) {
			ariaDescribedBy.push(warnings.id);
		}
		if (infos) {
			ariaDescribedBy.push(infos.id);
		}
	}

	if (suffixes) {
		ariaDescribedBy.push(suffixId);
	}

	const inputProps =
		required || !!autoComplete || secret
			? {
					"aria-required": required,
					autoComplete,
					type: secret ? "password" : undefined
				}
			: undefined;

	return {
		value,
		formattedValue,
		error,
		warning,
		info,
		errors: showMessagesAsTooltip ? undefined : errors?.content,
		warnings: showMessagesAsTooltip ? undefined : warnings?.content,
		infos: showMessagesAsTooltip ? undefined : infos?.content,
		readonly,
		label,
		hideLabel,
		helperText,
		tooltips,
		tooltipsOnTop,
		suffixes,
		uncheckedLabel,
		checkedLabel,
		inline,
		inputProps,
		ariaDescribedBy
	};
}

/**
 * Returns the localizables for all validation messages.
 */
function getRelevantMessageLocalizables(messages: Message[]): {
	error: Localizable[][];
	warning: Localizable[][];
	info: Localizable[][];
} {
	return {
		error: messages.filter(msg => msg.severity === "ERROR").map(msg => msg.errorText) ?? [],
		warning: messages.filter(msg => msg.severity === "WARNING").map(msg => msg.errorText) ?? [],
		info: messages.filter(msg => msg.severity === "INFO").map(msg => msg.errorText) ?? []
	};
}
