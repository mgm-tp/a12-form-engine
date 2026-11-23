// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { useContext } from "react";

import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import type { TextOutputProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/text-output/main/text-output.api.js";

import { UiId } from "../../../../../../../back-end/utils/internal/generateUiId.js";
import { ComponentMapContext } from "../../../../../configuration/componentMap/component-map-context.js";
import type { Inputs } from "../../../../../configuration/engine-configuration.js";

/**
 * @internal
 * Function to put together the props all inputs have in common.
 * It should only use the given InputProps and make no calculations
 * as this is done in input-control already.
 */
export function useTextOutputProps(
	inputProps: Inputs.InputProps<DocumentModel.FieldType | DocumentModel.Group>
): TextOutputProps {
	const { uiId } = inputProps;

	const { MessageList, Tooltips } = useContext(ComponentMapContext);

	const errorMessages = inputProps.validationMessages.errors;
	const warningMessages = inputProps.validationMessages.warnings;
	const infoMessages = inputProps.validationMessages.infos;

	const errorMessage =
		errorMessages.length > 0
			? {
					id: UiId.generateForErrorTooltip({ inputId: uiId }),
					content: <MessageList messages={errorMessages} id={uiId + "-error"} />
				}
			: undefined;
	const warningMessage =
		warningMessages.length > 0
			? {
					id: UiId.generateForWarningTooltip({ inputId: uiId }),
					content: <MessageList messages={warningMessages} id={uiId + "-warning"} />
				}
			: undefined;

	const infoMessage =
		infoMessages.length > 0
			? {
					id: UiId.generateForInfoTooltip({ inputId: uiId }),
					content: <MessageList messages={infoMessages} id={uiId + "-info"} />
				}
			: undefined;

	const hintTooltip = inputProps.modelElement.hintText
		? {
				id: UiId.generateForHintTooltip({ inputId: uiId }),
				content: inputProps.modelElement.hintText
			}
		: undefined;

	const showMessagesAsTooltip = inputProps.modelElement.messageExposition === "TOOLTIP";

	const validationMessagesTooltip =
		showMessagesAsTooltip && (errorMessage || warningMessage || infoMessage)
			? { errorTooltip: errorMessage, warningTooltip: warningMessage, infoTooltip: infoMessage }
			: undefined;

	const tooltips =
		hintTooltip || validationMessagesTooltip ? (
			<Tooltips
				disabled={inputProps.modelElement.disabled}
				{...validationMessagesTooltip}
				hintTooltip={hintTooltip}
			/>
		) : undefined;

	return {
		id: inputProps.uiId,
		label: inputProps.modelElement.label,
		addonAfter: tooltips,
		errorMessage: !showMessagesAsTooltip ? errorMessage?.content : undefined,
		warningMessage: !showMessagesAsTooltip ? warningMessage?.content : undefined,
		infoMessage: !showMessagesAsTooltip ? infoMessage?.content : undefined
	};
}
