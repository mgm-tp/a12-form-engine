// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ReactElement } from "react";

import { UiStateSelectors } from "../../../../../back-end/store/index.js";

import type { ContentBoxRenderConfiguration } from "../content-box-render-configuration.js";

import { RepeatFooter } from "./repeat-footer.js";

/** @internal */
export function DetachedRepeatFooter(props: {
	config: ContentBoxRenderConfiguration;
}): ReactElement | null {
	const currentScreenLocation = UiStateSelectors.currentScreenLocation()(
		props.config.renderOptions.state
	);
	const screenLocationStack = UiStateSelectors.screenLocationStack()(
		props.config.renderOptions.state
	);
	const repeatInstanceState =
		screenLocationStack[screenLocationStack.length - 2].repeatInstanceState;

	return (
		<RepeatFooter
			{...props}
			onButtonClick={(cancel: boolean) =>
				props.config.renderOptions.eventHandlers.repeat.onLeaveDetachedRepeatRow(cancel)
			}
			location={currentScreenLocation}
			repeatInstanceState={repeatInstanceState}
		/>
	);
}
