// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { FormModel } from "../form_model.js";

export function createSubHeaderBox(screens: FormModel.Screen[]): FormModel.HeaderFooterType {
	const majorButtons = screens.length > 1 ? createNavigationButtons(screens) : undefined;
	return {
		id: "subHeaderBox",
		...(majorButtons ? { majorButtons } : {})
	};
}

function createNavigationButtons(screens: FormModel.Screen[]): FormModel.ButtonList {
	const buttons = screens.map(createNavigationButton);
	return {
		button: buttons
	};
}

function createNavigationButton(screen: FormModel.Screen): FormModel.ButtonType {
	return {
		id: `Button_for_${screen.id}`,
		name: screen.name,
		type: "NAVIGATION",
		target: screen.id,
		scope: "ALWAYS"
	};
}

export function createFooterBox(): FormModel.HeaderFooterType {
	return {
		id: "footerBox"
	};
}
