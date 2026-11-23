// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { strictEqual } from "node:assert/strict";

import { query } from "@com.mgmtp.a12.devtools/react";

import type { Models } from "../../../../../back-end/store/index.js";
import { SetupHelpers } from "../../../../utils/setup.js";

const { setupFormEngineRendererWithRtl } = SetupHelpers;

export function testAriaRole(params: { models: Models; id: string; linkExpected: boolean }): void {
	const { models, id, linkExpected } = params;

	describe("aria role", () => {
		it(`should ${linkExpected ? "" : "not "}render with role="link"`, () => {
			const { widgetMap } = setupFormEngineRendererWithRtl({ models });
			const button = query(widgetMap.Button).withId(id).props();
			const role = button.buttonAttributes?.role;
			strictEqual(role, linkExpected ? "link" : undefined);
		});
	});
}
