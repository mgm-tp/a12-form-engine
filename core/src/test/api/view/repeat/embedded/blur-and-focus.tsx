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

import { deepEqual, equal } from "node:assert/strict";
import { mock } from "node:test";

import { fireEvent } from "@testing-library/react";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import { within } from "@com.mgmtp.a12.devtools/react";

import { defaultMapDispatchToProps, DefaultWidgetMap } from "../../../../../view/index.js";
import { DefaultTableWidgetMap } from "../../../../../view/internal/components/form-engine/repeat/table-widget-map.js";
import { DATE_PICKER } from "../../../../rtl-utils/data-roles.js";
import { mockFunctions } from "../../../../rtl-utils/mock-map.js";
import type { RtlRenderWrapper } from "../../../../rtl-utils/render-wrapper.js";
import { createDocumentPath } from "../../../../utils/createDocumentPath.js";
import { createModelPath } from "../../../../utils/createModelPath.js";
import { setupConnectedFormEngineWithRtlAsync } from "../../../../utils/setup.js";
import { setupModelsFixture } from "../../../../utils/setupFixture.js";
import {
	createDocumentForBlurAndFocus,
	DOCUMENT_MODEL,
	FORM_MODEL,
	IDS
} from "../../../../utils/test-model-helpers/repeat.blur-and-focus.js";

export function executeBlurAndFocusTest(): void {
	const models = setupModelsFixture("repeat.blur-and-focus");

	const stubbedDispatch = defaultMapDispatchToProps(mock.fn());
	const onLeaveRepeatRowStub = mock.fn();
	const onLeaveTableStub = mock.fn();

	afterEach(() => {
		onLeaveRepeatRowStub.mock.resetCalls();
		onLeaveTableStub.mock.resetCalls();
	});

	describe("given an active row", () => {
		describe("and onBlur occurs", () => {
			describe("and the new active element is inside the same row", () => {
				it("does not call onLeaveRepeatRow", async () => {
					const { baseElement } = await setup();
					const stringInput = within(baseElement).getById(IDS.ER_L1_STRING);
					const dateInput = within(baseElement).getById(IDS.ER_L1_DATE);

					fireEvent.blur(stringInput, {
						currentTarget: baseElement,
						relatedTarget: dateInput
					});

					equal(onLeaveRepeatRowStub.mock.callCount(), 0);
				});
			});

			describe("and the new active element is outside the row", () => {
				it("calls onLeaveRepeatRow with the correct parameters", async () => {
					const { baseElement } = await setup();
					const firstRow = within(baseElement).getById(IDS.ER_EXPANDED_ROW + "-0");
					const deleteButtonInSecondRow = within(baseElement).getById(IDS.ER_REMOVE_BUTTON + "-2");
					const stringInputRow1 = within(firstRow).getById(IDS.ER_L1_STRING);

					fireEvent.blur(stringInputRow1, {
						currentTarget: firstRow,
						relatedTarget: deleteButtonInSecondRow
					});

					assertOnLeaveRowStubCall();
				});
			});

			describe("and the new active element is outside the repeat", () => {
				it("calls onLeaveTable with the correct parameters", async () => {
					const { baseElement } = await setup();
					const stringInput = within(baseElement).getById(IDS.ER_L1_STRING);
					const stringInput1 = within(baseElement).getById(IDS.L0_STRING);
					fireEvent.blur(stringInput, {
						currentTarget: baseElement,
						relatedTarget: stringInput1
					});

					assertOnLeaveTableStubCall();
				});
			});

			describe("because onBlur in a date-picker was executed", () => {
				it("does not call onLeaveRepeatRow or onLeaveTable", async () => {
					const { baseElement } = await setup();

					const pickerButton = within(baseElement).getById(IDS.ER_L1_DATE_BUTTON);
					fireEvent.click(pickerButton);

					const datePicker = within(baseElement).getByDataRole(DATE_PICKER);
					fireEvent.blur(datePicker, {
						currentTarget: baseElement,
						relatedTarget: datePicker
					});

					equal(onLeaveRepeatRowStub.mock.callCount(), 0);
					equal(onLeaveTableStub.mock.callCount(), 0);
				});
			});

			describe("because onBlur in an autocomplete was executed", () => {
				it("does not call onLeaveRepeatRow or onLeaveTable", async () => {
					const { baseElement } = await setup();

					const autocomplete = within(baseElement).getById(IDS.ER_L1_ENUMERATION);
					fireEvent.focus(autocomplete);

					const dropdown = within(baseElement).getById(IDS.ER_L1_ENUMERATION + "-dropdown");
					fireEvent.blur(dropdown, {
						currentTarget: baseElement,
						relatedTarget: dropdown
					});

					equal(onLeaveRepeatRowStub.mock.callCount(), 0);
					equal(onLeaveTableStub.mock.callCount(), 0);
				});
			});
		});

		function assertOnLeaveRowStubCall(): void {
			const rowPath = createDocumentPath([DOCUMENT_MODEL.rootGroup], [DOCUMENT_MODEL.nestedL1]);
			equal(onLeaveRepeatRowStub.mock.callCount(), 1);
			deepEqual(onLeaveRepeatRowStub.mock.calls[0].arguments[0], rowPath);
			deepEqual(
				onLeaveRepeatRowStub.mock.calls[0].arguments[1],
				FORM_MODEL.embeddedRepeatModelPath
			);
		}

		function assertOnLeaveTableStubCall(): void {
			equal(onLeaveTableStub.mock.callCount(), 1);
			deepEqual(onLeaveTableStub.mock.calls[0].arguments[0], FORM_MODEL.embeddedRepeatModelPath);
		}
	});

	// mocks don't (yet) support focus/blur -> use widgets table
	function setup(): Promise<RtlRenderWrapper> {
		const repeatModelPath = FORM_MODEL.embeddedRepeatModelPath;
		const dispatchConfig = {
			...stubbedDispatch.eventHandlers,
			repeat: {
				...stubbedDispatch.eventHandlers.repeat,
				onLeaveRepeatRow: onLeaveRepeatRowStub,
				onLeaveTable: onLeaveTableStub
			}
		};

		return setupConnectedFormEngineWithRtlAsync({
			withWidgets: true,
			tableMap: mockFunctions(DefaultTableWidgetMap),
			config: {
				widgetMap: mockFunctions(DefaultWidgetMap)
			},
			models,
			data: { document: createDocumentForBlurAndFocus() },
			dispatchConfig,
			ui: {
				screenLocation: [
					{
						locationPath: createModelPath(FORM_MODEL.screenName),
						path: [],
						repeatInstanceState: {
							[ModelPath.toString(repeatModelPath)]: {
								expandedRowPath: createDocumentPath(
									[DOCUMENT_MODEL.rootGroup],
									[DOCUMENT_MODEL.nestedL1]
								)
							}
						}
					}
				]
			}
		});
	}
}
