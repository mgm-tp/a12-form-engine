// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

// tag::content[]
import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
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
