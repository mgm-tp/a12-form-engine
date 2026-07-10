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

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import { query } from "@com.mgmtp.a12.devtools/react";

import type { RtlRenderWrapper } from "../../../../rtl-utils/render-wrapper.js";
import { createDocumentPath } from "../../../../utils/createDocumentPath.js";
import { createModelPath } from "../../../../utils/createModelPath.js";
import { setupFormEngineRendererWithRtlAsync } from "../../../../utils/setup.js";
import { setupModelsFixture } from "../../../../utils/setupFixture.js";
import {
	DOCUMENT_MODEL,
	FORM_MODEL,
	IDS,
	createDocumentForBlurAndFocus
} from "../../../../utils/test-model-helpers/repeat.blur-and-focus.js";

export function executeNewRowTest(): void {
	const models = setupModelsFixture("repeat.blur-and-focus");

	function setup(): Promise<RtlRenderWrapper> {
		return setupFormEngineRendererWithRtlAsync({
			models,
			data: { document: createDocumentForBlurAndFocus() },
			ui: {
				screenLocation: [
					{
						locationPath: createModelPath(FORM_MODEL.screenName),
						path: [],
						repeatInstanceState: {
							[ModelPath.toString(FORM_MODEL.inlineRepeatModelPath)]: {
								newRow: {
									rowPath: createDocumentPath(
										[DOCUMENT_MODEL.rootGroup],
										[DOCUMENT_MODEL.nestedL1]
									),
									rowState: "workingOn"
								}
							}
						}
					}
				]
			}
		});
	}

	describe("given a row which is referenced in the state as a new row with row state 'workingOn'", () => {
		it("renders the new row with the prop 'highlighted' set to true and all other rows set to false", async () => {
			const { tableMap } = await setup();

			const StartsWith = (prefix: string) => (value: unknown) =>
				typeof value === "string" && value.startsWith(prefix);
			const bodyRows = query(tableMap.bodyRowRenderer)
				.withPropMatching("id", StartsWith(IDS.IR_BODY_ROW))
				.propsHistory();

			equal(bodyRows.at(0)?.highlighted, true, "Expected that first row is highlighted");
			equal(bodyRows.at(1)?.highlighted, false, "Expected that second row is not highlighted");
		});
	});
}
