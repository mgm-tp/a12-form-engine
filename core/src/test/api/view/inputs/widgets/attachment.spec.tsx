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

import { deepStrictEqual, ok, strictEqual } from "node:assert/strict";

import { act } from "@testing-library/react";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type { Attachment } from "@com.mgmtp.a12.dataservices/dataservices-access/lib/Attachment/attachment.js";
import { query } from "@com.mgmtp.a12.devtools/react";
import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";
import {
	defaultDataFormats,
	defaultLocalizerFactory,
	defaultValueConversion,
	type Localizer
} from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import { RESOURCE_KEYS } from "../../../../../back-end/localization/internal/languages/keys.js";
import { DocumentPath } from "../../../../../models/index.js";
import type { FormModel } from "../../../../../models/internal/form-model.js";
import type { WidgetMap } from "../../../../../view/index.js";
import { AttachmentUpload } from "../../../../../view/internal/components/widgets/form-engine/attachments/AttachmentUpload.js";
import { mouseEventMock } from "../../../../rtl-utils/mock-utils.js";
import type { RtlRenderWrapper } from "../../../../rtl-utils/render-wrapper.js";
import { rtlRenderWrapper } from "../../../../rtl-utils/render-wrapper.js";
import { US_LOCALE } from "../../../../utils/localization.js";
import { SetupHelpers } from "../../../../utils/setup.js";
import { setupModelsFixture } from "../../../../utils/setupFixture.js";
import { ATTACHMENT } from "../../../../utils/test-model-helpers/attachment.js";
import {
	resetStubbedDispatchConfig,
	stubbedDispatchConfig
} from "../../repeat/row-actions/row-action-utils.js";

const { setupFormEngineRendererWithRtl } = SetupHelpers;

