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

/* eslint-disable mocha/no-setup-in-describe */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { strictEqual } from "node:assert/strict";

import { query } from "@com.mgmtp.a12.devtools/react";

import type { WidgetMap } from "../../../../view/index.js";
import type { RtlRenderWrapper } from "../../../rtl-utils/render-wrapper.js";
import {
	setupContentBoxRendererWithRtl,
	setupFormEngineRendererWithRtl
} from "../../../utils/setup.js";
import { setupModelsFixture } from "../../../utils/setupFixture.js";
import { IDS } from "../../../utils/test-model-helpers/aria-level.js";

describe("api.features", () => {
	describe("a11y", () => {
		describe("aria-level", () => {
			const models = setupModelsFixture("a11y", "aria-level");

			function setup(): RtlRenderWrapper {
				return setupFormEngineRendererWithRtl({
					models
				});
			}

			function assertAriaLevel(
				widgetMap: WidgetMap,
				headlineTestId: string,
				expectedAriaLevel: number | undefined
			): void {
				const actualAriaLevel = query(widgetMap.TypographyHeadline)
					.withTestId(headlineTestId)
					.props().ariaLevel;
				strictEqual(actualAriaLevel, expectedAriaLevel);
			}

			interface TestDescription {
				readonly description: string;
				readonly parentHeadlineId: string;
				readonly elementLabelHeadlineId?: string;
				readonly elementNoLabelHeadlineId?: string;
				readonly childLabelHeadlineId?: string;
				readonly childNoLabelHeadlineId?: string;
			}

			const testDescriptions: TestDescription[] = [
				{
					description: "section having a label",
					parentHeadlineId: IDS.SECTION_PARENT_SECTION_HEADLINE,
					elementLabelHeadlineId: IDS.SECTION_WITH_LABEL_HEADLINE,
					childLabelHeadlineId: IDS.GRID_SECTION_WITH_LABEL_HEADLINE
				},
				{
					description: "section not having a label",
					parentHeadlineId: IDS.SECTION_PARENT_SECTION_HEADLINE,
					childNoLabelHeadlineId: IDS.GRID_SECTION_WITHOUT_LABEL_HEADLINE
				},
				{
					description: "collapsible section having a label",
					parentHeadlineId: IDS.COLLAPSIBLE_SECTION_PARENT_SECTION_HEADLINE,
					elementLabelHeadlineId: IDS.COLLAPSIBLE_SECTION_WITH_LABEL_HEADLINE,
					childLabelHeadlineId: IDS.GRID_COLLAPSIBLE_SECTION_WITH_LABEL_HEADLINE
				},
				{
					description: "collapsible section not having a label",
					parentHeadlineId: IDS.COLLAPSIBLE_SECTION_PARENT_SECTION_HEADLINE,
					elementNoLabelHeadlineId: IDS.COLLAPSIBLE_SECTION_WITHOUT_LABEL_HEADLINE,
					childNoLabelHeadlineId: IDS.GRID_COLLAPSIBLE_SECTION_WITHOUT_LABEL_HEADLINE
				},
				{
					description: "multi column section having a label",
					parentHeadlineId: IDS.MULTI_COLUMN_SECTION_PARENT_SECTION_HEADLINE,
					elementLabelHeadlineId: IDS.MULTI_COLUMN_SECTION_WITH_LABEL_HEADLINE,
					childLabelHeadlineId: IDS.GRID_MULTI_COLUMN_SECTION_WITH_LABEL_HEADLINE
				},
				{
					description: "multi column section not having a label",
					parentHeadlineId: IDS.MULTI_COLUMN_SECTION_PARENT_SECTION_HEADLINE,
					childNoLabelHeadlineId: IDS.GRID_MULTI_COLUMN_SECTION_WITHOUT_LABEL_HEADLINE
				},
				{
					description: "control grid having a label",
					parentHeadlineId: IDS.GRID_PARENT_SECTION_HEADLINE,
					elementLabelHeadlineId: IDS.GRID_WITH_LABEL_HEADLINE,
					childLabelHeadlineId: IDS.ROW_TITLE_ROW_GRID_WITH_LABEL_HEADLINE
				},
				{
					description: "control grid not having a label",
					parentHeadlineId: IDS.GRID_PARENT_SECTION_HEADLINE,
					childNoLabelHeadlineId: IDS.ROW_TITLE_ROW_GRID_WITHOUT_LABEL_HEADLINE
				},
				{
					description: "row",
					parentHeadlineId: IDS.ROW_PARENT_SECTION_HEADLINE,
					elementLabelHeadlineId: IDS.TITLE_ROW_ROW_WITH_LABEL_HEADLINE
				},
				{
					description: "repeat",
					parentHeadlineId: IDS.REPEAT_PARENT_SECTION_HEADLINE,
					elementLabelHeadlineId: IDS.REPEAT_WITH_LABEL_HEADLINE
				},
				{
					description: "button panel",
					parentHeadlineId: IDS.BUTTON_PANEL_PARENT_SECTION_HEADLINE,
					elementLabelHeadlineId: IDS.BUTTON_PANEL_WITH_LABEL_HEADLINE
				}
			];

			for (const testDescription of testDescriptions) {
				testAriaLevels(testDescription);
			}

			function testAriaLevels(testDescription: TestDescription): void {
				describe(`${testDescription.description}`, () => {
					if (testDescription.elementLabelHeadlineId) {
						testLabelIncreasesAriaLevel(testDescription);
					}
					if (testDescription.childLabelHeadlineId && testDescription.elementLabelHeadlineId) {
						testIncreasedAriaLevelPropagated(testDescription);
					}
					if (testDescription.elementNoLabelHeadlineId) {
						testEmptyTitleAndNoAriaLevel(testDescription);
					}
					if (testDescription.childNoLabelHeadlineId) {
						testNoIncreasedAriaLevelPropagated(testDescription);
					}
				});
			}

			function testLabelIncreasesAriaLevel(testDescription: TestDescription): void {
				it("renders a title with aria-level increased by 1 compared to ancestor title", () => {
					const { widgetMap } = setup();

					const expectedParentAriaLevel = 2;

					assertAriaLevel(widgetMap, testDescription.parentHeadlineId, expectedParentAriaLevel);
					assertAriaLevel(
						widgetMap,
						testDescription.elementLabelHeadlineId!,
						expectedParentAriaLevel + 1
					);
				});
			}

			function testIncreasedAriaLevelPropagated(testDescription: TestDescription): void {
				it("propagates an increased aria-level to nested elements", () => {
					const { widgetMap } = setup();

					const expectedParentAriaLevel = 2;

					// parent -> element +1 -> child +1
					assertAriaLevel(widgetMap, testDescription.parentHeadlineId, expectedParentAriaLevel);
					assertAriaLevel(
						widgetMap,
						testDescription.elementLabelHeadlineId!,
						expectedParentAriaLevel + 1
					);
					assertAriaLevel(
						widgetMap,
						testDescription.childLabelHeadlineId!,
						expectedParentAriaLevel + 2
					);
				});
			}

			function testEmptyTitleAndNoAriaLevel(testDescription: TestDescription): void {
				it("renders an empty title with no aria-level", () => {
					const { widgetMap } = setup();

					assertAriaLevel(widgetMap, testDescription.elementNoLabelHeadlineId!, undefined);

					const sectionHeadlineText = query(widgetMap.TypographyHeadline)
						.withTestId(testDescription.elementNoLabelHeadlineId!)
						.props().children;
					strictEqual(sectionHeadlineText, undefined);
				});
			}

			function testNoIncreasedAriaLevelPropagated(testDescription: TestDescription): void {
				it("doesn't propagate an increased aria-level to nested elements", () => {
					const { widgetMap } = setup();

					const expectedParentAriaLevel = 2;

					// parent -> element without title +0 -> child +1
					assertAriaLevel(widgetMap, testDescription.parentHeadlineId, expectedParentAriaLevel);
					assertAriaLevel(
						widgetMap,
						testDescription.childNoLabelHeadlineId!,
						expectedParentAriaLevel + 1
					);
				});
			}

			describe("footer", () => {
				it("renders a footer with aria-level increased by 1 compared to its parent heading", () => {
					const initialAriaLevel = 2;

					const { widgetMap } = setupContentBoxRendererWithRtl({
						models,
						config: {
							ariaLevel: initialAriaLevel
						}
					});

					const contentBoxTitle = query(widgetMap.ContentBoxTitle);
					const contentBoxFooter = query(widgetMap.ContentBoxFooter);

					const titleAriaLevel = contentBoxTitle.props().ariaLevel;
					const footerAriaLevel = contentBoxFooter.props().ariaLevel;

					strictEqual(titleAriaLevel, initialAriaLevel);
					strictEqual(footerAriaLevel, titleAriaLevel + 1);

					const titleRole = contentBoxTitle.props().role;

					strictEqual(titleRole, "heading");
				});
			});
		});
	});
});
