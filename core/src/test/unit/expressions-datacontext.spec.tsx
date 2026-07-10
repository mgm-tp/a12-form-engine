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

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import { query } from "@com.mgmtp.a12.devtools/react";

import type { EngineStore } from "../../back-end/store/internal/store.js";
import type { BufferedTextLineProps } from "../../view/internal/components/widgets/form-engine/buffered-text-line.js";

import { getComponentMocks } from "../rtl-utils/getComponentMocks.js";
import { mockFunctions } from "../rtl-utils/mock-map.js";
import type { RtlRenderWrapper } from "../rtl-utils/render-wrapper.js";
import { createDocumentPath } from "../utils/createDocumentPath.js";
import { loadData, setupFormEngineRendererWithRtlAsync } from "../utils/setup.js";
import { setupFixture, setupFixtureObject, setupModelsFixture } from "../utils/setupFixture.js";
import { DOCUMENT, MODEL_PATH } from "../utils/test-model-helpers/test-expression-datacontext.js";

describe("unit.Expression-Data-Context", () => {
	const models = setupModelsFixture("test.expression-datacontext");
	const fixture = setupFixture(() => ({
		document: loadData("test.expression-datacontext", "data", models.documentModel)
	}));

	function topLevelScreenLocation(): EngineStore.ScreenState[] {
		return [
			{
				locationPath: MODEL_PATH.TOP_LEVEL_SCREEN,
				path: []
			}
		];
	}

	function midLevelScreenLocation(): EngineStore.ScreenState[] {
		const repeatPath = createDocumentPath([DOCUMENT.ROOT_GROUP], [DOCUMENT.TOP_LEVEL_REP_GROUP, 2]);
		return [
			...topLevelScreenLocation(),
			{
				locationPath: MODEL_PATH.MID_LEVEL_SCREEN,
				path: repeatPath,
				repeatInstanceState: {}
			}
		];
	}

	function bottomLevelScreenLocation(): EngineStore.ScreenState[] {
		const repeatPath = createDocumentPath(
			[DOCUMENT.ROOT_GROUP, 1],
			[DOCUMENT.TOP_LEVEL_REP_GROUP, 2],
			["wrapper1", 1],
			[DOCUMENT.MID_LEVEL_REP_GROUP, 1]
		);

		const er_repeatPath = createDocumentPath(
			[DOCUMENT.ROOT_GROUP, 1],
			[DOCUMENT.TOP_LEVEL_REP_GROUP, 2],
			["wrapper1", 1],
			[DOCUMENT.MID_LEVEL_REP_GROUP, 1],
			["wrapper2", 1],
			[DOCUMENT.BOTTOM_LEVEL_REP_GROUP, 1]
		);
		return [
			...midLevelScreenLocation(),
			{
				locationPath: MODEL_PATH.BOTTOM_LEVEL_SCREEN,
				path: repeatPath,
				repeatInstanceState: {
					[ModelPath.toString(MODEL_PATH.ER)]: {
						expandedRowPath: er_repeatPath
					}
				}
			}
		];
	}

	function setup(options?: {
		screenLocation: EngineStore.ScreenState[];
	}): Promise<RtlRenderWrapper> {
		// label is needed for tests
		const BufferedTextLine: React.ComponentType<BufferedTextLineProps> = props => (
			<div>{props.label}</div>
		);

		const componentMap = mockFunctions({
			...getComponentMocks(),
			BufferedTextLine
		});

		return setupFormEngineRendererWithRtlAsync({
			componentMap,
			models,
			data: { document: fixture.document },
			ui: {
				screenLocation: options?.screenLocation
			}
		});
	}

	const REGEX = setupFixtureObject(() => ({
		TOP_LEVEL: {
			GLOBAL_HEADER_SUBTITLE: new RegExp(/GlobalSubtitle \[top\]/gi),
			GLOBAL_SUBHEADER_EVENT_BUTTON: new RegExp(/GlobalSubheaderEventButton \[top\]/gi),
			GLOBAL_SUBHEADER_NAVIGATION_BUTTON: new RegExp(/GlobalSubheaderNavButton \[top\]/gi),
			SCREEN_SUBHEADER_EVENT_BUTTON: new RegExp(/ScreenSubheaderBoxEventButton \[top\]/gi),
			GLOBAL_MINOR_FOOTER_BUTTON: new RegExp(/GlobalMinorFooterButton \[top\]/gi),
			GLOBAL_MAJOR_FOOTER_BUTTON: new RegExp(/GlobalMajorFooterButton \[top\]/gi),
			SCREEN_FOOTER_MINOR_BUTTON: new RegExp(/ScreenFooterBoxMinorButton \[top\]/gi),
			SCREEN_FOOTER_MAJOR_BUTTON: new RegExp(/ScreenFooterBoxMajorButton \[top\]/gi),
			MULTI_COLUMN_SECTION: new RegExp(/MultiColumnSection \[top\]/gi),
			SECTION: new RegExp(/[^n]Section \[top\]/gi), // don't want to match MultiColumnSection twice
			BUTTON_PANEL: new RegExp(/ButtonPanel \[top\]/gi),
			CONTROL_GRID: new RegExp(/ControlGrid \[top\]/gi),
			ROW: new RegExp(/Row \[top\]/gi),
			DETACHED_REPEAT: new RegExp(/DetachedRepeat \[top\]/gi),
			CONTROL: new RegExp(/Control \[top\]/gi),
			FIELD_COLUMN: new RegExp(/FieldColumnHeader \[top\]/gi),
			EXPRESSION_COLUMN: new RegExp(/ExpressionColumnHeader \[top\]/gi),
			ROW_ACTION: new RegExp(/RowAction \[mid-2\]/gi)
		},
		MID_LEVEL: {
			GLOBAL_HEADER_SUBTITLE: new RegExp(/GlobalSubtitle \[top\]/gi),
			GLOBAL_SUBHEADER_EVENT_BUTTON: new RegExp(/GlobalSubheaderEventButton \[top\]/gi),
			GLOBAL_SUBHEADER_NAVIGATION_BUTTON: new RegExp(/GlobalSubheaderNavButton \[top\]/gi),
			MULTI_COLUMN_SECTION: new RegExp(/MultiColumnSection \[mid-2\]/gi),
			SECTION: new RegExp(/[^n]Section \[mid-2\]/gi),
			BUTTON_PANEL: new RegExp(/ButtonPanel \[mid-2\]/gi),
			CONTROL_GRID: new RegExp(/ControlGrid \[mid-2\]/gi),
			ROW: new RegExp(/Row \[mid-2\]/gi),
			DETACHED_REPEAT: new RegExp(/DetachedRepeat \[mid-2\]/gi),
			CONTROL: new RegExp(/Control \[mid-2\]/gi),
			FIELD_COLUMN: new RegExp(/FieldColumnHeader \[mid-2\]/gi),
			EXPRESSION_COLUMN: new RegExp(/ExpressionColumnHeader \[mid-2\]/gi),
			ROW_ACTION: new RegExp(/RowAction \[bottom-2-1\]/gi)
		},
		BOTTOM_LEVEL: {
			GLOBAL_HEADER_SUBTITLE: new RegExp(/GlobalSubtitle \[top\]/gi),
			GLOBAL_SUBHEADER_EVENT_BUTTON: new RegExp(/GlobalSubheaderEventButton \[top\]/gi),
			GLOBAL_SUBHEADER_NAVIGATION_BUTTON: new RegExp(/GlobalSubheaderNavButton \[top\]/gi),
			MULTI_COLUMN_SECTION: new RegExp(/MultiColumnSection \[bottom-2-1\]/gi),
			SECTION: new RegExp(/[^n]Section \[bottom-2-1\]/gi),
			BUTTON_PANEL: new RegExp(/ButtonPanel \[bottom-2-1\]/gi),
			CONTROL_GRID: new RegExp(/ControlGrid \[bottom-2-1\]/gi),
			ROW: new RegExp(/Row \[bottom-2-1\]/gi),
			EMBEDDED_REPEAT: new RegExp(/EmbeddedRepeat \[bottom-2-1\]/gi),
			INLINE_REPEAT: new RegExp(/InlineRepeat \[bottom-2-1\]/gi),
			CONTROL: new RegExp(/Control \[bottom-2-1\]/gi),
			ER_CONTROL_GRID: new RegExp(/ControlGrid \[5\]/gi),
			ER_ROW: new RegExp(/Row \[5\]/gi),
			ER_CONTROL: new RegExp(/Control \[5\]/gi)
		}
	}));

	describe("empty data context", () => {
		it("renders expression labels using the root data context", async () => {
			const wrapper = await setup({ screenLocation: topLevelScreenLocation() });

			const textOutput = query(wrapper.componentMap.HtmlTextSpan)
				.propsHistory()
				.map(props => props.content)
				.join();

			Object.entries(REGEX.TOP_LEVEL).forEach(([key, regex]) => {
				const occurrences = (textOutput.match(regex) || []).length;
				strictEqual(occurrences, 1, `Expected 1 occurrence of ${key}. Found ${occurrences}.`);
			});
		});
	});

	describe("repeatable group data context", () => {
		it("renders expression labels using the DR repeatable group data context", async () => {
			const wrapper = await setup({ screenLocation: midLevelScreenLocation() });

			const textOutput = wrapper.baseElement.textContent;

			Object.entries(REGEX.MID_LEVEL).forEach(([key, regex]) => {
				const occurrences = (textOutput.match(regex) || []).length;
				strictEqual(occurrences, 1, `Expected 1 occurrence of ${key}. Found ${occurrences}.`);
			});
		});
	});

	describe("nested repeatable group data context", () => {
		it("renders expression labels using the nested DR repeatable group data context", async () => {
			const wrapper = await setup({ screenLocation: bottomLevelScreenLocation() });

			const textOutput = wrapper.baseElement.textContent;

			Object.entries(REGEX.BOTTOM_LEVEL).forEach(([key, regex]) => {
				const occurrences = (textOutput.match(regex) || []).length;
				strictEqual(occurrences, 1, `Expected 1 occurrence of ${key}. Found ${occurrences}.`);
			});
		});
	});
});
