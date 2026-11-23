// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { strictEqual } from "node:assert/strict";

import { query } from "@com.mgmtp.a12.devtools/react";

import { SetupHelpers } from "../../../utils/setup.js";
import { setupModelsFixture } from "../../../utils/setupFixture.js";
import { createModelPath } from "../../../utils/test-model-helpers/dependent-enumeration.js";

const { setupContentBoxRendererWithRtl } = SetupHelpers;

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
