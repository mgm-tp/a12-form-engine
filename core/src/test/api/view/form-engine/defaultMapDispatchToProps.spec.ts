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

import type { Dispatch } from "redux";

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import type { Attachment } from "@com.mgmtp.a12.dataservices/dataservices-access";
import type {
	EntityInstancePath,
	FieldInstanceValue
} from "@com.mgmtp.a12.kernel/kernel-md-facade";
import type { ValueConversionParseError } from "@com.mgmtp.a12.utils/utils-localization";

import type { CorrectionModeItem } from "../../../../back-end/store/internal/CorrectionModeItem.js";
import type {
	EngineStore,
	FilterParseError,
	RepeatFilter
} from "../../../../back-end/store/internal/store.js";
import { defaultMapDispatchToProps } from "../../../../view/index.js";
import { createModelPath } from "../../../utils/createModelPath.js";

const FORM_ENGINE_EVENT_PREFIX = "form-engine/event/";

describe("api.view.defaultMapDispatchToProps", () => {
	const dispatchSpy = mock.fn<Dispatch>();
	const mapDispatchToProps = defaultMapDispatchToProps(dispatchSpy);

	function checkDispatchedEvent(
		func: (...args: any[]) => void,
		parameters: any[][],
		expectedEventType: string
	) {
		const hasParameters = parameters.length > 0;
		if (hasParameters) {
			func(...parameters.map(parameter => parameter[1]));
		} else {
			func();
		}

		strictEqual(dispatchSpy.mock.callCount(), 1);
		const dispatchedEvent = dispatchSpy.mock.calls[0].arguments[0];
		strictEqual(dispatchedEvent.type, FORM_ENGINE_EVENT_PREFIX + expectedEventType);

		if (hasParameters) {
			const expectedPayload: { [index: string]: any } = {};
			parameters.forEach(parameter => {
				expectedPayload[parameter[0]] = parameter[1];
			});
			deepStrictEqual(dispatchedEvent.payload, expectedPayload);
		}
	}

	afterEach(() => {
		dispatchSpy.mock.resetCalls();
	});

	describe("will dispatch an", () => {
		it("Events.valueChange action with the respective payload if onValueChange was called ", () => {
			const parameters = [
				["path", [{ elementName: "abc", index: 0 }] as EntityInstancePath],
				["value", 42 as FieldInstanceValue],
				["formModelElementPath", []]
			];
			checkDispatchedEvent(
				mapDispatchToProps.eventHandlers.onValueChange,
				parameters,
				"VALUE_CHANGE"
			);
		});

		it("Events.inputTouched action with the respective payload if onInputTouched was called ", () => {
			checkDispatchedEvent(mapDispatchToProps.eventHandlers.onInputTouched, [], "INPUT_TOUCHED");
		});

		it("Events.parseError action with the respective payload if onParseError was called ", () => {
			const parameters = [
				["path", [{ elementName: "abc", index: 0 }] as EntityInstancePath],
				["uiValue", "abc" as string],
				[
					"error",
					{
						errorKey: "testKey",
						errorCode: "testCode",
						severity: "ERROR"
					} as ValueConversionParseError
				],
				["formModelElementPath", [] as ModelPath]
			];
			checkDispatchedEvent(
				mapDispatchToProps.eventHandlers.onParseError,
				parameters,
				"PARSE_ERROR"
			);
		});
		it("Events.collapseSection action with the respective payload if onCollapseSection was called ", () => {
			const parameters = [
				["collapse", true as boolean],
				["path", [{ elementName: "abc" }] as ModelPath]
			];
			checkDispatchedEvent(
				mapDispatchToProps.eventHandlers.onCollapseSection,
				parameters,
				"COLLAPSE_SECTION"
			);
		});
		it("Events.navigationButton action with the respective payload if onNavigationButton was called ", () => {
			const parameters = [
				["target", "abc"],
				["validation", "partial"]
			];
			checkDispatchedEvent(
				mapDispatchToProps.eventHandlers.onNavigationButton,
				parameters,
				"NAVIGATION_BUTTON"
			);
		});
		it("Events.eventButtonTrigger action with the respective payload if onEventButton was called", () => {
			const parameters = [
				["name", "abc"],
				["validation", undefined],
				["buttonPath", undefined]
			];
			checkDispatchedEvent(
				mapDispatchToProps.eventHandlers.onEventButton,
				parameters,
				"EVENT_BUTTON_TRIGGERED"
			);
		});
		it("Events.attachmentValueChange action with the respective payload if onCustomValueChange was called ", () => {
			const parameters = [
				["path", [{ elementName: "abc", index: 0 }] as EntityInstancePath],
				["value", {} as Attachment],
				["formModelElementPath", []]
			];
			checkDispatchedEvent(
				mapDispatchToProps.eventHandlers.onAttachmentValueChange,
				parameters,
				"ATTACHMENT_VALUE_CHANGE"
			);
		});
	});

	describe("Repeat", () => {
		describe("will dispatch an", () => {
			it("Events.Repeat.moveRowTriggered action with the respective payload if onMoveRow was called ", () => {
				const parameters = [
					["repeatFormModelPath", [{ elementName: "abc" }] as ModelPath],
					["rowPath", [{ elementName: "abc", index: 0 }] as EntityInstancePath],
					["delta", 42 as number]
				];
				checkDispatchedEvent(
					mapDispatchToProps.eventHandlers.repeat.onMoveRow,
					parameters,
					"MOVE_ROW"
				);
			});

			it("Events.Repeat.cloneRowTriggered action with the respective payload if onCloneRow was called ", () => {
				const parameters = [
					["rowPath", [{ elementName: "abc", index: 0 }] as EntityInstancePath],
					["repeatFormModelPath", [{ elementName: "abc" }] as ModelPath]
				];
				checkDispatchedEvent(
					mapDispatchToProps.eventHandlers.repeat.onCloneRow,
					parameters,
					"CLONE_ROW"
				);
			});

			it("Events.Repeat.leaveRepeatRow action with the respective payload if onLeaveRepeatRow was called ", () => {
				const parameters = [
					["rowPath", [{ elementName: "abc", index: 0 }] as EntityInstancePath],
					["repeatFormModelPath", [{ elementName: "abc" }] as ModelPath]
				];
				checkDispatchedEvent(
					mapDispatchToProps.eventHandlers.repeat.onLeaveRepeatRow,
					parameters,
					"LEAVE_REPEAT_ROW"
				);
			});

			it("Events.Repeat.leaveTable action with the respective payload if onLeaveTable was called ", () => {
				const parameters = [["repeatFormModelPath", [{ elementName: "abc" }] as ModelPath]];
				checkDispatchedEvent(
					mapDispatchToProps.eventHandlers.repeat.onLeaveTable,
					parameters,
					"LEAVE_TABLE"
				);
			});

			it(
				"Events.Repeat.addRow action with the respective payload if " + "addRow was called ",
				() => {
					const parameters = [
						["path", [{ elementName: "abc", index: 0 }] as EntityInstancePath],
						["repeatFormModelPath", [{ elementName: "abc" }] as ModelPath]
					];
					checkDispatchedEvent(
						mapDispatchToProps.eventHandlers.repeat.addRow,
						parameters,
						"ADD_ROW"
					);
				}
			);

			it("Events.Repeat.leaveDetachedRepeatRow action with the respective payload if onLeaveDetachedRepeatRow was called ", () => {
				const parameters = [["cancel", true as boolean]];
				checkDispatchedEvent(
					mapDispatchToProps.eventHandlers.repeat.onLeaveDetachedRepeatRow,
					parameters,
					"LEAVE_DETACHED_REPEAT_ROW"
				);
			});

			it("Events.Repeat.sortingChange action with the respective payload if onSortingChange was called ", () => {
				const parameters = [
					["repeatFormModelPath", [{ elementName: "abc" }] as ModelPath],
					["orderPath", [{ elementName: "abc", index: 0 }] as EntityInstancePath],
					["sorting", "asc" as "asc" | "desc" | undefined]
				];
				checkDispatchedEvent(
					mapDispatchToProps.eventHandlers.repeat.onSortingChange,
					parameters,
					"SORTING_CHANGE"
				);
			});

			it("Events.Repeat.showFilter action with the respective payload if onShowFilter was called ", () => {
				const parameters = [
					["repeatFormModelPath", [{ elementName: "abc" }] as ModelPath],
					["opened", true as boolean]
				];
				checkDispatchedEvent(
					mapDispatchToProps.eventHandlers.repeat.onShowFilter,
					parameters,
					"SHOW_FILTER"
				);
			});

			it("Events.Repeat.filterValueChange action with the respective payload if onFilterValueChange was called ", () => {
				const parameters = [
					["repeatFormModelPath", [{ elementName: "abc" }] as ModelPath],
					["columnId", "abc" as string],
					["filter", { filterValue: "abc" } as RepeatFilter]
				];
				checkDispatchedEvent(
					mapDispatchToProps.eventHandlers.repeat.onFilterValueChange,
					parameters,
					"FILTER_VALUE_CHANGE"
				);
			});

			it("Events.Repeat.filterParseError action with the respective payload if onFilterParseError was called ", () => {
				const parameters = [
					["columnId", "abc" as string],
					["repeatFormModelPath", [{ elementName: "abc" }] as ModelPath],
					[
						"errors",
						{
							fromError: {
								error: { errorKey: "testKey", errorCode: "testCode", severity: "ERROR" },
								value: "abc"
							} as FilterParseError,
							toError: {
								error: { errorKey: "testKey", errorCode: "testCode", severity: "ERROR" },
								value: "abc"
							} as FilterParseError
						}
					]
				];
				checkDispatchedEvent(
					mapDispatchToProps.eventHandlers.repeat.onFilterParseError,
					parameters,
					"FILTER_PARSE_ERROR"
				);
			});

			it("Events.Repeat.clearFilters action with the respective payload if onClearFilters was called ", () => {
				const parameters = [["repeatFormModelPath", [{ elementName: "abc" }] as ModelPath]];
				checkDispatchedEvent(
					mapDispatchToProps.eventHandlers.repeat.onClearFilters,
					parameters,
					"CLEAR_FILTERS"
				);
			});

			it(
				"Events.Repeat.removeRow action with the respective payload if " + "removeRow was called ",
				() => {
					const parameters = [
						["rowPath", [{ elementName: "abc", index: 0 }] as EntityInstancePath],
						["repeatFormModelPath", [{ elementName: "abc" }] as ModelPath]
					];
					checkDispatchedEvent(
						mapDispatchToProps.eventHandlers.repeat.removeRow,
						parameters,
						"REMOVE_ROW"
					);
				}
			);

			it("Events.Repeat.changePage action with the respective payload if onChangePage was called ", () => {
				const parameters = [
					["page", 42 as number],
					["repeatFormModelPath", [{ elementName: "abc", index: 0 }] as EntityInstancePath]
				];
				checkDispatchedEvent(
					mapDispatchToProps.eventHandlers.repeat.onChangePage,
					parameters,
					"CHANGE_PAGE"
				);
			});

			it("Events.Repeat.customRowAction action with the respective payload if onCustomRowAction was called ", () => {
				const parameters = [
					["rowPath", [{ elementName: "abc", index: 0 }] as EntityInstancePath],
					["repeatFormModelPath", [{ elementName: "abc" }] as ModelPath],
					["eventName", "abc" as string]
				];
				checkDispatchedEvent(
					mapDispatchToProps.eventHandlers.repeat.onCustomRowAction,
					parameters,
					"CUSTOM_ROW_ACTION"
				);
			});

			it("Events.Repeat.enterRow action with the respective payload if enterRow was called ", () => {
				const parameters = [
					["rowPath", [{ elementName: "abc", index: 0 }] as EntityInstancePath],
					["repeatFormModelPath", [{ elementName: "abc" }] as ModelPath],
					["triggerElement", undefined]
				];
				checkDispatchedEvent(
					mapDispatchToProps.eventHandlers.repeat.enterRow,
					parameters,
					"ENTER_ROW"
				);
			});

			it("Events.Repeat.closeEmbeddedRepeatRow action with the respective payload if onCloseEmbeddedRepeatRow was called ", () => {
				const parameters = [["repeatFormModelPath", [{ elementName: "abc" }] as ModelPath]];
				checkDispatchedEvent(
					mapDispatchToProps.eventHandlers.repeat.onCloseEmbeddedRepeatRow,
					parameters,
					"CLOSE_EMBEDDED_REPEAT_ROW"
				);
			});

			it("Events.Repeat.changeColumnWidth action with the respective payload if onColumnWidthChange was called ", () => {
				const parameters = [
					["columnPath", createModelPath("screen1", "dummySec", "dummyRepeat", "dummyColumn")],
					["width", 4]
				];
				checkDispatchedEvent(
					mapDispatchToProps.eventHandlers.repeat.onColumnWidthChange,
					parameters,
					"CHANGE_COLUMN_WIDTH"
				);
			});
		});
	});

	describe("CorrectionMode", () => {
		describe("will dispatch an", () => {
			it("Events.CorrectionMode.revalidate action with the respective payload if onRevalidate was called ", () => {
				checkDispatchedEvent(
					mapDispatchToProps.eventHandlers.correctionMode.onRevalidate,
					[],
					"VALIDATION_BUTTON"
				);
			});
			it("Events.CorrectionMode.goToElement action with the respective payload if onGoToElement was called ", () => {
				const parameters = [
					[
						"item",
						{
							formModelPath: [{ elementName: "abc" }] as ModelPath,
							locationStack: [] as ReadonlyArray<EngineStore.ScreenState>,
							sectionsCollapse: {} as ReadonlyArray<{
								readonly path: ModelPath;
								readonly collapse: boolean;
							}>
						} as CorrectionModeItem
					],
					["messageKey", "abc" as string]
				];
				checkDispatchedEvent(
					mapDispatchToProps.eventHandlers.correctionMode.onGoToElement,
					parameters,
					"GO_TO_ELEMENT"
				);
			});
			it("Events.CorrectionMode.exitCorrectionMode action with the respective payload if onExitCorrectionMode was called ", () => {
				checkDispatchedEvent(
					mapDispatchToProps.eventHandlers.correctionMode.onExitCorrectionMode,
					[],
					"EXIT_CORRECTION_MODE"
				);
			});
			it("Events.CorrectionMode.CorrectionView.show action with the respective payload if onShow was called ", () => {
				const parameters = [["show", true as boolean]];
				checkDispatchedEvent(
					mapDispatchToProps.eventHandlers.correctionMode.correctionView.onShow,
					parameters,
					"SHOW_CORRECTION_VIEW"
				);
			});
			it("Events.CorrectionMode.CorrectionView.showDetails action with the respective payload if onShowDetails was called ", () => {
				const parameters = [
					["element", "abc" as string],
					["showDetails", true as boolean]
				];
				checkDispatchedEvent(
					mapDispatchToProps.eventHandlers.correctionMode.correctionView.onShowDetails,
					parameters,
					"SHOW_DETAILS"
				);
			});
			it("Events.CorrectionMode.ValidationBar.showMessage action with the respective payload if onShowMessage was called ", () => {
				const parameters = [["messageKey", "abc" as string]];
				checkDispatchedEvent(
					mapDispatchToProps.eventHandlers.correctionMode.validationBar.onShowMessage,
					parameters,
					"SHOW_MESSAGE"
				);
			});
			it("Events.CorrectionMode.ValidationBar.expand action with the respective payload if onExpand was called ", () => {
				const parameters = [
					["expanded", true as boolean],
					["resetCurrentMessage", true as boolean]
				];
				checkDispatchedEvent(
					mapDispatchToProps.eventHandlers.correctionMode.validationBar.onExpand,
					parameters,
					"EXPAND_VALIDATION_BAR"
				);
			});
		});
	});
});
