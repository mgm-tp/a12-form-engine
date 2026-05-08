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

import { deepStrictEqual, equal, strictEqual } from "node:assert/strict";
import type { Mock } from "node:test";
import { mock } from "node:test";

import { act } from "@testing-library/react";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import { query } from "@com.mgmtp.a12.devtools/react";

import { UiStateSelectors } from "../../../../../back-end/store/index.js";
import { UiId } from "../../../../../back-end/utils/internal/generateUiId.js";
import type { DispatchConfiguration } from "../../../../../view/index.js";
import { defaultMapDispatchToProps } from "../../../../../view/index.js";
import type { EnablementByRow } from "../../../../../view/internal/configuration/engine-configuration.js";
import { DefaultRepeatButtonNames } from "../../../../../view/internal/configuration/engine-configuration.js";
import { mouseEventMock } from "../../../../rtl-utils/mock-utils.js";
import type { RtlRenderWrapper } from "../../../../rtl-utils/render-wrapper.js";
import { DocumentHelpers } from "../../../../utils/document-helpers.js";
import { ModelHelpers } from "../../../../utils/model-helpers.js";
import { SetupHelpers } from "../../../../utils/setup.js";
import { setupModelsFixture } from "../../../../utils/setupFixture.js";
import { ER } from "../../../../utils/test-model-helpers/embedded.repeat.js";
import { FORM_MODEL } from "../../../../utils/test-model-helpers/repeat.add.js";