describe("api.view.inputs", () => {
	describe("Attachment", () => {
		const models = setupModelsFixture("controls.attachmentUpload");

		afterEach(() => resetStubbedDispatchConfig(stubbedDispatchConfig));

		describe("Upload", () => {
			it("renders a popup menu with a secondary icon button as trigger element", () => {
				const { widgetMap } = setupAttachment({ withAttachmentContent: true, readonly: false });

				query(widgetMap.PopUpMenu).withTestId("test-popup-menu").assertRendered();
				const buttonProps = query(widgetMap.Button).withTestId("test-popup-menu-button").props();

				strictEqual(buttonProps.secondary, true);
			});
		});

		describe("Enablement", () => {
			describe("given readonly = true as prop", () => {
				describe("and no exposition", () => {
					it("renders a readonly file upload widget", () => {
						const { widgetMap } = setupAttachment({ readonly: true, withAttachmentContent: true });

						const props = query(widgetMap.DefaultFileUpload).withId("test").props();

						strictEqual(props.readOnly, true);
					});
				});

				describe("and exposition COMPACT", () => {
					describe("and no readonly presentation", () => {
						it("renders a file upload widget with the correct props", () => {
							const { widgetMap } = setupAttachment({
								readonly: true,
								exposition: "COMPACT",
								withAttachmentContent: true
							});

							const props = query(widgetMap.DefaultFileUpload).withId("test").props();

							strictEqual(props.readOnly, true);
							strictEqual(props.fileOptions?.textOnlyDisplay, false);
							strictEqual(props.fileOptions?.showAsLink, undefined);
						});
					});

					describe("and readonly presentation TEXT", () => {
						describe("given no attachment", () => {
							it("renders a file upload widget with the correct props", () => {
								const { widgetMap } = setupAttachment({
									readonly: true,
									readonlyPresentation: "TEXT",
									exposition: "COMPACT"
								});

								const props = query(widgetMap.DefaultFileUpload).withId("test").props();

								strictEqual(props.readOnly, true);
								strictEqual(props.fileOptions?.textOnlyDisplay, true);
								strictEqual(props.fileOptions?.showAsLink, false);
							});
						});

						describe("given an attachment", () => {
							it("renders a file upload widget with the correct props", () => {
								const { widgetMap } = setupAttachment({
									readonly: true,
									readonlyPresentation: "TEXT",
									exposition: "COMPACT",
									withAttachmentContent: true
								});

								const props = query(widgetMap.DefaultFileUpload).withId("test").props();

								strictEqual(props.readOnly, true);
								strictEqual(props.fileOptions?.textOnlyDisplay, true);
								strictEqual(props.fileOptions?.showAsLink, undefined);
							});
						});
					});
				});
			});

			describe("given readonly = false as prop", () => {
				it("renders an enabled file upload widget", () => {
					const { widgetMap } = setupAttachment({ readonly: false, withAttachmentContent: true });

					const props = query(widgetMap.DefaultFileUpload).withId("test").props();
					strictEqual(props.readOnly, false);
				});
			});

			describe("given disabled = true as prop", () => {
				it("renders a disabled file upload widget", () => {
					const { widgetMap } = setupAttachment({ disabled: true, withAttachmentContent: true });

					const props = query(widgetMap.DefaultFileUpload).withId("test").props();
					strictEqual(props.disabled, true);
				});
			});

			describe("given disabled = false as prop", () => {
				it("renders an enabled file upload widget", () => {
					const { widgetMap } = setupAttachment({ disabled: false, withAttachmentContent: true });

					const props = query(widgetMap.DefaultFileUpload).withId("test").props();
					strictEqual(props.disabled, false);
				});
			});
		});

		describe("When no attachment is given", () => {
			describe("onUploadAreaClick", () => {
				it("returns true if the defaultAction is not 'download'", () => {
					const { widgetMap } = setupAttachment({});
					const props = query(widgetMap.DefaultFileUpload).withId("test").props();
					strictEqual(props.onUploadAreaClick?.(), true);
				});

				it("returns true if the defaultAction is 'download'", () => {
					const { widgetMap } = setupAttachment({
						attachmentConfig: { defaultAction: "download" }
					});
					const props = query(widgetMap.DefaultFileUpload).withId("test").props();
					strictEqual(props.onUploadAreaClick?.(), true);
				});

				it("is undefined if the attachment is readonly", () => {
					const { widgetMap } = setupAttachment({
						readonly: true,
						attachmentConfig: { defaultAction: "download" }
					});
					const props = query(widgetMap.DefaultFileUpload).withId("test").props();
					strictEqual(props.onUploadAreaClick?.(), undefined);
				});
			});

			describe("onChange", () => {
				it("calls onAttachmentUpload from the dispatch config with the uploaded file and the correct path", async () => {
					const attachmentPath = DocumentPath.fromString("/my[1]/attachment[2]/path[1]");
					const formModelPath = ModelPath.fromString("/screen/sec/cg/row/myAttachmentControl");
					const { widgetMap } = setupAttachment({ attachmentPath, formModelPath });
					const props = query(widgetMap.DefaultFileUpload).withId("test").props();

					const mockFile: File = { name: "testFile" } as File;
					const fileListMock: FileList = { item: () => mockFile } as unknown as FileList;

					await act(() => props.onChange?.(fileListMock, false));

					strictEqual(stubbedDispatchConfig.onAttachmentUpload.mock.callCount(), 1);
					deepStrictEqual(stubbedDispatchConfig.onAttachmentUpload.mock.calls.at(0)?.arguments, [
						[
							{
								file: mockFile,
								attachmentPath
							}
						],
						formModelPath
					]);
				});
			});
		});

		describe("When an attachment is given", () => {
			it("renders the preview image, if one exists", () => {
				const { widgetMap } = setupAttachment({
					withAttachmentContent: true,
					thumbnail: "dummy.jpg"
				});

				const fileUploadProps = query(widgetMap.DefaultFileUpload).withId("test").props();
				strictEqual(fileUploadProps.showPlaceholderIconAsPreview, false);

				const imageProps = query(widgetMap.ResponsiveImageContainer)
					.withTestId("test-responsive-image-container")
					.props();
				ok(imageProps.src.endsWith("dummy.jpg"));
				strictEqual(imageProps.alt, "");
			});

			it("renders a default preview icon, if the preview image has an unsupported type", () => {
				const { widgetMap } = setupAttachment({
					customAttachmentContent: {
						internal_filename: "notSupported.tiff",
						original_filename: "notSupported.tiff",
						mime_type: "image/tiff",
						category: null,
						description: null,
						attachment_id: "123",
						size: null
					}
				});

				const fileUploadProps = query(widgetMap.DefaultFileUpload).withId("test").props();
				strictEqual(fileUploadProps.showPlaceholderIconAsPreview, true);

				query(widgetMap.ResponsiveImageContainer)
					.withId("test-responsive-image-container")
					.assertNotRendered();
			});

			it("renders a default preview icon, if no preview image exists", () => {
				const { widgetMap } = setupAttachment({ withAttachmentContent: true });

				const fileUploadProps = query(widgetMap.DefaultFileUpload).withId("test").props();
				strictEqual(fileUploadProps.showPlaceholderIconAsPreview, true);

				query(widgetMap.ResponsiveImageContainer)
					.withId("test-responsive-image-container")
					.assertNotRendered();
			});

			describe("and the attachment is editable", () => {
				it("renders a pop up menu with replace, download, and remove entries", () => {
					const { widgetMap } = setupAttachment({ withAttachmentContent: true });

					for (const action of ["replace", "download", "remove"]) {
						const props = query(widgetMap.ListItem).withTestId(`test-popup-menu-${action}`).props();

						strictEqual(
							props.text,
							RESOURCE_KEYS.attachment.button[action as "replace" | "download" | "remove"]
						);
						strictEqual(props.disabled, undefined);
					}
				});

				describe("and unassigned", () => {
					it("renders a pop up menu where the download entry is disabled", () => {
						const { widgetMap } = setupAttachment({
							withAttachmentContent: true,
							isUnassigned: true
						});

						for (const action of ["replace", "download", "remove"]) {
							const props = query(widgetMap.ListItem)
								.withTestId(`test-popup-menu-${action}`)
								.props();

							strictEqual(
								props.text,
								RESOURCE_KEYS.attachment.button[action as "replace" | "download" | "remove"]
							);
							strictEqual(props.disabled, action === "download" ? true : undefined);
						}
					});
				});

				describe("and rendered in a field column of a multi file upload repeat", () => {
					it("renders a pop up menu where the delete entry is hidden", async () => {
						const { widgetMap } = await act(() =>
							setupFormEngineRendererWithRtl({
								models,
								locale: US_LOCALE,
								data: {
									document: {
										root: {
											repeat_attachmentCollection_IR: [
												{
													attachment: {
														internal_filename: "internal_filename.jpg",
														original_filename: "original_filename.jpg",
														mime_type: "image/jpeg",
														category: null,
														description: null,
														attachment_id: "1",
														size: null
													}
												}
											]
										}
									}
								},
								ui: {
									screenLocation: [
										{ path: [], locationPath: [{ elementName: "multiAttachments" }] }
									]
								},
								localizer: localizable => localizable.key,
								withWidgets: true
							})
						);

						query(widgetMap.ListItem)
							.withTestId(`${ATTACHMENT.ID_IR_MULTI_FILE_UPLOAD_ATTACHMENT}-popup-menu-replace`)
							.assertRendered();
						query(widgetMap.ListItem)
							.withTestId(`${ATTACHMENT.ID_IR_MULTI_FILE_UPLOAD_ATTACHMENT}-popup-menu-download`)
							.assertRendered();
						query(widgetMap.ListItem)
							.withTestId(`${ATTACHMENT.ID_IR_MULTI_FILE_UPLOAD_ATTACHMENT}-popup-menu-remove`)
							.assertNotRendered();
					});
				});

				describe("Title", () => {
					describe("and no exposition", () => {
						describe("and defaultAction = 'replace'", () => {
							it("sets a title on the File Upload containing the current action and file name", () => {
								executeTitleTest({
									defaultAction: "replace",
									fileName: "TestFile.png",
									expectedTitle: "Replace attachment TestFile.png"
								});
							});
						});

						describe("and defaultAction = 'download'", () => {
							it("sets a title on the File Upload containing the current action and file name", () => {
								executeTitleTest({
									defaultAction: "download",
									fileName: "TestFile.png",
									expectedTitle: "Download attachment TestFile.png"
								});
							});
						});
					});

					describe("and exposition COMPACT", () => {
						describe("and defaultAction = 'replace'", () => {
							it("sets a title on the link containing the current action and file name", () => {
								executeTitleTest({
									exposition: "COMPACT",
									defaultAction: "replace",
									fileName: "TestFile.png",
									expectedTitle: "Replace attachment TestFile.png"
								});
							});
						});

						describe("and defaultAction = 'download'", () => {
							it("sets a title on the link containing the current action and file name", () => {
								executeTitleTest({
									exposition: "COMPACT",
									defaultAction: "download",
									fileName: "TestFile.png",
									expectedTitle: "Download attachment TestFile.png"
								});
							});
						});
					});
				});

				describe("when clicking 'Remove'", () => {
					describe("but not confirming the removal", () => {
						it("aborts the removal ", async () => {
							const { widgetMap } = setupAttachment({ withAttachmentContent: true });

							const removeItemProps = query(widgetMap.ListItem)
								.withTestId(`test-popup-menu-remove`)
								.props();
							await act(() => removeItemProps.onClick?.());

							const modalProps = query(widgetMap.ModalNotification).props();
							strictEqual(modalProps.title, RESOURCE_KEYS.attachment.dialog.remove.title);

							const cancelButtonProps = query(widgetMap.Button)
								.withTestId(`remove-modal-cancel`)
								.props();
							await act(() => cancelButtonProps.onClick?.(mouseEventMock));

							strictEqual(stubbedDispatchConfig.onAttachmentUpload.mock.callCount(), 0);
						});
					});

					describe("and confirming the removal", () => {
						it("triggers the removal", async () => {
							const { widgetMap } = setupAttachment({
								customAttachmentContent: { attachment_id: "1", original_filename: "test.txt" }
							});

							const removeItemProps = query(widgetMap.ListItem)
								.withTestId(`test-popup-menu-remove`)
								.props();
							await act(() => removeItemProps.onClick?.());

							const modalProps = query(widgetMap.ModalNotification).props();
							strictEqual(modalProps.title, RESOURCE_KEYS.attachment.dialog.remove.title);

							const continueButtonProps = query(widgetMap.Button)
								.withTestId(`remove-modal-continue`)
								.props();
							await act(() => continueButtonProps.onClick?.(mouseEventMock));

							deepStrictEqual(
								stubbedDispatchConfig.onAttachmentDelete.mock.calls.at(0)?.arguments,
								[{ attachment_id: "1", original_filename: "test.txt" }, []]
							);
						});
					});
				});

				describe("onUploadAreaClick", () => {
					it("returns true if the defaultAction is not 'download'", () => {
						const { widgetMap } = setupAttachment({ withAttachmentContent: true });
						const props = query(widgetMap.DefaultFileUpload).withId("test").props();
						strictEqual(props.onUploadAreaClick?.(), true);
					});

					describe("if the defaultAction is 'download'", () => {
						it("returns false and triggers a download", () => {
							const { widgetMap } = setupAttachment({
								customAttachmentContent: { attachment_id: "1", original_filename: "test.txt" },
								attachmentConfig: { defaultAction: "download" }
							});
							const props = query(widgetMap.DefaultFileUpload).withId("test").props();

							strictEqual(props.onUploadAreaClick?.(), false);
							deepStrictEqual(
								stubbedDispatchConfig.onAttachmentDownload.mock.calls.at(0)?.arguments,
								[{ attachment_id: "1", original_filename: "test.txt" }, []]
							);
						});

						it("returns false and does not trigger a download if the attachment is unassigned", () => {
							const { widgetMap } = setupAttachment({
								withAttachmentContent: true,
								attachmentConfig: { defaultAction: "download" },
								isUnassigned: true
							});
							const props = query(widgetMap.DefaultFileUpload).withId("test").props();

							strictEqual(props.onUploadAreaClick?.(), false);
							strictEqual(stubbedDispatchConfig.onAttachmentDownload.mock.callCount(), 0);
						});
					});
				});
			});

			describe("and the attachment is readonly", () => {
				it("does not render a pop up menu", () => {
					const { widgetMap } = setupAttachment({ readonly: true, withAttachmentContent: true });
					query(widgetMap.PopUpMenu).withId("test-popup-menu").assertNotRendered();
				});

				describe("Title", () => {
					describe("and no exposition", () => {
						it("sets a title on the FileUpload containing the current action and file name", () => {
							executeTitleTest({
								readonly: true,
								fileName: "TestFile.png",
								expectedTitle: "Download attachment TestFile.png"
							});
						});
					});

					describe("and exposition COMPACT", () => {
						it("sets a title on the link containing the current action and file name", () => {
							executeTitleTest({
								exposition: "COMPACT",
								readonly: true,
								fileName: "TestFile.png",
								expectedTitle: "Download attachment TestFile.png"
							});
						});
					});
				});

				describe("onUploadAreaClick", () => {
					describe("if the defaultAction is not 'download'", () => {
						it("returns false and triggers a download", () => {
							const { widgetMap } = setupAttachment({
								readonly: true,
								customAttachmentContent: { attachment_id: "1", original_filename: "test.txt" }
							});
							const props = query(widgetMap.DefaultFileUpload).withId("test").props();

							strictEqual(props.onUploadAreaClick?.(), false);
							deepStrictEqual(
								stubbedDispatchConfig.onAttachmentDownload.mock.calls.at(0)?.arguments,
								[{ attachment_id: "1", original_filename: "test.txt" }, []]
							);
						});

						it("returns false and does not trigger a download if the attachment is unassigned", () => {
							const { widgetMap } = setupAttachment({
								readonly: true,
								withAttachmentContent: true,
								isUnassigned: true
							});
							const props = query(widgetMap.DefaultFileUpload).withId("test").props();

							strictEqual(props.onUploadAreaClick?.(), false);
							strictEqual(stubbedDispatchConfig.onAttachmentDownload.mock.callCount(), 0);
						});
					});

					describe("if the defaultAction is 'download'", () => {
						it("returns false and triggers a download", () => {
							const { widgetMap } = setupAttachment({
								readonly: true,
								attachmentConfig: { defaultAction: "download" },
								customAttachmentContent: { attachment_id: "1", original_filename: "test.txt" }
							});
							const props = query(widgetMap.DefaultFileUpload).withId("test").props();

							strictEqual(props.onUploadAreaClick?.(), false);
							deepStrictEqual(
								stubbedDispatchConfig.onAttachmentDownload.mock.calls.at(0)?.arguments,
								[{ attachment_id: "1", original_filename: "test.txt" }, []]
							);
						});

						it("returns false and does not trigger a download if the attachment is unassigned", () => {
							const { widgetMap } = setupAttachment({
								readonly: true,
								attachmentConfig: { defaultAction: "download" },
								withAttachmentContent: true,
								isUnassigned: true
							});
							const props = query(widgetMap.DefaultFileUpload).withId("test").props();

							strictEqual(props.onUploadAreaClick?.(), false);
							strictEqual(stubbedDispatchConfig.onAttachmentDownload.mock.callCount(), 0);
						});
					});
				});
			});

			describe("and the attachment is disabled", () => {
				it("renders a disabled pop up menu", () => {
					const { widgetMap } = setupAttachment({ disabled: true, withAttachmentContent: true });
					const props = query(widgetMap.PopUpMenu).withTestId("test-popup-menu").props();

					strictEqual(props.disabled, true);
				});
			});
		});

		function executeTitleTest(params: {
			exposition?: FormModel.ExpositionPresentation;
			defaultAction?: FormModel.AttachmentDefaultActionType;
			fileName?: string;
			readonly?: true;
			expectedTitle: string;
		}) {
			const { exposition, defaultAction, fileName, readonly, expectedTitle } = params;

			const { widgetMap } = setupAttachment(
				{
					exposition,
					readonly,
					attachmentConfig: { defaultAction },
					customAttachmentContent: { attachment_id: "1", original_filename: fileName }
				},
				undefined,
				defaultLocalizerFactory({ locale: US_LOCALE })
			);

			const fileUploadProps = query(widgetMap.DefaultFileUpload).withId("test").props();

			if (exposition === "COMPACT") {
				strictEqual(fileUploadProps.title, "");
				strictEqual(fileUploadProps.fileOptions?.linkProps?.title, expectedTitle);
			} else {
				strictEqual(fileUploadProps.title, expectedTitle);
				strictEqual(fileUploadProps.fileOptions?.linkProps?.title, undefined);
			}
		}
	});
});

