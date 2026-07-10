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

import { strictEqual } from "node:assert/strict";

import { query } from "@com.mgmtp.a12.devtools/react";

import { createModelPath } from "../../../utils/createModelPath.js";
import { setupContentBoxRendererWithRtl } from "../../../utils/setup.js";
import { setupModelsFixture } from "../../../utils/setupFixture.js";

describe("api.view.content-box", () => {
	const models = setupModelsFixture("repeat.breadcrumbs");

	const topLevelScreenPath = createModelPath("Screen");
	const level1Path = createModelPath("Screen", "1", "ScreenWithLabel");
	const level11Path = createModelPath("Screen", "1", "ScreenWithLabel", "1.1", "ScreenWithLabel");
	const level12Path = createModelPath(
		"Screen",
		"1",
		"ScreenWithLabel",
		"1.2",
		"ScreenWithoutLabel"
	);
	const level2Path = createModelPath("Screen", "2", "ScreenWithoutLabel");
	const level21Path = createModelPath(
		"Screen",
		"2",
		"ScreenWithoutLabel",
		"2.1",
		"ScreenWithLabel"
	);
	const level22Path = createModelPath(
		"Screen",
		"2",
		"ScreenWithoutLabel",
		"2.2",
		"ScreenWithoutLabel"
	);

	describe("Label for Repeat given", () => {
		it("renders the BreadCrumbs correctly", () => {
			const { widgetMap } = setupContentBoxRendererWithRtl({
				models,
				ui: {
					screenLocation: [
						{ locationPath: topLevelScreenPath, path: [] },
						{ locationPath: level1Path, path: [] }
					]
				}
			});

			const props = query(widgetMap.BreadcrumbItem).props();
			strictEqual(props.children, "Level 1");
		});

		describe("Label for Nested Repeat given", () => {
			it("renders the BreadCrumbs correctly", () => {
				const { widgetMap } = setupContentBoxRendererWithRtl({
					models,
					ui: {
						screenLocation: [
							{ locationPath: topLevelScreenPath, path: [] },
							{ locationPath: level1Path, path: [] },
							{ locationPath: level11Path, path: [] }
						]
					}
				});

				const props1 = query(widgetMap.BreadcrumbItem).withTestId("breadcrumbItem-0").props();
				strictEqual(props1.children, "Level 1");
				const props2 = query(widgetMap.BreadcrumbItem).withTestId("breadcrumbItem-1").props();
				strictEqual(props2.children, "Level 2");
			});
		});

		describe("No Label for Nested Repeat given", () => {
			it("renders the BreadCrumbs correctly", () => {
				const { widgetMap } = setupContentBoxRendererWithRtl({
					models,
					ui: {
						screenLocation: [
							{ locationPath: topLevelScreenPath, path: [] },
							{ locationPath: level1Path, path: [] },
							{ locationPath: level12Path, path: [] }
						]
					}
				});

				const props1 = query(widgetMap.BreadcrumbItem).withTestId("breadcrumbItem-0").props();
				strictEqual(props1.children, "Level 1");
				const props2 = query(widgetMap.BreadcrumbItem).withTestId("breadcrumbItem-1").props();
				strictEqual(props2.children, "");
			});
		});
	});

	describe("No Label for Repeat given", () => {
		it("does not render any breadcrumb", () => {
			const { widgetMap } = setupContentBoxRendererWithRtl({
				models,
				ui: {
					screenLocation: [
						{ locationPath: topLevelScreenPath, path: [] },
						{ locationPath: level2Path, path: [] }
					]
				}
			});

			query(widgetMap.Breadcrumb).assertNotRendered();
			query(widgetMap.BreadcrumbItem).assertNotRendered();
		});

		describe("Label for Nested Repeat given", () => {
			it("renders the BreadCrumbs correctly", () => {
				const { widgetMap } = setupContentBoxRendererWithRtl({
					models,
					ui: {
						screenLocation: [
							{ locationPath: topLevelScreenPath, path: [] },
							{ locationPath: level2Path, path: [] },
							{ locationPath: level21Path, path: [] }
						]
					}
				});

				const props1 = query(widgetMap.BreadcrumbItem).withTestId("breadcrumbItem-0").props();
				strictEqual(props1.children, "");
				const props2 = query(widgetMap.BreadcrumbItem).withTestId("breadcrumbItem-1").props();
				strictEqual(props2.children, "Level 2");
			});
		});

		describe("No Label for Nested Repeat given", () => {
			it("does not render any breadcrumb", () => {
				const { widgetMap } = setupContentBoxRendererWithRtl({
					models,
					ui: {
						screenLocation: [
							{ locationPath: topLevelScreenPath, path: [] },
							{ locationPath: level2Path, path: [] },
							{ locationPath: level22Path, path: [] }
						]
					}
				});

				query(widgetMap.Breadcrumb).assertNotRendered();
				query(widgetMap.BreadcrumbItem).assertNotRendered();
			});
		});
	});
});
