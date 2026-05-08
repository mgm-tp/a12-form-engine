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

import { ok, strictEqual } from "node:assert/strict";
import { mock } from "node:test";

import type { JSX } from "react";
import { act, useEffect, useRef } from "react";
import type { Action } from "redux";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type { GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import type { GlobalMessageBoxProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/global-message-box/main/global-message-box.api.js";
import type { LayoutGridProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/layout/layout-grid/main/layout-grid.api.js";

import { Commands, Events } from "../../../../back-end/store/index.js";
import type { EngineStore } from "../../../../back-end/store/internal/store.js";
import type { Config, WidgetMap } from "../../../../view/index.js";
import { DefaultWidgetMap, ScrollHandler } from "../../../../view/index.js";
import { DefaultTableWidgetMap } from "../../../../view/internal/components/form-engine/repeat/table-widget-map.js";
import { widgetMocksForFocusTests as inputWidgetMocksForFocusTests } from "../../../integration/focusTestInputMocks.js";
import { GLOBAL_MESSAGE_BOX } from "../../../rtl-utils/data-roles.js";
import { getWidgetMocks } from "../../../rtl-utils/getWidgetMocks.js";
import { assertExists } from "../../../utils/assertions.js";
import { DisableMockComponents } from "../../../utils/disable-mocks.js";
import { DocumentHelpers } from "../../../utils/document-helpers.js";
import { US_LOCALE } from "../../../utils/localization.js";
import { getSingleElementScrollIntoView } from "../../../utils/scroll-into-view.js";
import { SetupHelpers } from "../../../utils/setup.js";
import { setupFixture, setupModelsFixture } from "../../../utils/setupFixture.js";
import {
	FORM_MODEL_PATHS,
	IDS
} from "../../../utils/test-model-helpers/test-model.scroll-handler.js";
import { createValidationEntry } from "../../../utils/validation.js";

const { loadData, createTestStore } = SetupHelpers;
const { createDocumentPath } = DocumentHelpers;

type Fixture = {
	dataDocument: GroupInstance;
};

describe("api.view.ScrollHandler", () => {
	const locale = US_LOCALE;

	const FORM_ID = "test.scroll-handler-form";
	const CORRECTION_SCREEN_ID = "a12-correction-screen";
	const models = setupModelsFixture("test.scroll-handler");
	const fixture: Fixture = setupFixture(() => ({
		dataDocument: loadData("test.scroll-handler", "data", models.documentModel)
	}));

	describe("if the `focusedComponent`is given", () => {
		executeTestsForFocusedComponent("deadbeef");
	});

	describe("if no `focusedComponent` is given in the store", () => {
		describe("and the screen state is changed", () => {
			describe("from top-level screen", () => {
				describe("to top-level screen", () => {
					it(
						"will not scroll if the `focusedComponent` is empty" +
							" and the screen location is changed from top level screen to top level screen",
						createTestForScrollingBehavior({
							actions: [
								Commands.setLocationStack({
									locationStack: [{ path: [], locationPath: [{ elementName: "Screen2" }] }]
								})
							],
							scrollIntoView: undefined
						})
					);
				});

				describe("to correction-screen", () => {
					it(
						"scrolls to the top of the screen when changing to the correction screen",
						createTestForScrollingBehavior({
							actions: [Events.CorrectionMode.CorrectionView.show({ show: true })],
							scrollIntoView: {
								id: CORRECTION_SCREEN_ID,
								activeElementId: IDS.CORRECTION_SCREEN_MESSAGE_BOX_ID,
								position: "start"
							}
						})
					);
				});
			});

			describe("from correction-screen", () => {
				describe("to top-level screen", () => {
					describe("if no validation bar is present", () => {
						const ui = { correctionScreen: { visible: true, showDetailsState: {} } };
						it(
							"scrolls to the top of form if no validation bar is present",
							createTestForScrollingBehavior({
								options: { ui },
								actions: [Events.CorrectionMode.CorrectionView.show({ show: false })],
								scrollIntoView: { id: FORM_ID, position: "start" }
							})
						);
					});
				});
			});
		});

		describe("and the screen state is not changed", () => {
			it("does not scroll to top again when in correction-screen", async () => {
				const scrollHandlerSpy = mock.method(ScrollHandler.prototype, "componentDidUpdate");
				const scrollIntoViewSpy = mock.method(Element.prototype, "scrollIntoView");

				const widgetMap = DefaultWidgetMap;
				const tableMap = DefaultTableWidgetMap;
				const wrapper = await SetupHelpers.setupConnectedFormEngineWithRtlAsync({
					tableMap,
					config: {
						widgetMap
					},
					withWidgets: true,
					withScrollHandler: true,
					models,
					locale,
					data: {}
				});

				await act(() => {
					wrapper.store.dispatch(Events.CorrectionMode.CorrectionView.show({ show: true }));
				});

				// scroll
				const before = getSingleElementScrollIntoView(scrollIntoViewSpy);
				assertExists(before.node);
				strictEqual(before.node.id, CORRECTION_SCREEN_ID);

				scrollIntoViewSpy.mock.resetCalls();
				scrollHandlerSpy.mock.resetCalls();

				await act(() => {
					wrapper.store.dispatch(
						Commands.CorrectionMode.setCorrectionScreenState({
							correctionScreen: { visible: true, showDetailsState: { 2: true } }
						})
					);
				});

				// State change should not lead to scrolling
				const after = getSingleElementScrollIntoView(scrollIntoViewSpy);
				strictEqual(scrollHandlerSpy.mock.callCount(), 1);
				strictEqual(after.node, undefined);
			});
		});
	});

	interface ScrollIntoView {
		readonly id: string;
		readonly activeElementId?: string;
		readonly position?: ScrollLogicalPosition;
	}

	interface TestSpecification {
		readonly options?: {
			readonly ui?: Partial<EngineStore.UIState>;
			readonly uiConfig?: Partial<Config>;
		};
		readonly actions: Action[];
		readonly scrollIntoView: ScrollIntoView | undefined;
		readonly disableRepeatBehavior?: boolean;
		readonly disableScrollToTopLevelScreen?: boolean;
		readonly checkActiveElement?: boolean;
		readonly actionsBeforeMount?: boolean;
	}

	/**
	 * Specific widget mocks are needed to make these tests runnable with mocks:
	 *
	 * mocks for input widgets (using actual HTML input elements)
	 *
	 * mocks for GlobalMessageBox and SizeContainer to emulate specific focus
	 * behavior: When switching to the correction screen, the GlobalMessageBox
	 * focuses itself, because focusOnMout is set. Then
	 * ScrollHandler.scrollToElement is called with the SizeContainer, but
	 * because that is not focusable, the focus() call has no effect.
	 */
	function widgetMap(): WidgetMap {
		return DisableMockComponents.components(() => DefaultWidgetMap)(() => ({
			...getWidgetMocks(),
			...inputWidgetMocksForFocusTests(),
			GlobalMessageBox,
			SizeContainer
		}));
	}

	function createTestForScrollingBehavior({
		options: { ui, uiConfig } = {},
		actions,
		scrollIntoView,
		disableRepeatBehavior,
		disableScrollToTopLevelScreen,
		checkActiveElement = true,
		actionsBeforeMount
	}: TestSpecification): () => Promise<void> {
		return async () => {
			const scrollIntoViewSpy = mock.method(Element.prototype, "scrollIntoView");

			const expectedPrefix = uiConfig?.uiIdPrefix ? `${uiConfig?.uiIdPrefix}-` : "";
			const expectedScrollIntoViewId = `${expectedPrefix}${scrollIntoView?.id}`;
			const expectedActiveElementId = `${expectedPrefix}${scrollIntoView?.activeElementId}`;

			const store = createTestStore({
				storeConfig: { models, locale, data: { document: fixture.dataDocument }, ui }
			});

			if (actionsBeforeMount) {
				for (const action of actions) {
					scrollIntoViewSpy.mock.resetCalls();
					await act(() => {
						store.dispatch(action);
					});
				}
			}

			await SetupHelpers.setupConnectedFormEngineWithRtlAsync({
				config: {
					...uiConfig,
					widgetMap: widgetMap()
				},
				withWidgets: true,
				withScrollHandler: true,
				scrollHandlerOptions: {
					disableRepeatBehavior,
					disableScrollToTopLevelScreen
				},
				store,
				models,
				locale,
				data: { document: fixture.dataDocument },
				ui
			});

			if (!actionsBeforeMount) {
				for (const action of actions) {
					scrollIntoViewSpy.mock.resetCalls();
					await act(() => {
						store.dispatch(action);
					});
				}
			}

			const { node, position } = getSingleElementScrollIntoView(scrollIntoViewSpy);
			if (scrollIntoView === undefined) {
				strictEqual(node, undefined, "HTMLElement.scrollIntoView() must not be called");
				return;
			}

			ok(node, "HTMLElement.scrollIntoView() must be called");
			strictEqual(
				node.id,
				expectedScrollIntoViewId,
				`HTMLElement.scrollIntoView() was never called for an element with id "${expectedScrollIntoViewId}"`
			);

			if (scrollIntoView.position !== undefined) {
				strictEqual(position, scrollIntoView.position);
			}

			if (checkActiveElement) {
				if (scrollIntoView.activeElementId === undefined) {
					// Do not use strictEqual because it tries to make json out of it
					ok(
						document.activeElement === node,
						"Active element is not the same element as the element that was scrolled into view"
					);
				} else {
					ok(document.activeElement, "No active element");
					strictEqual(
						document.activeElement.id,
						expectedActiveElementId,
						`Element with id "${expectedActiveElementId}" is not the active element`
					);
				}
			}
		};
	}

	// support focusOnMount
	function GlobalMessageBox(props: GlobalMessageBoxProps): JSX.Element {
		const ref = useRef<HTMLDivElement>(null);
		useEffect(() => {
			if (props.focusOnMount) {
				ref.current?.focus();
			}
		}, [props.focusOnMount]);
		return (
			<div id={props.id} data-role={GLOBAL_MESSAGE_BOX} tabIndex={-1} ref={ref}>
				{props.actions}
			</div>
		);
	}

	// NO tabIndex (not focusable)
	function SizeContainer(props: LayoutGridProps.LayoutGridProps): JSX.Element {
		return <div id={props.id}>{props.children}</div>;
	}

	function executeTestsForFocusedComponent(uiIdPrefix?: string): void {
		describe("given that the property 'subElement' of the 'focusedComponent' is", () => {
			describe("set to 'validation-bar'", () => {
				it(
					"scrolls to the validation-bar and focuses it",
					createTestForScrollingBehavior({
						actions: [
							Commands.setLocationStack({
								locationStack: [
									{
										path: [],
										locationPath: [{ elementName: "Screen1" }],
										focusedComponent: { formModelPath: [], subElement: "validation-bar" }
									}
								]
							})
						],
						options: {
							uiConfig: { uiIdPrefix },
							ui: {
								validationBar: { visible: true, currentMessageKey: "", expanded: false },
								messages: createValidationEntry({ path: createDocumentPath(["path"]) })
							}
						},
						scrollIntoView: { id: "a12-validation-bar", position: "start" }
					})
				);
			});

			describe("set to 'current-screen'", () => {
				describe("and disableScrollToTopLevelScreen is undefined", () => {
					it(
						"scrolls to the top of the screen and focuses it",
						createTestForScrollingBehavior({
							actions: [
								Commands.setLocationStack({
									locationStack: [
										{
											path: [],
											locationPath: [{ elementName: "Screen1" }],
											focusedComponent: { formModelPath: [], subElement: "current-screen" }
										}
									]
								})
							],
							options: { uiConfig: { uiIdPrefix } },
							scrollIntoView: { id: FORM_ID, position: "start" }
						})
					);
				});

				describe("and disableScrollToTopLevelScreen is false", () => {
					it(
						"scrolls to the top of the screen and focuses it",
						createTestForScrollingBehavior({
							actions: [
								Commands.setLocationStack({
									locationStack: [
										{
											path: [],
											locationPath: [{ elementName: "Screen1" }],
											focusedComponent: { formModelPath: [], subElement: "current-screen" }
										}
									]
								})
							],
							options: { uiConfig: { uiIdPrefix } },
							scrollIntoView: { id: FORM_ID, position: "start" }
						})
					);
				});

				describe("and disableScrollToTopLevelScreen is true", () => {
					it(
						"does not scroll to the top of the screen and focuses it",
						createTestForScrollingBehavior({
							actions: [
								Commands.setLocationStack({
									locationStack: [
										{
											path: [],
											locationPath: [{ elementName: "Screen1" }],
											focusedComponent: { formModelPath: [], subElement: "current-screen" }
										}
									]
								})
							],
							options: { uiConfig: { uiIdPrefix } },
							scrollIntoView: { id: FORM_ID }
						})
					);
				});
			});
		});

		describe("given that 'formModelPath' property of the 'focusedComponent' references", () => {
			describe("a repeat", () => {
				describe("and an index I is given", () => {
					describe("and the property 'subElement' is set to 'repeat-edit'", () => {
						function createTest(
							scrollIntoView?: ScrollIntoView,
							disableRepeatBehavior?: boolean
						): () => Promise<void> {
							return createTestForScrollingBehavior({
								actions: [
									Commands.setLocationStack({
										locationStack: [
											{
												path: [],
												locationPath: [{ elementName: "Screen1" }],
												focusedComponent: {
													formModelPath: FORM_MODEL_PATHS.DETACHED_REPEAT,
													index: 1,
													subElement: "repeat-edit"
												}
											}
										]
									})
								],
								options: { uiConfig: { uiIdPrefix } },
								scrollIntoView: scrollIntoView
									? { ...scrollIntoView, position: "center" }
									: undefined,
								disableRepeatBehavior
							});
						}

						describe("and disableRepeatBehavior is set to false", () => {
							it(
								"focuses the repeat edit button in the row with the index I",
								createTest({ id: IDS.EDIT_BUTTON_DETACHED_REPEAT + "-2" }, false)
							);
						});

						describe("and disableRepeatBehavior is undefined", () => {
							it(
								"focuses the repeat edit button in the row with the index I",
								createTest({ id: IDS.EDIT_BUTTON_DETACHED_REPEAT + "-2" }, undefined)
							);
						});

						describe("and disableRepeatBehavior is set to true", () => {
							it(
								"does not focus the repeat edit button in the row with the index I",
								createTest(undefined, true)
							);
						});
					});

					describe("and the property 'subElement' is not set to 'repeat-edit'", () => {
						function createTest(
							scrollIntoView?: ScrollIntoView,
							disableRepeatBehavior?: boolean
						): () => Promise<void> {
							return createTestForScrollingBehavior({
								actions: [
									Commands.setLocationStack({
										locationStack: [
											{
												path: [],
												locationPath: [{ elementName: "Screen1" }],
												focusedComponent: {
													formModelPath: FORM_MODEL_PATHS.INLINE_REPEAT,
													index: 1
												}
											}
										]
									})
								],
								options: { uiConfig: { uiIdPrefix } },
								scrollIntoView: scrollIntoView
									? { ...scrollIntoView, position: "center" }
									: undefined,
								disableRepeatBehavior
							});
						}

						describe("and disableRepeatBehavior is set to false", () => {
							it(
								"focuses the row of the table",
								createTest({ id: IDS.BODY_ROW_INLINE_REPEAT + "-1" }, false)
							);
						});

						describe("and disableRepeatBehavior is undefined", () => {
							it(
								"focuses the row of the table",
								createTest({ id: IDS.BODY_ROW_INLINE_REPEAT + "-1" }, undefined)
							);
						});

						describe("and disableRepeatBehavior is set to true", () => {
							it("does not focus the row of the table", createTest(undefined, true));
						});
					});
				});

				describe("and no index is given", () => {
					describe("and the property 'subElement' is set to 'repeat-add'", () => {
						function createTest(
							scrollIntoView?: ScrollIntoView,
							disableRepeatBehavior?: boolean
						): () => Promise<void> {
							return createTestForScrollingBehavior({
								actions: [
									Commands.setLocationStack({
										locationStack: [
											{
												path: [],
												locationPath: [{ elementName: "Screen1" }],
												focusedComponent: {
													formModelPath: FORM_MODEL_PATHS.INLINE_REPEAT,
													subElement: "repeat-add"
												}
											}
										]
									})
								],
								options: { uiConfig: { uiIdPrefix } },
								scrollIntoView: scrollIntoView
									? { ...scrollIntoView, position: "center" }
									: undefined,
								disableRepeatBehavior
							});
						}

						describe("and disableRepeatBehavior is set to false", () => {
							it(
								"focuses the add button of the referenced repeat",
								createTest({ id: IDS.ADD_BUTTON_DETACHED_REPEAT }, false)
							);
						});

						describe("and disableRepeatBehavior is undefined", () => {
							it(
								"focuses the add button of the referenced repeat",
								createTest({ id: IDS.ADD_BUTTON_DETACHED_REPEAT }, undefined)
							);
						});

						describe("and disableRepeatBehavior is set to true", () => {
							it(
								"does not focus the add button of the referenced repeat",
								createTest(undefined, true)
							);
						});
					});

					describe("and the property 'subElement' is not set", () => {
						function createTest(
							scrollIntoView?: ScrollIntoView,
							disableRepeatBehavior?: boolean
						): () => Promise<void> {
							return createTestForScrollingBehavior({
								actions: [
									Commands.setLocationStack({
										locationStack: [
											{
												path: [],
												locationPath: [{ elementName: "Screen1" }],
												focusedComponent: {
													formModelPath: FORM_MODEL_PATHS.INLINE_REPEAT
												}
											}
										]
									})
								],
								options: { uiConfig: { uiIdPrefix } },
								scrollIntoView: scrollIntoView
									? { ...scrollIntoView, position: "center" }
									: undefined,
								disableRepeatBehavior
							});
						}

						describe("and disableRepeatBehavior is set to false", () => {
							it("focuses the table", createTest({ id: IDS.INLINE_REPEAT }, false));
						});

						describe("and disableRepeatBehavior is undefined", () => {
							it("focuses the table", createTest({ id: IDS.INLINE_REPEAT }, undefined));
						});

						describe("and disableRepeatBehavior is set to true", () => {
							it("does not focus the table", createTest(undefined, true));
						});
					});
				});
			});

			describe("a control", () => {
				describe("rendered as an input", () => {
					it(
						"focuses the respective input",
						createTestForScrollingBehavior({
							actions: [
								Commands.setLocationStack({
									locationStack: [
										{
											path: [],
											locationPath: [{ elementName: "Screen1" }],
											focusedComponent: { formModelPath: FORM_MODEL_PATHS.FIELD_1 }
										}
									]
								})
							],
							options: { uiConfig: { uiIdPrefix } },
							scrollIntoView: {
								id: IDS.FIELD_1 + "-group",
								activeElementId: IDS.FIELD_1,
								position: "center"
							}
						})
					);
				});

				describe("rendered as a text output", () => {
					it(
						"scrolls to the respective div element",
						createTestForScrollingBehavior({
							actions: [
								Commands.setLocationStack({
									locationStack: [
										{
											path: [],
											locationPath: [{ elementName: "Screen1" }],
											focusedComponent: { formModelPath: FORM_MODEL_PATHS.FIELD_1_TEXT_OUTPUT }
										}
									]
								})
							],
							options: { uiConfig: { uiIdPrefix } },
							scrollIntoView: {
								id: IDS.FIELD_1_TEXT_OUTPUT + "-group",
								activeElementId: IDS.FIELD_1_TEXT_OUTPUT,
								position: "center"
							},
							checkActiveElement: false
						})
					);
				});
			});

			describe("a field overview column", () => {
				describe("rendered as an input", () => {
					it(
						"focuses the respective input in the correct row",
						createTestForScrollingBehavior({
							actions: [
								Commands.setLocationStack({
									locationStack: [
										{
											path: [],
											locationPath: [{ elementName: "Screen1" }],
											focusedComponent: {
												formModelPath: FORM_MODEL_PATHS.INLINE_REPEAT_CELL,
												index: 1
											}
										}
									]
								})
							],
							options: { uiConfig: { uiIdPrefix } },
							scrollIntoView: {
								id: IDS.INLINE_REPEAT_BODY_CELL,
								activeElementId: IDS.INLINE_REPEAT_CELL,
								position: "center"
							}
						})
					);
				});

				describe("rendered as a text output", () => {
					it(
						"scrolls to the respective div element in the correct row",
						createTestForScrollingBehavior({
							actions: [
								Commands.setLocationStack({
									locationStack: [
										{
											path: [],
											locationPath: [{ elementName: "Screen1" }],
											focusedComponent: {
												formModelPath: FORM_MODEL_PATHS.INLINE_REPEAT_CELL_TEXT_OUTPUT,
												index: 1
											}
										}
									]
								})
							],
							options: { uiConfig: { uiIdPrefix } },
							scrollIntoView: {
								id: IDS.INLINE_REPEAT_BODY_CELL_TEXT_OUTPUT,
								activeElementId: IDS.INLINE_REPEAT_CELL_TEXT_OUTPUT,
								position: "center"
							},
							checkActiveElement: false
						})
					);
				});
			});

			describe("a control-grid in an expanded embedded repeat row", () => {
				it("focused the control-grid once the row is expanded", () => {
					createTestForScrollingBehavior({
						actions: [
							Commands.setLocationStack({
								locationStack: [
									{
										path: [],
										locationPath: [{ elementName: "Screen1" }],
										focusedComponent: {
											formModelPath: FORM_MODEL_PATHS.CG_IN_EMBEDDED_REPEAT,
											index: 2
										},
										repeatInstanceState: {
											[ModelPath.toString(FORM_MODEL_PATHS.EMBEDDED_REPEAT)]: {
												expandedRowPath: DocumentHelpers.createDocumentPath(
													["root"],
													["repGroup", 2]
												)
											}
										}
									}
								]
							})
						],
						options: {
							uiConfig: { uiIdPrefix },
							ui: {
								screenLocation: [
									{
										path: [],
										locationPath: [{ elementName: "Screen1" }],
										repeatInstanceState: {
											[ModelPath.toString(FORM_MODEL_PATHS.EMBEDDED_REPEAT)]: {
												expandedRowPath: DocumentHelpers.createDocumentPath(["root"], ["repGroup"])
											}
										}
									}
								]
							}
						},
						scrollIntoView: {
							id: "a12-controlgrid-bc4fb",
							activeElementId: "a12-controlgrid-bc4fb",
							position: "center"
						}
					});
				});
			});

			describe("and another focusedComponent of the same screen has been given before", () => {
				it(
					"scrolls to the element",
					createTestForScrollingBehavior({
						options: { uiConfig: { uiIdPrefix } },
						actions: [
							Commands.changeScreenState({
								index: 0,
								focusedComponent: { formModelPath: FORM_MODEL_PATHS.FIELD_1 }
							}),
							Commands.changeScreenState({
								index: 0,
								focusedComponent: { formModelPath: FORM_MODEL_PATHS.FIELD_2 }
							})
						],
						scrollIntoView: {
							id: `${IDS.FIELD_2}-group`,
							activeElementId: IDS.FIELD_2
						}
					})
				);
			});
		});

		describe("if the state is updated", () => {
			const initialScreenState = {
				path: [],
				locationPath: [{ elementName: "Screen1" }],
				focusedComponent: { formModelPath: FORM_MODEL_PATHS.FIELD_1 },
				focusedComponentRequestCount: 1
			};

			const ui = { screenLocation: [initialScreenState] };

			describe("and the focusedComponentRequestCount is not changed", () => {
				it(
					"does not scroll twice to the element",
					createTestForScrollingBehavior({
						options: { uiConfig: { uiIdPrefix } },
						actions: [
							Commands.setLocationStack({
								locationStack: [{ ...initialScreenState, focusedComponentRequestCount: 1 }]
							}),
							Commands.setLocationStack({
								locationStack: [{ ...initialScreenState, focusedComponentRequestCount: 1 }]
							})
						],
						scrollIntoView: undefined
					})
				);
			});

			describe("and the focusedComponentRequestCount is changed", () => {
				it(
					"does scroll to the element",
					createTestForScrollingBehavior({
						options: { ui },
						actions: [
							Commands.setLocationStack({
								locationStack: [{ ...initialScreenState, focusedComponentRequestCount: 1 }]
							}),
							Commands.setLocationStack({
								locationStack: [{ ...initialScreenState, focusedComponentRequestCount: 2 }]
							})
						],
						scrollIntoView: {
							id: `${IDS.FIELD_1}-group`,
							activeElementId: IDS.FIELD_1
						}
					})
				);
			});

			describe("before the scroll handler is mounted", () => {
				it(
					"does scroll to the element",
					createTestForScrollingBehavior({
						actionsBeforeMount: true,
						options: { ui },
						actions: [
							Commands.setLocationStack({
								locationStack: [{ ...initialScreenState }]
							})
						],
						scrollIntoView: {
							id: `${IDS.FIELD_1}-group`,
							activeElementId: IDS.FIELD_1
						}
					})
				);
			});
		});
	}
});
