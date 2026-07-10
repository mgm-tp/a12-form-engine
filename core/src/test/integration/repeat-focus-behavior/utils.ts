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

import { equal } from "node:assert/strict";

import { within } from "@com.mgmtp.a12.devtools/react";

import type { EngineStore } from "../../../back-end/store/index.js";
import type { Models } from "../../../back-end/store/internal/store.js";
import { click } from "../../rtl-utils/rtl-click.js";
import { createModelPath } from "../../utils/createModelPath.js";
import { setupConnectedFormEngineWithRtlAsync } from "../../utils/setup.js";
import type { ConnectedRtlWrapper } from "../../utils/setup.js";

export function createSetup(models: Models): Promise<ConnectedRtlWrapper> {
	const ui: Partial<EngineStore.UIState> = {
		screenLocation: [
			{
				locationPath: [{ elementName: "tabAndFocus" }],
				path: [],
				focusedComponent: {
					// Set the focused component to any other element to see if it is updated correctly later
					formModelPath: createModelPath("tabAndFocus", "inline-repeat", "inline-repeat-rep")
				}
			}
		],
		correctionModeBackup: undefined
	};

	const data: EngineStore.DataState = {
		dirty: true,
		document: {
			root: { rep: [{}, {}] }
		}
	};

	return setupConnectedFormEngineWithRtlAsync({
		withScrollHandler: true,
		models,
		ui,
		data
	});
}

export async function executeFocusFormTest(options: {
	models: Models;
	addButtonId: string;
}): Promise<void> {
	const wrapper = await createSetup(options.models);

	await click(within(wrapper.baseElement).getById(options.addButtonId));
	equal(document.activeElement?.id, "a11y.repeat-form", "Expected that the form is focused");
}

export async function executeAddButtonTest(options: {
	models: Models;
	addButtonId: string;
	expectedActiveElementId: string;
}): Promise<void> {
	const wrapper = await createSetup(options.models);

	await click(within(wrapper.baseElement).getById(options.addButtonId));

	equal(
		document.activeElement?.id,
		options.expectedActiveElementId + "-2",
		`Expected that the element with id ${options.expectedActiveElementId}-2 is focused`
	);
}

export async function executeDeleteButtonTest(options: {
	models: Models;
	deleteButtonId: string;
	expectedActiveElementId: string;
	confirm: boolean;
}): Promise<void> {
	const wrapper = await createSetup(options.models);

	await click(within(wrapper.baseElement).getById(options.deleteButtonId + "-2"));

	const button = options.deleteButtonId + "-2-" + (options.confirm ? "confirm" : "cancel");
	await click(within(wrapper.baseElement).getById(button));

	equal(
		document.activeElement?.id,
		options.expectedActiveElementId,
		`Expected that the element with id ${options.expectedActiveElementId} is focused`
	);
}
