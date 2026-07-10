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
import type { Mock } from "node:test";
import { mock } from "node:test";

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import { query } from "@com.mgmtp.a12.devtools/react";
import { Locale } from "@com.mgmtp.a12.utils/utils-localization";
import { provider } from "@com.mgmtp.a12.widgets/widgets-core";
import type { MobileValidationProps } from "@com.mgmtp.a12.widgets/widgets-core";

import type { EngineStore } from "../../../../back-end/store/index.js";
import type { RtlRenderWrapper } from "../../../rtl-utils/render-wrapper.js";
import { createModelPath } from "../../../utils/createModelPath.js";
import { RenderGroupFixture } from "../../../utils/rtl-render-group.js";
import { setupModelsFixture } from "../../../utils/setupFixture.js";

import type { StubbedDispatchConfig } from "./validation-bar-setup.js";
import { createStubbedDispatchConfig, setupValidationBarTests } from "./validation-bar-setup.js";

describe("api.view.validation.Mobile Validation Bar", () => {
	const models = setupModelsFixture("computation-validation.errors_and_warnings_and_infos");

	beforeEach(() => {
		if (!(provider.get as Mock<typeof provider.get>).mock) {
			mock.method(provider, "get", () => "phone");
		}
	});

	describe("Validation Bar Overview", () => {
		describe("Given a state with the information that the validation bar is visible", () => {
			describe("and given only errors", () => {
				it("shows a validation bar with variant=error, the number of errors and a11yTitleSupport=true", () => {
					const { widgetMap } = setup({
						setupDevApp: false,
						onlyErrors: true,
						onlyTopLevelMessages: true
					});

					query(widgetMap.MobileValidationOverview)
						.withProp("variant", "error")
						.assertRenderedTimes(1);

					const errorGraphic = query(widgetMap.MobileValidationGraphic)
						.withProp("variant", "error")
						.props();
					strictEqual(errorGraphic.children, "7");
					strictEqual(errorGraphic.a11yTitleSupport, true);

					const warningGraphics = query(widgetMap.MobileValidationGraphic)
						.withProp("variant", "warning")
						.props();
					strictEqual(warningGraphics.children, "0");
					strictEqual(warningGraphics.a11yTitleSupport, true);

					const infoGraphics = query(widgetMap.MobileValidationGraphic)
						.withProp("variant", "info")
						.props();
					strictEqual(infoGraphics.children, "0");
					strictEqual(infoGraphics.a11yTitleSupport, true);
				});
			});

			describe("and given only warnings", () => {
				it("shows a validation bar with variant=warning, the number of warnings and a11yTitleSupport=true", () => {
					const { widgetMap } = setup({
						setupDevApp: false,
						onlyWarnings: true,
						onlyTopLevelMessages: true
					});

					query(widgetMap.MobileValidationOverview)
						.withProp("variant", "warning")
						.assertRenderedTimes(1);

					const errorGraphic = query(widgetMap.MobileValidationGraphic)
						.withProp("variant", "error")
						.props();
					strictEqual(errorGraphic.children, "0");
					strictEqual(errorGraphic.a11yTitleSupport, true);

					const warningGraphics = query(widgetMap.MobileValidationGraphic)
						.withProp("variant", "warning")
						.props();
					strictEqual(warningGraphics.children, "7");
					strictEqual(warningGraphics.a11yTitleSupport, true);

					const infoGraphics = query(widgetMap.MobileValidationGraphic)
						.withProp("variant", "info")
						.props();
					strictEqual(infoGraphics.children, "0");
					strictEqual(infoGraphics.a11yTitleSupport, true);
				});
			});

			describe("and given only infos", () => {
				it("shows a validation bar with variant=info, the number of infos and a11yTitleSupport=true", () => {
					const { widgetMap } = setup({
						setupDevApp: false,
						onlyInfos: true,
						onlyTopLevelMessages: true
					});

					query(widgetMap.MobileValidationOverview)
						.withProp("variant", "info")
						.assertRenderedTimes(1);

					const errorGraphic = query(widgetMap.MobileValidationGraphic)
						.withProp("variant", "error")
						.props();
					strictEqual(errorGraphic.children, "0");
					strictEqual(errorGraphic.a11yTitleSupport, true);

					const warningGraphics = query(widgetMap.MobileValidationGraphic)
						.withProp("variant", "warning")
						.props();
					strictEqual(warningGraphics.children, "0");
					strictEqual(warningGraphics.a11yTitleSupport, true);

					const infoGraphics = query(widgetMap.MobileValidationGraphic)
						.withProp("variant", "info")
						.props();
					strictEqual(infoGraphics.children, "7");
					strictEqual(infoGraphics.a11yTitleSupport, true);
				});
			});

			describe("and given errors and warnings and infos", () => {
				it("shows a validation bar with variant=error, the number of errors, warnings and infos and a11yTitleSupport=true", () => {
					const { widgetMap } = setup({ setupDevApp: false, onlyTopLevelMessages: true });

					query(widgetMap.MobileValidationOverview)
						.withProp("variant", "error")
						.assertRenderedTimes(1);

					const errorGraphic = query(widgetMap.MobileValidationGraphic)
						.withProp("variant", "error")
						.props();
					strictEqual(errorGraphic.children, "3");
					strictEqual(errorGraphic.a11yTitleSupport, true);

					const warningGraphics = query(widgetMap.MobileValidationGraphic)
						.withProp("variant", "warning")
						.props();
					strictEqual(warningGraphics.children, "2");
					strictEqual(warningGraphics.a11yTitleSupport, true);

					const infoGraphics = query(widgetMap.MobileValidationGraphic)
						.withProp("variant", "info")
						.props();
					strictEqual(infoGraphics.children, "2");
					strictEqual(infoGraphics.a11yTitleSupport, true);
				});
			});

			describe("clicking on the validation bar", () => {
				it("calls 'correctionMode.validationBar.onExpand'", () => {
					const dispatchConfig = createStubbedDispatchConfig();
					const { widgetMap } = setup({
						setupDevApp: false,
						onlyErrors: true,
						onlyTopLevelMessages: true,
						dispatchConfig
					});

					const props = query(widgetMap.MobileValidationOverview).props();
					props.onClick?.({} as React.MouseEvent<HTMLDivElement>);

					strictEqual(dispatchConfig.correctionMode.validationBar.onExpand.mock.callCount(), 1);
					// First parameter is the new expansion state
					strictEqual(
						dispatchConfig.correctionMode.validationBar.onExpand.mock.calls[0].arguments[0],
						true
					);
					// Second is the reset message
					strictEqual(
						dispatchConfig.correctionMode.validationBar.onExpand.mock.calls[0].arguments[1],
						false
					);
				});
			});
		});
	});

	describe("Validation Bar Modal", () => {
		describe("given a state information that the validation bar modal is opened", () => {
			describe("and no issue is selected", () => {
				it("shows a validation bar with variant=error, the number of errors, warnings and infos and a11yTitleSupport=undefined", () => {
					const { widgetMap } = setup({
						setupDevApp: false,
						expanded: true,
						onlyTopLevelMessages: true
					});

					query(widgetMap.MobileValidationOverview)
						.withProp("variant", "error")
						.assertRenderedTimes(1);

					const errorGraphic = query(widgetMap.MobileValidationGraphic)
						.withProp("variant", "error")
						.props();
					strictEqual(errorGraphic.children, "3");
					strictEqual(errorGraphic.a11yTitleSupport, undefined);

					const warningGraphics = query(widgetMap.MobileValidationGraphic)
						.withProp("variant", "warning")
						.props();
					strictEqual(warningGraphics.children, "2");
					strictEqual(warningGraphics.a11yTitleSupport, undefined);

					const infoGraphics = query(widgetMap.MobileValidationGraphic)
						.withProp("variant", "info")
						.props();
					strictEqual(infoGraphics.children, "2");
					strictEqual(infoGraphics.a11yTitleSupport, undefined);
				});

				it("shows an overview with all issue types", () => {
					const { widgetMap } = setup({
						setupDevApp: false,
						expanded: true,
						onlyTopLevelMessages: true
					});

					query(widgetMap.MobileValidationPreviewList).assertRenderedTimes(1);
					const items = query(widgetMap.MobileValidationPreviewListItem).groupByTestId();
					items.assertSize(7);

					const assertItem = (
						item: MobileValidationProps.PreviewListItemProps,
						variant: MobileValidationProps.PreviewListItemProps["variant"],
						text: MobileValidationProps.PreviewListItemProps["text"]
					) => {
						strictEqual(item.variant, variant);
						strictEqual(item.text, text);
					};

					assertItem(items.at(0).props(), "error", "Error String 1");
					assertItem(items.at(1).props(), "error", "Error String 2");
					assertItem(items.at(2).props(), "error", "Error String 3");
					assertItem(items.at(3).props(), "warning", "Warning String 4");
					assertItem(items.at(4).props(), "warning", "Warning String 5");
					assertItem(items.at(5).props(), "info", "Info String 6");
					assertItem(items.at(6).props(), "info", "Info String 7");
				});

				it("calls 'correctionMode.validationBar.onShowMessage' when an issue type is clicked", () => {
					const dispatchConfig = createStubbedDispatchConfig();
					const { widgetMap } = setup({
						setupDevApp: false,
						expanded: true,
						onlyTopLevelMessages: true,
						dispatchConfig
					});
					const props = query(widgetMap.MobileValidationPreviewListItem).props();
					props.onClick?.({} as React.MouseEvent<HTMLElement>);

					strictEqual(
						dispatchConfig.correctionMode.validationBar.onShowMessage.mock.callCount(),
						1
					);
					strictEqual(
						dispatchConfig.correctionMode.validationBar.onShowMessage.mock.calls[0].arguments[0],
						INFO_KEY_2
					);
				});
			});

			describe("and an error is selected", () => {
				it("shows the selected error in the header", () => {
					const { widgetMap } = setup({
						multipleCauses: false,
						expanded: true,
						currentMessageKey: ERROR_KEY_2,
						onlyTopLevelMessages: true
					});
					query(widgetMap.MobileValidationGraphic)
						.withProp("children", ["Error", " (2/7)"])
						.withProp("variant", "error")
						.assertRenderedTimes(1);
				});

				describe("given that there is only one cause for the error", () => {
					it("shows the error text of the issue and the jumping link", () => {
						const { widgetMap } = setup({
							expanded: true,
							currentMessageKey: ERROR_KEY_2,
							onlyTopLevelMessages: true
						});

						query(widgetMap.LayoutGridRow)
							.withProp("children", "Error String 2")
							.assertRenderedTimes(1);
						query(widgetMap.Button)
							.withProp("label", "First Screen > StringType")
							.assertRenderedTimes(1);
					});
				});

				describe("given that there are multiple causes for the error", () => {
					it("shows the error text of the issue, the jumping links and an information that they are multiple causes", () => {
						const { widgetMap } = setup({
							multipleCauses: true,
							expanded: true,
							currentMessageKey: ERROR_KEY_1,
							onlyTopLevelMessages: true
						});

						query(widgetMap.LayoutGridRow)
							.withProp("children", "Error String 1")
							.assertRenderedTimes(1);
						query(widgetMap.LayoutGridRow)
							.withProp("children", "Multiple possible causes")
							.assertRenderedTimes(1);
						query(widgetMap.Button)
							.withProp("label", "First Screen > StringType")
							.assertRenderedTimes(1);
						query(widgetMap.Button)
							.withProp("label", "First Screen > NumberType")
							.assertRenderedTimes(1);
					});
				});

				function testGoToIssueButton(options: {
					readonly type: "top-level-screen" | "detail-screen" | "nested-repeat";
					readonly expectedModelPath: ModelPath;
					readonly expectedFocusedComponent: EngineStore.FocusedComponent;
					readonly currentMessageKey: string;
					readonly locationStackIndex: number;
				}) {
					const {
						type,
						currentMessageKey,
						expectedModelPath,
						expectedFocusedComponent,
						locationStackIndex
					} = options;
					const dispatchConfig = createStubbedDispatchConfig();
					const { widgetMap } = setup({
						expanded: true,
						currentMessageKey,
						onlyTopLevelMessages: type === "top-level-screen",
						onlyRepeatMessages: type === "detail-screen",
						onlyNestedRepeatMessages: type === "nested-repeat",
						dispatchConfig
					});

					const button = query(widgetMap.Button).withTestId("row").props();
					strictEqual(button.buttonAttributes?.role, "link");
					button.onClick?.({} as React.MouseEvent<HTMLElement>);

					strictEqual(dispatchConfig.correctionMode.onGoToElement.mock.callCount(), 1);
					const item = dispatchConfig.correctionMode.onGoToElement.mock.calls[0].arguments[0];
					deepStrictEqual(item.formModelPath, expectedModelPath, "Wrong form-model path");
					deepStrictEqual(
						item.locationStack[locationStackIndex].focusedComponent,
						expectedFocusedComponent,
						"Wrong path to focused component"
					);
				}

				describe("and the error can fixed on a top-level screen", () => {
					it("calls 'correctionMode.onGoToElement' if the link is clicked", () => {
						const path = createModelPath("Screen1", "cg2", "row-e82d0", "control-281ef");

						testGoToIssueButton({
							type: "top-level-screen",
							currentMessageKey: ERROR_KEY_2,
							expectedModelPath: path,
							expectedFocusedComponent: { formModelPath: path },
							locationStackIndex: 0
						});
					});
				});

				describe("and the error can fixed on a detached repeat detail screen", () => {
					it("calls 'correctionMode.onGoToElement' if the link is clicked", () => {
						const path = createModelPath(
							"Screen1",
							"detached-repeat",
							"detached-repeat-detail-screen",
							"grid-2",
							"row-2b260",
							"control-3b9f1"
						);

						testGoToIssueButton({
							type: "detail-screen",
							currentMessageKey: ERROR_KEY_DETAIL_SCREEN,
							expectedModelPath: path,
							expectedFocusedComponent: { formModelPath: path },
							locationStackIndex: 1
						});
					});
				});

				describe("and the error can fixed in a nested repeat on a detached repeat detail screen", () => {
					it("calls 'correctionMode.onGoToElement' if the link is clicked", () => {
						const path = createModelPath(
							"Screen1",
							"detached-repeat",
							"detached-repeat-detail-screen",
							"inline-repeat-nested_repeat",
							"fieldbasedrepeatoverviewcolumn-86c5b"
						);

						testGoToIssueButton({
							type: "nested-repeat",
							currentMessageKey: ERROR_KEY_NESTED_REPEAT,
							expectedModelPath: path,
							expectedFocusedComponent: { formModelPath: path, index: 0 },
							locationStackIndex: 1
						});
					});
				});

				describe("and clicking on the 'Next' button", () => {
					it("calls 'correctionMode.validationBar.onShowMessage' with the key of the next message", () => {
						const dispatchConfig = createStubbedDispatchConfig();
						const { widgetMap } = setup({
							expanded: true,
							currentMessageKey: ERROR_KEY_1,
							dispatchConfig
						});

						const button = query(widgetMap.Button).withProp("label", "Next").props();
						button.onClick?.({} as React.MouseEvent<HTMLElement>);

						strictEqual(
							dispatchConfig.correctionMode.validationBar.onShowMessage.mock.callCount(),
							1
						);
						strictEqual(
							dispatchConfig.correctionMode.validationBar.onShowMessage.mock.calls[0].arguments[0],
							ERROR_KEY_2
						);
					});
				});

				describe("and clicking on the 'Previous' button", () => {
					it("calls 'correctionMode.validationBar.onShowMessage' with the key of the previous message", () => {
						const dispatchConfig = createStubbedDispatchConfig();
						const { widgetMap } = setup({
							expanded: true,
							currentMessageKey: ERROR_KEY_2,
							dispatchConfig
						});

						const button = query(widgetMap.Button).withProp("label", "Previous").props();
						button.onClick?.({} as React.MouseEvent<HTMLElement>);

						strictEqual(
							dispatchConfig.correctionMode.validationBar.onShowMessage.mock.callCount(),
							1
						);
						strictEqual(
							dispatchConfig.correctionMode.validationBar.onShowMessage.mock.calls[0].arguments[0],
							ERROR_KEY_1
						);
					});
				});

				describe("and clicking on the 'Show all Issues' button", () => {
					it("calls 'correctionMode.validationBar.onExpand' to reset the message key", () => {
						const dispatchConfig = createStubbedDispatchConfig();
						const { widgetMap } = setup({
							expanded: true,
							currentMessageKey: ERROR_KEY_2,
							dispatchConfig
						});

						const button = query(widgetMap.Button).withProp("label", "Show All").props();
						button.onClick?.({} as React.MouseEvent<HTMLElement>);

						strictEqual(dispatchConfig.correctionMode.validationBar.onExpand.mock.callCount(), 1);
						// First parameter is the new expansion state
						strictEqual(
							dispatchConfig.correctionMode.validationBar.onExpand.mock.calls[0].arguments[0],
							true
						);
						// Second is the reset message
						strictEqual(
							dispatchConfig.correctionMode.validationBar.onExpand.mock.calls[0].arguments[1],
							true
						);
					});
				});
			});

			describe("and a warning is selected", () => {
				it("shows the selected warning in the header", () => {
					const { widgetMap } = setup({
						multipleCauses: false,
						expanded: true,
						currentMessageKey: WARNING_KEY_1,
						onlyTopLevelMessages: true
					});
					query(widgetMap.MobileValidationGraphic)
						.withProp("children", ["Warning", " (4/7)"])
						.withProp("variant", "warning")
						.assertRenderedTimes(1);
				});
			});

			describe("and an info is selected", () => {
				it("shows the selected info in the header", () => {
					const { widgetMap } = setup({
						multipleCauses: false,
						expanded: true,
						currentMessageKey: INFO_KEY_1,
						onlyTopLevelMessages: true
					});
					query(widgetMap.MobileValidationGraphic)
						.withProp("children", ["Info", " (6/7)"])
						.withProp("variant", "info")
						.assertRenderedTimes(1);
				});
			});

			describe("and clicking on the close button", () => {
				it("calls 'correctionMode.validationBar.onExpand'", () => {
					const dispatchConfig = createStubbedDispatchConfig();
					const { widgetMap } = setup({ setupDevApp: false, expanded: true, dispatchConfig });

					const button = query(widgetMap.Button).withTestId("button-close").props();
					button.onClick?.({} as React.MouseEvent<HTMLElement>);

					strictEqual(dispatchConfig.correctionMode.validationBar.onExpand.mock.callCount(), 1);
					// First parameter is the new expansion state
					strictEqual(
						dispatchConfig.correctionMode.validationBar.onExpand.mock.calls[0].arguments[0],
						false
					);
					// Second is the reset message
					strictEqual(
						dispatchConfig.correctionMode.validationBar.onExpand.mock.calls[0].arguments[1],
						true
					);
				});
			});
		});
	});

	describe("Given a state with validation messages and an information that the validation bar is not visible", () => {
		it("does not show a validation bar", () => {
			const { widgetMap } = setup({ validationBarNotVisible: true });
			query(widgetMap.MobileValidation).assertNotRendered();
		});
	});

	describe("Disabled Form-Engine", () => {
		it("disables the Validation Bar Overview", () => {
			const { widgetMap } = setup({ setupDevApp: false, disabled: true });
			const allProps = query(widgetMap.MobileValidationOverview).propsHistory();
			allProps.forEach(props => {
				strictEqual(props.onClick, undefined);
			});
		});

		it("disables the PreviewList Items", () => {
			const { widgetMap } = setup({ setupDevApp: false, expanded: true, disabled: true });
			const allProps = query(widgetMap.MobileValidationPreviewListItem).propsHistory();
			allProps.forEach(props => {
				strictEqual(props.onClick, undefined);
			});
		});

		it("disables links to the issues", () => {
			const { widgetMap } = setup({
				disabled: true,
				expanded: true,
				currentMessageKey: ERROR_KEY_2,
				onlyTopLevelMessages: true
			});
			query(widgetMap.Button)
				.withProp("label", "First Screen > StringType")
				.withProp("disabled", true)
				.assertRenderedTimes(1);
		});
	});

	describe("Localization", () => {
		describe("en", () => {
			executeLocalizationTest("en_US");
		});

		describe("de", () => {
			executeLocalizationTest("de_DE");
		});

		function executeLocalizationTest(locale: "en_US" | "de_DE"): void {
			describe("Given the modal is opened and an error is selected", () => {
				before(() => {
					// the RenderGroupFixture setup runs before the beforeEach above, so we need to stub earlier
					mock.method(provider, "get", () => "phone");
				});

				const { render, it } = RenderGroupFixture(() => {
					return setup({
						expanded: true,
						currentMessageKey: ERROR_KEY_1,
						multipleCauses: true,
						locale: Locale.fromString(locale) as Locale,
						onlyTopLevelMessages: true
					});
				});

				it("renders a localized 'previous' button", () => {
					const expectedText = locale === "en_US" ? "Previous" : "Zurück";
					query(render.wrapper.widgetMap.Button)
						.withProp("label", expectedText)
						.assertRenderedTimes(1);
				});

				it("renders a localized 'next' button", () => {
					const expectedText = locale === "en_US" ? "Next" : "Weiter";
					query(render.wrapper.widgetMap.Button)
						.withProp("label", expectedText)
						.assertRenderedTimes(1);
				});

				it("renders a localized 'show all' button", () => {
					const expectedText = locale === "en_US" ? "Show All" : "Alle zeigen";
					query(render.wrapper.widgetMap.Button)
						.withProp("label", expectedText)
						.assertRenderedTimes(1);
				});

				it("renders a localized 'Multiple causes' text", () => {
					const expectedText =
						locale === "en_US" ? "Multiple possible causes" : "Mehrere mögliche Fehlerquellen";
					query(render.wrapper.widgetMap.LayoutGridRow)
						.withProp("children", expectedText)
						.assertRenderedTimes(1);
				});

				it("renders a localized header text", () => {
					const expectedText = locale === "en_US" ? ["Error", " (1/7)"] : ["Fehler", " (1/7)"];
					query(render.wrapper.widgetMap.MobileValidationGraphic)
						.withProp("children", expectedText)
						.assertRenderedTimes(1);
				});
			});

			describe("Given the modal is opened and a warning is selected", () => {
				it("renders a localized header text", () => {
					const expectedText = locale === "en_US" ? ["Warning", " (4/7)"] : ["Warnung", " (4/7)"];
					const { widgetMap } = setup({
						expanded: true,
						currentMessageKey: WARNING_KEY_1,
						locale: Locale.fromString(locale) as Locale,
						onlyTopLevelMessages: true
					});
					query(widgetMap.MobileValidationGraphic)
						.withProp("children", expectedText)
						.assertRenderedTimes(1);
				});
			});

			describe("Given the modal is opened and an info is selected", () => {
				it("renders a localized header text", () => {
					const expectedText = locale === "en_US" ? ["Info", " (6/7)"] : ["Information", " (6/7)"];
					const { widgetMap } = setup({
						expanded: true,
						currentMessageKey: INFO_KEY_1,
						locale: Locale.fromString(locale) as Locale,
						onlyTopLevelMessages: true
					});
					query(widgetMap.MobileValidationGraphic)
						.withProp("children", expectedText)
						.assertRenderedTimes(1);
				});
			});
		}
	});

	const ERROR_KEY_1 = "ERROR:/group[1]/StringType[1]:1:MessageCode";
	const ERROR_KEY_2 = "ERROR:/group[1]/StringType[1]:2:MessageCode";
	const ERROR_KEY_DETAIL_SCREEN = "ERROR:/repeat[1]/StringType2[1]:1:MessageCode";
	const ERROR_KEY_NESTED_REPEAT = "ERROR:/repeat[1]/nested_repeat[1]/StringType[1]:1:MessageCode";
	const WARNING_KEY_1 = "WARNING:/group[1]/NumberType[1]:1:MessageCode";
	const INFO_KEY_1 = "INFO:/group[1]/NumberType[1]:3:MessageCode";
	const INFO_KEY_2 = "INFO:/group[1]/NumberType[1]:4:MessageCode";

	function setup(props: {
		setupDevApp?: boolean;
		expanded?: boolean;
		multipleCauses?: boolean;
		validationBarNotVisible?: boolean;
		disabled?: boolean;
		onlyInfos?: boolean;
		onlyWarnings?: boolean;
		onlyErrors?: boolean;
		currentMessageKey?: string;
		locale?: Locale;
		onlyTopLevelMessages?: boolean;
		onlyRepeatMessages?: boolean;
		onlyNestedRepeatMessages?: boolean;
		dispatchConfig?: StubbedDispatchConfig;
	}): RtlRenderWrapper {
		return setupValidationBarTests({ models, ...props });
	}
});
