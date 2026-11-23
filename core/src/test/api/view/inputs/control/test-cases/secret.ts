// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { strictEqual } from "node:assert/strict";

import { query } from "@com.mgmtp.a12.devtools/react";

import { getInputMocks } from "../../../../../rtl-utils/getInputMocks.js";
import { setupModelsFixture } from "../../../../../utils/setupFixture.js";
import {
	PICUS_TYPES,
	setupPicusTypeTest
} from "../../../../../utils/test-model-helpers/picustypes.js";

export function executeTestForSecret(): void {
	const models = setupModelsFixture("controls.picustypes");

	function assertSecret(uiId: string, value: true | undefined): void {
		const inputMap = getInputMocks();
		setupPicusTypeTest({
			models,
			inputMap
		});
		const modelElement = query(inputMap.StringInput).withProp("uiId", uiId).props().modelElement;
		strictEqual(modelElement.secret, value);
	}

	describe("given a form-model", () => {
		describe("with a control where 'secret is set", () => {
			it("renders an input with prop 'secret' which is set to true", () => {
				assertSecret(PICUS_TYPES.STRING_01_SECRET, true);
			});
		});

		describe("with a control where 'secret is not set", () => {
			it("renders an input with prop 'secret' which is set to undefined", () => {
				assertSecret(PICUS_TYPES.STRING_01, undefined);
			});
		});
	});
}
