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
import { mock } from "node:test";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import { query, within } from "@com.mgmtp.a12.devtools/react";
import type {
	DocumentModel,
	EntityInstancePath
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import { DataRoles } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/data-roles.js";
import type { DropDownItem } from "@com.mgmtp.a12.widgets/widgets-core/lib/dropdown/main/template/dropdown.tpl.api.js";
import type { AutocompleteProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/autocomplete/main/autocomplete.api.js";
import type { MultiselectProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/multiselect/main/multiselect.api.js";

import type ExternalEnumerationProvider from "../../back-end/services/external-enumeration-provider.js";
import { Commands, Events } from "../../back-end/store/index.js";
import type { EngineStore } from "../../back-end/store/internal/store.js";
import type { WidgetMap } from "../../view/index.js";
import { DefaultComponentMap } from "../../view/internal/configuration/componentMap/DefaultComponentMap.js";

import { mockFunctions } from "../rtl-utils/mock-map.js";
import type { RtlRenderWrapper } from "../rtl-utils/render-wrapper.js";
import { MiddlewareHelpers } from "../utils/back-end-helpers.js";
import { DocumentHelpers } from "../utils/document-helpers.js";
import { RenderGroupFixture } from "../utils/rtl-render-group.js";
import { SetupHelpers } from "../utils/setup.js";
import { setupFixture, setupModelsFixture } from "../utils/setupFixture.js";
import {
	CONTROLS,
	DETACHED_REPEAT,
	EMBEDDED_REPEAT,
	INLINE_REPEAT
} from "../utils/test-model-helpers/controls.externalenumeration.js";
import { createModelPath } from "../utils/test-model-helpers/dependent-enumeration.js";
import { queryRadioItemsProps } from "../utils/test-model-helpers/radio-item-query.js";

const { loadData, createTestStore, createRepeatInstanceStateEntry } = SetupHelpers;

describe("unit.view.External enumeration", () => {
	const models = setupModelsFixture("controls.externalenumeration");

	const fixture = setupFixture(() => ({
		document: loadData("controls.externalenumeration", "data", models.documentModel)
	}));

	function setup(
		options: {
			widgetMap?: Partial<WidgetMap>;
			screenLocation?: EngineStore.ScreenState[];
			repeatFormModelPath?: ModelPath;
			orderPath?: ModelPath;
			expandedRowPath?: EntityInstancePath;
		} = {}
	): Promise<RtlRenderWrapper> {
		const componentMap = mockFunctions(DefaultComponentMap);
		return SetupHelpers.setupFormEngineRendererWithRtlAsync({
			componentMap,
			models,
			data: { document: fixture.document },
			ui: {
				screenLocation: [
					{
						locationPath: [{ elementName: "Screen" }],
						path: [],
						repeatInstanceState: {
							...(options.repeatFormModelPath
								? {
										[ModelPath.toString(options.repeatFormModelPath)]: {
											page: 1,
											expandedRowPath: options.expandedRowPath ? options.expandedRowPath : undefined
										}
									}
								: {})
						}
					},
					...(options.screenLocation ? options.screenLocation : [])
				],
				backup: [{ document: fixture.document, messages: {} }],
				repeatStaticState: {
					...(options.repeatFormModelPath
						? {
								[ModelPath.toString(options.repeatFormModelPath)]: {
									sortingState: options.orderPath
										? {
												orderPath: options.orderPath,
												sorting: "asc" as const
											}
										: undefined
								}
							}
						: {})
				}
			},
			config: {
				widgetMap: options.widgetMap,
				externalEnumerationProvider
			}
		});
	}
	describe("Controls", () => {
		const { it, render } = RenderGroupFixture(setup);
		describe("Given an external enumeration with exposition compact", () => {
			it("renders a Select enumeration control and uses the given enumeration provider", async () => {
				const input = query(render.wrapper.widgetMap.Select)
					.withId(CONTROLS.ID_EXTERNAL_ENUM_COMPACT)
					.props();

				const items = input.items;
				strictEqual(items.length, 4);
				strictEqual(items[1].value, "Munich_key");
				strictEqual(items[2].value, "Berlin_key");
				strictEqual(items[3].value, "Cologne_key");
				strictEqual(items[1].label, "Munich");
				strictEqual(items[2].label, "Berlin");
				strictEqual(items[3].label, "Cologne");
			});
		});

		describe("Given an external enumeration with exposition autocomplete and custom values allowed", () => {
			it("renders a DropDown enumeration control with allowAddingNewItem=true and uses the given enumeration provider", async () => {
				const input = query(render.wrapper.widgetMap.Autocomplete)
					.withId(CONTROLS.ID_EXTERNAL_ENUM_AUTOCOMPLETE)
					.props();

				strictEqual(input.allowAddingNewItem, true);

				const items = input.items as DropDownItem[];
				strictEqual(items.length, 3);
				strictEqual(items[0].label, "Munich");
				strictEqual(items[1].label, "Berlin");
				strictEqual(items[2].label, "Cologne");
			});
		});

		describe("Given an external enumeration with exposition autocomplete and custom values allowed and case sensitive", () => {
			it(
				"renders a DropDown enumeration control with allowAddingNewItem=true and caseSensitive=true" +
					"and uses the given enumeration provider",
				async () => {
					const input = query(render.wrapper.widgetMap.Autocomplete)
						.withId(CONTROLS.ID_EXTERNAL_ENUM_CASE_SENSITIVE)
						.props();

					strictEqual(input.caseSensitive, true);

					const items = input.items as DropDownItem[];
					strictEqual(items.length, 3);
					strictEqual(items[0].label, "Munich");
					strictEqual(items[1].label, "Berlin");
					strictEqual(items[2].label, "Cologne");
				}
			);
		});

		describe("Given an external enumeration with exposition full", () => {
			it("renders a radio button group and uses the given enumeration provider", async () => {
				const items = queryRadioItemsProps(render.wrapper.widgetMap.RadioItem).withDataTestIdPrefix(
					CONTROLS.ID_EXTERNAL_ENUM_FULL
				);

				strictEqual(items.length, 3);
				strictEqual(items[0].value, "Munich_key");
				strictEqual(items[1].value, "Berlin_key");
				strictEqual(items[2].value, "Cologne_key");
				strictEqual(items[0].label, "Munich");
				strictEqual(items[1].label, "Berlin");
				strictEqual(items[2].label, "Cologne");
			});
		});

		describe("Given an external enumeration with exposition inline", () => {
			it("renders an inline radio button group and uses the given enumeration provider", async () => {
				const input = query(render.wrapper.widgetMap.Radio)
					.withId(CONTROLS.ID_EXTERNAL_ENUM_INLINE)
					.props();
				strictEqual(input.inline, true);

				const items = queryRadioItemsProps(render.wrapper.widgetMap.RadioItem).withDataTestIdPrefix(
					CONTROLS.ID_EXTERNAL_ENUM_INLINE
				);

				strictEqual(items.length, 3);
				strictEqual(items[0].value, "Munich_key");
				strictEqual(items[1].value, "Berlin_key");
				strictEqual(items[2].value, "Cologne_key");
				strictEqual(items[0].label, "Munich");
				strictEqual(items[1].label, "Berlin");
				strictEqual(items[2].label, "Cologne");
			});
		});

		describe("Given an expression which references a field which is displayed as external enumeration", () => {
			it("renders the expression correctly", async () => {
				const input = query(render.wrapper.componentMap.HtmlTextDiv)
					.withTestId(CONTROLS.ID_EXPRESSION)
					.props();
				strictEqual(input.content, "<p>Munich  </p>\n");
			});
		});

		describe("Given a multi select with an external enumeration", () => {
			it("renders a MultiSelect enumeration control that uses the given enumeration provider", async () => {
				const items = query(render.wrapper.widgetMap.MultiSelect)
					.withId(CONTROLS.ID_MULTI_SELECT_EXTERNAL_ENUM)
					.props().items as MultiselectProps.Item[];

				strictEqual(items.length, 3);
				strictEqual(items[0].id, "Munich_key");
				strictEqual(items[1].id, "Berlin_key");
				strictEqual(items[2].id, "Cologne_key");
				strictEqual(items[0].label, "Munich");
				strictEqual(items[1].label, "Berlin");
				strictEqual(items[2].label, "Cologne");
			});
		});
	});

	describe("Repeat", () => {
		describe("Inline", () => {
			const { it, render } = RenderGroupFixture(setup);

			describe("Given an external enumeration with exposition compact", () => {
				it("renders a Select enumeration control and uses the given enumeration provider", async () => {
					const input = query(render.wrapper.widgetMap.Select)
						.withId(INLINE_REPEAT.ID_EXTERNAL_ENUM_COMPACT)
						.props();

					const items = input.items;
					strictEqual(items.length, 4);
					strictEqual(items[1].value, "Munich_key");
					strictEqual(items[2].value, "Berlin_key");
					strictEqual(items[3].value, "Cologne_key");
					strictEqual(items[1].label, "Munich");
					strictEqual(items[2].label, "Berlin");
					strictEqual(items[3].label, "Cologne");
				});
			});

			describe("Given an external enumeration with exposition autocomplete and custom values allowed", () => {
				it("renders a DropDown enumeration control with allowAddingNewItem=true and uses the given enumeration provider", async () => {
					const input = query(render.wrapper.widgetMap.Autocomplete)
						.withId(INLINE_REPEAT.ID_EXTERNAL_ENUM_AUTOCOMPLETE)
						.props();

					strictEqual(input.allowAddingNewItem, true);

					const items = input.items as DropDownItem[];
					strictEqual(items.length, 3);
					strictEqual(items[0].label, "Munich");
					strictEqual(items[1].label, "Berlin");
					strictEqual(items[2].label, "Cologne");
				});
			});

			describe("Given an external enumeration with exposition autocomplete and custom values allowed and case sensitive", () => {
				it("renders a DropDown enumeration control with allowAddingNewItem=true and caseSensitive=true and uses the given enumeration provider", async () => {
					const input = query(render.wrapper.widgetMap.Autocomplete)
						.withId(INLINE_REPEAT.ID_EXTERNAL_ENUM_CASE_SENSITIVE)
						.props();

					strictEqual(input.caseSensitive, true);

					const items = input.items as DropDownItem[];
					strictEqual(items.length, 3);
					strictEqual(items[0].label, "Munich");
					strictEqual(items[1].label, "Berlin");
					strictEqual(items[2].label, "Cologne");
				});
			});

			describe("Given an external enumeration with exposition full", () => {
				it("renders a Select enumeration control and uses the given enumeration provider", async () => {
					const input = query(render.wrapper.widgetMap.Select)
						.withId(INLINE_REPEAT.ID_EXTERNAL_ENUM_FULL)
						.props();

					const items = input.items;
					strictEqual(items.length, 4);
					strictEqual(items[1].value, "Munich_key");
					strictEqual(items[2].value, "Berlin_key");
					strictEqual(items[3].value, "Cologne_key");
					strictEqual(items[1].label, "Munich");
					strictEqual(items[2].label, "Berlin");
					strictEqual(items[3].label, "Cologne");
				});
			});

			describe("Given an external enumeration with exposition inline", () => {
				it("renders a Select enumeration control and uses the given enumeration provider", async () => {
					const input = query(render.wrapper.widgetMap.Select)
						.withId(INLINE_REPEAT.ID_EXTERNAL_ENUM_INLINE)
						.props();

					const items = input.items;
					strictEqual(items.length, 4);
					strictEqual(items[1].value, "Munich_key");
					strictEqual(items[2].value, "Berlin_key");
					strictEqual(items[3].value, "Cologne_key");
					strictEqual(items[1].label, "Munich");
					strictEqual(items[2].label, "Berlin");
					strictEqual(items[3].label, "Cologne");
				});
			});

			describe("Given a multi select with an external enumeration", () => {
				it("renders a MultiSelect enumeration control that uses the given enumeration provider", async () => {
					const input = query(render.wrapper.widgetMap.MultiSelect)
						.withId(INLINE_REPEAT.ID_MULTI_SELECT_EXTERNAL_ENUM)
						.props();

					const items = input.items as MultiselectProps.Item[];
					strictEqual(items.length, 3);
					strictEqual(items[0].id, "Munich_key");
					strictEqual(items[1].id, "Berlin_key");
					strictEqual(items[2].id, "Cologne_key");
					strictEqual(items[0].label, "Munich");
					strictEqual(items[1].label, "Berlin");
					strictEqual(items[2].label, "Cologne");
				});
			});

			describe("on leave row: onLeaveRowMiddlewareFactory", () => {
				it("dispatches Commands.changeRepeatInstanceStateEntry for the parent screen with an entry for the new row", () => {
					const leaveRepeatRow = Events.Repeat.leaveRepeatRow({
						repeatFormModelPath: INLINE_REPEAT.repeatFormModelPath,
						rowPath: INLINE_REPEAT.firstRowPath
					});

					const repeatInstanceStateEntry = createRepeatInstanceStateEntry({
						newRow: {
							rowPath: INLINE_REPEAT.firstRowPath,
							rowState: "workingOn"
						}
					});

					const middlewareSpy = MiddlewareHelpers.createMiddlewareSpy();

					const store = createTestStore({
						storeConfig: {
							models: models,
							data: { dirty: false, document },
							ui: {
								backup: [{ document: fixture.document, messages: {} }],
								screenLocation: [
									{
										path: [],
										locationPath: createModelPath("Screen"),
										repeatInstanceState: {
											[ModelPath.toString(INLINE_REPEAT.repeatFormModelPath)]:
												repeatInstanceStateEntry
										}
									}
								]
							}
						},
						middlewares: [middlewareSpy.middleware]
					});

					store.dispatch(leaveRepeatRow);
					const expectedActions = [
						Commands.changeRepeatInstanceStateEntry({
							locationPath: createModelPath("Screen"),
							repeatFormModelPath: INLINE_REPEAT.repeatFormModelPath,
							entry: {
								...repeatInstanceStateEntry,
								newRow: {
									rowState: "recentlyAdded",
									rowPath: DocumentHelpers.createDocumentPath(["Root"], ["Config"], ["NewGroup_1"])
								}
							}
						})
					];
					MiddlewareHelpers.assertActions(middlewareSpy.spy, expectedActions);
				});
			});
		});

		describe("Inline", () => {
			describe("Sorting", () => {
				it("sorts the values by label", async () => {
					const Autocomplete: React.ComponentType<AutocompleteProps> = props => (
						<div>
							<input role="combobox" id={props.id} />
						</div>
					);
					const wrapper = await setup({
						widgetMap: { Autocomplete: mock.fn(Autocomplete) },
						orderPath: [
							...INLINE_REPEAT.repeatFormModelPath,
							...createModelPath(INLINE_REPEAT.sortingColumn)
						],
						repeatFormModelPath: INLINE_REPEAT.repeatFormModelPath
					});

					const repeat = within(wrapper.baseElement).getById(INLINE_REPEAT.ID_REPEAT);
					const rows = within(repeat).getAllByDataRole(DataRoles.Table.Body.Row);

					function autocompleteLabel(row: number): string | undefined {
						const cell = within(rows[row]).getAllByDataRole(DataRoles.Table.Body.Cell)[1];
						const input = within(cell).getByRole("combobox");
						const autocomplete = query(wrapper.widgetMap.Autocomplete).withId(input.id).props();
						const selected = autocomplete.value;
						return typeof selected === "string" ? selected : selected?.label;
					}

					strictEqual(autocompleteLabel(0), "Berlin");
					strictEqual(autocompleteLabel(1), "Cologne");
					strictEqual(autocompleteLabel(2), "Munich");
				});
			});
		});

		describe("Detached", () => {
			const renderDetached = () =>
				setup({
					screenLocation: [
						{
							locationPath: DETACHED_REPEAT.detailScreenLocationPath,
							path: DETACHED_REPEAT.detailScreenPath
						}
					]
				});

			const { it, render } = RenderGroupFixture(renderDetached);

			describe("Given an external enumeration with exposition compact", () => {
				it("renders a Select enumeration control and uses the given enumeration provider", async () => {
					const input = query(render.wrapper.widgetMap.Select)
						.withId(DETACHED_REPEAT.ID_EXTERNAL_ENUM_COMPACT)
						.props();

					const items = input.items;
					strictEqual(items.length, 4);
					strictEqual(items[1].value, "Munich_key");
					strictEqual(items[2].value, "Berlin_key");
					strictEqual(items[3].value, "Cologne_key");
					strictEqual(items[1].label, "Munich");
					strictEqual(items[2].label, "Berlin");
					strictEqual(items[3].label, "Cologne");
				});
			});

			describe("Given an external enumeration with exposition autocomplete and custom values allowed", () => {
				it("renders a DropDown enumeration control with allowAddingNewItem=true and uses the given enumeration provider", async () => {
					const input = query(render.wrapper.widgetMap.Autocomplete)
						.withId(DETACHED_REPEAT.ID_EXTERNAL_ENUM_AUTOCOMPLETE)
						.props();

					strictEqual(input.allowAddingNewItem, true);

					const items = input.items as DropDownItem[];
					strictEqual(items.length, 3);
					strictEqual(items[0].label, "Munich");
					strictEqual(items[1].label, "Berlin");
					strictEqual(items[2].label, "Cologne");
				});
			});

			describe("Given an external enumeration with exposition autocomplete and custom values allowed and case sensitive ", () => {
				it("renders a DropDown enumeration control with allowAddingNewItem=true and caseSensitive=true and uses the given enumeration provider", async () => {
					const input = query(render.wrapper.widgetMap.Autocomplete)
						.withId(DETACHED_REPEAT.ID_EXTERNAL_ENUM_CASE_SENSITIVE)
						.props();

					strictEqual(input.caseSensitive, true);

					const items = input.items as DropDownItem[];
					strictEqual(items.length, 3);
					strictEqual(items[0].label, "Munich");
					strictEqual(items[1].label, "Berlin");
					strictEqual(items[2].label, "Cologne");
				});
			});

			describe("Given a multi select with an external enumeration", () => {
				it("renders a MultiSelect enumeration control that uses the given enumeration provider", async () => {
					const input = query(render.wrapper.widgetMap.MultiSelect)
						.withId(DETACHED_REPEAT.ID_MULTI_SELECT_EXTERNAL_ENUM)
						.props();

					const items = input.items as MultiselectProps.Item[];
					strictEqual(items.length, 3);
					strictEqual(items[0].id, "Munich_key");
					strictEqual(items[1].id, "Berlin_key");
					strictEqual(items[2].id, "Cologne_key");
					strictEqual(items[0].label, "Munich");
					strictEqual(items[1].label, "Berlin");
					strictEqual(items[2].label, "Cologne");
				});
			});

			describe("on commit new row: leaveDetachedRepeatRowMiddlewareFactory", () => {
				it("dispatches Commands.changeRepeatInstanceStateEntry for the parent screen with an entry for the new row", () => {
					const repeatInstanceStateEntry = createRepeatInstanceStateEntry({
						newRow: {
							rowPath: DETACHED_REPEAT.detailScreenPath,
							rowState: "workingOn"
						}
					});

					const middlewareSpy = MiddlewareHelpers.createMiddlewareSpy();

					const store = createTestStore({
						storeConfig: {
							models: models,
							data: { dirty: false },
							ui: {
								backup: [{ document: fixture.document, messages: {} }],
								screenLocation: [
									{
										locationPath: [{ elementName: "Screen" }],
										path: [],
										repeatInstanceState: {
											[ModelPath.toString(DETACHED_REPEAT.repeatFormModelPath)]:
												repeatInstanceStateEntry
										}
									},
									{
										path: DETACHED_REPEAT.detailScreenPath,
										locationPath: DETACHED_REPEAT.detailScreenLocationPath
									}
								]
							}
						},
						middlewares: [middlewareSpy.middleware]
					});

					const action = Events.Repeat.leaveDetachedRepeatRow({ cancel: false });

					store.dispatch(action);
					const expectedCommand = Commands.changeRepeatInstanceStateEntry({
						locationPath: DETACHED_REPEAT.detailScreenLocationPath,
						repeatFormModelPath: DETACHED_REPEAT.repeatFormModelPath,
						entry: {
							...repeatInstanceStateEntry,
							newRow: repeatInstanceStateEntry.newRow
								? {
										...repeatInstanceStateEntry.newRow,
										rowState: "recentlyAdded"
									}
								: undefined
						}
					});

					MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommand);
				});
			});
		});

		describe("Embedded", () => {
			const renderEmbeddedState = () =>
				setup({
					expandedRowPath: EMBEDDED_REPEAT.repeatableGroupPath,
					repeatFormModelPath: EMBEDDED_REPEAT.repeatFormModelPath
				});

			const { it, render } = RenderGroupFixture(renderEmbeddedState);

			describe("Given an external enumeration with exposition compact", () => {
				it("renders a Select enumeration control and uses the given enumeration provider", async () => {
					const input = query(render.wrapper.widgetMap.Select)
						.withId(EMBEDDED_REPEAT.ID_EXTERNAL_ENUM_COMPACT)
						.props();

					const items = input.items;
					strictEqual(items.length, 4);
					strictEqual(items[1].value, "Munich_key");
					strictEqual(items[2].value, "Berlin_key");
					strictEqual(items[3].value, "Cologne_key");
					strictEqual(items[1].label, "Munich");
					strictEqual(items[2].label, "Berlin");
					strictEqual(items[3].label, "Cologne");
				});
			});

			describe("Given an external enumeration with exposition autocomplete and custom values allowed", () => {
				it("renders a DropDown enumeration control with allowAddingNewItem=true and uses the given enumeration provider", async () => {
					const input = query(render.wrapper.widgetMap.Autocomplete)
						.withId(EMBEDDED_REPEAT.ID_EXTERNAL_ENUM_AUTOCOMPLETE)
						.props();

					strictEqual(input.allowAddingNewItem, true);

					const items = input.items as DropDownItem[];
					strictEqual(items.length, 3);
					strictEqual(items[0].label, "Munich");
					strictEqual(items[1].label, "Berlin");
					strictEqual(items[2].label, "Cologne");
				});
			});

			describe("Given an external enumeration with exposition autocomplete and custom values allowed and case sensitive ", () => {
				it(
					"renders a DropDown enumeration control with allowAddingNewItem=true and caseSensitive=true " +
						"and uses the given enumeration provider",
					async () => {
						const input = query(render.wrapper.widgetMap.Autocomplete)
							.withId(EMBEDDED_REPEAT.ID_EXTERNAL_ENUM_CASE_SENSITIVE)
							.props();

						strictEqual(input.caseSensitive, true);

						const items = input.items as DropDownItem[];
						strictEqual(items.length, 3);
						strictEqual(items[0].label, "Munich");
						strictEqual(items[1].label, "Berlin");
						strictEqual(items[2].label, "Cologne");
					}
				);
			});

			describe("Given a multi select with an external enumeration", () => {
				it("renders a MultiSelect enumeration control that uses the given enumeration provider", async () => {
					const input = query(render.wrapper.widgetMap.MultiSelect)
						.withId(EMBEDDED_REPEAT.ID_MULTI_SELECT_EXTERNAL_ENUM)
						.props();

					const items = input.items as MultiselectProps.Item[];
					strictEqual(items.length, 3);
					strictEqual(items[0].id, "Munich_key");
					strictEqual(items[1].id, "Berlin_key");
					strictEqual(items[2].id, "Cologne_key");
					strictEqual(items[0].label, "Munich");
					strictEqual(items[1].label, "Berlin");
					strictEqual(items[2].label, "Cologne");
				});
			});

			describe("on close expanded row: onCloseEmbeddedRepeatRowMiddleware", () => {
				it("dispatches Commands.changeRepeatInstanceStateEntry for the parent screen with an entry for the new row", () => {
					const repeatInstanceStateEntry = createRepeatInstanceStateEntry({
						newRow: {
							rowPath: EMBEDDED_REPEAT.repeatableGroupPath,
							rowState: "workingOn"
						}
					});

					const middlewareSpy = MiddlewareHelpers.createMiddlewareSpy();

					const store = createTestStore({
						storeConfig: {
							models: models,
							data: { dirty: false },
							ui: {
								backup: [{ document: fixture.document, messages: {} }],
								screenLocation: [
									{
										locationPath: [{ elementName: "Screen" }],
										path: [],
										repeatInstanceState: {
											[ModelPath.toString(EMBEDDED_REPEAT.repeatFormModelPath)]: {
												...repeatInstanceStateEntry,
												expandedRowPath: EMBEDDED_REPEAT.repeatableGroupPath
											}
										}
									}
								]
							}
						},
						middlewares: [middlewareSpy.middleware]
					});

					const action = Events.Repeat.closeEmbeddedRepeatRow({
						repeatFormModelPath: EMBEDDED_REPEAT.repeatFormModelPath
					});

					store.dispatch(action);
					const expectedCommand = Commands.changeRepeatInstanceStateEntry({
						locationPath: [{ elementName: "Screen" }],
						repeatFormModelPath: EMBEDDED_REPEAT.repeatFormModelPath,
						entry: {
							...repeatInstanceStateEntry,
							newRow: repeatInstanceStateEntry.newRow
								? {
										...repeatInstanceStateEntry.newRow,
										rowState: "recentlyAdded"
									}
								: undefined
						}
					});

					MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommand);
				});
			});

			describe("on commit new row: leaveDetachedRepeatRowMiddleware", () => {
				it("dispatches Commands.changeRepeatInstanceStateEntry for the parent screen with an entry for the new row", () => {
					const repeatInstanceStateEntry = createRepeatInstanceStateEntry({
						newRow: {
							rowPath: DETACHED_REPEAT.detailScreenPath,
							rowState: "workingOn"
						}
					});

					const middlewareSpy = MiddlewareHelpers.createMiddlewareSpy();

					const store = createTestStore({
						storeConfig: {
							models: models,
							data: { dirty: false },
							ui: {
								backup: [{ document, messages: {} }],
								screenLocation: [
									{
										locationPath: [{ elementName: "Screen" }],
										path: [],
										repeatInstanceState: {
											[ModelPath.toString(DETACHED_REPEAT.repeatFormModelPath)]:
												repeatInstanceStateEntry
										}
									},
									{
										path: DETACHED_REPEAT.detailScreenPath,
										locationPath: DETACHED_REPEAT.detailScreenLocationPath
									}
								]
							}
						},
						middlewares: [middlewareSpy.middleware]
					});

					const action = Events.Repeat.leaveDetachedRepeatRow({});

					store.dispatch(action);
					const expectedCommand = Commands.changeRepeatInstanceStateEntry({
						locationPath: DETACHED_REPEAT.detailScreenLocationPath,
						repeatFormModelPath: DETACHED_REPEAT.repeatFormModelPath,
						entry: {
							...repeatInstanceStateEntry,
							newRow: repeatInstanceStateEntry.newRow
								? {
										...repeatInstanceStateEntry.newRow,
										rowState: "recentlyAdded"
									}
								: undefined
						}
					});

					MiddlewareHelpers.assertAction(middlewareSpy.spy, expectedCommand);
				});
			});
		});
	});
});

const externalEnumerationProvider: ExternalEnumerationProvider =
	(): DocumentModel.ReadonlyObjectMap<{ [key: string]: string | undefined }> => {
		return {
			Munich_key: { en: "Munich" },
			Berlin_key: { en: "Berlin" },
			Cologne_key: { en: "Cologne" }
		};
	};
