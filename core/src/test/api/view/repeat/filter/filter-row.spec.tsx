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

import { deepStrictEqual, ok, strictEqual } from "node:assert/strict";
import type { Mock } from "node:test";
import { mock } from "node:test";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import { query, within } from "@com.mgmtp.a12.devtools/react";
import type { ButtonProps } from "@com.mgmtp.a12.widgets/widgets-core";

import { UiId } from "../../../../../back-end/utils/internal/generateUiId.js";
import type { DispatchConfiguration } from "../../../../../view/index.js";
import { defaultMapDispatchToProps, DefaultWidgetMap } from "../../../../../view/index.js";
import { toggleFilterButtonTestId } from "../../../../../view/internal/components/form-engine/repeat/components/tableComponentRenderers.js";
import { BufferedTextLine } from "../../../../../view/internal/components/widgets/form-engine/buffered-text-line.js";
import type { ComponentMap } from "../../../../../view/internal/configuration/componentMap/component-map.js";
import { DefaultComponentMap } from "../../../../../view/internal/configuration/componentMap/DefaultComponentMap.js";
import { ACTION_CELL, MESSAGE, TABLE_BODY, TABLE_HEAD } from "../../../../rtl-utils/data-roles.js";
import { getWidgetMocks } from "../../../../rtl-utils/getWidgetMocks.js";
import { mouseEventMock } from "../../../../rtl-utils/mock-utils.js";
import type { RtlRenderWrapper } from "../../../../rtl-utils/render-wrapper.js";
import { createModelPath } from "../../../../utils/createModelPath.js";
import { DisableMockComponents } from "../../../../utils/disable-mocks.js";
import type { Context } from "../../../../utils/rtl-render-group.js";
import { RenderGroupFixture } from "../../../../utils/rtl-render-group.js";
import { loadData, setupConnectedFormEngineWithRtlAsync } from "../../../../utils/setup.js";
import { setupFixture, setupModelsFixture } from "../../../../utils/setupFixture.js";
import { IR } from "../../../../utils/test-model-helpers/inline.repeat.js";

import { createUIState, REPEAT_MODEL_PATH } from "./filter.utils.js";

