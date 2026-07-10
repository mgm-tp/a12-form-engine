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

import { deepStrictEqual, notStrictEqual, strictEqual } from "node:assert/strict";

import { act } from "react";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import type { Attachment } from "@com.mgmtp.a12.dataservices/dataservices-access";
import { query } from "@com.mgmtp.a12.devtools/react";
import type { Localizable } from "@com.mgmtp.a12.utils/utils-localization";

import { createLocalizableFactory } from "../../../../../back-end/localization/internal/localization.js";
import type { EngineStore, Models } from "../../../../../back-end/store/index.js";
import { Events } from "../../../../../back-end/store/index.js";
import type { DuplicateStrategy } from "../../../../../client-extensions/index.js";
import { ATTACHMENT_ERROR_CODE } from "../../../../../client-extensions/internal/extensions/form-engine/internal/attachments/reducer/reduceUiState.js";
import type { ExistingFile } from "../../../../../client-extensions/internal/extensions/form-engine/internal/attachments/utils.js";
import { findElementByFormModelPath } from "../../../../../models/internal/findElementByFormModelPath.js";
import { RepeatUtils } from "../../../../../view/internal/components/form-engine/repeat/components/repeat-utils.js";
import { MultiAttachmentUpload } from "../../../../../view/internal/components/widgets/form-engine/attachments/MultiAttachmentUpload.js";
import type { RepeatWithMultiFileUpload } from "../../../../../view/internal/components/widgets/form-engine/attachments/attachmentUtils.js";
import { getComponentMocks } from "../../../../rtl-utils/getComponentMocks.js";
import { mouseEventMock } from "../../../../rtl-utils/mock-utils.js";
import type { RtlRenderWrapper } from "../../../../rtl-utils/render-wrapper.js";
import { rtlRenderWrapperAsync } from "../../../../rtl-utils/render-wrapper.js";
import { MiddlewareHelpers } from "../../../../utils/MiddlewareHelpers.js";
import { US_LOCALE } from "../../../../utils/localization.js";
import {
	setupConnectedFormEngineWithRtlAsync,
	setupFormEngineRendererWithRtlAsync
} from "../../../../utils/setup.js";
import { setupFixture, setupModelsFixture } from "../../../../utils/setupFixture.js";
import {
	DOCUMENT_MODEL,
	FORM_MODEL
} from "../../../../utils/test-model-helpers/repeat.multi-file-upload.js";
import { stubbedDispatchConfig } from "../../repeat/row-actions/row-action-utils.js";

const { createMiddlewareSpy, createMiddlewareWaitForAction } = MiddlewareHelpers;

function setupMultiFileUpload(options: {
	models: Models;
	document: Record<string, unknown>;
	repeatFormModelPath: ModelPath;
	readonly?: boolean;
	disabled?: boolean;
	loading?: boolean;
	existingFiles?: ExistingFile[];
	errorMessages?: EngineStore.Validation.Message[];
}): Promise<RtlRenderWrapper> {
	const repeat = findElementByFormModelPath(
		options.models.formModel,
		options.repeatFormModelPath
	) as RepeatWithMultiFileUpload;

	const attachmentConfig =
		options.models.formModel.content.fieldConfiguration.fieldMap[
			ModelPath.toString(repeat.multiFileUploadOptions.elementPath)
		]?.attachmentConfig;

	return rtlRenderWrapperAsync(
		<MultiAttachmentUpload
			id="test"
			repeat={repeat}
			repeatDocumentPath={DOCUMENT_MODEL.getAttachmentCollectionDocPath(0)}
			available={RepeatUtils.getRepeatability(repeat, options.models.documentModel)}
			loading={options.loading ?? false}
			existingFiles={options.existingFiles ?? []}
			attachmentConfig={attachmentConfig}
			dispatchUpload={stubbedDispatchConfig.onAttachmentUpload}
			dispatchCancel={stubbedDispatchConfig.onCancelAttachmentUpload}
			localizableFactory={createLocalizableFactory(
				options.models.documentModel,
				options.models.formModel
			)}
			{...options}
		/>,
		{ componentMap: getComponentMocks() }
	);
}

function setupFileListMock(fileMocks: File[]): FileList {
	return {
		[Symbol.iterator]() {
			return fileMocks.values();
		},
		length: fileMocks.length,
		item(index) {
			return fileMocks.at(index) ?? null;
		}
	};
}

