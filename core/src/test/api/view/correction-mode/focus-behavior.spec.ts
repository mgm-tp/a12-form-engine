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

import { notStrictEqual, strictEqual } from "node:assert/strict";
import type { Mock } from "node:test";
import { mock } from "node:test";
import { scheduler } from "node:timers/promises";

import { act } from "@testing-library/react";

import { provider as deviceDetector } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/device-detector.js";

import { Commands, Events, type EngineStore } from "../../../../back-end/store/index.js";
import { UiId } from "../../../../back-end/utils/internal/generateUiId.js";
import { DocumentHelpers } from "../../../utils/document-helpers.js";
import { getSingleElementScrollIntoView } from "../../../utils/scroll-into-view.js";
import { SetupHelpers } from "../../../utils/setup.js";
import { setupModelsFixture } from "../../../utils/setupFixture.js";
import { createValidationEntry } from "../../../utils/validation.js";

describe("api.view.Correction-Mode-Focus-Behavior", () => {
	const models = setupModelsFixture("computation-validation.correctionmode");

	describe("non-mobile", () => {
		executeTest("desktop");
	});

	describe("mobile", () => {
		executeTest("phone");
	});

	function executeTest(device: "phone" | "desktop"): void {
		beforeEach(() => {
			mock.method(deviceDetector, "get", () => device);
		});

		describe("leaving the correction-mode", () => {
			describe("with no validation bar shown", () => {
				it("scrolls to the top of the form and focused the form", async () => {
					const { store, scrollIntoViewSpy } = await createSetup({
						validationBarVisible: false,
						inCorrectionMode: true
					});
					await act(() => store.dispatch(Events.CorrectionMode.exitCorrectionMode({})));

					assertScrollAndFocusOfForm(scrollIntoViewSpy);
				});
			});

			describe("with a validation bar shown", () => {
				it("scrolls to the top of the form and focused the form", async () => {
					const { store, scrollIntoViewSpy } = await createSetup({
						validationBarVisible: true,
						inCorrectionMode: true
					});
					await act(() => store.dispatch(Events.CorrectionMode.exitCorrectionMode({})));

					assertScrollAndFocusOfForm(scrollIntoViewSpy);
				});
			});
		});

		describe("full validation", () => {
			describe("validation bar is shown before the validation", () => {
				describe("and validation bar is shown after the validation", () => {
					it("focuses the validation bar", async () => {
						const { store } = await createSetup({
							validationBarVisible: true,
							inCorrectionMode: true
						});
						await act(() => store.dispatch(Commands.validateFull()));

						assertFocusedElement(UiId.generateForValidationBar({}), "validation-bar");
					});
				});

				describe("and validation bar is not shown after the validation", () => {
					it("scrolls to the top of the form and focused the form", async () => {
						const { store, scrollIntoViewSpy } = await createSetup({
							validationBarVisible: true,
							inCorrectionMode: true
						});
						await act(() =>
							store.dispatch(Commands.setDocument({ document: getBaseDocument(), changes: [] }))
						);
						await act(() => store.dispatch(Commands.validateFull()));

						assertScrollAndFocusOfForm(scrollIntoViewSpy);
					});
				});
			});

			describe("validation bar is not shown before the validation", () => {
				describe("and validation bar is shown after the validation", () => {
					it("focuses the validation bar", async () => {
						const { store } = await createSetup({ validationBarVisible: false });
						await act(() => store.dispatch(Commands.validateFull()));

						assertFocusedElement(UiId.generateForValidationBar({}), "validation-bar");
					});
				});

				describe("and validation bar is not shown after the validation", () => {
					it("scrolls to the top of the form and focused the form", async () => {
						const { store, scrollIntoViewSpy } = await createSetup({ validationBarVisible: false });
						await act(() =>
							store.dispatch(Commands.setDocument({ document: getBaseDocument(), changes: [] }))
						);
						await act(() => store.dispatch(Commands.validateFull()));

						assertScrollAndFocusOfForm(scrollIntoViewSpy);
					});
				});
			});
		});

		if (device === "phone") {
			describe("validation-bar", () => {
				describe("expand validation message", () => {
					it("focuses the validation bar modal", async () => {
						const { store } = await createSetup({ validationBarVisible: true });
						await act(() => {
							store.dispatch(
								Events.CorrectionMode.ValidationBar.expand({
									expanded: true,
									resetCurrentMessage: false
								})
							);
						});

						await scheduler.wait(0);

						await assertFocusedElement(
							UiId.generateForMobileValidationBarModal({}),
							"validation bar content"
						);
					});
				});

				describe("messages changes", () => {
					it("focuses the validation bar modal", async () => {
						const { store } = await createSetup({
							validationBarVisible: true,
							expanded: true,
							currentMessageKey: "ERROR:/root[1]/F1[1]:/root/R1:42"
						});
						await act(() => {
							store.dispatch(
								Events.CorrectionMode.ValidationBar.showMessage({
									messageKey: "ERROR:/root[1]/F2M[1]:/root/R2M:42"
								})
							);
						});

						await scheduler.wait(0);

						assertFocusedElement(
							UiId.generateForMobileValidationBarModal({}),
							"validation bar title"
						);
					});
				});
			});
		}
	}

	function assertScrollAndFocusOfForm(scrollIntoViewSpy: Mock<Element["scrollIntoView"]>) {
		const formModelId = UiId.generate({ element: models.formModel });
		const { node, position } = getSingleElementScrollIntoView(scrollIntoViewSpy);
		notStrictEqual(node, undefined);
		strictEqual(node?.id, formModelId, "Expected that the element is scrolled to the form");
		strictEqual(position, "start", "Expected  that the element is scrolled to the top");
		assertFocusedElement(formModelId, "form");
	}

	function assertFocusedElement(id: string, componentName: string) {
		strictEqual(document.activeElement?.id, id, `Expected that the ${componentName} is focused`);
	}

	function getBaseDocument() {
		return {
			CustomTypes: { MultiSelect2: [{ value: "key1" }] }
		};
	}

	async function createSetup(options: {
		validationBarVisible?: boolean;
		inCorrectionMode?: boolean;
		expanded?: boolean;
		currentMessageKey?: string;
	}) {
		const scrollIntoViewSpy = mock.method(Element.prototype, "scrollIntoView");

		const ui: Partial<EngineStore.UIState> = {
			screenLocation: [
				{
					locationPath: [{ elementName: "Screen1" }],
					path: [],
					repeatInstanceState: { "/Screen1/ir1": { page: 1 } }
				}
			],
			messages: {
				...createValidationEntry({ path: DocumentHelpers.createDocumentPath(["root"], ["F2M"]) }),
				...createValidationEntry({ path: DocumentHelpers.createDocumentPath(["root"], ["F1"]) })
			},
			validationBar: {
				visible: options.validationBarVisible ?? false,
				expanded: options.expanded ?? false,
				currentMessageKey: options.currentMessageKey
			},
			correctionModeBackup: options.inCorrectionMode
				? {
						location: [
							{
								locationPath: [{ elementName: "Screen1" }],
								path: [],
								repeatInstanceState: { "/Screen1/ir1": { page: 1 } }
							}
						],
						sections: {}
					}
				: undefined
		};

		const data: EngineStore.DataState = {
			dirty: true,
			document: { ...getBaseDocument(), root: { F1: 1, G1R: [{ F1R1: 1, G1R2: {} }] } }
		};

		const wrapper = await SetupHelpers.setupConnectedFormEngineWithRtlAsync({
			withScrollHandler: true,
			models,
			ui,
			data
		});

		return {
			...wrapper,
			scrollIntoViewSpy
		};
	}
});
