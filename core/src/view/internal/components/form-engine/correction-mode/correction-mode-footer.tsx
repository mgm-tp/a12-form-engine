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

import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react";

import { RESOURCE_KEYS } from "../../../../../back-end/localization/internal/languages/keys.js";
import { getLocalizedResource } from "../../../../../back-end/localization/internal/localize.js";
import { UiStateSelectors } from "../../../../../back-end/store/internal/selectors/ui-state.js";
import type { FormModelMap } from "../../../configuration/engine-configuration.js";
import { WidgetMapContext } from "../../../configuration/widget-map-context.js";

/** @internal  */
export function CorrectionModeFooter(config: FormModelMap.RenderConfiguration): ReactElement {
	const localizer = useContext(LocalizerContext).localizer;
	const { Button, ButtonGroup, ContentBoxFooter } = useContext(WidgetMapContext);

	const exitCorrectionModeButton = (
		<Button
			label={getLocalizedResource(RESOURCE_KEYS.validation.correctionMode.exit, localizer)}
			disabled={UiStateSelectors.disabled()(config.renderOptions.state)}
			onClick={() => {
				config.renderOptions.eventHandlers.correctionMode.onExitCorrectionMode();
			}}
			key="exitCorrectionModeButton"
		/>
	);

	const validateButton = (
		<Button
			label={getLocalizedResource(RESOURCE_KEYS.validation.validate, localizer)}
			disabled={UiStateSelectors.disabled()(config.renderOptions.state)}
			onClick={() => {
				config.renderOptions.eventHandlers.correctionMode.onRevalidate();
			}}
			key="validateButton"
		/>
	);

	return (
		<ContentBoxFooter>
			<ButtonGroup alignment="right" key="panel">
				{exitCorrectionModeButton}
				{validateButton}
			</ButtonGroup>
		</ContentBoxFooter>
	);
}
