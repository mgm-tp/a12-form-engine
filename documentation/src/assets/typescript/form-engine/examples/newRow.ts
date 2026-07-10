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

// tag::content[]
import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import type { EngineState } from "@com.mgmtp.a12.formengine/formengine-core";
import { UiStateSelectors } from "@com.mgmtp.a12.formengine/formengine-core";

export function newRow(state: EngineState): boolean {
	const screenLocation = UiStateSelectors.screenLocationStack()(state);
	const currentLocationPath = UiStateSelectors.currentScreenLocation()(state).locationPath;

	/**
	 * The current location screenLocation[screenLocation.length - 1] is the
	 * DetachedRepeat-DetailScreen.
	 * Therefore to evaluate the RepeatState of the parent
	 * repeat we need to evaluate the parent screenLocation:
	 * screenLocation[screenLocation.length - 2]
	 */
	const repeatInstanceState = screenLocation[screenLocation.length - 2].repeatInstanceState;

	/**
	 * For a DetachedRepeat the location path to the DetailScreen is always the
	 * path to the parent repeat (parentRepeatPath) plus the name of the
	 * DetailScreen: parentRepeatPath/DetailScreenName
	 *
	 * This means to get the Form Model path of the parent repeat we need to
	 * slice the last segment from the current location path.
	 */
	const repeatModelPath = currentLocationPath.slice(0, currentLocationPath.length - 1);

	const repeatStateEntry = repeatInstanceState
		? repeatInstanceState[ModelPath.toString(repeatModelPath)]
		: undefined;

	return repeatStateEntry?.newRow?.rowState === "workingOn";
}
// end::content[]
