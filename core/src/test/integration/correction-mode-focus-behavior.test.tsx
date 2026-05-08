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

import { equal } from "node:assert/strict";
import { mock } from "node:test";

import type { JSX } from "react";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import { within } from "@com.mgmtp.a12.devtools/react";
import type { ButtonProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/button/main/button.api.js";
import { provider as deviceDetector } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/device-detector.js";
import type { MobileValidationProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/validation-bar/main/validation-bar.mobile.api.js";

import type { EngineStore } from "../../back-end/store/index.js";
import type { WidgetMap } from "../../view/index.js";

import {
	MOBILE_PREVIEW_LIST,
	MOBILE_PREVIEW_LIST_ITEM,
	MOBILE_VALIDATION_BAR_OVERVIEW
} from "../rtl-utils/data-roles.js";
import type { RtlRenderWrapper } from "../rtl-utils/render-wrapper.js";
import { click } from "../rtl-utils/rtl-click.js";
import { ModelHelpers } from "../utils/model-helpers.js";
import { SetupHelpers } from "../utils/setup.js";
import { setupFixture, setupModelsFixture } from "../utils/setupFixture.js";
import {
	DOCUMENT,
	FORM_MODEL
} from "../utils/test-model-helpers/validation.errors_and_warnings_and_infos.js";
import { createValidationMessage } from "../utils/validation.js";

import { widgetMocksForFocusTests } from "./focusTestInputMocks.js";

describe("integration.view.Correction-Mode-Focus-Behavior", () => {
	const models = setupModelsFixture("computation-validation.errors_and_warnings_and_infos");

	describe("Desktop", () => {
		beforeEach(() => {
			mock.method(deviceDetector, "get", () => "desktop");
		});

		describeCorrectionModeTests();

		describe("Validation Bar", () => {
			describe("given a document with no error", () => {
				describe("and clicking a button with validate = full", () => {
					it("focus is set to the form", async () => {
						const wrapper = await createSetup({ document: validDocument });

						await validateDocument(wrapper);
						assertActiveDocumentId(FORM_MODEL.ID_FORM_MODEL);
					});
				});
			});

			describe("given a document with errors", () => {
				describe("and clicking a button with validate = full", () => {
					it("focus is set to the validation-bar", async () => {
						const wrapper = await createSetup({
							validationBarVisible: false,
							document: invalidDocument
						});

						await validateDocument(wrapper);
						assertActiveDocumentId(FORM_MODEL.ID_VALIDATION_BAR);
					});
				});

				describe("and clicking 'Go To Issue' in the quick access button", () => {
					it("focus is set to the input", async () => {
						const wrapper = await createSetup({
							validationBarVisible: true,
							multipleCauses: false,
							document: invalidDocument
						});

						const validationBar = findAndFocusValidationBar(wrapper);
						await click(validationBar.querySelector(`[title="${FORM_MODEL.GO_TO_ISSUE}"]`));
						assertActiveDocumentId(FORM_MODEL.STRING_TYPE);
					});
				});

				describe("and clicking 'Collapse' in the quick access button", () => {
					it("focus stays on the button", async () => {
						const wrapper = await createSetup({
							document: invalidDocument,
							validationBarVisible: true,
							multipleCauses: true,
							expanded: true
						});

						const validationBar = findValidationBar(wrapper);
						await click(validationBar.querySelector(`[title="${FORM_MODEL.COLLAPSE_MESSAGE}"]`));
						equal(document.activeElement?.textContent, "unfold_more");
					});
				});

				describe("and clicking a link in the validation-bar-content", () => {
					it("focus is set to the input", async () => {
						const wrapper = await createSetup({
							document: invalidDocument,
							validationBarVisible: true,
							expanded: true
						});

						const validationBar = findAndFocusValidationBar(wrapper);
						const content = within(validationBar).getByDataRole("validation-bar-content");
						const link1 = within(content).getByText(linkText);
						await click(link1);
						assertActiveDocumentId(FORM_MODEL.STRING_TYPE);
					});
				});
			});
		});

		describe("Correction Screen", () => {
			describe("given a document with errors", () => {
				describe("and clicking 'Show Details'", () => {
					it("does not remove the focus from the button", async () => {
						const wrapper = await createSetup({
							correctionScreenVisible: true,
							document: invalidDocument,
							multipleCauses: true,
							validationMessage: true
						});

						await click(within(wrapper.baseElement).getByText(FORM_MODEL.SHOW_DETAILS_TEXT));
						equal(document.activeElement?.textContent, FORM_MODEL.HIDE_DETAILS_TEXT);
					});
				});
			});

			describe("and clicking a jumping link", () => {
				it("focuses the input", async () => {
					const wrapper = await createSetup({
						correctionScreenVisible: true,
						document: invalidDocument,
						validationMessage: true
					});

					await click(within(wrapper.baseElement).getAllByText(linkText)[0]);
					assertActiveDocumentId(FORM_MODEL.STRING_TYPE);
				});
			});

			describe("and clicking back", () => {
				it("focuses the validation-bar", async () => {
					const wrapper = await createSetup({
						correctionScreenVisible: true,
						document: invalidDocument,
						validationBarVisible: true
					});

					await click(within(wrapper.baseElement).getByText(FORM_MODEL.BACK));
					assertActiveDocumentId(FORM_MODEL.ID_VALIDATION_BAR);
				});
			});
		});
	});

	describe("Mobile", () => {
		beforeEach(() => {
			mock.method(deviceDetector, "get", () => "phone");
		});

		describeCorrectionModeTests();

		describe("Validation Bar", () => {
			describe("given a document with no error", () => {
				describe("and clicking a button with validate = full", () => {
					it("focus is set to the form", async () => {
						const wrapper = await createSetup({ document: validDocument });

						await validateDocument(wrapper);
						assertActiveDocumentId(FORM_MODEL.ID_FORM_MODEL);
					});
				});
			});

			describe("given a document with errors", () => {
				describe("and clicking a button with validate = full", () => {
					it("focus is set to the validation-bar", async () => {
						const wrapper = await createSetup({
							validationBarVisible: false,
							document: invalidDocument
						});

						await validateDocument(wrapper);
						assertActiveDocumentId(FORM_MODEL.ID_VALIDATION_BAR);
					});
				});

				describe("and clicking the validation bar overview", () => {
					it("focuses the modal", async () => {
						const wrapper = await createSetup({
							validationBarVisible: true,
							document: invalidDocument
						});

						await click(within(wrapper.baseElement).getByDataRole(MOBILE_VALIDATION_BAR_OVERVIEW));
						assertActiveDocumentId(FORM_MODEL.ID_VALIDATION_BAR_MODAL);
					});
				});

				describe("and clicking an entry in the preview list", () => {
					it("focuses the modal", async () => {
						const wrapper = await createSetup({
							validationBarVisible: true,
							document: invalidDocument,
							multipleCauses: true,
							expanded: true
						});

						const previewList = within(wrapper.baseElement).getByDataRole(MOBILE_PREVIEW_LIST);
						await click(within(previewList).getAllByDataRole(MOBILE_PREVIEW_LIST_ITEM)[0]);
						assertActiveDocumentId(FORM_MODEL.ID_VALIDATION_BAR_MODAL);
					});
				});

				describe("and clicking a jumping link", () => {
					it("focuses the input", async () => {
						const wrapper = await createSetup({
							validationBarVisible: true,
							document: invalidDocument,
							currentMessageKey: messageKeyError1
						});

						// Set the focus to the button to see that no focus back occurs
						const validateButton = within(wrapper.baseElement).getById(FORM_MODEL.ID_VALIDATE_FULL);
						validateButton.focus();

						await click(within(wrapper.baseElement).getByDataRole(MOBILE_VALIDATION_BAR_OVERVIEW));
						await click(within(wrapper.baseElement).getAllByText(linkText)[0]);
						assertActiveDocumentId(FORM_MODEL.STRING_TYPE);
					});
				});

				describe("and clicking 'Next' in the quick access button", () => {
					it("focuses the modal", async () => {
						const wrapper = await createSetup({
							validationBarVisible: true,
							document: invalidDocument,
							expanded: true,
							currentMessageKey: messageKeyError1
						});

						await click(within(wrapper.baseElement).getByText(FORM_MODEL.NEXT));
						assertActiveDocumentId(FORM_MODEL.ID_VALIDATION_BAR_MODAL);
					});
				});

				describe("and clicking 'Previous'", () => {
					it("focuses the modal", async () => {
						const wrapper = await createSetup({
							validationBarVisible: true,
							document: invalidDocument,
							expanded: true,
							currentMessageKey: messageKeyError2
						});

						await click(within(wrapper.baseElement).getByText(FORM_MODEL.PREVIOUS));
						assertActiveDocumentId(FORM_MODEL.ID_VALIDATION_BAR_MODAL);
					});
				});

				describe("and clicking 'Show All'", () => {
					it("focus is set to the modal", async () => {
						const wrapper = await createSetup({
							validationBarVisible: true,
							document: invalidDocument,
							expanded: true,
							currentMessageKey: messageKeyError1
						});

						await click(within(wrapper.baseElement).getByText(FORM_MODEL.SHOW_ALL));
						assertActiveDocumentId(FORM_MODEL.ID_VALIDATION_BAR_MODAL);
					});
				});
			});
		});
	});

	// these tests are executed both in desktop AND phone mode
	function describeCorrectionModeTests(): void {
		describe("Correction Mode", () => {
			describe("is active", () => {
				const correctionModeBackup = setupFixture(() => ({
					location: [{ locationPath: ModelHelpers.createModelPath("Screen1"), path: [] }],
					sections: {}
				}));

				describe("and clicking 'Validate'", () => {
					it("focuses the validation bar if there are still errors", async () => {
						const wrapper = await createSetup({
							document: invalidDocument,
							validationBarVisible: true,
							correctionModeBackup
						});

						await click(within(wrapper.baseElement).getByText(FORM_MODEL.VALIDATE));
						assertActiveDocumentId(FORM_MODEL.ID_VALIDATION_BAR);
					});

					it("focuses the form if there are no errors anymore", async () => {
						const wrapper = await createSetup({
							document: validDocument,
							validationBarVisible: true,
							correctionModeBackup
						});

						await click(within(wrapper.baseElement).getByText(FORM_MODEL.VALIDATE));
						assertActiveDocumentId(FORM_MODEL.ID_FORM_MODEL);
					});
				});

				describe("and clicking 'Exit Correction Mode'", () => {
					it("focuses the form", async () => {
						const wrapper = await createSetup({
							document: validDocument,
							validationBarVisible: true,
							correctionModeBackup
						});

						await click(within(wrapper.baseElement).getByText(FORM_MODEL.EXIT_CORRECTION_MODE));
						assertActiveDocumentId(FORM_MODEL.ID_FORM_MODEL);
					});
				});
			});
		});
	}

	async function validateDocument(wrapper: RtlRenderWrapper): Promise<void> {
		click(within(wrapper.baseElement).getById(FORM_MODEL.ID_VALIDATE_FULL));
	}

	function findValidationBar(wrapper: RtlRenderWrapper): HTMLElement {
		return within(wrapper.baseElement).getById(FORM_MODEL.ID_VALIDATION_BAR);
	}

	/**
	 * Search for validation bar and focus it
	 * The setting of the focus is important to see that it changes
	 * when executing the test.
	 * Also when there is tab-sandbox it is necessary to have a previous
	 * focus to see that the sandbox does not steal the focus in the end.
	 */
	function findAndFocusValidationBar(wrapper: RtlRenderWrapper): HTMLElement {
		const validationBar = findValidationBar(wrapper);
		validationBar.focus();
		return validationBar;
	}

	function assertActiveDocumentId(id: string): void {
		equal(document.activeElement?.id, id);
	}

	const validDocument = { group: { StringType: "Test" } };
	const invalidDocument = { group: {} };

	const linkText = "First Screen > StringType";
	const messageKeyError1 = "ERROR:/group[1]/StringType[1]:1:MessageCode";
	const messageKeyError2 = "ERROR:/group[1]/StringType[1]:2:MessageCode";

	function createSetup(props: {
		document: object;
		multipleCauses?: boolean;
		validationBarVisible?: boolean;
		validationMessage?: boolean;
		expanded?: boolean;
		currentMessageKey?: string;
		correctionScreenVisible?: boolean;
		correctionModeBackup?: EngineStore.CorrectionModeBackup;
	}): Promise<SetupHelpers.ConnectedRtlWrapper> {
		const validationMessages =
			props.validationBarVisible || props.validationMessage
				? {
						[ModelPath.toString(DOCUMENT.pathString)]: {
							validationMessages: [
								createValidationMessage({
									type: "ERROR",
									path: DOCUMENT.pathString,
									errorText: [{ key: "foo", defaults: { en: "Error String 1" } }],
									errorKey: "1",
									referencedFields: props.multipleCauses
										? [DOCUMENT.pathString, DOCUMENT.pathNumber]
										: [DOCUMENT.pathString]
								}),
								createValidationMessage({
									type: "ERROR",
									path: DOCUMENT.pathString,
									errorText: [{ key: "foo", defaults: { en: "Error String 2" } }],
									errorKey: "2"
								})
							]
						}
					}
				: {};

		const ui: Partial<EngineStore.UIState> = {
			screenLocation: [
				{
					locationPath: [{ elementName: "Screen1" }],
					path: [],
					repeatInstanceState: { "/Screen1/ir1": { page: 1 } }
				}
			],
			messages: validationMessages,
			validationBar: {
				visible: props.validationBarVisible || false,
				currentMessageKey: props.currentMessageKey,
				expanded: props.expanded || false
			},
			correctionScreen: {
				visible: props.correctionScreenVisible || false,
				showDetailsState: {}
			},
			correctionModeBackup: props.correctionModeBackup
		};

		const data: EngineStore.DataState = {
			dirty: true,
			document: props.document
		};

		const widgetMap: Partial<WidgetMap> = {
			...widgetMocksForFocusTests(),
			Button,
			MobileValidationBarOverview,
			MobilePreviewListIem
		};

		return SetupHelpers.setupConnectedFormEngineWithRtlAsync({
			config: {
				widgetMap
			},
			withScrollHandler: true,
			models,
			ui,
			data
		});
	}

	// render title
	function Button(props: ButtonProps): JSX.Element {
		return (
			<div id={props.id} title={props.title} onClick={props.onClick} tabIndex={-1}>
				{props.icon}
				{props.label}
				{props.children}
			</div>
		);
	}

	// render onClick
	function MobileValidationBarOverview(props: MobileValidationProps.OverviewProps): JSX.Element {
		return (
			<div id={props.id} data-role={MOBILE_VALIDATION_BAR_OVERVIEW} onClick={props.onClick}>
				{props.leftElement}
				{props.rightElement}
			</div>
		);
	}

	// render onClick
	function MobilePreviewListIem(props: MobileValidationProps.PreviewListItemProps): JSX.Element {
		return <div id={props.id} data-role={MOBILE_PREVIEW_LIST_ITEM} onClick={props.onClick} />;
	}
});
