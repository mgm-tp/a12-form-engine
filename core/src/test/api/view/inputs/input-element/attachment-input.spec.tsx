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

import { equal, notEqual } from "node:assert/strict";

import { query } from "@com.mgmtp.a12.devtools/react";
import type {
	DocumentModel,
	GroupInstance
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import type { DefaultFileUploadProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/file-upload/main/default/default-file-upload.api.js";

import type { EngineStore } from "../../../../../back-end/store/index.js";
import { DocumentPath } from "../../../../../models/internal/utils/document-utils.js";
import { AttachmentInput } from "../../../../../view/internal/components/form-engine/cells/controls/attachment/attachment-input.js";
import { DocumentHelpers } from "../../../../utils/document-helpers.js";
import { DocumentModelHelpers } from "../../../../utils/model-helpers.js";
import { SetupHelpers } from "../../../../utils/setup.js";
import { setupFixtureObject, setupModelsFixture } from "../../../../utils/setupFixture.js";
import { ATTACHMENT } from "../../../../utils/test-model-helpers/attachment.js";

import { inputTest } from "./generic-tests/input-tests.js";
import type { GroupBasedProps } from "./generic-tests/input-utils.js";

const { Group } = DocumentModelHelpers;

describe("api.view.inputs", () => {
	describe("AttachmentInput", () => {
		const models = setupModelsFixture("controls.attachmentUpload");

		const documentElementDataType: DocumentModel.Group = Group({ usageType: "attachment" });
		const baseProps: GroupBasedProps = {
			documentElement: documentElementDataType,
			documentElementDataType,
			component: "AttachmentUpload",
			componentToolTip: "DefaultFileUpload",
			componentErrorProp: "DefaultFileUpload",
			breakTooltipsToNewLine: true,
			renderFunction: AttachmentInput,
			path: DocumentHelpers.createDocumentPath(["root"], ["group"], ["AttachmentInput"])
		};

		describe("General", () => {
			inputTest(() => models, baseProps, {
				errorWarningPropTest: false,
				ariaRequiredTest: false,
				helperTextTest: false,
				autoCompleteTest: false,
				placeholderTest: false
			});
		});

		/**
		 * Errors for attachment are all errors which start with the path to
		 * the attachment group. This is different to normal controls, where the
		 * whole path is decisive. Therefore this behavior is tested here again.
		 */
		describe("Validation errors", () => {
			it("renders a DefaultFileUpload with the prop errorMessage set, if there are error message for the attachment", async () => {
				await testValidationMessages("ERROR");
			});

			it("renders a DefaultFileUpload with the prop warningMessage set, if there are warning messages for the attachment", async () => {
				await testValidationMessages("WARNING");
			});

			it("renders a DefaultFileUpload with the prop infoMessage set, if there are info messages for the attachment", async () => {
				await testValidationMessages("INFO");
			});

			async function testValidationMessages(severity: EngineStore.Validation.MessageSeverity) {
				const ATTACHMENT_PATH = DocumentHelpers.createDocumentPath(["root"], ["attachment"]);
				const pathToFileName = [
					...ATTACHMENT_PATH,
					...DocumentHelpers.createDocumentPath(["original_filename"])
				];
				const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
					models,
					ui: {
						messages: {
							[DocumentPath.toString(pathToFileName)]: {
								validationMessages: [
									{
										element: pathToFileName,
										errorCode: "Error rule_205f5",
										errorKey: "/root/NewRule_1",
										errorText: [
											{
												key: "foo",
												defaults: { en: "Filename should not be invalidFilename.jpg!" }
											}
										],
										severity,
										referencedFields: [pathToFileName]
									}
								]
							}
						}
					}
				});

				const input = query(wrapper.widgetMap.DefaultFileUpload)
					.withId(ATTACHMENT.ID_ATTACHMENT)
					.props();

				const severityProps: {
					[key in EngineStore.Validation.MessageSeverity]: keyof DefaultFileUploadProps;
				} = {
					["ERROR"]: "errorMessage",
					["WARNING"]: "warningMessage",
					["INFO"]: "infoMessage"
				};

				Object.values(severityProps).forEach(prop => {
					if (prop === severityProps[severity]) {
						notEqual(input[prop], undefined);
					} else {
						equal(input[prop], undefined);
					}
				});
			}

			it("does neither set the errorMessage prop, the warningMessage prop or the infoMessage prop if there are no messages", async () => {
				const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
					models
				});

				const input = query(wrapper.widgetMap.DefaultFileUpload)
					.withId(ATTACHMENT.ID_ATTACHMENT)
					.props();
				equal(input.infoMessage, undefined);
				equal(input.warningMessage, undefined);
				equal(input.errorMessage, undefined);
			});
		});

		describe("Exposition", () => {
			it("does not set the prop compact, if the exposition is not COMPACT", async () => {
				const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
					models
				});

				const input = query(wrapper.widgetMap.DefaultFileUpload)
					.withId(ATTACHMENT.ID_ATTACHMENT)
					.props();

				equal(input.compact, undefined);
			});

			it("sets the prop compact to true, if the exposition is COMPACT", async () => {
				const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
					models
				});

				const input = query(wrapper.widgetMap.DefaultFileUpload)
					.withId(ATTACHMENT.ID_ATTACHMENT_COMPACT)
					.props();

				equal(input.compact, true);
			});
		});

		describe("file options", () => {
			describe("given no attachment", () => {
				it("does not set fileOptions", async () => {
					const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
						models
					});

					const input = query(wrapper.widgetMap.DefaultFileUpload)
						.withId(ATTACHMENT.ID_ATTACHMENT_COMPACT)
						.props();

					equal(input.fileOptions, undefined);
				});
			});

			describe("given an attachment", () => {
				it("does not set fileOptions if the exposition is not COMPACT", async () => {
					const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
						models,
						data: { document: { root: { attachment: {} } } }
					});

					const input = query(wrapper.widgetMap.DefaultFileUpload)
						.withId(ATTACHMENT.ID_ATTACHMENT)
						.props();

					equal(input.fileOptions, undefined);
				});

				// the property textOnlyDisplay is further tested in read-only.ts (for controls and columns)
				it("sets the correct fileOptions if the exposition is COMPACT", async () => {
					const mockAttachment = {
						original_filename: "test",
						content: "test",
						mime_type: "image/jpeg"
					};

					const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
						models,
						data: { document: { root: { attachment: mockAttachment } } }
					});

					const input = query(wrapper.widgetMap.DefaultFileUpload)
						.withId(ATTACHMENT.ID_ATTACHMENT_COMPACT)
						.props();

					const expectedFileOptions = {
						name: mockAttachment.original_filename,
						// icon: <Icon>datatype_image</Icon>,
						textOnlyDisplay: false
					};

					const actualFileOptions = input.fileOptions;

					equal(actualFileOptions?.name, expectedFileOptions.name);
					// equal(
					// 	actualFileOptions?.icon.props.children,
					// 	expectedFileOptions.icon.props.children
					// );
					equal(actualFileOptions.textOnlyDisplay, expectedFileOptions.textOnlyDisplay);
				});
			});
		});

		describe("other props", () => {
			/**
			 * Only placeholderIcon and accept are tested here
			 * The defaultAction is tested in attachment.spec.tsx
			 */
			describe("attachmentConfig", () => {
				const document: GroupInstance = setupFixtureObject(() => {
					const mockAttachment = {
						internal_filename: "test.jpeg",
						original_filename: "test.jpeg",
						content: "",
						size: 1337,
						mime_type: "image/jpeg"
					};

					return ATTACHMENT.createDocumentForAttachment({
						repeatableGroup: [
							{
								attachment: mockAttachment,
								attachmentForPlaceholderIcon: mockAttachment,
								attachmentForAccept: mockAttachment
							}
						]
					});
				});

				describe("placeholderIcon", () => {
					describe("for an attachment control", () => {
						describe("with compact set to undefined", () => {
							it("hands the placeholderIcon prop from the attachmentConfig in the field configuration to the widget", async () => {
								const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
									models
								});

								const input = query(wrapper.widgetMap.DefaultFileUpload)
									.withId(ATTACHMENT.ID_ATTACHMENT_PLACEHOLDER_ICON)
									.props();

								equal(input.placeholderIcon, "image");
							});
						});

						describe("with compact set to true", () => {
							it("does not hand the placeholderIcon prop to the widget", async () => {
								const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
									models
								});

								const input = query(wrapper.widgetMap.DefaultFileUpload)
									.withId(ATTACHMENT.ID_ATTACHMENT_COMPACT)
									.props();

								equal(input.placeholderIcon, undefined);
							});
						});
					});

					describe("for an attachment in a field overview column", () => {
						describe("with compact set to undefined", () => {
							it("hands the placeholderIcon prop from the attachmentConfig in the field configuration to the widget", async () => {
								const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
									models,
									data: { document }
								});

								const input = query(wrapper.widgetMap.DefaultFileUpload)
									.withId(ATTACHMENT.ID_ATTACHMENT_PLACEHOLDER_ICON)
									.props();

								equal(input.placeholderIcon, "image");
							});
						});

						describe("with compact set to true", () => {
							it("does not hand the placeholderIcon prop to the widget", async () => {
								const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
									models,
									data: { document }
								});

								const input = query(wrapper.widgetMap.DefaultFileUpload)
									.withId(ATTACHMENT.ID_DR_ATTACHMENT_COMPACT)
									.props();

								equal(input.placeholderIcon, undefined);
							});
						});
					});
				});

				describe("accept", () => {
					describe("for an attachment control", () => {
						it("hands the accept prop from the attachmentConfig in the field configuration to the widget", async () => {
							const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
								models
							});

							const input = query(wrapper.widgetMap.DefaultFileUpload)
								.withId(ATTACHMENT.ID_ATTACHMENT_ACCEPT)
								.props();

							equal(input.accept, "image/*");
						});
					});

					describe("for an attachment in a field overview column", () => {
						it("hands the accept prop from the attachmentConfig in the field configuration to the widget", async () => {
							const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
								models,
								data: { document }
							});

							const input = query(wrapper.widgetMap.DefaultFileUpload)
								.withId(ATTACHMENT.ID_DR_ATTACHMENT_ACCEPT)
								.props();

							equal(input.accept, "image/*");
						});
					});
				});
			});
		});
	});
});
