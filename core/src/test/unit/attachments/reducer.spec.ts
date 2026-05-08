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

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type { Activity } from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";
import { ActivityActions } from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";

import { Events } from "../../../back-end/store/internal/actions.js";
import type { EngineStore } from "../../../back-end/store/internal/store.js";
import { createUIState } from "../../../back-end/store/internal/storeFactory.js";
import { FormEngineActions } from "../../../client-extensions/internal/extensions/form-engine/internal/actions.js";
import {
	resetUnassigned,
	uploadDone
} from "../../../client-extensions/internal/extensions/form-engine/internal/attachments/actions.js";
import { attachmentReducer } from "../../../client-extensions/internal/extensions/form-engine/internal/attachments/reducer/attachmentReducer.js";
import { reduceAttachmentState } from "../../../client-extensions/internal/extensions/form-engine/internal/attachments/reducer/reduceAttachmentState.js";
import { reduceThumbnails } from "../../../client-extensions/internal/extensions/form-engine/internal/attachments/reducer/reduceThumbnails.js";
import {
	ATTACHMENT_ERROR_CODE,
	reduceUiState
} from "../../../client-extensions/internal/extensions/form-engine/internal/attachments/reducer/reduceUiState.js";
import { DocumentPath } from "../../../models/internal/utils/document-utils.js";
import { DocumentModelHelpers } from "../../utils/model-helpers.js";

