// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { RefObject } from "react";

import type { EngineState } from "../../../../back-end/store/internal/store.js";
import type { DispatchConfiguration } from "../../configuration/dispatch-configuration.js";
import type { Config } from "../../configuration/engine-configuration.js";

import type { ScrollApi } from "../scroll-api.js";

/**
 * Props for the FE React Component (extracted to avoid circular references)
 */
export interface FormEngineRendererPropsType {
	/**
	 * Configuration of the rendering.
	 * This includes the component maps to
	 * exchange default widgets by custom widgets.
	 */
	readonly config: Config;
	/** The current state. */
	readonly state: EngineState;

	/**
	 * Event callbacks, which map an UI-event to a {@link Events} action.
	 *
	 * When customizing, always spread the {@link defaultMapDispatchToProps} into the map object.
	 * Adding new mandatory properties to {@link DispatchConfiguration} is not considered as a breaking change.
	 */
	readonly eventHandlers: DispatchConfiguration;

	/** Ref to gain access to the {@link ScrollApi}. */
	readonly scrollRef?: RefObject<ScrollApi | null | undefined>;
}
