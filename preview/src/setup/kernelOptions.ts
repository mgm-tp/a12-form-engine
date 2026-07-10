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

import type { Selector } from "@com.mgmtp.a12.client/client-core";
import { FormEngineSelectors } from "@com.mgmtp.a12.formengine/formengine-core";
import type { EngineState } from "@com.mgmtp.a12.formengine/formengine-core";
import type {
	GeneratedCodeRtConfig,
	ICustomCondition,
	ICustomConditionFactory
} from "@com.mgmtp.a12.kernel/kernel-md-facade";

import { selectActiveConditions, selectNow } from "../store/previewSlice.js";

// values are injected into FE state by previewEngineStateSelector
export interface PreviewEngineState extends EngineState {
	readonly preview?: {
		readonly now?: Date;
		readonly customConditions?: readonly string[];
	};
}

const staticCondition: (result: boolean) => ICustomCondition = result => ({
	check: () => result
});

const createCustomConditionFactory: (
	state: PreviewEngineState
) => ICustomConditionFactory = state => ({
	createCustomCondition: customConditionName =>
		staticCondition(state.preview?.customConditions?.includes(customConditionName) ?? false)
});

/**
 * Only works in conjunction with a custom {@link previewEngineStateSelector}
 */
export function kernelOptionsProvider(state: PreviewEngineState): GeneratedCodeRtConfig {
	const customConditionFactory = createCustomConditionFactory(state);
	return {
		currentDateForTest: state.preview?.now,
		customConditionFactory
	};
}

/**
 * Enhances the engine state with the now value from the dataholder slice so
 * the form engine middlewares can access it via the {@link kernelOptionsProvider}.
 * @internal
 */
export function previewEngineStateSelector(
	activityId: string
): Selector<PreviewEngineState | undefined> {
	return state => {
		const engineState = FormEngineSelectors.engineState(activityId)(state);
		const now = selectNow(state, activityId);
		const customConditions = selectActiveConditions(state, activityId);

		return engineState
			? now || customConditions.length
				? {
						...engineState,
						preview: { now, customConditions }
					}
				: engineState
			: undefined;
	};
}
