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

import { ok, strictEqual } from "node:assert/strict";

import { userEvent } from "@testing-library/user-event";
import type { ChangeEvent } from "react";
import { act } from "react";
import type { Action, Store } from "redux";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import { query, screen, within } from "@com.mgmtp.a12.devtools/react";

import type { EngineState, EngineStore } from "../../../back-end/store/index.js";
import { DataSelectors, UiStateSelectors } from "../../../back-end/store/index.js";
import type { WidgetMap } from "../../../view/index.js";
import { DefaultWidgetMap } from "../../../view/index.js";
import { mouseEventMock } from "../../rtl-utils/mock-utils.js";
import type { RtlRenderWrapper } from "../../rtl-utils/render-wrapper.js";
import { createModelPath } from "../../utils/createModelPath.js";
import { US_LOCALE } from "../../utils/localization.js";
import { findClickConfirm } from "../../utils/row-action-buttons.js";
import { createScreenLocationMock, setupConnectedFormEngineWithRtl } from "../../utils/setup.js";
import type { StoreConfig } from "../../utils/setup.js";
import { setupModelsFixture } from "../../utils/setupFixture.js";
import {
	DIRTY_SCREEN_NAME,
	DIRTY_STATE
} from "../../utils/test-model-helpers/control.dirty-state.js";

/**
 * TESTED BEHAVIOR
 * The store contains two dirty states that are used for the data and UI state
 * of the entire form. The default behavior of both states is that both are
 * initialized with false and can only turn true.
 * The data dirty state will turn true if a value changes on a top-level screen
 * or when changes on a detached repeat detail-screen are committed. It will not
 * return to false on backup restoring.
 * Detached repeat detail-screens have their own data dirty state, which only
 * applies to this screen. It is initialized with undefined and will turn true,
 * if a value changes on the corresponding detail-screen or when changes on a
 * nested detached repeat detail-screen are committed.
 * The ui dirty state will turn true if a conversion error occurred and will not
 * return to false if this error is resolved. In addition if
 * "earlyDetectDirtyControl" is enabled and some value is changed but not
 * submitted, the ui dirty state will also turn true.
 */

