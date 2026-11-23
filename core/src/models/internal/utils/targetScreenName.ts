// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { FormModel } from "../form-model.js";

function siblingScreenName(
	currentScreenName: string,
	offset: number,
	form: FormModel
): string | undefined {
	// we do only support toplevelscreens to have siblings
	const allScreens: string[] = form.content.screens.map(screen => screen.name);
	const thisIndex = allScreens.indexOf(currentScreenName);
	const siblingIndex = thisIndex + offset;
	if (siblingIndex < 0 || siblingIndex >= allScreens.length) {
		return undefined;
	}
	return allScreens[siblingIndex];
}

/** @internal */
export function calcTargetScreenName(
	currentScreenName: string,
	targetScreenName: FormModel.NavigationButtonTarget,
	form: FormModel
): string | undefined {
	if (targetScreenName === "#previous") {
		return siblingScreenName(currentScreenName, -1, form);
	} else if (targetScreenName === "#next") {
		return siblingScreenName(currentScreenName, 1, form);
	} else {
		const screen = form.content.screens.find(s => s.id === targetScreenName);
		return screen ? screen.name : undefined;
	}
}
