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

import type { RefObject } from "react";

import type { Events } from "../../../../back-end/store/internal/actions.js";
import type { EngineState } from "../../../../back-end/store/internal/store.js";
import type { DispatchConfiguration } from "../../configuration/dispatch-configuration.js";
import type { Config } from "../../configuration/engine-configuration.js";
import type { defaultMapDispatchToProps } from "../../configuration/Defaults.js";

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
