// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { SetupHelpers } from "../../../../utils/setup.js";
import { setupModelsFixture } from "../../../../utils/setupFixture.js";
import { IR } from "../../../../utils/test-model-helpers/inline.repeat.js";
import {
	createDocumentForRepeat,
	createNestedL6Entry
} from "../../../../utils/test-model-helpers/repeat.js";

import { assertButtonEnablement } from "./assertButtonEnablement.js";

/**
 * Note: The triggering of the correct event is tested in row-action.spec.ts
 */
describe("api.view.repeat", () => {
	describe("Clone button", () => {
		const models = setupModelsFixture("repeat", "inline");

		describe("enable-disabled", () => {
			it("disabled the clone button if number of documents >= Max Repeatability", async () => {
				const { widgetMap } = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
					models,
					data: {
						document: createDocumentForRepeat({
							nestedL6: [
								createNestedL6Entry({ L6_Number: 42 }),
								createNestedL6Entry({ L6_Number: 42 }),
								createNestedL6Entry({ L6_Number: 42 })
							]
						})
					}
				});

				assertButtonEnablement(widgetMap, `${IR.SortingAndFiltering.ID_CLONE_BUTTON}-1`, true);
			});

			it("enables the clone button number of documents < Max Repeatability", async () => {
				const { widgetMap } = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
					models,
					data: {
						document: createDocumentForRepeat({
							nestedL6: [createNestedL6Entry({ L6_Number: 42 })]
						})
					}
				});

				assertButtonEnablement(widgetMap, `${IR.SortingAndFiltering.ID_CLONE_BUTTON}-1`, false);
			});
		});
	});
});