describe("api.view.inputs", () => {
	const models = setupModelsFixture("repeat.multi-file-upload");
	const fixture = setupFixture(() => {
		const document = {
			Root: {
				AttachmentCollection: [
					{
						Attachment01: {
							original_filename: "already_existing.txt",
							internal_filename: "internal_filename",
							attachment_id: "test",
							size: 10,
							mime_type: "text/plain"
						}
					}
				]
			}
		};
		const numberOfExistingAttachmentsDocument = document.Root.AttachmentCollection.length;

		const documentAlmostMaxRep = {
			Root: {
				AttachmentCollection: [{}, {}, {}, {}, {}, {}, {}, {}, {}]
			}
		};

		const documentMaxRep = {
			Root: {
				AttachmentCollection: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
			}
		};

		const uniqueAttachment1 = {
			attachment_id: "unique1",
			original_filename: "unique_file_name_1.txt"
		} satisfies Attachment;

		const uniqueAttachment2 = {
			attachment_id: "unique2",
			original_filename: "unique_file_name_2.txt"
		} satisfies Attachment;

		const duplicateAttachment = {
			attachment_id: "duplicate",
			original_filename: "already_existing.txt"
		} satisfies Attachment;

		const uniqueFileMock1 = mockFile("unique_file_name_1.txt");
		const uniqueFileMock2 = mockFile("unique_file_name_2.txt");
		const duplicateFileMock = mockFile("already_existing.txt");

		return {
			document,
			numberOfExistingAttachmentsDocument,
			documentAlmostMaxRep,
			documentMaxRep,
			attachments: {
				uniqueAttachment1,
				uniqueAttachment2,
				duplicateAttachment
			},
			fileMocks: {
				uniqueFileMock1,
				uniqueFileMock2,
				duplicateFileMock
			}
		};
	});

	describe("Multi-Attachment", () => {
		describe("When the attachment input is editable", () => {
			describe("Upload", () => {
				describe("if the user selected a number of files that is compatible with group's repeatability", () => {
					describe("if all file names are unique", () => {
						it("does not render a modal dialog", async () => {
							const fileListMock = setupFileListMock([fixture.fileMocks.uniqueFileMock1]);

							const wrapper = await setupFormEngineRendererWithRtlAsync({
								models,
								data: { document: fixture.document }
							});

							act(() => {
								const attachmentControl = query(wrapper.widgetMap.DefaultFileUpload).props();
								attachmentControl.onChange?.(fileListMock, false);
							});

							query(wrapper.widgetMap.ModalNotification).assertNotRendered();
						});
					});

					describeDuplicateHandlingTests();
				});

				describe("if the user selected too many files", () => {
					it("renders a modal dialog and prevents the user from uploading the files", async () => {
						const fileListMock = setupFileListMock([
							fixture.fileMocks.uniqueFileMock1,
							fixture.fileMocks.uniqueFileMock2
						]);

						const wrapper = await setupFormEngineRendererWithRtlAsync({
							models,
							data: { document: fixture.documentAlmostMaxRep }
						});

						act(() => {
							const attachmentControl = query(wrapper.widgetMap.DefaultFileUpload).props();
							attachmentControl.onChange?.(fileListMock, false);
						});

						const modal = query(wrapper.widgetMap.ModalNotification).props();

						strictEqual(modal.title, "Too many files selected");
					});
				});
			});

			it("`onUploadAreaClick` returns true", async () => {
				const wrapper = await setupMultiFileUpload({
					models,
					document: fixture.document,
					repeatFormModelPath: FORM_MODEL.IR.repeatFormModelPath
				});
				const fileUpload = query(wrapper.widgetMap.DefaultFileUpload).props();
				strictEqual(fileUpload.onUploadAreaClick?.(), true);
			});
		});

		describe("When the attachment input is readonly", () => {
			it("`onUploadAreaClick` is undefined", async () => {
				const wrapper = await setupMultiFileUpload({
					models,
					document: fixture.document,
					repeatFormModelPath: FORM_MODEL.IR.repeatFormModelPath,
					readonly: true
				});
				const fileUpload = query(wrapper.widgetMap.DefaultFileUpload).props();
				strictEqual(fileUpload.onUploadAreaClick, undefined);
			});
		});

		describe("Enablement", () => {
			describe("given readonly = true as prop", () => {
				it("renders a readonly file upload widget", async () => {
					const wrapper = await setupMultiFileUpload({
						models,
						document: fixture.document,
						repeatFormModelPath: FORM_MODEL.IR.repeatFormModelPath,
						readonly: true
					});

					const fileUpload = query(wrapper.widgetMap.DefaultFileUpload).props();
					strictEqual(fileUpload.readOnly, true);
				});
			});

			describe("given readonly = false as prop", () => {
				it("renders an enabled file upload widget", async () => {
					const wrapper = await setupMultiFileUpload({
						models,
						document: fixture.document,
						repeatFormModelPath: FORM_MODEL.IR.repeatFormModelPath,
						readonly: false
					});

					const fileUpload = query(wrapper.widgetMap.DefaultFileUpload).props();
					strictEqual(fileUpload.readOnly, false);
				});
			});

			describe("given disabled = true as prop", () => {
				it("renders a disabled file upload widget", async () => {
					const wrapper = await setupMultiFileUpload({
						models,
						document: fixture.document,
						repeatFormModelPath: FORM_MODEL.IR.repeatFormModelPath,
						disabled: true
					});

					const fileUpload = query(wrapper.widgetMap.DefaultFileUpload).props();
					strictEqual(fileUpload.disabled, true);
				});
			});

			describe("given disabled = false as prop", () => {
				it("renders an enabled file upload widget", async () => {
					const wrapper = await setupMultiFileUpload({
						models,
						document: fixture.document,
						repeatFormModelPath: FORM_MODEL.IR.repeatFormModelPath,
						disabled: false
					});

					const fileUpload = query(wrapper.widgetMap.DefaultFileUpload).props();
					strictEqual(fileUpload.disabled, false);
				});
			});

			describe("given a document, where the maximum repeatability of the repeatable group is reached", () => {
				it("renders a disabled file upload widget", async () => {
					const wrapper = await setupFormEngineRendererWithRtlAsync({
						models,
						data: { document: fixture.documentMaxRep }
					});

					const fileUpload = query(wrapper.widgetMap.DefaultFileUpload).props();
					strictEqual(fileUpload.disabled, true);
				});
			});
		});

		describe("props", () => {
			describe("labels", () => {
				it("hands the label properties from the form model to the widget", async () => {
					const wrapper = await setupMultiFileUpload({
						models,
						document: fixture.document,
						repeatFormModelPath: FORM_MODEL.IR.repeatHiddenLabelsFormModelPath
					});
					const fileUpload = query(wrapper.widgetMap.DefaultFileUpload).props();
					strictEqual(fileUpload.descriptionText, "Drop files here or click to");
					strictEqual(fileUpload.hideDescriptionText, true);
					strictEqual(fileUpload.buttonText, "Upload files");
					strictEqual(fileUpload.mobileButtonText, "Upload files");
					strictEqual(fileUpload.hideButtonText, true);
					strictEqual(
						fileUpload.helperText,
						"This is a super useful helper text, that's explaining very important things!"
					);
				});
			});

			describe("attachmentConfig", () => {
				describe("accept", () => {
					it("hands the accept prop from the attachmentConfig in the field configuration to the widget", async () => {
						const wrapper = await setupMultiFileUpload({
							models,
							document: fixture.document,
							repeatFormModelPath: FORM_MODEL.IR.repeatFormModelPath
						});
						const defaultFileUpload = query(wrapper.widgetMap.DefaultFileUpload).props();
						strictEqual(defaultFileUpload.accept, "image/*");
					});
				});
			});

			describe("validationMessages", () => {
				it("renders only the upload error from the message state", async () => {
					const uploadErrorLocalizable: Localizable = { key: "uploadError" };

					const wrapper = await setupMultiFileUpload({
						models,
						document: fixture.document,
						repeatFormModelPath: FORM_MODEL.IR.repeatHiddenLabelsFormModelPath,
						errorMessages: [
							error({ errorText: [{ key: "someOtherError1" }] }),
							error({ errorCode: ATTACHMENT_ERROR_CODE, errorText: [uploadErrorLocalizable] }),
							error({ errorText: [{ key: "someOtherError2" }] })
						]
					});

					const defaultFileUpload = query(wrapper.widgetMap.DefaultFileUpload).props();
					notStrictEqual(defaultFileUpload.errorMessage, undefined);

					const msgProps = query(wrapper.componentMap.MessageList).props();
					deepStrictEqual(msgProps.messages, [[uploadErrorLocalizable]]);
				});

				it("does not render messages if no upload error exists", async () => {
					const wrapper = await setupMultiFileUpload({
						models,
						document: fixture.document,
						repeatFormModelPath: FORM_MODEL.IR.repeatHiddenLabelsFormModelPath,
						errorMessages: [error({ errorText: [{ key: "someOtherError1" }] })]
					});

					const defaultFileUpload = query(wrapper.widgetMap.DefaultFileUpload).props();
					strictEqual(defaultFileUpload.errorMessage, undefined);

					query(wrapper.componentMap.MessageList).assertNotRendered();
				});
			});
		});
	});

	function describeDuplicateHandlingTests(): void {
		const buttonWithLabelQuery = (wrapper: RtlRenderWrapper) => (label: string) =>
			query(wrapper.widgetMap.Button).withProp("label", label);

		interface TestCase {
			readonly strategy: DuplicateStrategy;
			readonly buttonLabel: string;
		}

		const DuplicateHandlingVariants: TestCase[] = [
			{
				strategy: "skip",
				buttonLabel: "Skip"
			},
			{
				strategy: "replace",
				buttonLabel: "Replace"
			},
			{
				strategy: "as_copy",
				buttonLabel: "Upload as copy"
			}
		];

		describe("if a file name already exists in the document", () => {
			it("renders a modal dialog for duplicate handling", async () => {
				const fileListMock = setupFileListMock([fixture.fileMocks.duplicateFileMock]);

				const wrapper = await setupConnectedFormEngineWithRtlAsync({
					models,
					data: { document: fixture.document }
				});

				act(() => {
					const attachmentControl = query(wrapper.widgetMap.DefaultFileUpload).props();
					attachmentControl.onChange?.(fileListMock, false);
				});

				const modal = query(wrapper.widgetMap.ModalNotification).props();

				strictEqual(modal.title, "File name already exists");

				const assertButtonWithLabel = (label: string) =>
					buttonWithLabelQuery(wrapper)(label).assertRendered();

				DuplicateHandlingVariants.map(variant => variant.buttonLabel).forEach(
					assertButtonWithLabel
				);
			});

			DuplicateHandlingVariants.forEach(describeDuplicateHandlingTestCase);

			function describeDuplicateHandlingTestCase(testCase: TestCase): void {
				describe(`and "${testCase.buttonLabel}" is clicked in the modal dialog`, () => {
					it(`dispatches "Attachments.uploadAttachments" with duplicate strategy '${testCase.strategy}'`, async () => {
						const fileMocks = [
							fixture.fileMocks.duplicateFileMock,
							fixture.fileMocks.uniqueFileMock1
						];

						const fileListMock = setupFileListMock(fileMocks);

						const expectedAction = Events.Attachments.uploadAttachments({
							files: fileMocks.map((fm, idx) => ({
								file: fm,
								attachmentPath: DOCUMENT_MODEL.getAttachmentDocPath(
									fixture.numberOfExistingAttachmentsDocument + idx + 1,
									1
								)
							})),
							formModelElementPath: FORM_MODEL.IR.repeatFormModelPath,

							pathToRepeatGroup: DOCUMENT_MODEL.getAttachmentCollectionDocPath(0),
							duplicateStrategy: testCase.strategy,
							existingFiles: [
								{
									fileName: fixture.attachments.duplicateAttachment.original_filename,
									documentPath: DOCUMENT_MODEL.getAttachmentDocPath(1)
								}
							]
						});

						const { spy, middleware: spyMiddleware } = createMiddlewareSpy();
						const { ready, middleware: waitForActionMiddleware } =
							createMiddlewareWaitForAction(expectedAction);

						const wrapper = await setupConnectedFormEngineWithRtlAsync({
							models,
							locale: US_LOCALE,
							data: { document: fixture.document },
							middlewares: [spyMiddleware, waitForActionMiddleware]
						});

						act(() => {
							const attachmentControl = query(wrapper.widgetMap.DefaultFileUpload)
								.propsHistory()
								.at(0);
							attachmentControl?.onChange?.(fileListMock, false);
						});

						query(wrapper.widgetMap.ModalNotification).assertRendered();
						act(() => {
							const skipButton = buttonWithLabelQuery(wrapper)(testCase.buttonLabel)
								.propsHistory()
								.at(0);
							skipButton?.onClick?.(mouseEventMock);
						});

						await ready;
						deepStrictEqual(spy.mock.calls[0].arguments[0], expectedAction);
					});
				});
			}
		});
	}
});

function mockFile(name: string): File {
	return { name } as File;
}

function error(partial?: Partial<EngineStore.Validation.Message>): EngineStore.Validation.Message {
	return {
		errorKey: "someKey",
		errorText: [{ key: "k1" }],
		element: [],
		referencedFields: [],
		errorCode: "someCode",
		severity: "ERROR",
		...partial
	};
}
