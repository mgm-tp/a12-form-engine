// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX } from "react";
import { useContext } from "react";

import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";

import { RESOURCE_KEYS } from "../../../../../back-end/localization/index.js";
import { getLocalizedResource } from "../../../../../back-end/localization/internal/localize.js";
import { ModelSelectors, UiStateSelectors } from "../../../../../back-end/store/index.js";
import { relevantMessagesSelector } from "../../../../../back-end/store/internal/validation.js";
import type { FormModelMap } from "../../../configuration/engine-configuration.js";
import { WidgetMapContext } from "../../../configuration/widget-map-context.js";
import { getInfos, getWarnings } from "../../../utilities/control-utilities.js";

/** @internal */
export function WarningInfoConfirmation(props: {
	renderOptions: FormModelMap.RenderOptions;
}): JSX.Element | null {
	const { Button, ButtonGroup, Counter, ModalNotification } = useContext(WidgetMapContext);
	const localizer = useContext(LocalizerContext).localizer;

	const { renderOptions } = props;

	const confirmationRequested = UiStateSelectors.actionConfirmationRequested()(renderOptions.state);
	if (!confirmationRequested) {
		return null;
	}

	const relevantMessages = relevantMessagesSelector(confirmationRequested.validation)(
		renderOptions.state
	);

	const hideConfirmationSummary = ModelSelectors.formModel()(renderOptions.state).content
		.hideConfirmationSummary;

	const warnings = getWarnings(relevantMessages).length;
	const infos = getInfos(relevantMessages).length;

	return (
		<ModalNotification
			title={getLocalizedResource(RESOURCE_KEYS.validation.confirmation.title, localizer)}
			closeOnEsc
			closeOnOutsideClick
			focusBack={false}
			footer={
				<ButtonGroup alignment="right">
					<Button
						primary
						id={"user-validation-cancel"}
						label={getLocalizedResource(RESOURCE_KEYS.validation.confirmation.cancel, localizer)}
						onClick={(event: React.MouseEvent<HTMLElement>) => {
							event.stopPropagation();
							renderOptions.eventHandlers.onUserConfirmationResponse(false);
						}}
					/>
					<Button
						secondary
						id={"user-validation-confirm"}
						label={getLocalizedResource(RESOURCE_KEYS.validation.confirmation.confirm, localizer)}
						onClick={(event: React.MouseEvent<HTMLElement>) => {
							event.stopPropagation();
							renderOptions.eventHandlers.onUserConfirmationResponse(true);
						}}
					/>
				</ButtonGroup>
			}
			variant={warnings > 0 ? "warning" : "info"}
			key="dialog"
			onClose={() => {
				renderOptions.eventHandlers.onUserConfirmationResponse(false);
			}}
		>
			{!hideConfirmationSummary && (
				<>
					<p>
						<Counter value={infos} hiddenDescription="Infos counter" />
						{getLocalizedResource(RESOURCE_KEYS.validation.confirmation.infos, localizer)}
					</p>
					<p>
						<Counter value={warnings} hiddenDescription="Warnings counter" />
						{getLocalizedResource(RESOURCE_KEYS.validation.confirmation.warnings, localizer)}
					</p>
				</>
			)}
			<p>{getLocalizedResource(RESOURCE_KEYS.validation.confirmation.description, localizer)}</p>
		</ModalNotification>
	);
}
