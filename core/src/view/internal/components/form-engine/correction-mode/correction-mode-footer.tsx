// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ReactElement } from "react";
import { useContext } from "react";

import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";

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
