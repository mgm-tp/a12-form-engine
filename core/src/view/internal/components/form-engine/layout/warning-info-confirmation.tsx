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