describe("api.features", () => {
	describe("dirty-states", () => {
		// eslint-disable-next-line mocha/no-setup-in-describe
		const models = setupModelsFixture("controls.dirty-states");
		// eslint-disable-next-line mocha/no-setup-in-describe
		const user = userEvent.setup();

		function setup(options: {
			storeConfig?: Partial<StoreConfig>;
			earlyDetectDirtyControl?: boolean;
			widgetMap?: Partial<WidgetMap>;
		}): {
			store: Store<EngineState> & { readonly dispatch: unknown };
			rtlWrapper: RtlRenderWrapper;
			widgetMap: WidgetMap;
		} {
			const { store, ...rtlWrapper } = setupConnectedFormEngineWithRtl({
				models,
				locale: US_LOCALE,
				data: {},
				config: {
					earlyDetectDirtyControl: options.earlyDetectDirtyControl,
					widgetMap: options.widgetMap
				},
				withWidgets: options.widgetMap ? true : undefined,
				...options.storeConfig
			});

			return {
				store,
				rtlWrapper,
				widgetMap: rtlWrapper.widgetMap
			};
		}

		function createChangeEventMock(value: string | boolean): ChangeEvent<HTMLInputElement> {
			return { target: { value } } as ChangeEvent<HTMLInputElement>;
		}

		describe("The data dirty-state", () => {
			function createRootScreenState(): EngineStore.ScreenState {
				return {
					path: [],
					locationPath: createModelPath(DIRTY_SCREEN_NAME),
					repeatInstanceState: {
						[ModelPath.toString(DIRTY_STATE.DR_FORM_MODEL_PATH)]: { page: 1 }
					}
				};
			}

			function createDetailScreenState(): EngineStore.ScreenState {
				return {
					path: DIRTY_STATE.REP_GROUP_DOCUMENT_PATH,
					locationPath: DIRTY_STATE.DR_LOCATION_PATH
				};
			}

			function createDirtyDetailScreenState(): EngineStore.ScreenState {
				return {
					path: DIRTY_STATE.REP_GROUP_DOCUMENT_PATH,
					locationPath: DIRTY_STATE.DR_LOCATION_PATH,
					dirty: true
				};
			}

			function createDirtyNestedDetailScreenState(): EngineStore.ScreenState {
				return {
					path: DIRTY_STATE.NESTED_REP_GROUP_DOCUMENT_PATH,
					locationPath: DIRTY_STATE.NESTED_DR_LOCATION_PATH,
					dirty: true
				};
			}

			describe("will turn true if a value changes on a top-level screen.", () => {
				// eslint-disable-next-line mocha/no-setup-in-describe
				testDataDirtyState({
					stateToBeTested: "data",
					createScreenLocation: createScreenLocationMock,
					expectedStateOnValueChange: { dataDirty: true }
				});
			});

			describe(
				"will not turn true if a value changes on a detached repeat detail screen, " +
					"but the screen's dirty-state will turn true.",
				() => {
					// eslint-disable-next-line mocha/no-setup-in-describe
					testDataDirtyState({
						stateToBeTested: "screen",
						createScreenLocation: () => [createRootScreenState(), createDetailScreenState()],
						expectedStateOnValueChange: {
							dataDirty: false,
							screenDirty: true
						}
					});
				}
			);

			it("will turn true if the changes on a detached repeat detail screen are committed.", async () => {
				const { widgetMap, store } = setup({
					storeConfig: {
						ui: { screenLocation: [createRootScreenState(), createDirtyDetailScreenState()] }
					},
					earlyDetectDirtyControl: false
				});

				assertDirtyState({
					store,
					expectedDataDirtyState: false,
					expectedScreenDirtyState: true
				});

				const button = query(widgetMap.Button).withId(DIRTY_STATE.DR_COMMIT_EDIT_BUTTON);

				await act(() => {
					button.props().onClick?.(mouseEventMock);
				});

				assertDirtyState({ store, expectedDataDirtyState: true });
			});

			it("will not turn true if the changes on a detached repeat detail screen are discarded.", async () => {
				const { rtlWrapper, store } = setup({
					storeConfig: {
						ui: {
							backup: [
								{
									document: {},
									messages: {}
								}
							],
							screenLocation: [createRootScreenState(), createDirtyDetailScreenState()]
						}
					},
					earlyDetectDirtyControl: false
				});

				assertDirtyState({
					store,
					expectedDataDirtyState: false,
					expectedScreenDirtyState: true
				});

				await findClickConfirm(rtlWrapper, DIRTY_STATE.DR_CANCEL_EDIT_BUTTON);

				assertDirtyState({ store, expectedDataDirtyState: false });
			});

			it(
				"will not turn true if the changes on a nested detached repeat detail screen are committed, " +
					"but the nesting screen's dirty-state will turn true.",
				async () => {
					const { widgetMap, store } = setup({
						storeConfig: {
							ui: {
								screenLocation: [
									createRootScreenState(),
									createDirtyDetailScreenState(),
									createDirtyNestedDetailScreenState()
								]
							}
						},
						earlyDetectDirtyControl: false
					});

					assertDirtyState({
						store,
						expectedDataDirtyState: false,
						expectedScreenDirtyState: true
					});

					const button = query(widgetMap.Button).withId(DIRTY_STATE.NESTED_DR_COMMIT_EDIT_BUTTON);

					await act(() => {
						button.props().onClick?.(mouseEventMock);
					});

					assertDirtyState({
						store,
						expectedDataDirtyState: false,
						expectedScreenDirtyState: true
					});
				}
			);

			it(
				"will not turn true if the changes on a nested detached repeat detail screen are discarded " +
					"and neither will the nesting screen's dirty-state.",
				async () => {
					const { rtlWrapper, store } = setup({
						storeConfig: {
							ui: {
								backup: [
									{
										document: {},
										messages: {}
									}
								],
								screenLocation: [
									createRootScreenState(),
									createDetailScreenState(),
									createDirtyNestedDetailScreenState()
								]
							}
						},
						earlyDetectDirtyControl: false
					});

					assertDirtyState({
						store,
						expectedDataDirtyState: false,
						expectedScreenDirtyState: true
					});

					await findClickConfirm(rtlWrapper, DIRTY_STATE.NESTED_DR_CANCEL_EDIT_BUTTON);

					assertDirtyState({ store, expectedDataDirtyState: false });
				}
			);

			function assertDirtyState(options: {
				store: Store<EngineState, Action>;
				expectedDataDirtyState: boolean;
				expectedScreenDirtyState?: boolean;
			}): void {
				const { store, expectedDataDirtyState, expectedScreenDirtyState } = options;

				strictEqual(
					DataSelectors.dirty()(store.getState()),
					expectedDataDirtyState,
					`Data dirty state is not ${expectedDataDirtyState}.`
				);
				strictEqual(
					UiStateSelectors.currentScreenLocation()(store.getState()).dirty,
					expectedScreenDirtyState,
					`Screen dirty state is not ${expectedScreenDirtyState}.`
				);
			}

			function testDataDirtyState(options: {
				stateToBeTested: "data" | "screen";
				createScreenLocation?: () => ReadonlyArray<EngineStore.ScreenState>;
				expectedStateOnValueChange: {
					dataDirty: boolean;
					screenDirty?: boolean;
				};
			}): void {
				const { stateToBeTested, createScreenLocation, expectedStateOnValueChange } = options;
				const screenLocation = createScreenLocation?.();

				it(
					`does not set the ${stateToBeTested} dirty state on touching the value of a string control, ` +
						`but the ${stateToBeTested} dirty state is set after submitting it`,
					async () => {
						const { store } = setup({
							storeConfig: {
								ui: { screenLocation }
							},
							earlyDetectDirtyControl: false,
							widgetMap: {
								TextField: DefaultWidgetMap.TextField
							}
						});

						assertDirtyState({ store, expectedDataDirtyState: false });

						const input = screen.getByLabelText("String Input");

						await user.click(input);
						await user.keyboard("a");

						assertDirtyState({ store, expectedDataDirtyState: false });

						await user.keyboard("[Tab]");

						assertDirtyState({
							store,
							expectedDataDirtyState: expectedStateOnValueChange.dataDirty,
							expectedScreenDirtyState: expectedStateOnValueChange.screenDirty
						});
					}
				);

				it(
					`does not set the ${stateToBeTested} dirty state on touching the value of a number control, ` +
						`but the ${stateToBeTested} dirty state is set after submitting it`,
					async () => {
						const { store } = setup({
							storeConfig: {
								ui: { screenLocation }
							},
							earlyDetectDirtyControl: false,
							widgetMap: {
								TextField: DefaultWidgetMap.TextField
							}
						});

						assertDirtyState({ store, expectedDataDirtyState: false });

						const input = await screen.getByLabelText("Number Input");

						await user.click(input);
						await user.keyboard("1");

						assertDirtyState({ store, expectedDataDirtyState: false });

						await user.keyboard("[Tab]");

						assertDirtyState({
							store,
							expectedDataDirtyState: expectedStateOnValueChange.dataDirty,
							expectedScreenDirtyState: expectedStateOnValueChange.screenDirty
						});
					}
				);

				it(`sets the ${stateToBeTested} dirty state on changing the value of a boolean control`, async () => {
					const { widgetMap, store } = setup({
						storeConfig: {
							ui: { screenLocation }
						},
						earlyDetectDirtyControl: false
					});

					assertDirtyState({ store, expectedDataDirtyState: false });

					// top level screen: checkbox
					const checkbox = query(widgetMap.Checkbox).withProp("label", "Boolean Input");
					if (checkbox.maybeProps()) {
						act(() => {
							checkbox.props().onChange?.(true, createChangeEventMock(true));
						});
					}

					// detached repeat detail screen: boolean select
					const select = query(widgetMap.Select).withProp("label", "Boolean Input");
					if (select.maybeProps()) {
						act(() => {
							select.props().onValueChanged?.("true");
						});
					}

					assertDirtyState({
						store,
						expectedDataDirtyState: expectedStateOnValueChange.dataDirty,
						expectedScreenDirtyState: expectedStateOnValueChange.screenDirty
					});
				});

				it(`sets the ${stateToBeTested} dirty state on changing the value of a confirm control`, async () => {
					const { widgetMap, store } = setup({
						storeConfig: {
							ui: { screenLocation }
						},
						earlyDetectDirtyControl: false
					});

					assertDirtyState({ store, expectedDataDirtyState: false });

					const checkbox = query(widgetMap.Checkbox).withProp("label", "Confirm Input");

					act(() => {
						checkbox.props().onChange?.(true, createChangeEventMock(true));
					});

					assertDirtyState({
						store,
						expectedDataDirtyState: expectedStateOnValueChange.dataDirty,
						expectedScreenDirtyState: expectedStateOnValueChange.screenDirty
					});
				});

				it(`sets the ${stateToBeTested} dirty state on changing the value of an enumeration control (compact)`, async () => {
					const { widgetMap, store } = setup({
						storeConfig: {
							ui: { screenLocation }
						},
						earlyDetectDirtyControl: false
					});

					assertDirtyState({ store, expectedDataDirtyState: false });

					const select = query(widgetMap.Select).withProp("label", "Enumeration Input (compact)");

					act(() => {
						select.props().onValueChanged?.("1");
					});

					assertDirtyState({
						store,
						expectedDataDirtyState: expectedStateOnValueChange.dataDirty,
						expectedScreenDirtyState: expectedStateOnValueChange.screenDirty
					});
				});

				it(`sets the ${stateToBeTested} dirty state on changing the value of an enumeration control (autocomplete)`, async () => {
					const { widgetMap, store } = setup({
						storeConfig: {
							ui: { screenLocation }
						},
						earlyDetectDirtyControl: false
					});

					assertDirtyState({ store, expectedDataDirtyState: false });

					const input = query(widgetMap.Autocomplete).withProp(
						"label",
						"Enumeration Input (autocomplete)"
					);

					act(() => {
						input.props().onValueChange?.("1");
					});

					assertDirtyState({
						store,
						expectedDataDirtyState: expectedStateOnValueChange.dataDirty,
						expectedScreenDirtyState: expectedStateOnValueChange.screenDirty
					});
				});

				it(`sets the ${stateToBeTested} dirty state on changing the value of an enumeration control (full)`, async () => {
					const { widgetMap, store } = setup({
						storeConfig: {
							ui: { screenLocation }
						},
						earlyDetectDirtyControl: false
					});

					assertDirtyState({ store, expectedDataDirtyState: false });

					const radio = query(widgetMap.Radio).withProp("label", "Enumeration Input (full)");

					act(() => {
						radio.props().onValueChanged?.("1");
					});

					assertDirtyState({
						store,
						expectedDataDirtyState: expectedStateOnValueChange.dataDirty,
						expectedScreenDirtyState: expectedStateOnValueChange.screenDirty
					});
				});

				it(`sets the ${stateToBeTested} dirty state on changing the value of an enumeration control (inline)`, async () => {
					const { widgetMap, store } = setup({
						storeConfig: {
							ui: { screenLocation }
						},
						earlyDetectDirtyControl: false
					});

					assertDirtyState({ store, expectedDataDirtyState: false });

					const radio = query(widgetMap.Radio).withProp("label", "Enumeration Input (inline)");

					await act(() => {
						radio.props().onValueChanged?.("1");
					});

					assertDirtyState({
						store,
						expectedDataDirtyState: expectedStateOnValueChange.dataDirty,
						expectedScreenDirtyState: expectedStateOnValueChange.screenDirty
					});
				});

				it(
					`does not set the ${stateToBeTested} dirty state on touching the value of a date control (input), ` +
						`but the ${stateToBeTested} dirty state is set after submitting it`,
					async () => {
						const { store } = setup({
							storeConfig: {
								ui: { screenLocation }
							},
							earlyDetectDirtyControl: false,
							widgetMap: {
								TextField: DefaultWidgetMap.TextField
							}
						});

						assertDirtyState({ store, expectedDataDirtyState: false });

						const input = screen.getByLabelText("Date Input");

						await user.click(input);
						await user.keyboard("01/01/1970");

						assertDirtyState({ store, expectedDataDirtyState: false });

						await user.keyboard("[Tab]");

						assertDirtyState({
							store,
							expectedDataDirtyState: expectedStateOnValueChange.dataDirty,
							expectedScreenDirtyState: expectedStateOnValueChange.screenDirty
						});
					}
				);

				it(`sets the ${stateToBeTested} dirty state on changing the value of a date control (picker)`, async () => {
					const { store, widgetMap } = setup({
						storeConfig: {
							ui: { screenLocation }
						},
						earlyDetectDirtyControl: false,
						widgetMap: {
							TextField: DefaultWidgetMap.TextField,
							Button: DefaultWidgetMap.Button
						}
					});

					assertDirtyState({ store, expectedDataDirtyState: false });

					const input = screen.getByRole("textbox", { name: "Date Input" });
					const inputWrapper = input.closest("div");
					ok(inputWrapper !== null);

					const datePickerButton = within(inputWrapper).getByRole("button");

					await user.click(datePickerButton);

					const datePicker = query(widgetMap.DatePicker);

					act(() => {
						datePicker.props().onChange?.(new Date());
					});

					assertDirtyState({
						store,
						expectedDataDirtyState: expectedStateOnValueChange.dataDirty,
						expectedScreenDirtyState: expectedStateOnValueChange.screenDirty
					});
				});

				it(
					`does not set the ${stateToBeTested} dirty state on touching the value of a date time control (input), ` +
						`but the ${stateToBeTested} dirty state is set after submitting it`,
					async () => {
						const { store } = setup({
							storeConfig: {
								ui: { screenLocation }
							},
							earlyDetectDirtyControl: false,
							widgetMap: {
								TextField: DefaultWidgetMap.TextField
							}
						});

						assertDirtyState({ store, expectedDataDirtyState: false });

						const input = screen.getByLabelText("Date Time Input");

						await user.click(input);
						await user.keyboard("01/01/1970 12:00 AM");

						assertDirtyState({ store, expectedDataDirtyState: false });

						await user.keyboard("[Tab]");

						assertDirtyState({
							store,
							expectedDataDirtyState: expectedStateOnValueChange.dataDirty,
							expectedScreenDirtyState: expectedStateOnValueChange.screenDirty
						});
					}
				);

				it(`sets the ${stateToBeTested} dirty state on changing the value of a date time control (picker)`, async () => {
					const { store, widgetMap } = setup({
						storeConfig: {
							ui: { screenLocation }
						},
						earlyDetectDirtyControl: false,
						widgetMap: {
							TextField: DefaultWidgetMap.TextField,
							Button: DefaultWidgetMap.Button
						}
					});

					assertDirtyState({ store, expectedDataDirtyState: false });

					const input = screen.getByRole("textbox", { name: "Date Time Input" });
					const inputWrapper = input.closest("div");
					ok(inputWrapper !== null);

					const datePickerButton = within(inputWrapper).getByRole("button");

					await user.click(datePickerButton);

					const dateTimePicker = query(widgetMap.DateTimePicker);

					await act(() => {
						dateTimePicker.props().onAccept?.(new Date());
					});

					assertDirtyState({
						store,
						expectedDataDirtyState: expectedStateOnValueChange.dataDirty,
						expectedScreenDirtyState: expectedStateOnValueChange.screenDirty
					});
				});

				it(
					`does not set the ${stateToBeTested} dirty state on touching the value of a time control (input), ` +
						`but the ${stateToBeTested} dirty state is set after submitting it`,
					async () => {
						const { store } = setup({
							storeConfig: {
								ui: { screenLocation }
							},
							earlyDetectDirtyControl: false,
							widgetMap: {
								TimePicker: DefaultWidgetMap.TimePicker
							}
						});

						assertDirtyState({ store, expectedDataDirtyState: false });

						const input = screen.getByRole("textbox", { name: "Time Input" });

						await user.click(input);
						await user.keyboard("12:00 AM");

						assertDirtyState({ store, expectedDataDirtyState: false });

						await user.keyboard("[Tab]");

						assertDirtyState({
							store,
							expectedDataDirtyState: expectedStateOnValueChange.dataDirty,
							expectedScreenDirtyState: expectedStateOnValueChange.screenDirty
						});
					}
				);

				it(`sets the ${stateToBeTested} dirty state on changing the value of a time control (picker)`, () => {
					const { store, widgetMap } = setup({
						storeConfig: {
							ui: { screenLocation }
						},
						earlyDetectDirtyControl: false
					});

					assertDirtyState({ store, expectedDataDirtyState: false });

					const timePicker = query(widgetMap.TimePicker).withProp("label", "Time Input");

					act(() => {
						timePicker.props().onChange?.(new Date());
					});

					assertDirtyState({
						store,
						expectedDataDirtyState: expectedStateOnValueChange.dataDirty,
						expectedScreenDirtyState: expectedStateOnValueChange.screenDirty
					});
				});
			}
		});

		describe("The ui dirty-state", () => {
			function assertUIDirtyState(options: {
				store: Store<EngineState, Action>;
				expectedUIDirtyState: boolean;
			}): void {
				const { store, expectedUIDirtyState } = options;
				strictEqual(
					UiStateSelectors.dirty()(store.getState()),
					expectedUIDirtyState,
					`UI dirty state is not ${expectedUIDirtyState}.`
				);
			}

			describe("will turn true if a conversion error occurred", () => {
				it("sets the ui dirty state on conversion error and does not change it back after resolving the error", async () => {
					const { store } = setup({
						earlyDetectDirtyControl: false,
						widgetMap: {
							TextField: DefaultWidgetMap.TextField
						}
					});

					assertUIDirtyState({ store, expectedUIDirtyState: false });

					const input = screen.getByRole("textbox", { name: "Number Input" });

					await user.click(input);
					await user.keyboard("a");

					assertUIDirtyState({ store, expectedUIDirtyState: false });

					await user.keyboard("[Tab]");

					assertUIDirtyState({ store, expectedUIDirtyState: true });

					await user.clear(input);

					await user.click(input);
					await user.keyboard("1");
					await user.keyboard("[Tab]");

					assertUIDirtyState({ store, expectedUIDirtyState: true });
				});
			});

			/**
			 * Controls for which this can not be tested because they do not support touched
			 * (because as soon as onChange is triggered the value is written to the document)
			 * Boolean (Checkbox)
			 * Confirm (Checkbox)
			 * all Enumeration inputs (Select, AutoComplete, Radio)
			 * Date input using the picker
			 * DateTime input using the picker
			 * Time input using the picker
			 * Attachment input
			 */
			describe("will turn true if earlyDetectDirtyControl is true and a value of a control is touched", () => {
				it("sets the ui dirty state on touching the value of a string control", async () => {
					const { store } = setup({
						earlyDetectDirtyControl: true,
						widgetMap: {
							TextField: DefaultWidgetMap.TextField
						}
					});

					assertUIDirtyState({ store, expectedUIDirtyState: false });

					const input = screen.getByRole("textbox", { name: "String Input" });

					await user.click(input);
					await user.keyboard("a");

					assertUIDirtyState({ store, expectedUIDirtyState: true });

					await user.keyboard("[Tab]");

					assertUIDirtyState({ store, expectedUIDirtyState: true });
				});

				it("sets the ui dirty state on touching the value of a number control", async () => {
					const { store } = setup({
						earlyDetectDirtyControl: true,
						widgetMap: {
							TextField: DefaultWidgetMap.TextField
						}
					});

					assertUIDirtyState({ store, expectedUIDirtyState: false });

					const input = screen.getByRole("textbox", { name: "Number Input" });

					await user.click(input);
					await user.keyboard("1");

					assertUIDirtyState({ store, expectedUIDirtyState: true });

					await user.keyboard("[Tab]");

					assertUIDirtyState({ store, expectedUIDirtyState: true });
				});

				it("sets the ui dirty state on touching the value of a date control (input)", async () => {
					const { store } = setup({
						earlyDetectDirtyControl: true,
						widgetMap: {
							TextField: DefaultWidgetMap.TextField
						}
					});

					assertUIDirtyState({ store, expectedUIDirtyState: false });

					const input = screen.getByRole("textbox", { name: "Date Input" });

					await user.click(input);
					await user.keyboard("01/01/1970");

					assertUIDirtyState({ store, expectedUIDirtyState: true });

					await user.keyboard("[Tab]");

					assertUIDirtyState({ store, expectedUIDirtyState: true });
				});

				it("sets the ui dirty state on touching the value of a date time control (input)", async () => {
					const { store } = setup({
						earlyDetectDirtyControl: true,
						widgetMap: {
							TextField: DefaultWidgetMap.TextField
						}
					});

					assertUIDirtyState({ store, expectedUIDirtyState: false });

					const input = screen.getByRole("textbox", { name: "Date Time Input" });

					await user.click(input);
					await user.keyboard("01/01/1970 12:00 AM");

					assertUIDirtyState({ store, expectedUIDirtyState: true });

					await user.keyboard("[Tab]");

					assertUIDirtyState({ store, expectedUIDirtyState: true });
				});

				it("sets the ui dirty state on touching the value of a time control", async () => {
					const { store } = setup({
						earlyDetectDirtyControl: true,
						widgetMap: {
							TimePicker: DefaultWidgetMap.TimePicker
						}
					});

					assertUIDirtyState({ store, expectedUIDirtyState: false });

					const input = screen.getByRole("textbox", { name: "Time Input" });

					await user.click(input);
					await user.keyboard("12:00 AM");

					assertUIDirtyState({ store, expectedUIDirtyState: true });

					await user.keyboard("[Tab]");

					assertUIDirtyState({ store, expectedUIDirtyState: true });
				});
			});

			describe("will not turn true if earlyDetectDirtyControl is false and a value of a control is touched", () => {
				it("does not set the ui dirty state on touching or submitting the value of a string control", async () => {
					const { store } = setup({
						earlyDetectDirtyControl: false,
						widgetMap: {
							TextField: DefaultWidgetMap.TextField
						}
					});

					assertUIDirtyState({ store, expectedUIDirtyState: false });

					const input = screen.getByLabelText("String Input");

					await user.click(input);
					await user.keyboard("a");

					assertUIDirtyState({ store, expectedUIDirtyState: false });

					await user.keyboard("[Tab]");

					assertUIDirtyState({ store, expectedUIDirtyState: false });
				});

				it("does not set the ui dirty state on touching or submitting the value of a number control", async () => {
					const { store } = setup({
						earlyDetectDirtyControl: false,
						widgetMap: {
							TextField: DefaultWidgetMap.TextField
						}
					});

					assertUIDirtyState({ store, expectedUIDirtyState: false });

					const input = screen.getByLabelText("Number Input");

					await user.click(input);
					await user.keyboard("1");

					assertUIDirtyState({ store, expectedUIDirtyState: false });

					await user.keyboard("[Tab]");

					assertUIDirtyState({ store, expectedUIDirtyState: false });
				});

				it("does not set the ui dirty state on changing the value of a boolean control", async () => {
					const { widgetMap, store } = setup({
						earlyDetectDirtyControl: false
					});

					assertUIDirtyState({ store, expectedUIDirtyState: false });

					const checkbox = query(widgetMap.Checkbox).withProp("label", "Boolean Input");

					await act(() => {
						checkbox.props().onChange?.(true, createChangeEventMock(true));
					});

					assertUIDirtyState({ store, expectedUIDirtyState: false });
				});

				it("does not set the ui dirty state on changing the value of a confirm control", async () => {
					const { widgetMap, store } = setup({
						earlyDetectDirtyControl: false
					});

					assertUIDirtyState({ store, expectedUIDirtyState: false });

					const checkbox = query(widgetMap.Checkbox).withProp("label", "Confirm Input");

					await act(() => {
						checkbox.props().onChange?.(true, createChangeEventMock(true));
					});

					assertUIDirtyState({ store, expectedUIDirtyState: false });
				});

				it("does not set the ui dirty state on changing the value of an enumeration control (compact)", async () => {
					const { widgetMap, store } = setup({
						earlyDetectDirtyControl: false
					});

					assertUIDirtyState({ store, expectedUIDirtyState: false });

					const select = query(widgetMap.Select).withProp("label", "Enumeration Input (compact)");

					await act(() => {
						select.props().onValueChanged?.("1");
					});

					assertUIDirtyState({ store, expectedUIDirtyState: false });
				});

				it("does not set the ui dirty state on changing the value of an enumeration control (autocomplete)", async () => {
					const { widgetMap, store } = setup({
						earlyDetectDirtyControl: false
					});

					assertUIDirtyState({ store, expectedUIDirtyState: false });

					const input = query(widgetMap.Autocomplete).withProp(
						"label",
						"Enumeration Input (autocomplete)"
					);

					await act(() => {
						input.props().onValueChange?.("1");
					});

					assertUIDirtyState({ store, expectedUIDirtyState: false });
				});

				it("does not set the ui dirty state on changing the value of an enumeration control (full)", async () => {
					const { widgetMap, store } = setup({
						earlyDetectDirtyControl: false
					});

					assertUIDirtyState({ store, expectedUIDirtyState: false });

					const radio = query(widgetMap.Radio).withProp("label", "Enumeration Input (full)");

					await act(() => {
						radio.props().onValueChanged?.("1");
					});

					assertUIDirtyState({ store, expectedUIDirtyState: false });
				});

				it("does not set the ui dirty state on changing the value of an enumeration control (inline)", () => {
					const { widgetMap, store } = setup({
						earlyDetectDirtyControl: false
					});

					assertUIDirtyState({ store, expectedUIDirtyState: false });

					const radio = query(widgetMap.Radio).withProp("label", "Enumeration Input (inline)");

					act(() => {
						radio.props().onValueChanged?.("1");
					});

					assertUIDirtyState({ store, expectedUIDirtyState: false });
				});

				it("does not set the ui dirty state on touching or submitting the value of a date control (input)", async () => {
					const { store } = setup({
						earlyDetectDirtyControl: false,
						widgetMap: {
							TextField: DefaultWidgetMap.TextField
						}
					});

					assertUIDirtyState({ store, expectedUIDirtyState: false });

					const input = screen.getByRole("textbox", { name: "Date Input" });

					await user.click(input);
					await user.keyboard("01/01/1970");

					assertUIDirtyState({ store, expectedUIDirtyState: false });

					await user.keyboard("[Tab]");

					assertUIDirtyState({ store, expectedUIDirtyState: false });
				});

				it("does not set the ui dirty state on changing the value of a date control (picker)", async () => {
					const { store, widgetMap } = setup({
						earlyDetectDirtyControl: false,
						widgetMap: {
							TextField: DefaultWidgetMap.TextField,
							Button: DefaultWidgetMap.Button
						}
					});

					assertUIDirtyState({ store, expectedUIDirtyState: false });

					const input = screen.getByRole("textbox", { name: "Date Input" });
					const inputWrapper = input.closest("div");
					ok(inputWrapper !== null);

					const datePickerButton = within(inputWrapper).getByRole("button");

					await user.click(datePickerButton);

					const datePicker = query(widgetMap.DatePicker);

					await act(() => {
						datePicker.props().onChange?.(new Date());
					});

					assertUIDirtyState({ store, expectedUIDirtyState: false });
				});

				it("does not set the ui dirty state on touching or submitting the value of a date time control (input)", async () => {
					const { store } = setup({
						earlyDetectDirtyControl: false,
						widgetMap: {
							TextField: DefaultWidgetMap.TextField
						}
					});

					assertUIDirtyState({ store, expectedUIDirtyState: false });

					const input = screen.getByRole("textbox", { name: "Date Time Input" });

					await user.click(input);
					await user.keyboard("01/01/1970 12:00 AM");

					assertUIDirtyState({ store, expectedUIDirtyState: false });

					await user.keyboard("[Tab]");

					assertUIDirtyState({ store, expectedUIDirtyState: false });
				});

				it("does not set the ui dirty state on changing the value of a date time control (picker)", async () => {
					const { store, widgetMap } = setup({
						earlyDetectDirtyControl: false,
						widgetMap: {
							TextField: DefaultWidgetMap.TextField,
							Button: DefaultWidgetMap.Button
						}
					});

					assertUIDirtyState({ store, expectedUIDirtyState: false });

					const input = screen.getByRole("textbox", { name: "Date Time Input" });
					const inputWrapper = input.closest("div");
					ok(inputWrapper !== null);

					const datePickerButton = within(inputWrapper).getByRole("button");

					await user.click(datePickerButton);

					const dateTimePicker = query(widgetMap.DateTimePicker);

					await act(() => {
						dateTimePicker.props().onAccept?.(new Date());
					});

					assertUIDirtyState({ store, expectedUIDirtyState: false });
				});

				it("does not set the ui dirty state on touching or submitting the value of a time control (input)", async () => {
					const { store } = setup({
						earlyDetectDirtyControl: false,
						widgetMap: {
							TimePicker: DefaultWidgetMap.TimePicker
						}
					});

					assertUIDirtyState({ store, expectedUIDirtyState: false });

					const input = screen.getByRole("textbox", { name: "Time Input" });

					await user.click(input);
					await user.keyboard("12:00 AM");

					assertUIDirtyState({ store, expectedUIDirtyState: false });

					await user.keyboard("[Tab]");

					assertUIDirtyState({ store, expectedUIDirtyState: false });
				});

				it("does not set the ui dirty state on changing the value of a time control (picker)", () => {
					const { store, widgetMap } = setup({
						earlyDetectDirtyControl: false
					});

					assertUIDirtyState({ store, expectedUIDirtyState: false });

					const timePicker = query(widgetMap.TimePicker).withProp("label", "Time Input");

					act(() => {
						timePicker.props().onChange?.(new Date());
					});

					assertUIDirtyState({ store, expectedUIDirtyState: false });
				});
			});
		});
	});
});