describe("api.view.repeat", () => {
	const models = setupModelsFixture("repeat.add");
	interface RepeatSpec {
		type: "inline" | "detached" | "embedded";
		addButtonId: string;
		modelPath: ModelPath;
		modelPathRO: ModelPath;
		addButtonRepeatRoByDependencyId: string;
		modelPathRoByDependency: ModelPath;
		locationPath: ModelPath;
		readonlyRepeatTableId: string;
		enableAddFalseTableId: string;
		enableAddUndefinedTableId: string;
	}

	const repeatSpecs: RepeatSpec[] = [
		{
			type: "inline",
			addButtonId: FORM_MODEL.IR.withInitialValuesAddButton,
			modelPath: FORM_MODEL.IR.withInitialValues,
			modelPathRO: FORM_MODEL.IR.readonly,
			addButtonRepeatRoByDependencyId: FORM_MODEL.IR.readonlyByDependencyAddButton,
			modelPathRoByDependency: FORM_MODEL.IR.readonlyByDependency,
			locationPath: FORM_MODEL.IR.locationPath,
			readonlyRepeatTableId: FORM_MODEL.IR.readonlyRepeatTableId,
			enableAddFalseTableId: FORM_MODEL.IR.enableAddFalseTableId,
			enableAddUndefinedTableId: FORM_MODEL.IR.enableAddUndefinedTableId
		},
		{
			type: "detached",
			addButtonId: FORM_MODEL.DR.withInitialValuesAddButton,
			modelPath: FORM_MODEL.DR.withInitialValues,
			modelPathRO: FORM_MODEL.DR.readonly,
			addButtonRepeatRoByDependencyId: FORM_MODEL.DR.readonlyByDependencyAddButton,
			modelPathRoByDependency: FORM_MODEL.DR.readonlyByDependency,
			locationPath: FORM_MODEL.DR.locationPath,
			readonlyRepeatTableId: FORM_MODEL.DR.readonlyRepeatTableId,
			enableAddFalseTableId: FORM_MODEL.DR.enableAddFalseTableId,
			enableAddUndefinedTableId: FORM_MODEL.DR.enableAddUndefinedTableId
		},
		{
			type: "embedded",
			addButtonId: FORM_MODEL.ER.withInitialValuesAddButton,
			modelPath: FORM_MODEL.ER.withInitialValues,
			modelPathRO: FORM_MODEL.ER.readonly,
			addButtonRepeatRoByDependencyId: FORM_MODEL.ER.readonlyByDependencyAddButton,
			modelPathRoByDependency: FORM_MODEL.ER.readonlyByDependency,
			locationPath: FORM_MODEL.ER.locationPath,
			readonlyRepeatTableId: FORM_MODEL.ER.readonlyRepeatTableId,
			enableAddFalseTableId: FORM_MODEL.ER.enableAddFalseTableId,
			enableAddUndefinedTableId: FORM_MODEL.ER.enableAddUndefinedTableId
		}
	];

	const addButtonId = (repeatId: string) =>
		UiId.generate({
			element: { id: repeatId },
			infix: "add-button"
		});

	const assertDisabledState =
		(disabled: boolean) => (buttonId: string) => (wrapper: RtlRenderWrapper) => {
			const button = query(wrapper.widgetMap.Button).withId(buttonId).props();
			equal(button.disabled, disabled);
		};

	const assertVisibilityState =
		(visible: boolean) => (buttonId: string) => (wrapper: RtlRenderWrapper) => {
			const buttonQuery = query(wrapper.widgetMap.Button).withId(buttonId);
			buttonQuery.assertRenderedTimes(visible ? 1 : 0);
		};

	function mockAddRow(): {
		dispatchConfig: DispatchConfiguration;
		addRow: Mock<DispatchConfiguration.Repeat["addRow"]>;
	} {
		const stubbedDispatch = defaultMapDispatchToProps(mock.fn());
		const addRow = mock.fn();
		const dispatchConfig = {
			...stubbedDispatch.eventHandlers,
			repeat: {
				...stubbedDispatch.eventHandlers.repeat,
				addRow
			}
		};
		return {
			dispatchConfig,
			addRow
		};
	}

	describe("Add", () => {
		repeatSpecs.forEach(repeatSpec => {
			describe(repeatSpec.type, () => {
				function setup(options: {
					disabled?: boolean;
					readonly?: boolean;
					enablementMap?: {
						enablements: { byRow: EnablementByRow };
					};
					document?: object;
					dispatchConfig?: DispatchConfiguration;
				}): Promise<RtlRenderWrapper> {
					return SetupHelpers.setupFormEngineRendererWithRtlAsync({
						models,
						ui: {
							screenLocation: [
								{
									locationPath: repeatSpec.locationPath,
									path: []
								}
							],
							disabled: options.disabled,
							readonly: options.readonly
						},
						data: { document: options.document },
						config: { ...options.enablementMap },
						dispatchConfig: options.dispatchConfig
					});
				}

				describe("enabled / disabled", () => {
					const assertDisabled = assertDisabledState(true)(repeatSpec.addButtonId);
					const assertEnabled = assertDisabledState(false)(repeatSpec.addButtonId);

					describe("if no entry in the enablement map is given", () => {
						it("is disabled when the Form-Engine is disabled", async () => {
							const wrapper = await setup({ disabled: true });
							assertDisabled(wrapper);
						});

						it("is not disabled when the Form-Engine is not disabled", async () => {
							const wrapper = await setup({ disabled: false });
							assertEnabled(wrapper);
						});
					});

					describe("if an entry with 'disabled=false' in the enablement map is given", () => {
						it("is enabled when the Form-Engine is disabled", async () => {
							const wrapper = await setup({
								disabled: true,
								enablementMap: createEnablementMap({
									repeatPath: repeatSpec.modelPath,
									disabled: false
								})
							});
							assertEnabled(wrapper);
						});
					});

					describe("if an entry with 'disabled=true' in the enablement map is given", () => {
						it("is disabled when the Form-Engine is not disabled", async () => {
							const wrapper = await setup({
								disabled: false,
								enablementMap: createEnablementMap({
									repeatPath: repeatSpec.modelPath,
									disabled: true
								})
							});
							assertDisabled(wrapper);
						});
					});
				});

				describe("visibility", () => {
					const assertVisible = assertVisibilityState(true)(repeatSpec.addButtonId);
					const assertHidden = assertVisibilityState(false)(repeatSpec.addButtonId);

					describe("if no entry in the enablement map is given", () => {
						it("shows the button if the Form-Engine is not read-only and enableAdd=true in the model", async () => {
							const wrapper = await setup({ readonly: false });
							assertVisible(wrapper);
						});

						it("hides the button if enableAdd=false in the model", async () => {
							const wrapper = await setup({ readonly: false });
							assertVisibilityState(false)(addButtonId(repeatSpec.enableAddFalseTableId))(wrapper);
						});

						it("hides the button if enableAdd=undefined in the model", async () => {
							const wrapper = await setup({ readonly: false });
							assertVisibilityState(false)(addButtonId(repeatSpec.enableAddFalseTableId))(wrapper);
						});

						it("hides the button if the Form-Engine is read-only", async () => {
							const wrapper = await setup({ readonly: true });
							assertHidden(wrapper);
						});

						it("hides the button if the repeat is read-only by model", async () => {
							const wrapper = await setup({});
							assertVisibilityState(false)(addButtonId(repeatSpec.readonlyRepeatTableId))(wrapper);
						});

						it("hides the button if the repeat is read-only by dependency", async () => {
							const wrapper = await setup({
								document: {
									root: {
										repeatReadonlyByDependency: [{}],
										masterField: true
									}
								}
							});
							assertVisibilityState(false)(repeatSpec.addButtonRepeatRoByDependencyId)(wrapper);
						});

						it("hides the button if the number of repeat rows >= max repeatability", async () => {
							const wrapper = await setup({
								document: {
									repInitialValues: Array(10).fill({ stringField: "test" })
								}
							});
							assertHidden(wrapper);
						});
					});

					describe("if an entry with 'hidden=false' in the enablement map is given", () => {
						it("shows the button if the Form-Engine is not read-only", async () => {
							const wrapper = await setup({
								readonly: false,
								enablementMap: createEnablementMap({
									repeatPath: repeatSpec.modelPath,
									hidden: false
								})
							});
							assertVisible(wrapper);
						});

						it("shows the button if the Form-Engine is read-only", async () => {
							const wrapper = await setup({
								readonly: true,
								enablementMap: createEnablementMap({
									repeatPath: repeatSpec.modelPath,
									hidden: false
								})
							});
							assertVisible(wrapper);
						});

						it("shows the button if the number of repeat rows >= max repeatability", async () => {
							const wrapper = await setup({
								document: {
									repInitialValues: Array(10).fill({ stringField: "test" })
								},
								enablementMap: createEnablementMap({
									repeatPath: repeatSpec.modelPath,
									hidden: false
								})
							});
							assertVisible(wrapper);
						});
					});

					describe("if an entry with 'hidden=true' in the enablement map is given", () => {
						it("hides the button if the Form-Engine is not read-only", async () => {
							const wrapper = await setup({
								readonly: false,
								enablementMap: createEnablementMap({
									repeatPath: repeatSpec.modelPath,
									hidden: true
								})
							});
							assertHidden(wrapper);
						});

						it("hides the button if the Form-Engine is read-only", async () => {
							const wrapper = await setup({
								readonly: true,
								enablementMap: createEnablementMap({
									repeatPath: repeatSpec.modelPath,
									hidden: true
								})
							});
							assertHidden(wrapper);
						});
					});
				});

				describe("Behavior", () => {
					it(
						"clicking the button triggers a call of addRow from the dispatch configuration with the form" +
							"model path to the repeat",
						async () => {
							const { dispatchConfig, addRow } = mockAddRow();
							const wrapper = await setup({ dispatchConfig });
							const addButton = query(wrapper.widgetMap.Button)
								.withId(repeatSpec.addButtonId)
								.props();
							addButton.onClick?.(mouseEventMock);

							strictEqual(addRow.mock.callCount(), 1);
							deepStrictEqual(addRow.mock.calls[0].arguments[1], repeatSpec.modelPath);

							deepStrictEqual(
								addRow.mock.calls[0].arguments[0],
								DocumentHelpers.createDocumentPath(["repInitialValues", 0])
							);
						}
					);

					if (repeatSpec.type === "embedded") {
						describe(
							"if the add button belongs to a sortable embedded repeat" +
								"and is clicked while a row is already open that would be sorted to the front",
							() => {
								const embeddedRepeatModels = setupModelsFixture("repeat", "embedded");

								it("a new row is opened", () => {
									const doc = {
										[ER.ROOT]: {
											[ER.repeatableGroup]: [
												{
													L1_String: "a"
												},
												{
													L1_String: "b"
												},
												{
													L1_String: "c"
												},
												{
													L1_String: "a" // <- new, currently expanded
												}
											]
										}
									};

									const rowPath = [
										{
											elementName: ER.ROOT,
											index: 1
										},
										{
											elementName: ER.repeatableGroup,
											index: 4 // kernel-indices start at 1, so this is row 4
										}
									];

									const wrapper = SetupHelpers.setupConnectedFormEngineWithRtl({
										models: embeddedRepeatModels,
										data: { document: doc },
										ui: {
											screenLocation: [
												{
													locationPath: [
														{
															elementName: ER.SortingAndFiltering.screenSortingAndFiltering
														}
													],
													path: [],
													repeatInstanceState: {
														[ModelPath.toString(ER.SortingAndFiltering.repeatFormModelPath)]: {
															page: 2,
															newRow: {
																rowPath,
																rowState: "workingOn"
															},
															expandedRowPath: rowPath,
															tableInteractionDocument: doc
														}
													}
												}
											]
										}
									});

									act(() =>
										query(wrapper.widgetMap.Button)
											.withId("a12-add-button-inlinerepeat-da601")
											.props()
											.onClick?.(mouseEventMock)
									);

									strictEqual(
										UiStateSelectors.repeatInstanceStateEntry(
											ER.SortingAndFiltering.repeatFormModelPath
										)(wrapper.store.getState())?.page,
										3 // add created a new 5th row -> now we should have 3 pages
									);

									// assert the 5th row is rendered expanded
									// html id indices start at 0, so the 5th row ends with 4
									query(wrapper.tableMap.TableTemplate.ExpandableRow)
										.withId(`${ER.SortingAndFiltering.ID_EXPANDED_ROW}-4`)
										.assertRendered();
								});
							}
						);
					}
				});
			});

			describe("if the add button belongs to a nested detached repeat", () => {
				it("calls addRow from the dispatch configuration with the form model path to the repeat", async () => {
					const { dispatchConfig, addRow } = mockAddRow();

					const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
						models,
						ui: {
							screenLocation: [
								{
									locationPath: ModelHelpers.createModelPath("DetachedRepeat"),
									path: []
								},
								{
									locationPath: ModelHelpers.createModelPath(
										"DetachedRepeat",
										"detached-repeat-rep",
										"detached-repeat-rep-detail-screen"
									),
									path: DocumentHelpers.createDocumentPath(["rep", 2])
								}
							]
						},
						dispatchConfig
					});

					const addButton = query(wrapper.widgetMap.Button)
						.withId(FORM_MODEL.DR.nestedAddButton)
						.props();

					addButton.onClick?.(mouseEventMock);

					deepStrictEqual(
						addRow.mock.calls[0].arguments[1],
						FORM_MODEL.DR.irInNestedDetachedRepeat
					);

					deepStrictEqual(
						addRow.mock.calls[0].arguments[0],
						DocumentHelpers.createDocumentPath(["rep", 2], ["nestedRepInitialRows", 0])
					);
				});
			});
		});

		function createEnablementMap(options: {
			repeatPath: ModelPath;
			hidden?: boolean;
			disabled?: boolean;
		}): {
			enablements: { byRow: EnablementByRow };
		} {
			const repeatName = options.repeatPath[options.repeatPath.length - 1].elementName;
			return {
				enablements: {
					byRow: {
						[repeatName]: {
							[DefaultRepeatButtonNames.add]: {
								[0]: { hidden: options.hidden, disabled: options.disabled }
							}
						}
					}
				}
			};
		}
	});
});
