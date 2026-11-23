// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import { DocumentHelpers } from "../document-helpers.js";

export namespace DOCUMENT_MODEL {
	// Field Value Change
	const FIELD_VALUE_GROUP_PATH = DocumentHelpers.createDocumentPath(["base"], ["fieldValueChange"]);
	export const MASTER_PATH = [
		...FIELD_VALUE_GROUP_PATH,
		...DocumentHelpers.createDocumentPath(["master"])
	];
	export const SLAVE_PATH = [
		...FIELD_VALUE_GROUP_PATH,
		...DocumentHelpers.createDocumentPath(["slave"])
	];
	export const NUM_FIELD_PATH = [
		...FIELD_VALUE_GROUP_PATH,
		...DocumentHelpers.createDocumentPath(["numField"])
	];
	export const BOOL_FIELD_PATH = [
		...FIELD_VALUE_GROUP_PATH,
		...DocumentHelpers.createDocumentPath(["bool"])
	];
	export const NOT_RELEVANT_STRING_FIELD_PATH = [
		...FIELD_VALUE_GROUP_PATH,
		...DocumentHelpers.createDocumentPath(["notRelevantString"])
	];
	export const DEP_GROUP_STRING_FIELD_PATH = [
		...FIELD_VALUE_GROUP_PATH,
		...DocumentHelpers.createDocumentPath(["depGroup"], ["stringField"])
	];

	// Multi-Select Value Change
	const MULTISELECT_GROUP_PATH = DocumentHelpers.createDocumentPath(
		["base"],
		["multiSelectValueChange"]
	);
	export const MULTISELECT_PATH = [
		...MULTISELECT_GROUP_PATH,
		...DocumentHelpers.createDocumentPath(["multiSelect"])
	];
	export const MULTISELECT_VALUE_PATH = [
		...MULTISELECT_PATH,
		...DocumentHelpers.createDocumentPath(["value"])
	];
	export const COMPUTED_FIELD_MULTISELECT_PATH = [
		...MULTISELECT_GROUP_PATH,
		...DocumentHelpers.createDocumentPath(["computedFieldMultiSelect"])
	];
	export const ERROR_FIELD_MULTISELECT_PATH = [
		...MULTISELECT_GROUP_PATH,
		...DocumentHelpers.createDocumentPath(["errorFieldMultiSelect"])
	];

	// Attachment Value Change
	const ATTACHMENT_GROUP_PATH = DocumentHelpers.createDocumentPath(
		["base"],
		["attachmentValueChange"]
	);
	export const ATTACHMENT_PATH = [
		...ATTACHMENT_GROUP_PATH,
		...DocumentHelpers.createDocumentPath(["attachment"])
	];
	export const ATTACHMENT_ID_PATH = [
		...ATTACHMENT_PATH,
		...DocumentHelpers.createDocumentPath(["attachment_id"])
	];
	export const COMPUTED_FIELD_ATTACHMENT_PATH = [
		...ATTACHMENT_GROUP_PATH,
		...DocumentHelpers.createDocumentPath(["computedFieldAttachment"])
	];
	export const ERROR_FIELD_ATTACHMENT_PATH = [
		...ATTACHMENT_GROUP_PATH,
		...DocumentHelpers.createDocumentPath(["errorFieldAttachment"])
	];

	// Multi File Upload
	const MULTI_FILE_UPLOAD_GROUP_PATH = DocumentHelpers.createDocumentPath(
		["base"],
		["multiFileUpload"]
	);
	export const ATTACHMENT_COLLECTION_PATH = [
		...MULTI_FILE_UPLOAD_GROUP_PATH,
		...DocumentHelpers.createDocumentPath(["attachmentCollection"])
	];
	export const ATTACHMENT_IN_COLLECTION_PATH = [
		...ATTACHMENT_COLLECTION_PATH,
		...DocumentHelpers.createDocumentPath(["attachment"])
	];
	export const COMPUTED_FIELD_MULTI_FILE_UPLOAD_PATH = [
		...MULTI_FILE_UPLOAD_GROUP_PATH,
		...DocumentHelpers.createDocumentPath(["computedFieldMultiFileUpload"])
	];
	export const ERROR_FIELD_MULTI_FILE_UPLOAD_PATH = [
		...MULTI_FILE_UPLOAD_GROUP_PATH,
		...DocumentHelpers.createDocumentPath(["errorFieldMultiFileUpload"])
	];

	export function getDocument(options: {
		fieldValueChange?: GroupInstance;
		multiSelectValueChange?: GroupInstance;
		attachmentValueChange?: GroupInstance;
		multiFileUpload?: GroupInstance;
	}) {
		const { fieldValueChange, multiSelectValueChange, attachmentValueChange, multiFileUpload } =
			options;

		return {
			base: {
				...(fieldValueChange ? { fieldValueChange } : {}),
				multiSelectValueChange: multiSelectValueChange ?? {
					computedFieldMultiSelect: "empty"
				},
				attachmentValueChange: attachmentValueChange ?? {
					computedFieldAttachment: "empty"
				},
				multiFileUpload: multiFileUpload ?? {
					computedFieldMultiFileUpload: "empty"
				}
			}
		};
	}
}