describe("api.view.repeat", () => {
	describe("Filter Row", () => {
		const COLUMN_NAME = IR.SortingAndFiltering.ID_L1_STRING_COLUMN;
		const REPEAT_PATH = createModelPath(...REPEAT_MODEL_PATH);
		const models = setupModelsFixture("repeat", "inline");
		const fixture = setupFixture(() => ({
			document: loadData("repeat", "data", models.documentModel)
		}));

		const getRepeat: (start: HTMLElement) => HTMLElement = start =>
			within(start).getById(IR.SortingAndFiltering.ID_REPEAT);

		it("should show correct placeholder for repeat with active filters and no existing rows", async () => {
			const wrapper = await setupVirtualDevAppForFilterRow({
				filterRowOpen: false,
				containsFilter: true,
				filterValue: "abc",
				dispatchConfig: undefined,
				withEmptyDocument: true
			});

			const repeat = getRepeat(wrapper.baseElement);
			const body = within(repeat).getByDataRole(TABLE_BODY);
			const message = within(body).queryByDataRole(MESSAGE);
			strictEqual(message?.textContent, "There are no entries yet.");
		});

		describe("if rows exist, but all are filtered", () => {
			for (const filterRowOpen of [false, true]) {
				const state = filterRowOpen ? "shown" : "hidden";
				it(`should show a message if the filter row is ${state}`, async () => {
					const wrapper = await setupVirtualDevAppForFilterRow({
						filterRowOpen,
						containsFilter: true,
						filterValue: "abc"
					});

					const repeat = getRepeat(wrapper.baseElement);
					const body = within(repeat).getByDataRole(TABLE_BODY);
					const message = within(body).queryByDataRole(MESSAGE);
					strictEqual(message?.textContent, "No results found");
				});
			}
		});

		describe("if the repeat state contains a filter and filterRowOpen: true", () => {
			const dispatchConfig = registerDispatchMocks();
			const { it, render } = RenderGroupFixture(() =>
				setupVirtualDevAppForFilterRow({
					filterRowOpen: true,
					containsFilter: true,
					filterValue: "Row 2",
					dispatchConfig
				})
			);

			it("shows a filter button with title: Close filter", () => {
				assertFilterButtonTitle(render.wrapper, 0, "Close filter");
			});

			it("will show the filter row", () => {
				const uiId = UiId.generateForFieldOverviewColumnFilter({
					id: IR.SortingAndFiltering.ID_L1_STRING_COLUMN
				});
				within(getRepeat(render.wrapper.baseElement)).getById(uiId);
			});

			it("filters the rows", () => {
				const tbody = within(getRepeat(render.wrapper.baseElement)).getByDataRole(TABLE_BODY);
				const bodyRows = within(tbody).getAllByRole("row");
				strictEqual(bodyRows?.length, 1);
			});

			it("shows no message if not all rows were filtered out", () => {
				const messages = within(getRepeat(render.wrapper.baseElement)).queryAllByDataRole(MESSAGE);
				ok(messages.length === 0);
			});

			it("shows a clear filter button with title: Clear filter", () => {
				assertFilterButtonTitle(render.wrapper, 1, "Clear filter");
			});

			it(
				"calls the repeat.onFilterValueChange function of the DispatchConfiguration" +
					" when the filter value input is not empty",
				() => {
					const wrapper = render.wrapper;

					const uiId = UiId.generateForFieldOverviewColumnFilter({
						id: IR.SortingAndFiltering.ID_L1_STRING_COLUMN
					});
					const input = query(wrapper.componentMap.BufferedTextLine).withId(uiId).props();

					const newFilterValue = "123";

					input.onValueSubmit(newFilterValue);
					strictEqual(dispatchConfig.repeat.onFilterValueChange.mock.callCount(), 1);
					deepStrictEqual(dispatchConfig.repeat.onFilterValueChange.mock.calls[0].arguments, [
						REPEAT_PATH,
						COLUMN_NAME,
						{
							filterValue: newFilterValue
						}
					]);
				}
			);

			it("calls the repeat.onClearFilters function of the DispatchConfiguration after clicking the clear filter button", () => {
				const wrapper = render.wrapper;

				const testId = `${ModelPath.toString(IR.SortingAndFiltering.repeatFormModelPath)}-clear_filter`;
				const clearFilterButton = query(wrapper.widgetMap.Button).withTestId(testId).props();

				clearFilterButton.onClick?.(mouseEventMock);

				strictEqual(dispatchConfig.repeat.onClearFilters.mock.callCount(), 1);
			});

			describeOnShowFilterTest({ it, render, dispatchConfig }, false);
		});

		describe("if the repeat state contains a filter and filterRowOpen: false", () => {
			const dispatchConfig = registerDispatchMocks();
			const { it, render } = RenderGroupFixture(() =>
				setupVirtualDevAppForFilterRow({
					filterRowOpen: false,
					containsFilter: true,
					filterValue: "Row 2",
					dispatchConfig
				})
			);

			it("shows a filter button with title: Open filter", () => {
				assertFilterButtonTitle(render.wrapper, 0, "Open filter");
			});

			it("will not show the filter row", () => {
				const uiId = UiId.generateForFieldOverviewColumnFilter({
					id: IR.SortingAndFiltering.ID_L1_STRING_COLUMN
				});
				strictEqual(within(getRepeat(render.wrapper.baseElement)).queryById(uiId), null);
			});

			it("filters the rows", () => {
				const tbody = within(getRepeat(render.wrapper.baseElement)).getByDataRole(TABLE_BODY);
				const bodyRows = within(tbody).getAllByRole("row");
				strictEqual(bodyRows?.length, 1);
			});

			it("shows no message if not all rows were filtered out", () => {
				const messages = within(getRepeat(render.wrapper.baseElement)).queryAllByDataRole(MESSAGE);
				strictEqual(messages.length, 0);
			});

			describeOnShowFilterTest({ it, render, dispatchConfig }, true);
		});

		describe("if the repeat state contains no filter and filterRowOpen: true", () => {
			it("shows a filter button with title: Close filter", async () => {
				const wrapper = await setupVirtualDevAppForFilterRow({
					filterRowOpen: true,
					containsFilter: false
				});
				assertFilterButtonTitle(wrapper, 0, "Close filter");
			});
		});

		describe("if the repeat state contains no filter and filterRowOpen: false", () => {
			it("shows a filter button with title: Open filter", async () => {
				const wrapper = await setupVirtualDevAppForFilterRow({
					filterRowOpen: false,
					containsFilter: false
				});
				assertFilterButtonTitle(wrapper, 0, "Open filter");
			});
		});

		function describeOnShowFilterTest(
			renderContext: Context & { dispatchConfig: DispatchMocks },
			expectedResult: boolean
		): void {
			const { it, render } = renderContext;
			it(
				"calls the repeat.onShowFilter function of the DispatchConfiguration " +
					"with opened=true after clicking the filter button",
				() => {
					const wrapper = render.wrapper;

					const testId = toggleFilterButtonTestId(IR.SortingAndFiltering.repeatFormModelPath);
					const toggleFilterButton = query(wrapper.widgetMap.Button).withTestId(testId).props();

					toggleFilterButton.onClick?.(mouseEventMock);

					strictEqual(renderContext.dispatchConfig.repeat.onShowFilter.mock.callCount(), 1);
					deepStrictEqual(
						renderContext.dispatchConfig.repeat.onShowFilter.mock.calls[0].arguments,
						[REPEAT_PATH, expectedResult]
					);
				}
			);
		}

		function assertFilterButtonTitle(wrapper: RtlRenderWrapper, row: number, title: string): void {
			const thead = within(getRepeat(wrapper.baseElement)).getByDataRole(TABLE_HEAD);
			const filterRow = within(thead).getAllByRole("row")[row];
			const actionCell = filterRow.querySelector<HTMLElement>(`[data-type="${ACTION_CELL}"]`);
			const filterButton = actionCell ? within(actionCell).getByRole("button") : undefined;
			strictEqual(filterButton?.title, title);
		}

		type StubbedFunctions =
			"onClearFilters" | "onFilterParseError" | "onFilterValueChange" | "onShowFilter";

		type RepeatDispatchMocks = DispatchConfiguration.Repeat &
			Record<StubbedFunctions, Mock<() => unknown>>;

		type DispatchMocks = DispatchConfiguration & {
			repeat: DispatchConfiguration.Repeat & RepeatDispatchMocks;
		};

		function registerDispatchMocks(): DispatchMocks {
			const stubbedDispatch = defaultMapDispatchToProps(mock.fn());

			const spys = {
				onClearFilters: mock.fn(),
				onFilterParseError: mock.fn(),
				onFilterValueChange: mock.fn(),
				onShowFilter: mock.fn()
			};

			return {
				...stubbedDispatch.eventHandlers,
				repeat: {
					...stubbedDispatch.eventHandlers.repeat,
					...spys
				}
			};
		}

		interface SetupVirtualDevAppForFilterRowParams {
			filterRowOpen: boolean;
			containsFilter: boolean;
			filterValue?: string;
			dispatchConfig?: DispatchConfiguration;
			withEmptyDocument?: boolean;
		}

		function setupVirtualDevAppForFilterRow(
			params: SetupVirtualDevAppForFilterRowParams
		): Promise<RtlRenderWrapper> {
			const { filterRowOpen, containsFilter, filterValue, dispatchConfig, withEmptyDocument } =
				params;

			// add title prop
			const ButtonMock: React.ComponentType<ButtonProps> = props => (
				<button title={props.title}>
					{props.label}
					{props.icon}
				</button>
			);
			const widgetMap = DisableMockComponents.components(() => DefaultWidgetMap)(() => ({
				...getWidgetMocks(),
				Button: mock.fn(ButtonMock)
			}));

			const componentMap: ComponentMap = {
				...DefaultComponentMap,
				BufferedTextLine: mock.fn(BufferedTextLine)
			};

			return setupConnectedFormEngineWithRtlAsync({
				componentMap,
				config: {
					widgetMap
				},
				models,
				data: { document: withEmptyDocument ? {} : fixture.document },
				ui: {
					...createUIState({
						filterRowOpen,
						filters:
							containsFilter && filterValue
								? {
										[COLUMN_NAME]: {
											columnPath: createModelPath(...REPEAT_MODEL_PATH, COLUMN_NAME),
											filter: {
												filterValue
											}
										}
									}
								: undefined
					}),
					backup: location ? [{ document: {}, messages: {} }] : undefined
				},
				dispatchConfig
			});
		}
	});
});