describe("unit.attachments.reducer", () => {
	describe("attachmentReducer", () => {
		it("handles attachment-related actions when a ui state exist for the default dh", () => {
			const defaultDh = dh({
				descriptor: { default: "true" },
				slices: { uiState: createUIState({ screenLocation: [], disabled: true }) }
			});
			const dhs = [dh(), defaultDh];

			const actual = attachmentReducer.reduce(
				dhs,
				withModels(
					FormEngineActions.event({
						activityId: "1",
						engineEvent: Events.Attachments.cancelUploadAttachments()
					})
				),
				defaultDh
			);

			deepStrictEqual(actual[0], dhs[0]);
			deepStrictEqual(actual[1], {
				...defaultDh,
				slices: {
					uiState: {
						...defaultDh.slices.uiState,
						disabled: false
					}
				}
			});
		});

		it("does not handle attachment-related actions when there is no default dh", () => {
			const dhs = [
				dh(),
				dh({
					descriptor: { default: "true" },
					slices: { uiState: createUIState({ screenLocation: [] }) }
				})
			];

			const actual = attachmentReducer.reduce(
				dhs,
				ActivityActions.unlock({ activityId: "1", lockId: "" })
			);

			strictEqual(actual, dhs);
		});

		it("does not handle unrelated actions", () => {
			const defaultDh = dh({
				descriptor: { default: "true" },
				slices: { uiState: createUIState({ screenLocation: [] }) }
			});
			const dhs = [dh(), defaultDh];

			const actual = attachmentReducer.reduce(
				dhs,
				ActivityActions.unlock({ activityId: "1", lockId: "" }),
				defaultDh
			);

			strictEqual(actual, dhs);
		});
	});

	describe("reduceThumbnails", () => {
		it("returns old state when action is not uploadDone", () => {
			const thumbnails = { a1: "t1" };

			const actual = reduceThumbnails(
				thumbnails,
				ActivityActions.unlock({ activityId: "1", lockId: "1" })
			);

			strictEqual(actual, thumbnails);
		});

		it("returns old state when uploadDone action did not include any attachmentIds", () => {
			const thumbnails = { a1: "t1" };

			const actual = reduceThumbnails(
				thumbnails,
				uploadDone({
					activityId: "1",
					attachments: [
						{ content: "1", thumbnail: "url1" },
						{ content: "2", thumbnail: "url2" }
					],
					errors: []
				})
			);

			strictEqual(actual, thumbnails);
		});

		it("returns old state when uploadDone action did not include any thumbnails", () => {
			const thumbnails = { a1: "t1" };

			const actual = reduceThumbnails(
				thumbnails,
				uploadDone({
					activityId: "1",
					attachments: [{ attachment_id: "1" }, { attachment_id: "2" }],
					errors: []
				})
			);

			strictEqual(actual, thumbnails);
		});

		it("returns new thumbnails when uploadDone action includes new attachments with id and thumbnail", () => {
			const actual = reduceThumbnails(
				undefined,
				uploadDone({
					activityId: "1",
					attachments: [
						{ attachment_id: "a1", thumbnail: "t1" },
						{ attachment_id: "a2", thumbnail: "t2" }
					],
					errors: []
				})
			);

			deepStrictEqual(actual, { a1: "t1", a2: "t2" });
		});

		it("merges new thumbnails in existing state when uploadDone action includes new attachments with id and thumbnail", () => {
			const thumbnails = { a1: "t1" };

			const actual = reduceThumbnails(
				thumbnails,
				uploadDone({
					activityId: "1",
					attachments: [
						{ attachment_id: "a2", thumbnail: "t2" },
						{ attachment_id: "a3", thumbnail: "t3" }
					],
					errors: []
				})
			);

			deepStrictEqual(actual, { a1: "t1", a2: "t2", a3: "t3" });
		});
	});

	describe("reduceAttachmentState", () => {
		it("returns state as is for unrelated actions", () => {
			const attachmentState = { loading: ModelPath.fromString("/g1/f1") };

			const actual = reduceAttachmentState(
				attachmentState,
				ActivityActions.unlock({ activityId: "1", lockId: "1" })
			);

			strictEqual(actual, attachmentState);
		});

		it("sets loading when an upload action is given", () => {
			const attachmentState = {};

			const attachmentPath = DocumentPath.fromString("/root[1]/rep[2]/attachment[1]");

			const actual = reduceAttachmentState(
				attachmentState,
				FormEngineActions.event({
					activityId: "1",
					engineEvent: Events.Attachments.uploadAttachments({
						files: [{ file: {} as File, attachmentPath }],
						formModelElementPath: ModelPath.fromString(
							"/screen/detachedRepeat/details/cg/row/control"
						)
					})
				})
			);

			deepStrictEqual(actual?.loading, ModelPath.fromString(ModelPath.toString(attachmentPath)));
		});

		it("resets loading when an uploadDone is given", () => {
			const attachmentState = { loading: ModelPath.fromString("/g1/f1") };

			const actual = reduceAttachmentState(
				attachmentState,
				uploadDone({ activityId: "1", attachments: [], errors: [] })
			);

			strictEqual(actual?.loading, undefined);
		});

		it("resets loading when a cancel action is given", () => {
			const attachmentState = { loading: ModelPath.fromString("/g1/f1") };

			const actual = reduceAttachmentState(
				attachmentState,
				FormEngineActions.event({
					activityId: "1",
					engineEvent: Events.Attachments.cancelUploadAttachments()
				})
			);

			strictEqual(actual?.loading, undefined);
		});

		it("sets new attachment id as unassigned for a attachmentValueChange action with attachmentId", () => {
			const attachmentState = {};

			const actual = reduceAttachmentState(
				attachmentState,
				FormEngineActions.event({
					activityId: "1",
					engineEvent: Events.attachmentValueChange({ value: { attachment_id: "a1" }, path: [] })
				})
			);

			deepStrictEqual(actual?.unassigned, ["a1"]);
		});

		it("keeps unassigned as is for a attachmentValueChange action without attachmentId", () => {
			const attachmentState = { unassigned: ["a1"] };

			const actual = reduceAttachmentState(
				attachmentState,
				FormEngineActions.event({
					activityId: "1",
					engineEvent: Events.attachmentValueChange({ value: { content: "base64" }, path: [] })
				})
			);

			strictEqual(actual?.unassigned, attachmentState.unassigned);
		});

		it("sets new attachment ids as unassigned for a multiFileUpload action with attachmentIds", () => {
			const attachmentState = {};

			const actual = reduceAttachmentState(
				attachmentState,
				FormEngineActions.event({
					activityId: "1",
					engineEvent: Events.Repeat.multiFileUpload({
						path: [],
						toBeAdded: [{ attachment_id: "a1" }],
						toBeReplaced: [{ value: { attachment_id: "a2" }, path: [] }],
						attachmentModelPath: []
					})
				})
			);

			deepStrictEqual(actual?.unassigned, ["a1", "a2"]);
		});

		it("keeps unassigned as is for a multiFileUpload action without attachmentIds", () => {
			const attachmentState = { unassigned: ["a1", "a2"] };

			const actual = reduceAttachmentState(
				attachmentState,
				FormEngineActions.event({
					activityId: "1",
					engineEvent: Events.Repeat.multiFileUpload({
						path: [],
						toBeAdded: [{ content: "base641" }],
						toBeReplaced: [{ value: { content: "base642" }, path: [] }],
						attachmentModelPath: []
					})
				})
			);

			strictEqual(actual?.unassigned, attachmentState.unassigned);
		});

		it("resets unassigned for an resetUnassigned action", () => {
			const attachmentState = { unassigned: ["a1"] };

			const actual = reduceAttachmentState(attachmentState, resetUnassigned({ activityId: "1" }));

			strictEqual(actual?.unassigned, undefined);
		});
	});

	describe("reduceUiState", () => {
		it("sets disabled=true for upload actions", () => {
			const uiState = createUIState({ screenLocation: [], disabled: false });

			const actual = reduceUiState(
				withModels(
					FormEngineActions.event({
						activityId: "1",
						engineEvent: Events.Attachments.uploadAttachments({
							files: [],
							formModelElementPath: []
						})
					})
				),
				uiState
			);

			strictEqual(actual.disabled, true);
		});

		it("sets disabled=false for other actions", () => {
			const uiState = createUIState({ screenLocation: [], disabled: true });

			const actual = reduceUiState(
				withModels(uploadDone({ activityId: "1", attachments: [], errors: [] })),
				uiState
			);

			strictEqual(actual.disabled, false);
		});

		it("creates new ui state with disabled=true if none exists yet", () => {
			const uiState = undefined;

			const actual = reduceUiState(
				withModels(
					FormEngineActions.event({
						activityId: "1",
						engineEvent: Events.Attachments.uploadAttachments({
							files: [],
							formModelElementPath: []
						})
					})
				),
				uiState
			);

			strictEqual(actual.disabled, true);
		});

		describe("for uploadDone actions", () => {
			it("removes existing attachment errors from the message state", () => {
				const uiState = createUIState({
					screenLocation: [],
					messages: {
						"root[1]/field[1]": {
							validationMessages: [
								{ errorCode: "other" } as EngineStore.Validation.Message,
								{ errorCode: ATTACHMENT_ERROR_CODE } as EngineStore.Validation.Message
							]
						},
						"root[1]/field[2]": {
							validationMessages: [
								{ errorCode: ATTACHMENT_ERROR_CODE } as EngineStore.Validation.Message
							]
						}
					}
				});

				const actual = reduceUiState(
					withModels(uploadDone({ activityId: "1", attachments: [], errors: [] })),
					uiState
				);

				deepStrictEqual(actual.messages, {
					"root[1]/field[1]": {
						validationMessages: [{ errorCode: "other" } as EngineStore.Validation.Message]
					}
				});
			});

			it("for single file uploads, adds a specific error for the attachment group if needed", () => {
				const uiState = createUIState({
					screenLocation: []
				});

				const error = { key: "localizableKey" };
				const attachmentPath = DocumentPath.fromString("r[1]/attachment[1]");

				const actual = reduceUiState(
					withModels(
						uploadDone({
							activityId: "1",
							attachments: [],
							errors: [{ error, path: attachmentPath }]
						})
					),
					uiState
				);

				deepStrictEqual(actual.messages, {
					[DocumentPath.toString(attachmentPath)]: {
						validationMessages: [
							{
								errorKey: error.key,
								errorText: [error],
								errorCode: ATTACHMENT_ERROR_CODE,
								severity: "ERROR",
								element: attachmentPath,
								referencedFields: [attachmentPath]
							}
						]
					}
				});
			});

			it("for multi file uploads, adds a generic error for the repeat group if needed", () => {
				const uiState = createUIState({
					screenLocation: []
				});

				const pathToRepeatGroup = DocumentPath.fromString("r[1]/repeatGroup[0]");

				const error1 = { key: "localizableKey1" };
				const attachmentPath1 = DocumentPath.fromString("r[1]/repeatGroup[0]/attachment[1]");
				const error2 = { key: "localizableKey2" };
				const attachmentPath2 = DocumentPath.fromString("r[1]/repeatGroup[0]/attachment[2]");

				const actual = reduceUiState(
					withModels(
						uploadDone({
							activityId: "1",
							attachments: [],
							errors: [
								{ error: error1, path: attachmentPath1 },
								{ error: error2, path: attachmentPath2 }
							],
							pathToRepeatGroup
						})
					),
					uiState
				);

				deepStrictEqual(actual.messages, {
					[DocumentPath.toString(pathToRepeatGroup)]: {
						validationMessages: [
							{
								errorKey: error1.key,
								errorText: [error1, error2],
								errorCode: ATTACHMENT_ERROR_CODE,
								severity: "ERROR",
								element: pathToRepeatGroup,
								referencedFields: [attachmentPath1, attachmentPath2]
							}
						]
					}
				});
			});

			it("creates new ui state with messages if none exists yet", () => {
				const uiState = undefined;

				const error = { key: "localizableKey" };
				const attachmentPath = DocumentPath.fromString("r[1]/attachment[1]");

				const actual = reduceUiState(
					withModels(
						uploadDone({
							activityId: "1",
							attachments: [],
							errors: [{ error, path: attachmentPath }]
						})
					),
					uiState
				);

				deepStrictEqual(actual.messages, {
					[DocumentPath.toString(attachmentPath)]: {
						validationMessages: [
							{
								errorKey: error.key,
								errorText: [error],
								errorCode: ATTACHMENT_ERROR_CODE,
								severity: "ERROR",
								element: attachmentPath,
								referencedFields: [attachmentPath]
							}
						]
					}
				});
			});
		});

		it("keeps messages as it for other actions", () => {
			const uiState = createUIState({ screenLocation: [], disabled: false });

			const actual = reduceUiState(
				withModels(
					FormEngineActions.event({
						activityId: "1",
						engineEvent: Events.Attachments.uploadAttachments({
							files: [],
							formModelElementPath: []
						})
					})
				),
				uiState
			);

			strictEqual(actual.messages, uiState.messages);
		});
	});
});

function withModels<A extends ActivityActions.DataReducerAction>(action: A): A {
	return {
		...action,
		payload: {
			...action.payload,
			modelsInScene: [
				{
					loadingState: "loaded" as const,
					model: {
						header: {
							id: "FM",
							modelType: "form",
							modelVersion: "38.0.0",
							modelReferences: [{ modelType: "document", reference: "DM" }]
						},
						content: {
							screens: [{ name: "screen1" }]
						}
					},
					direct: true
				},
				{
					loadingState: "loaded" as const,
					model: {
						header: { id: "DM", modelType: "document", modelVersion: "28.4.0" },
						content: DocumentModelHelpers.DocumentModelContent(),
						generatedCodeAccessor: {}
					}
				}
			]
		}
	};
}

function dh(options: Partial<Activity.DataHolder> = {}): Activity.DataHolder {
	const { descriptor, data, slices } = options;

	return {
		descriptor: descriptor ?? { model: "test" },
		data: data ?? {},
		loadingState: "loaded",
		savingState: "not_saved",
		dirty: false,
		slices: slices ?? {}
	};
}
