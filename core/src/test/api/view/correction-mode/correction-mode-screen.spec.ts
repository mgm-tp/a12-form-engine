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

import { deepStrictEqual, strictEqual } from "node:assert/strict";
import { mock } from "node:test";

import { act } from "@testing-library/react";

import { query } from "@com.mgmtp.a12.devtools/react";

import type { EngineStore } from "../../../../back-end/store/index.js";
import { UiStateSelectors } from "../../../../back-end/store/index.js";
import type { DispatchConfiguration } from "../../../../view/index.js";
import { defaultMapDispatchToProps } from "../../../../view/index.js";
import { createDocumentPath } from "../../../utils/createDocumentPath.js";
import { createModelPath } from "../../../utils/createModelPath.js";
import { setupConnectedFormEngineWithRtl } from "../../../utils/setup.js";
import { setupModelsFixture } from "../../../utils/setupFixture.js";
import { createValidationEntry } from "../../../utils/validation.js";

describe("api.view.Correction-Mode-Screen", () => {
	// eslint-disable-next-line mocha/no-setup-in-describe
	const models = setupModelsFixture("computation-validation.correctionmode");

	describe("Messages", () => {
		it("shows a list of all issues", () => {
			const { widgetMap } = createSetup();
			query(widgetMap.MessageBox).groupByTestId().assertSize(2);
		});

		describe("issue with single cause", () => {
			it("shows a link to the issue", () => {
				const { widgetMap } = createSetup();
				query(widgetMap.Button).withProp("label", "First Screen > F1").assertRenderedTimes(1);
			});
		});

		describe("issue with multiple causes", () => {
			it("shows a Show-Details Button", () => {
				const { widgetMap } = createSetup({ 1: false });
				query(widgetMap.Button).withProp("label", "Show details").assertRenderedTimes(1);
			});

			describe("Show-Details Button clicked", () => {
				it("shows a list of all causes", () => {
					const { widgetMap, store } = createSetup({ 1: false });
					const props = query(widgetMap.Button).withProp("label", "Show details").props();
					query(widgetMap.Button).resetHistory(); // assert the renders after the click
					act(() => props.onClick?.({} as React.MouseEvent<HTMLElement>));

					deepStrictEqual(
						UiStateSelectors.correctionScreenState()(store.getState()).showDetailsState,
						{
							1: true
						}
					);

					query(widgetMap.Button)
						.withProp("label", "First Screen > F1R1")
						.groupByTestId()
						.assertSize(2);
					query(widgetMap.Button)
						.withProp("label", "First Screen > dr1 > F1R1")
						.assertRenderedTimes(1);
				});

				it("shows a Hide-Details Button", () => {
					const { widgetMap } = createSetup({ 1: true });

					query(widgetMap.Button).withProp("label", "Hide details").assertRenderedTimes(1);
				});
			});

			describe("Hide-Details Button clicked", () => {
				it("hides the list of all causes", () => {
					const { widgetMap, store } = createSetup({ 1: true });

					const props = query(widgetMap.Button).withProp("label", "Hide details").props();
					query(widgetMap.Button).resetHistory(); // assert the renders after the click
					act(() => props.onClick?.({} as React.MouseEvent<HTMLElement>));

					deepStrictEqual(
						UiStateSelectors.correctionScreenState()(store.getState()).showDetailsState,
						{
							1: false
						}
					);

					query(widgetMap.Button).withProp("label", "First Screen > F1R1").assertNotRendered();
					query(widgetMap.Button)
						.withProp("label", "First Screen > dr1 > F1R1")
						.assertNotRendered();
				});
			});
		});

		it("renders the jump-to button label of inline-repeat and embedded-repeat columns complete", () => {
			const { widgetMap } = createSetup({ 1: true });

			query(widgetMap.Button)
				.withProp("label", "First Screen > F1R1")
				.groupByTestId()
				.assertSize(2);
			query(widgetMap.Button).withProp("label", "First Screen > dr1 > F1R1").assertRenderedTimes(1);
		});

		describe("back", () => {
			it("leaves the screen and returns to the original screen when Back Button is clicked", () => {
				const { widgetMap, store } = createSetup();

				const props = query(widgetMap.Button).withProp("label", "Back").props();
				act(() => props.onClick?.({} as React.MouseEvent<HTMLElement>));

				strictEqual(UiStateSelectors.correctionScreenState()(store.getState()).visible, false);
			});
		});
	});

	describe("Jumping links", () => {
		function getDispatchConfig() {
			const stubbedDispatch = defaultMapDispatchToProps(mock.fn());
			return {
				...stubbedDispatch.eventHandlers,
				correctionMode: {
					...stubbedDispatch.eventHandlers.correctionMode,
					onGoToElement: mock.fn<DispatchConfiguration.CorrectionMode["onGoToElement"]>(),
					validationBar: {
						...stubbedDispatch.eventHandlers.correctionMode.validationBar,
						onExpand: mock.fn<DispatchConfiguration.CorrectionMode.ValidationBar["onExpand"]>()
					}
				}
			};
		}

		it("calls 'correctionMode.onGoToElement' if a link is clicked", () => {
			const dispatchConfig = getDispatchConfig();
			const { widgetMap } = createSetup({}, false, dispatchConfig);

			const props = query(widgetMap.Button).withProp("label", "First Screen > F1").props();
			props.onClick?.({} as React.MouseEvent<HTMLElement>);

			strictEqual(dispatchConfig.correctionMode.onGoToElement.mock.callCount(), 1);

			const item = dispatchConfig.correctionMode.onGoToElement.mock.calls[0].arguments[0];
			deepStrictEqual(
				item.formModelPath,
				createModelPath("Screen1", "cg1", "row-f942e", "control-bfd65"),
				"Wrong form-model path"
			);
			deepStrictEqual(
				item.locationStack[0].focusedComponent,
				{
					formModelPath: createModelPath("Screen1", "cg1", "row-f942e", "control-bfd65")
				},
				"Wrong path to focused component"
			);
		});

		it("calls 'correctionMode.validationBar.onExpand' with 'expand=false' if the validation bar is expanded and if the link is clicked", () => {
			const dispatchConfig = getDispatchConfig();
			const { widgetMap } = createSetup({}, true, dispatchConfig);

			const props = query(widgetMap.Button).withProp("label", "First Screen > F1").props();
			props.onClick?.({} as React.MouseEvent<HTMLElement>);

			strictEqual(dispatchConfig.correctionMode.validationBar.onExpand.mock.callCount(), 1);

			const expanded =
				dispatchConfig.correctionMode.validationBar.onExpand.mock.calls[0].arguments[0];
			const resetCurrentMessage =
				dispatchConfig.correctionMode.validationBar.onExpand.mock.calls[0].arguments[1];
			strictEqual(expanded, false, "Expected that expanded is set to false");
			strictEqual(resetCurrentMessage, false, "Expected that resetCurrentMessage is set to false");
		});

		it("does not call 'correctionMode.validationBar.onExpand' if the validation bar is not expanded and if the link is clicked", () => {
			const dispatchConfig = getDispatchConfig();
			const { widgetMap } = createSetup({}, false, dispatchConfig);

			const props = query(widgetMap.Button).withProp("label", "First Screen > F1").props();
			props.onClick?.({} as React.MouseEvent<HTMLElement>);

			strictEqual(dispatchConfig.correctionMode.validationBar.onExpand.mock.callCount(), 0);
		});
	});

	function createSetup(
		showDetailsState: { [key: string]: boolean } = {},
		validationBarExpanded = false,
		dispatchConfig?: DispatchConfiguration
	) {
		const ui: Partial<EngineStore.UIState> = {
			screenLocation: [
				{
					locationPath: [{ elementName: "Screen1" }],
					path: [],
					repeatInstanceState: { "/Screen1/ir1": { page: 1 } }
				}
			],
			messages: {
				...createValidationEntry({
					path: createDocumentPath(["root"], ["F1"]),
					errorText: [{ key: "errorKey" }]
				}),
				...createValidationEntry({
					path: createDocumentPath(["root"], ["G1R"], ["F1R1"]),
					errorText: [{ key: "errorKey" }]
				})
			},
			correctionScreen: { visible: true, showDetailsState },
			validationBar: {
				visible: true,
				expanded: validationBarExpanded,
				currentMessageKey: undefined
			}
		};

		const data: EngineStore.DataState = {
			dirty: true,
			document: { root: { F1: 1, G1R: [{ F1R1: 1, G1R2: {} }] } }
		};

		return setupConnectedFormEngineWithRtl({
			models,
			ui,
			data,
			dispatchConfig
		});
	}
});
