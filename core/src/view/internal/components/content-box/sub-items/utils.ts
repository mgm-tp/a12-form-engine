// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { FormModel } from "../../../../../models/index.js";

/** @internal */
export function isNotNull<T>(obj: T | null): obj is T {
	return obj !== null;
}

/** @internal */
export function getButtonsFromHeaderFooterType(
	element?: FormModel.HeaderFooterType,
	type?: "major" | "minor" | undefined
): ReadonlyArray<FormModel.ButtonType> {
	if (element === undefined) {
		return [];
	}

	const emptyButtons = { button: [] };
	const {
		majorButtons: { button: majorButtons = [] } = emptyButtons,
		minorButtons: { button: minorButtons = [] } = emptyButtons
	} = element;

	if (type === "major") {
		return majorButtons;
	} else if (type === "minor") {
		return minorButtons;
	} else {
		return [...majorButtons, ...minorButtons];
	}
}
