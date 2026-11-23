// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { equal } from "node:assert/strict";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import { query } from "@com.mgmtp.a12.devtools/react";

import type { RtlRenderWrapper } from "../../../../rtl-utils/render-wrapper.js";
import { SetupHelpers } from "../../../../utils/setup.js";
import { setupModelsFixture } from "../../../../utils/setupFixture.js";
import {
	createDocumentPath,
	createModelPath
} from "../../../../utils/test-model-helpers/dependent-enumeration.js";
import {
	DOCUMENT_MODEL,
	FORM_MODEL,
	IDS,
	createDocumentForBlurAndFocus
} from "../../../../utils/test-model-helpers/repeat.blur-and-focus.js";

export function executeNewRowTest(): void {
	const models = setupModelsFixture("repeat.blur-and-focus");

	function setup(): Promise<RtlRenderWrapper> {
		return SetupHelpers.setupFormEngineRendererWithRtlAsync({
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