function setupAttachment(
	options: {
		attachmentPath?: EntityInstancePath;
		formModelPath?: ModelPath;
		exposition?: FormModel.ExpositionPresentation;
		readonly?: boolean;
		readonlyPresentation?: FormModel.ReadonlyPresentation;
		disabled?: boolean;
		loading?: boolean;
		thumbnail?: string;
		isUnassigned?: boolean;
		attachmentConfig?: FormModel.AttachmentConfig;
		customAttachmentContent?: Attachment;
		withAttachmentContent?: boolean;
	},
	widgetMap?: WidgetMap,
	localizer?: Localizer
): RtlRenderWrapper {
	const attachment: Attachment =
		options.customAttachmentContent ??
		(options.withAttachmentContent
			? {
					internal_filename: "internal_filename.jpg",
					original_filename: "original_filename.jpg",
					mime_type: "image/jpeg",
					category: null,
					description: null,
					attachment_id: "1",
					size: null
				}
			: {});

	const locale = US_LOCALE;
	const defaultLocalizer: Localizer = localizable => localizable.key;
	const dataFormats = defaultDataFormats(locale);
	const conversion = defaultValueConversion(dataFormats);

	return rtlRenderWrapper(
		<LocalizerContext.Provider
			value={{ locale, dataFormats, conversion, localizer: localizer ?? defaultLocalizer }}
		>
			<AttachmentUpload
				id="test"
				attachment={attachment}
				attachmentPath={options.attachmentPath ?? []}
				formModelPath={options.formModelPath ?? []}
				modelElement={{
					elementRef: "test",
					elementPath: [],
					exposition: options.exposition ?? "FULL",
					attachmentConfig: options.attachmentConfig
				}}
				loading={options.loading ?? false}
				dispatchUpload={stubbedDispatchConfig.onAttachmentUpload}
				dispatchDelete={stubbedDispatchConfig.onAttachmentDelete}
				dispatchDownload={stubbedDispatchConfig.onAttachmentDownload}
				dispatchCancel={stubbedDispatchConfig.onCancelAttachmentUpload}
				{...options}
			/>
		</LocalizerContext.Provider>,
		{
			widgetMap
		}
	);
}
