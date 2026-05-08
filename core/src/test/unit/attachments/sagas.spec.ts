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

import { deepStrictEqual, notStrictEqual, strictEqual } from "node:assert/strict";
import type { Mock } from "node:test";
import { mock } from "node:test";

import { expectSaga } from "redux-saga-test-plan";
import type { AnyAction } from "typescript-fsa";

import { Settings } from "@com.mgmtp.a12.utils/utils-logging/lib/Settings.js";

import { Events } from "../../../back-end/store/index.js";
import type { AttachmentLoader, FormEngineSagaOptions } from "../../../client-extensions/index.js";
import { FormEngineActions } from "../../../client-extensions/index.js";
import { uploadDone } from "../../../client-extensions/internal/extensions/form-engine/internal/attachments/actions.js";
import { cancelSaga } from "../../../client-extensions/internal/extensions/form-engine/internal/attachments/sagas/cancelSaga.js";
import { deleteSaga } from "../../../client-extensions/internal/extensions/form-engine/internal/attachments/sagas/deleteSaga.js";
import { downloadSaga } from "../../../client-extensions/internal/extensions/form-engine/internal/attachments/sagas/downloadSaga.js";
import { uploadSaga } from "../../../client-extensions/internal/extensions/form-engine/internal/attachments/sagas/uploadSaga.js";
import { DocumentHelpers } from "../../utils/document-helpers.js";
import { ModelHelpers } from "../../utils/model-helpers.js";

const { createModelPath } = ModelHelpers;
const { createDocumentPath } = DocumentHelpers;

