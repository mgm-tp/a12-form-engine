// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { strictEqual } from "node:assert/strict";

import { query } from "@com.mgmtp.a12.devtools/react";

import { getInputMocks } from "../../../../../rtl-utils/getInputMocks.js";
import { setupModelsFixture } from "../../../../../utils/setupFixture.js";
import { setupPicusTypeTest } from "../../../../../utils/test-model-helpers/picustypes.js";

export function executeTestForAutoExpand(): void {
	const models = setupModelsFixture("controls.picustypes");

	function assertAutoExpand(opts: { elementId: string; autoExpand: true | undefined }): void {
		const { elementId, autoExpand } = opts;
		const inputMap = getInputMocks();
		setupPicusTypeTest({
			models,
			inputMap
		});
		const props = query(inputMap.MultilineInput).withProp("uiId", elementId).props();
		strictEqual(props.modelElement.autoExpand, autoExpand);
	}

	describe("true", () => {
		it("renders a component with prop 'autoExpand=true' if 'autoExpand' is set in the model", () => {
			assertAutoExpand({ elementId: "a12-String04-id6147-2", autoExpand: true });
		});
	});

	describe("false", () => {
		it("renders a component with prop 'autoExpand=false' if 'autoExpand' is not set in the model", () => {
			assertAutoExpand({ elementId: "a12-String04-id6147", autoExpand: undefined });
		});
	});
}
