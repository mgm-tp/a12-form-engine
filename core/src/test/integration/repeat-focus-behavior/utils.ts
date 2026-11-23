// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { equal } from "node:assert/strict";

import { within } from "@com.mgmtp.a12.devtools/react";

import type { EngineStore } from "../../../back-end/store/index.js";
import type { Models } from "../../../back-end/store/internal/store.js";
import { click } from "../../rtl-utils/rtl-click.js";
import { SetupHelpers } from "../../utils/setup.js";
import { createModelPath } from "../../utils/test-model-helpers/dependent-enumeration.js";

export function createSetup(models: Models): Promise<SetupHelpers.ConnectedRtlWrapper> {
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

	return SetupHelpers.setupConnectedFormEngineWithRtlAsync({
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
