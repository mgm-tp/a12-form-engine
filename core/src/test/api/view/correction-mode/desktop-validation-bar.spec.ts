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

import { deepStrictEqual, strictEqual } from "node:assert/strict";

import { act } from "@testing-library/react";

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import { query } from "@com.mgmtp.a12.devtools/react";

import type { EngineStore } from "../../../../back-end/store/internal/store.js";
import type { WidgetMap } from "../../../../view/index.js";
import type { RtlRenderWrapper } from "../../../rtl-utils/render-wrapper.js";
import { setupModelsFixture } from "../../../utils/setupFixture.js";
import { createModelPath } from "../../../utils/test-model-helpers/repeat.infinite-scrolling.js";

import type { StubbedDispatchConfig } from "./validation-bar-setup.js";
import { createStubbedDispatchConfig, setupValidationBarTests } from "./validation-bar-setup.js";

describe("api.view.validation.Validation Bar", () => {
	const models = setupModelsFixture("computation-validation.errors_and_warnings_and_infos");

	describe("Given a state with validation messages and an information that the validation bar is visible", () => {
		describe("given a state information that the validation bar is not expanded", () => {
			describe("and an error which has one cause", () => {
				it("shows a not expanded validation bar with the first error text and the reason", () => {
					const { widgetMap } = setupForDesktop({ setupDevApp: false });
					const props = query(widgetMap.ValidationBar).props();

					strictEqual(props.variant, "error");
					strictEqual(props.primaryTitle, "Error String 1");
					strictEqual(props.secondaryTitle, "First Screen > StringType");
					strictEqual(props.children, undefined);
				});
			});

			describe("and an error which has multiple causes", () => {
				it(
					"shows a not expanded validation bar with the first error text " +
						"and an information that there are multiple causes ",
					() => {
						const { widgetMap } = setupForDesktop({ setupDevApp: false, multipleCauses: true });
						const props = query(widgetMap.ValidationBar).props();

						strictEqual(props.variant, "error");
						strictEqual(props.primaryTitle, "Error String 1");
						strictEqual(props.secondaryTitle, "Multiple possible causes");
						strictEqual(props.children, undefined);
					}
				);
			});
		});

		describe("given a state information that the validation bar is expanded", () => {
			it("shows an expanded validation bar with the first error and the jumping links if state.validationBar.expanded = true", () => {
				const { widgetMap } = setupForDesktop({
					setupDevApp: false,
					expanded: true,
					multipleCauses: true
				});

				const rows = query(widgetMap.SizeContainerRow).withTestId("row").groupByTestId();
				strictEqual(rows.at(0).props().children, "Error String 1");
				strictEqual(rows.at(1).props().children, "Multiple possible causes");

				const links = query(widgetMap.Button).withTestId("row").groupByTestId();
				strictEqual(links.at(0).props().label, "First Screen > StringType");
				strictEqual(links.at(1).props().label, "First Screen > NumberType");
			});
		});

		it("has 21 errors", () => {
			const { widgetMap } = setupForDesktop({ setupDevApp: false, onlyTopLevelMessages: true });
			const props = query(widgetMap.Pagination).props();

			strictEqual(props.pageCount, 7);
			strictEqual(props.currentPage, 1);
		});

		it("sorts errors before warnings", () => {
			const { widgetMap } = setupForDesktop({ setupDevApp: true });
			// tests implicit pagination
			changePageAndCheckResult(widgetMap, 2, "error");
			changePageAndCheckResult(widgetMap, 3, "error");
			changePageAndCheckResult(widgetMap, 4, "warning");
			changePageAndCheckResult(widgetMap, 5, "warning");
			changePageAndCheckResult(widgetMap, 6, "info");
			changePageAndCheckResult(widgetMap, 7, "info");
		});

		function changePageAndCheckResult(
			widgetMap: WidgetMap,
			page: number,
			severity: "error" | "warning" | "info"
		): void {
			const pagination = query(widgetMap.Pagination);
			const pageChange = pagination.props().onPageChanged;
			pagination.resetHistory();
			act(() => pageChange(page));

			const paginationProps = pagination.props();
			strictEqual(paginationProps.currentPage, page, "Expected to be on page " + page);
			const validationBarProps = query(widgetMap.ValidationBar).props();
			strictEqual(validationBarProps.variant, severity);
		}
	});

	describe("Given a state with validation messages and an information that the validation bar is not visible", () => {
		it("does not show a validation bar", () => {
			const { widgetMap } = setupForDesktop({ validationBarNotVisible: true });
			query(widgetMap.ValidationBar).assertNotRendered();
		});
	});

	describe("QuickAccessButton", () => {
		describe("one cause for issue", () => {
			it("shows the Goto-Issue button", () => {
				const { widgetMap } = setupForDesktop({});
				query(widgetMap.Button).withProp("title", "Go to Issue").assertRenderedTimes(1);
			});
		});

		describe("multiple causes for issue", () => {
			it("disables the GoTo-Issue button and enables the other buttons", () => {
				const { widgetMap } = setupForDesktop({ multipleCauses: true });
				query(widgetMap.ListItem).groupByTestId().assertSize(3);
				// First item: Go To issue
				query(widgetMap.ListItem)
					.withProp("text", "Go to Issue")
					.withProp("disabled", true)
					.assertRenderedTimes(1);
				// Second item: Expand message
				query(widgetMap.ListItem)
					.withProp("text", "Expand Message")
					.withProp("disabled", false)
					.assertRenderedTimes(1);
				// Third item: View all issues
				query(widgetMap.ListItem)
					.withProp("text", "Show All Issues")
					.withProp("disabled", false)
					.assertRenderedTimes(1);
			});

			it("shows the Expand button when the validation bar is collapsed", () => {
				const { widgetMap } = setupForDesktop({ multipleCauses: true });
				query(widgetMap.Button).withProp("title", "Expand Message").assertRenderedTimes(1);
			});

			it("shows the Collapse button when the validation bar is expanded", () => {
				const dispatchConfig = createStubbedDispatchConfig();
				const { widgetMap } = setupForDesktop({ expanded: true, dispatchConfig });

				const props = query(widgetMap.Button).withProp("title", "Collapse Message").props();
				props.onClick?.({} as React.MouseEvent<HTMLElement>);
				strictEqual(dispatchConfig.correctionMode.validationBar.onExpand.mock.callCount(), 1);
				// First parameter is the new expansion state
				strictEqual(
					dispatchConfig.correctionMode.validationBar.onExpand.mock.calls[0].arguments[0],
					false
				);
				// Second is the reset message
				strictEqual(
					dispatchConfig.correctionMode.validationBar.onExpand.mock.calls[0].arguments[1],
					false
				);
			});
		});

		describe("behavior", () => {
			describe("Given a validation bar with a quick menu where", () => {
				describe("the expand message button is active", () => {
					it("dispatches 'validationBar.onExpand' with expand=true if the expand button is clicked", () => {
						const dispatchConfig = createStubbedDispatchConfig();
						const { widgetMap } = setupForDesktop({
							expanded: false,
							multipleCauses: true,
							dispatchConfig
						});
						const activeButton = query(widgetMap.Button)
							.withProp("title", "Expand Message")
							.props();
						activeButton.onClick?.({} as React.MouseEvent<HTMLElement>);
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

				describe("the collapse message button is active", () => {
					it("calls 'validationBar.onExpand' with expand=false if the expand button is clicked", () => {
						const dispatchConfig = createStubbedDispatchConfig();
						const { widgetMap } = setupForDesktop({ expanded: true, dispatchConfig });
						const activeButton = query(widgetMap.Button)
							.withProp("title", "Collapse Message")
							.props();
						activeButton.onClick?.({} as React.MouseEvent<HTMLElement>);
						strictEqual(dispatchConfig.correctionMode.validationBar.onExpand.mock.callCount(), 1);
						// First parameter is the new expansion state
						strictEqual(
							dispatchConfig.correctionMode.validationBar.onExpand.mock.calls[0].arguments[0],
							false
						);
						// Second is the reset message
						strictEqual(
							dispatchConfig.correctionMode.validationBar.onExpand.mock.calls[0].arguments[1],
							false
						);
					});
				});

				describe("the 'Go to Issue' button is active", () => {
					function testGoToIssueButton(options: {
						readonly type: "top-level-screen" | "detail-screen" | "nested-repeat";
						readonly expectedModelPath: ModelPath;
						readonly expectedFocusedComponent: EngineStore.FocusedComponent;
						readonly locationStackIndex: number;
					}): void {
						const dispatchConfig = createStubbedDispatchConfig();
						const { type, expectedModelPath, expectedFocusedComponent, locationStackIndex } =
							options;
						const { widgetMap } = setupForDesktop({
							multipleCauses: false,
							onlyTopLevelMessages: type === "top-level-screen",
							onlyRepeatMessages: type === "detail-screen",
							onlyNestedRepeatMessages: type === "nested-repeat",
							dispatchConfig
						});
						const button = query(widgetMap.Button).withProp("title", "Go to Issue").props();
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

					describe("and the issue can be fixed on a top-level screen", () => {
						it("calls 'correctionMode.onGoToElement' if the button is clicked", () => {
							const path = createModelPath("Screen1", "cg2", "row-e82d0", "control-281ef");
							testGoToIssueButton({
								type: "top-level-screen",
								expectedModelPath: path,
								expectedFocusedComponent: { formModelPath: path },
								locationStackIndex: 0
							});
						});
					});

					describe("and the issue can be fixed on a detached repeat detail screen", () => {
						it("calls 'correctionMode.onGoToElement' if the button is clicked", () => {
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
								expectedModelPath: path,
								expectedFocusedComponent: { formModelPath: path },
								locationStackIndex: 1
							});
						});
					});

					describe("and the issue can be fixed in a nested repeat on a detached repeat detail screen", () => {
						it("calls 'correctionMode.onGoToElement' if the button is clicked", () => {
							const path = createModelPath(
								"Screen1",
								"detached-repeat",
								"detached-repeat-detail-screen",
								"inline-repeat-nested_repeat",
								"fieldbasedrepeatoverviewcolumn-86c5b"
							);
							testGoToIssueButton({
								type: "nested-repeat",
								expectedModelPath: path,
								expectedFocusedComponent: { formModelPath: path, index: 0 },
								locationStackIndex: 1
							});
						});
					});

					it("does not call 'correctionMode.validationBar.onExpand' if the button is clicked", () => {
						const dispatchConfig = createStubbedDispatchConfig();
						const { widgetMap } = setupForDesktop({ multipleCauses: false, dispatchConfig });
						const button = query(widgetMap.Button).withProp("title", "Go to Issue").props();
						button.onClick?.({} as React.MouseEvent<HTMLElement>);
						strictEqual(dispatchConfig.correctionMode.validationBar.onExpand.mock.callCount(), 0);
					});
				});

				describe("the portal is open", () => {
					describe("a click on the 'Expand Message' entry", () => {
						it("calls 'validationBar.onExpand' with expand=true if the expand button is clicked", () => {
							const dispatchConfig = setupTest({ searchText: "Expand Message" });
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

					describe("a click on the 'Collapse Message' entry", () => {
						it("calls 'validationBar.onExpand' with expand=false if the collapse button is clicked", () => {
							const dispatchConfig = setupTest({
								searchText: "Collapse Message",
								expanded: true
							});
							strictEqual(dispatchConfig.correctionMode.validationBar.onExpand.mock.callCount(), 1);
							// First parameter is the new expansion state
							strictEqual(
								dispatchConfig.correctionMode.validationBar.onExpand.mock.calls[0].arguments[0],
								false
							);
							// Second is the reset message
							strictEqual(
								dispatchConfig.correctionMode.validationBar.onExpand.mock.calls[0].arguments[1],
								false
							);
						});
					});

					describe("a click on the 'Show all issues' entry", () => {
						it("calls 'validationBar.correctionView.onShow' if the entry is clicked", () => {
							const dispatchConfig = setupTest({ searchText: "Show All Issues" });
							strictEqual(dispatchConfig.correctionMode.correctionView.onShow.mock.callCount(), 1);
						});
					});

					describe("a click on the 'GoTo issue' entry", () => {
						it("calls 'correctionMode.onGoToElement' if the entry is clicked", () => {
							const dispatchConfig = setupTest({ searchText: "Go to Issue" });
							strictEqual(dispatchConfig.correctionMode.onGoToElement.mock.callCount(), 1);
						});
					});

					function setupTest(props: {
						searchText: string;
						expanded?: boolean;
					}): StubbedDispatchConfig {
						const dispatchConfig = createStubbedDispatchConfig();
						const { widgetMap } = setupForDesktop({ expanded: props.expanded, dispatchConfig });
						const listItem = query(widgetMap.ListItem).withProp("text", props.searchText).props();
						listItem.onClick?.({} as React.MouseEvent<HTMLElement>);
						return dispatchConfig;
					}
				});
			});
		});
	});

	describe("Jumping links", () => {
		it("calls 'correctionMode.onGoToElement' if the link is clicked", () => {
			const dispatchConfig = createStubbedDispatchConfig();
			const { widgetMap } = setupForDesktop({
				multipleCauses: false,
				expanded: true,
				dispatchConfig
			});
			const button = query(widgetMap.Button).withProp("label", "First Screen > StringType").props();
			button.onClick?.({} as React.MouseEvent<HTMLElement>);

			strictEqual(dispatchConfig.correctionMode.onGoToElement.mock.callCount(), 1);

			const item = dispatchConfig.correctionMode.onGoToElement.mock.calls[0].arguments[0];
			deepStrictEqual(
				item.formModelPath,
				createModelPath("Screen1", "cg2", "row-e82d0", "control-281ef"),
				"Wrong form-model path"
			);
			deepStrictEqual(
				item.locationStack[0].focusedComponent,
				{
					formModelPath: createModelPath("Screen1", "cg2", "row-e82d0", "control-281ef")
				},
				"Wrong path to focused component"
			);
		});

		it("calls 'correctionMode.validationBar.onExpand' with 'expand=false' if the validation bar is expanded and if the link is clicked", () => {
			const dispatchConfig = createStubbedDispatchConfig();
			const { widgetMap } = setupForDesktop({
				multipleCauses: false,
				expanded: true,
				dispatchConfig
			});
			const button = query(widgetMap.Button).withProp("label", "First Screen > StringType").props();
			button.onClick?.({} as React.MouseEvent<HTMLElement>);

			strictEqual(dispatchConfig.correctionMode.validationBar.onExpand.mock.callCount(), 1);

			const expanded =
				dispatchConfig.correctionMode.validationBar.onExpand.mock.calls[0].arguments[0];
			const resetCurrentMessage =
				dispatchConfig.correctionMode.validationBar.onExpand.mock.calls[0].arguments[1];
			deepStrictEqual(expanded, false);
			deepStrictEqual(resetCurrentMessage, false);
		});

		it("have aria role='link'", () => {
			const { widgetMap } = setupForDesktop({ multipleCauses: false, expanded: true });
			const props = query(widgetMap.Button).withProp("label", "First Screen > StringType").props();
			strictEqual(props.buttonAttributes?.role, "link");
		});
	});

	describe("Disabled Form-Engine", () => {
		it("disables the QuickAccessButton", () => {
			const { widgetMap } = setupForDesktop({ disabled: true });
			query(widgetMap.QuickAccessButton).withProp("disabled", true).assertRenderedTimes(1);
		});

		it("disabled the Pagination", () => {
			const { widgetMap } = setupForDesktop({ disabled: true });
			query(widgetMap.Pagination).withProp("disabled", true).assertRenderedTimes(1);
		});

		it("disables links to the issues", () => {
			const { widgetMap } = setupForDesktop({ expanded: true, disabled: true });
			const allLinks = query(widgetMap.Button).propsHistory();
			allLinks.forEach(link => {
				strictEqual(link.disabled, true);
			});
		});
	});

	function setupForDesktop(props: {
		setupDevApp?: boolean;
		expanded?: boolean;
		multipleCauses?: boolean;
		validationBarNotVisible?: boolean;
		disabled?: boolean;
		onlyTopLevelMessages?: boolean;
		onlyRepeatMessages?: boolean;
		onlyNestedRepeatMessages?: boolean;
		dispatchConfig?: StubbedDispatchConfig;
	}): RtlRenderWrapper {
		return setupValidationBarTests({ models, ...props });
	}
});
