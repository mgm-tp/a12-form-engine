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
 * 1. Open-Source License – EUPL v1.2
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

import { strictEqual } from "node:assert/strict";

import { query } from "@com.mgmtp.a12.devtools/react";

import { mouseEventMock } from "../../../../rtl-utils/mock-utils.js";
import { ER } from "../../../../utils/test-model-helpers/embedded.repeat.js";

import type { EmbeddedRepeatTestEnv } from "./utils.js";
import { setup } from "./utils.js";

export function executeAddButtonTests(testEnv: EmbeddedRepeatTestEnv): void {
	it("triggers addRow", async () => {
		const { widgetMap } = await setup({ testEnv });

		const addButtonProps = query(widgetMap.Button)
			.withId(ER.SortingAndFiltering.ID_ER_ADD_BUTTON)
			.props();

		addButtonProps?.onClick?.(mouseEventMock);

		strictEqual(
			testEnv.stubs.addRow.mock.callCount(),
			1,
			`Dispatch function was called ${testEnv.stubs.addRow.mock.callCount()} time(s). Expected call count: 1`
		);
	});
}
