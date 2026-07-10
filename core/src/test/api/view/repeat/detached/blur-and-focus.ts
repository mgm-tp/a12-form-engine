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

import { defaultMapDispatchToProps } from "../../../../../view/index.js";
import { DefaultTableWidgetMap } from "../../../../../view/internal/components/form-engine/repeat/table-widget-map.js";
import type { RtlRenderWrapper } from "../../../../rtl-utils/render-wrapper.js";
import { createDocumentPath } from "../../../../utils/createDocumentPath.js";
import { createModelPath } from "../../../../utils/createModelPath.js";
import { setupConnectedFormEngineWithRtlAsync } from "../../../../utils/setup.js";
import { setupModelsFixture } from "../../../../utils/setupFixture.js";
import {
	DOCUMENT_MODEL,
	FORM_MODEL,
	IDS,
	createDocumentForBlurAndFocus
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

	describe("given an active row which", () => {
		describe("and onBlur occurs", () => {
			describe("and the new active element is inside the same row", () => {
				it("does not call onLeaveRepeatRow", async () => {
					const { firstRow } = await setupRecentlyAddedTest();
					const deleteButton = within(firstRow).getById(IDS.DR_REMOVE_BUTTON + "-1");
					fireEvent.blur(firstRow, { relatedTarget: deleteButton });

					equal(onLeaveRepeatRowStub.mock.callCount(), 0);
				});
			});

			describe("and the new active element is outside the row", () => {
				it("calls onLeaveRepeatRow with the correct parameters", async () => {
					const { firstRow, wrapper } = await setupRecentlyAddedTest();
					const deleteButtonInSecondRow = within(wrapper.baseElement).getById(
						IDS.DR_REMOVE_BUTTON + "-2"
					);
					fireEvent.blur(firstRow, { relatedTarget: deleteButtonInSecondRow });

					assertOnLeaveRowStubCall();
				});
			});

			describe("and the new active element is outside the repeat", () => {
				it("calls onLeaveRepeatTable with the correct parameters", async () => {
					const { firstRow, wrapper } = await setupRecentlyAddedTest();
					const stringInput = within(wrapper.baseElement).getById(IDS.L0_STRING);
					fireEvent.blur(firstRow, { relatedTarget: stringInput });

					assertOnLeaveTableStubCall();
				});
			});
		});

		/** Calls the setup and returns the first row in the repeat */
		async function setupRecentlyAddedTest(): Promise<{
			firstRow: HTMLElement;
			wrapper: RtlRenderWrapper;
		}> {
			const wrapper = await setup();
			const firstRow = within(wrapper.baseElement).getById(`${IDS.DR_BODY_ROW}-0`);
			return { firstRow, wrapper };
		}

		function assertOnLeaveRowStubCall(): void {
			const rowPath = createDocumentPath([DOCUMENT_MODEL.rootGroup], [DOCUMENT_MODEL.nestedL1]);
			equal(onLeaveRepeatRowStub.mock.callCount(), 1);
			deepEqual(onLeaveRepeatRowStub.mock.calls[0].arguments[0], rowPath);
			deepEqual(
				onLeaveRepeatRowStub.mock.calls[0].arguments[1],
				FORM_MODEL.detachedRepeatModelPath
			);
		}

		function assertOnLeaveTableStubCall(): void {
			equal(onLeaveTableStub.mock.callCount(), 1);
			deepEqual(onLeaveTableStub.mock.calls[0].arguments[0], FORM_MODEL.detachedRepeatModelPath);
		}
	});

	function setup(): Promise<RtlRenderWrapper> {
		const dispatchConfig = {
			...stubbedDispatch.eventHandlers,
			repeat: {
				...stubbedDispatch.eventHandlers.repeat,
				onLeaveRepeatRow: onLeaveRepeatRowStub,
				onLeaveTable: onLeaveTableStub
			}
		};

		// table mocks don't (yet) support focus/blur -> use widgets table
		return setupConnectedFormEngineWithRtlAsync({
			withWidgets: true,
			tableMap: DefaultTableWidgetMap,
			models,
			data: { document: createDocumentForBlurAndFocus() },
			dispatchConfig,
			ui: {
				screenLocation: [
					{
						locationPath: createModelPath(FORM_MODEL.screenName),
						path: [],
						repeatInstanceState: {
							[ModelPath.toString(FORM_MODEL.detachedRepeatModelPath)]: {
								newRow: {
									rowPath: createDocumentPath(
										[DOCUMENT_MODEL.rootGroup],
										[DOCUMENT_MODEL.nestedL1]
									),
									rowState: "recentlyAdded"
								}
							}
						}
					}
				]
			}
		});
	}
}