describe("unit.attachments.sagas", () => {
	const activityId = "1";
	const strategy = Settings.LogStrategy;

	before(() => {
		Settings.resetLogStrategy();
	});

	after(() => {
		Settings.LogStrategy = strategy;
	});

	describe("uploadSaga", () => {
		it("does nothing when AttachmentLoader is not given", async () => {
			const triggerAction = FormEngineActions.event({
				activityId,
				engineEvent: Events.Attachments.uploadAttachments({ files: [], formModelElementPath: [] })
			});

			const { effects } = await expectSaga(uploadSaga, undefined)
				.dispatch(triggerAction)
				.silentRun();

			strictEqual(effects.put, undefined);
		});

		describe("with an AttachmentLoader", () => {
			function attachmentPath() {
				return createDocumentPath(["root"], ["attachment"]);
			}
			function attachmentFormModelPath() {
				return createModelPath("screen", "cg", "row", "attachment");
			}

			const triggerActionSingle = FormEngineActions.event({
				activityId,
				engineEvent: Events.Attachments.uploadAttachments({
					files: [{ file: new File([], "1"), attachmentPath: attachmentPath() }],
					formModelElementPath: attachmentFormModelPath()
				})
			});

			const attachmentLoaderMock = {
				uploadFiles: async files => files.map((_, idx) => ({ attachment_id: `${idx}` })),
				retrieveDownloadLink: async () => ""
			} satisfies AttachmentLoader;

			function runSaga(triggerAction: AnyAction, options?: FormEngineSagaOptions) {
				return expectSaga(uploadSaga, {
					attachmentLoader: attachmentLoaderMock,
					documentDescriptorSelector: () => ({ documentId: "", documentModelName: "" }),
					...options
				})
					.dispatch(triggerAction)
					.silentRun();
			}

			it("calls the provided selector", async () => {
				const descriptorSelectorMock = mock.fn(() => ({ documentId: "", documentModelName: "" }));
				await runSaga(triggerActionSingle, { documentDescriptorSelector: descriptorSelectorMock });

				strictEqual(descriptorSelectorMock.mock.callCount(), 1);
			});

			it("forks a cancel saga", async () => {
				const { effects } = await runSaga(triggerActionSingle);

				const cancelForkEffect = effects.fork.find(f => f.payload.fn === cancelSaga);

				notStrictEqual(cancelForkEffect, undefined);
			});

			it("calls the upload method of the AttachmentLoader", async () => {
				const { effects } = await runSaga(triggerActionSingle);

				const callUploadEffect = effects.call.find(
					f => f.payload.fn === attachmentLoaderMock.uploadFiles
				);

				notStrictEqual(callUploadEffect, undefined);
			});

			it("puts an uploadDone action", async () => {
				const { effects } = await runSaga(triggerActionSingle);

				const putEffect = effects.put.find(f => uploadDone.match(f.payload.action));
				notStrictEqual(putEffect, undefined);
			});

			it("only puts an uploadDone action if all files are duplicates and duplicates are skipped", async () => {
				const uploadAction = FormEngineActions.event({
					activityId,
					engineEvent: Events.Attachments.uploadAttachments({
						files: [{ file: new File([], "1"), attachmentPath: [] }],
						formModelElementPath: [],
						existingFiles: [{ fileName: "1", documentPath: [] }],
						duplicateStrategy: "skip"
					})
				});

				const { effects } = await runSaga(uploadAction);

				const putEffect = effects.put?.find(f => uploadDone.match(f.payload.action));
				const cancelForkEffect = effects.fork?.find(f => f.payload.fn === cancelSaga);
				const callUploadEffect = effects.call?.find(
					f => f.payload.fn === attachmentLoaderMock.uploadFiles
				);

				notStrictEqual(putEffect, undefined);
				strictEqual(cancelForkEffect, undefined);
				strictEqual(callUploadEffect, undefined);
			});

			describe("for successful uploads", () => {
				it("also puts a `attachmentValueChange` from a single file upload", async () => {
					const { effects } = await runSaga(triggerActionSingle);

					const putEffect = effects.put.find(
						f =>
							FormEngineActions.event.match(f.payload.action) &&
							Events.attachmentValueChange.match(f.payload.action.payload.engineEvent)
					);
					notStrictEqual(putEffect, undefined);
					deepStrictEqual(putEffect?.payload.action.payload.engineEvent.payload, {
						path: attachmentPath(),
						formModelElementPath: attachmentFormModelPath(),
						value: { attachment_id: "0" }
					});
				});

				it("also puts a `multiFileUpload` for uploads from a multi file upload", async () => {
					const formModelRepeatPath = createModelPath("screen", "repeat");
					const pathToRepeatGroup = createDocumentPath(["root"], ["repeat"]);
					const attachment1 = {
						file: new File([], "1"),
						attachmentPath: createDocumentPath(["root"], ["repeat", 2], ["attachment"])
					};
					const attachment2 = {
						file: new File([], "2"),
						attachmentPath: createDocumentPath(["root"], ["repeat", 3], ["attachment"])
					};

					const triggerActionMultiple = FormEngineActions.event({
						activityId,
						engineEvent: Events.Attachments.uploadAttachments({
							files: [attachment1, attachment2],
							formModelElementPath: formModelRepeatPath,
							pathToRepeatGroup,
							formModelRepeatPath: []
						})
					});

					const { effects } = await runSaga(triggerActionMultiple);

					const putEffect = effects.put.find(
						f =>
							FormEngineActions.event.match(f.payload.action) &&
							Events.Repeat.multiFileUpload.match(f.payload.action.payload.engineEvent)
					);
					notStrictEqual(putEffect, undefined);
					deepStrictEqual(putEffect?.payload.action.payload.engineEvent.payload, {
						path: pathToRepeatGroup,
						repeatFormModelPath: formModelRepeatPath,
						attachmentModelPath: attachment1.attachmentPath,
						toBeAdded: [{ attachment_id: "0" }, { attachment_id: "1" }],
						toBeReplaced: undefined
					});
				});
			});
		});
	});

	describe("deleteSaga", () => {
		const triggerAction = FormEngineActions.event({
			activityId,
			engineEvent: Events.Attachments.deleteAttachment({
				attachment: { attachment_id: "1" },
				attachmentPath: []
			})
		});

		const attachmentLoaderMock = {
			uploadFiles: async files => files.map((_, idx) => ({ attachment_id: `${idx}` })),
			retrieveDownloadLink: async () => "url",
			deleteFile: async () => {}
		} satisfies AttachmentLoader;

		function runSaga(triggerAction: AnyAction, options?: FormEngineSagaOptions) {
			return expectSaga(deleteSaga, {
				attachmentLoader: attachmentLoaderMock,
				documentDescriptorSelector: () => ({ documentId: "", documentModelName: "" }),
				...options
			})
				.dispatch(triggerAction)
				.silentRun();
		}

		it("calls the provided selector", async () => {
			const descriptorSelectorMock = mock.fn(() => ({ documentId: "", documentModelName: "" }));
			await runSaga(triggerAction, { documentDescriptorSelector: descriptorSelectorMock });

			strictEqual(descriptorSelectorMock.mock.callCount(), 1);
		});

		it("calls the delete method of the AttachmentLoader, if it exists", async () => {
			const { effects } = await runSaga(triggerAction);

			const callDeleteEffect = effects.call.find(
				f => f.payload.fn === attachmentLoaderMock.deleteFile
			);

			notStrictEqual(callDeleteEffect, undefined);
		});

		it("puts a `attachmentValueChange` with an empty attachment", async () => {
			const { effects } = await runSaga(triggerAction);

			const putEffect = effects.put.find(
				({ payload }) =>
					FormEngineActions.event.match(payload.action) &&
					Events.attachmentValueChange.match(payload.action.payload.engineEvent) &&
					payload.action.payload.engineEvent.payload.value.attachment_id === null
			);
			notStrictEqual(putEffect, undefined);
		});
	});

	describe("downloadSaga", () => {
		it("does nothing when AttachmentLoader is not given", async () => {
			const triggerAction = FormEngineActions.event({
				activityId,
				engineEvent: Events.Attachments.downloadAttachment({
					attachment: { attachment_id: "1" },
					attachmentPath: []
				})
			});

			const { effects } = await expectSaga(downloadSaga, undefined)
				.dispatch(triggerAction)
				.silentRun();

			strictEqual(effects.put, undefined);
		});

		describe("with an AttachmentLoader", () => {
			let hrefSetterStub: Mock<(value: string) => void>;
			let clickStub: Mock<typeof HTMLAnchorElement.prototype.click>;

			beforeEach(() => {
				hrefSetterStub = mock.setter(HTMLAnchorElement.prototype, "href", () => () => {});
				clickStub = mock.method(HTMLAnchorElement.prototype, "click");
			});

			const triggerAction = FormEngineActions.event({
				activityId,
				engineEvent: Events.Attachments.downloadAttachment({
					attachment: { attachment_id: "1" },
					attachmentPath: []
				})
			});

			const attachmentLoaderMock = {
				uploadFiles: async files => files.map((_, idx) => ({ attachment_id: `${idx}` })),
				retrieveDownloadLink: async () => "url"
			} satisfies AttachmentLoader;

			function runSaga(triggerAction: AnyAction, options?: FormEngineSagaOptions) {
				return expectSaga(downloadSaga, {
					attachmentLoader: attachmentLoaderMock,
					documentDescriptorSelector: () => ({ documentId: "", documentModelName: "" }),
					...options
				})
					.dispatch(triggerAction)
					.silentRun();
			}

			it("calls the provided selector", async () => {
				const descriptorSelectorMock = mock.fn(() => ({ documentId: "", documentModelName: "" }));
				await runSaga(triggerAction, { documentDescriptorSelector: descriptorSelectorMock });

				strictEqual(descriptorSelectorMock.mock.callCount(), 1);
			});

			it("calls the download method of the AttachmentLoader", async () => {
				const { effects } = await runSaga(triggerAction);

				const callDownloadEffect = effects.call.find(
					f => f.payload.fn === attachmentLoaderMock.retrieveDownloadLink
				);

				notStrictEqual(callDownloadEffect, undefined);
			});

			it("clicks an anchor element with href set to the resulting link", async () => {
				await runSaga(triggerAction);

				strictEqual(hrefSetterStub.mock.calls.at(0)?.arguments.at(0), "url");
				strictEqual(clickStub.mock.callCount(), 1);
			});
		});
	});

	describe("cancelSaga", () => {
		it("calls the abort method when triggered", async () => {
			const triggerAction = FormEngineActions.event({
				activityId,
				engineEvent: Events.Attachments.cancelUploadAttachments()
			});

			const abortStub = mock.method(AbortController.prototype, "abort");

			await expectSaga(cancelSaga, new AbortController()).dispatch(triggerAction).silentRun();

			strictEqual(abortStub.mock.callCount(), 1);
		});
	});
});
