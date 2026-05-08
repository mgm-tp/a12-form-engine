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

import { screen } from "@com.mgmtp.a12.devtools/react";

import { assertCondition } from "../../../../back-end/utils/internal/assertions.js";
import { findElementByFormModelPath, FormModel } from "../../../../models/index.js";
import {
	DETACHED_REPEAT_DETAIL_SCREEN,
	SCREEN
} from "../../../../view/internal/components/form-engine/data-roles.js";
import { ScreenComponent } from "../../../../view/internal/components/form-engine/layout/screen.js";
import { rtlRenderWrapperAsync } from "../../../rtl-utils/render-wrapper.js";
import { assertExists } from "../../../utils/assertions.js";
import { DocumentHelpers } from "../../../utils/document-helpers.js";
import { ModelHelpers } from "../../../utils/model-helpers.js";
import { SetupHelpers } from "../../../utils/setup.js";
import { setupModelsFixture } from "../../../utils/setupFixture.js";

describe("api.view.layout", () => {
	describe("Screens", () => {
		describe("data-roles", () => {
			const models = setupModelsFixture("container", "screen");
			const topLevelScreenPath = ModelHelpers.createModelPath("topLevelScreen");

			describe("top level screen", () => {
				it("should have the data-role 'screen' on the outmost div", async () => {
					const { formModel } = models;
					const topLevelScreen = findElementByFormModelPath(formModel, topLevelScreenPath);
					assertExists(topLevelScreen);
					assertCondition(FormModel.Screen.isInstance(topLevelScreen));

					const renderConfiguration = SetupHelpers.setupRenderConfiguration({
						models,
						parentPath: [],
						ui: {
							screenLocation: [{ locationPath: topLevelScreenPath, path: [] }]
						}
					});

					await rtlRenderWrapperAsync(
						<ScreenComponent modelElement={topLevelScreen} config={renderConfiguration} />
					);

					const screens = screen.getAllByDataRole(SCREEN);

					strictEqual(screens.length, 1);
				});
			});

			describe("DetachedRepeat detail screen", () => {
				it("should have the data-role 'screen-detached-repeat-detail' on the outmost div", async () => {
					const { formModel } = models;

					const detailScreenPath = ModelHelpers.createModelPath(
						"screenWithDetachedRepeat",
						"repeat-r1",
						"repeat-r1-detail-screen"
					);
					const detailScreen = findElementByFormModelPath(formModel, detailScreenPath);
					assertExists(detailScreen);
					assertCondition(FormModel.Screen.isInstance(detailScreen));

					const detailScreenContext = DocumentHelpers.createDocumentPath(
						["groupForSection"],
						["r1"]
					);

					const renderConfiguration = SetupHelpers.setupRenderConfiguration({
						models,
						parentPath: detailScreenPath,
						ui: {
							screenLocation: [
								{ locationPath: topLevelScreenPath, path: [] },
								{ locationPath: detailScreenPath, path: detailScreenContext }
							]
						}
					});

					await rtlRenderWrapperAsync(
						<ScreenComponent modelElement={detailScreen} config={renderConfiguration} />
					);

					const detailScreens = screen.getAllByDataRole(DETACHED_REPEAT_DETAIL_SCREEN);
					strictEqual(detailScreens.length, 1);

					const screens = screen.queryAllByTestId(SCREEN);
					strictEqual(screens.length, 0);
				});
			});
		});
	});
});
