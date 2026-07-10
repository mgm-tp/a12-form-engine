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
import { mock } from "node:test";
import type { Mock } from "node:test";

import type { PropsWithChildren } from "react";

import { query } from "@com.mgmtp.a12.devtools/react";
import { NavigationContentboxContext } from "@com.mgmtp.a12.widgets/widgets-core";
import type { SizeDetectorProps } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Models } from "../../../../back-end/store/internal/store.js";
import type { DispatchConfiguration } from "../../../../view/index.js";
import { defaultMapDispatchToProps } from "../../../../view/index.js";
import { mouseEventMock } from "../../../rtl-utils/mock-utils.js";
import { createDocumentPath } from "../../../utils/createDocumentPath.js";
import { createModelPath } from "../../../utils/createModelPath.js";
import { setupContentBoxRendererWithRtl } from "../../../utils/setup.js";
import { setupModelsFixture } from "../../../utils/setupFixture.js";

describe("api.view.content-box", () => {
	const models = setupModelsFixture("buttons");
	const detachedRepeatModels = setupModelsFixture("repeat", "detached");

	type SetupOptions = {
		readonly size?: SizeDetectorProps.Size;
		readonly withContext?: boolean;
		readonly backButtonSpy?: Mock<() => unknown>;
		readonly repeatOpened: boolean;
		readonly dispatchConfig?: DispatchConfiguration;
	};

	function setup(options: SetupOptions) {
		const NavigationBoxContext = (props: PropsWithChildren) => (
			<NavigationContentboxContext.Provider
				value={{
					onBackButtonClicked: options.backButtonSpy
				}}
			>
				{props.children}
			</NavigationContentboxContext.Provider>
		);
		return setupContentBoxRendererWithRtl({
			size: options.size,
			models: detachedRepeatModels,
			dispatchConfig: options.dispatchConfig,
			AdditionalWrapper: options.withContext ? NavigationBoxContext : undefined,
			ui: {
				screenLocation: options.repeatOpened
					? [
							{
								path: [],
								locationPath: []
							},
							{
								path: createDocumentPath(["Root"], ["Nested_L1"]),
								locationPath: createModelPath(
									"SortingAndFiltering",
									"sec1",
									"inline-repeat-Nested_L1",
									"inline-repeat-Nested_L1-detail-screen"
								)
							}
						]
					: undefined
			}
		});
	}

	describe("small devices", () => {
		describe("if a detached-repeat details screen is opened", () => {
			describe("and a NavigationContentboxContext with a 'onBackButtonClicked' key is given", () => {
				it("renders a back-button which closes the screen", () => {
					const defaultConfig = defaultMapDispatchToProps(mock.fn());
					const dispatchConfig = {
						...defaultConfig.eventHandlers,
						repeat: {
							...defaultConfig.eventHandlers.repeat,
							onLeaveDetachedRepeatRow: mock.fn()
						}
					};

					const { widgetMap } = setup({
						size: "sm",
						withContext: true,
						repeatOpened: true,
						dispatchConfig
					});

					const props = query(widgetMap.Button).withProp("title", "Back").props();

					props.onClick?.(mouseEventMock);

					strictEqual(dispatchConfig.repeat.onLeaveDetachedRepeatRow.mock.callCount(), 1);
				});
			});

			describe("and no NavigationContentboxContext with a 'onBackButtonClicked' key is given", () => {
				it("renders no back-button ", () => {
					const { widgetMap } = setup({
						size: "sm",
						repeatOpened: true
					});

					query(widgetMap.Button).withProp("title", "Back").assertNotRendered();
				});
			});
		});

		describe("if no detached-repeat details screen is opened", () => {
			it("renders no back-button when none is given in the context", () => {
				const { widgetMap } = setup({
					size: "sm",
					repeatOpened: false
				});

				query(widgetMap.Button).withProp("title", "Back").assertNotRendered();
			});

			it("renders a back-button when one is given in the context", () => {
				const spy = mock.fn();
				const { widgetMap } = setup({
					repeatOpened: false,
					withContext: true,
					backButtonSpy: spy
				});

				const props = query(widgetMap.Button).withProp("title", "Back").props();

				props.onClick?.(mouseEventMock);

				strictEqual(spy.mock.callCount(), 1);
			});
		});
	});

	describe("independent of device", () => {
		it("renders with the property role='form'", () => {
			const { widgetMap } = setupContentBoxRendererWithRtl({ models });

			const allProps = query(widgetMap.ActionContentbox).propsHistory();
			allProps.forEach(props => {
				strictEqual(props.role, "form");
			});
		});

		describe("given a label is defined for the model", () => {
			it("renders with the property aria-label having the label from the model", () => {
				const modelsWithFormModelWithLabel: Models = {
					...models,
					formModel: {
						...models.formModel,
						header: {
							...models.formModel.header,
							labels: [{ locale: "en", text: "test" }]
						}
					}
				};

				const { widgetMap } = setupContentBoxRendererWithRtl({
					models: modelsWithFormModelWithLabel
				});

				const props = query(widgetMap.ActionContentbox).props();
				strictEqual(props.ariaLabel, "test");
			});
		});

		describe("given no label is defined for the model", () => {
			it("renders without the property aria-label", () => {
				const modelsWithFormModelWithoutLabel: Models = {
					...models,
					formModel: {
						...models.formModel,
						header: {
							...models.formModel.header,
							labels: []
						}
					}
				};

				const { widgetMap } = setupContentBoxRendererWithRtl({
					models: modelsWithFormModelWithoutLabel
				});

				const props = query(widgetMap.ActionContentbox).props();
				strictEqual(props.ariaLabel, undefined);
			});
		});
	});
});
