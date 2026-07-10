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

import type { GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import { createDocumentPath } from "../createDocumentPath.js";

const FIELD_VALUE_GROUP_PATH = createDocumentPath(["base"], ["fieldValueChange"]);
const MULTISELECT_GROUP_PATH = createDocumentPath(["base"], ["multiSelectValueChange"]);
const MULTISELECT_PATH = [...MULTISELECT_GROUP_PATH, ...createDocumentPath(["multiSelect"])];
const ATTACHMENT_GROUP_PATH = createDocumentPath(["base"], ["attachmentValueChange"]);
const ATTACHMENT_PATH = [...ATTACHMENT_GROUP_PATH, ...createDocumentPath(["attachment"])];
const MULTI_FILE_UPLOAD_GROUP_PATH = createDocumentPath(["base"], ["multiFileUpload"]);
const ATTACHMENT_COLLECTION_PATH = [
	...MULTI_FILE_UPLOAD_GROUP_PATH,
	...createDocumentPath(["attachmentCollection"])
];
const MULTI_FILE_UPLOAD_WITH_ERROR_GROUP_PATH = createDocumentPath(
	["base"],
	["multiFileUploadAttachmentError"]
);
const ATTACHMENT_COLLECTION_WITH_ERROR_PATH = [
	...MULTI_FILE_UPLOAD_WITH_ERROR_GROUP_PATH,
	...createDocumentPath(["attachmentCollection"])
];
const MULTI_FILE_UPLOAD_WITH_INITIAL_VALUE_GROUP_PATH = createDocumentPath(
	["base"],
	["multiFileUploadWithInitialValue"]
);
const ATTACHMENT_COLLECTION_WITH_INITIAL_VALUE_PATH = [
	...MULTI_FILE_UPLOAD_WITH_INITIAL_VALUE_GROUP_PATH,
	...createDocumentPath(["attachmentCollection"])
];

export const DOCUMENT_MODEL = {
	FIELD_VALUE_GROUP_PATH,
	MASTER_PATH: [...FIELD_VALUE_GROUP_PATH, ...createDocumentPath(["master"])],
	SLAVE_PATH: [...FIELD_VALUE_GROUP_PATH, ...createDocumentPath(["slave"])],
	NUM_FIELD_PATH: [...FIELD_VALUE_GROUP_PATH, ...createDocumentPath(["numField"])],
	BOOL_FIELD_PATH: [...FIELD_VALUE_GROUP_PATH, ...createDocumentPath(["bool"])],
	NOT_RELEVANT_STRING_FIELD_PATH: [
		...FIELD_VALUE_GROUP_PATH,
		...createDocumentPath(["notRelevantString"])
	],
	DEP_GROUP_STRING_FIELD_PATH: [
		...FIELD_VALUE_GROUP_PATH,
		...createDocumentPath(["depGroup"], ["stringField"])
	],
	MULTISELECT_GROUP_PATH,
	MULTISELECT_PATH,
	MULTISELECT_VALUE_PATH: [...MULTISELECT_PATH, ...createDocumentPath(["value"])],
	COMPUTED_FIELD_MULTISELECT_PATH: [
		...MULTISELECT_GROUP_PATH,
		...createDocumentPath(["computedFieldMultiSelect"])
	],
	ERROR_FIELD_MULTISELECT_PATH: [
		...MULTISELECT_GROUP_PATH,
		...createDocumentPath(["errorFieldMultiSelect"])
	],
	ATTACHMENT_GROUP_PATH,
	ATTACHMENT_PATH,
	ATTACHMENT_ID_PATH: [...ATTACHMENT_PATH, ...createDocumentPath(["attachment_id"])],
	COMPUTED_FIELD_ATTACHMENT_PATH: [
		...ATTACHMENT_GROUP_PATH,
		...createDocumentPath(["computedFieldAttachment"])
	],
	ERROR_FIELD_ATTACHMENT_PATH: [
		...ATTACHMENT_GROUP_PATH,
		...createDocumentPath(["errorFieldAttachment"])
	],
	MULTI_FILE_UPLOAD_GROUP_PATH,
	ATTACHMENT_COLLECTION_PATH,
	ATTACHMENT_COLLECTION_WITH_ERROR_PATH,
	ATTACHMENT_IN_COLLECTION_PATH: [
		...ATTACHMENT_COLLECTION_PATH,
		...createDocumentPath(["attachment"])
	],
	ATTACHMENT_WITH_ERROR_IN_COLLECTION_PATH: [
		...ATTACHMENT_COLLECTION_WITH_ERROR_PATH,
		...createDocumentPath(["attachment"])
	],
	ERROR_FIELD_ATTACHMENT_MULTI_FILE_UPLOAD_PATH: [
		...ATTACHMENT_COLLECTION_WITH_ERROR_PATH,
		...createDocumentPath(["attachment"]),
		...createDocumentPath(["size"])
	],
	ATTACHMENT_COLLECTION_WITH_INITIAL_VALUE_PATH,
	ATTACHMENT_WITH_INITIAL_VALUE_IN_COLLECTION_PATH: [
		...ATTACHMENT_COLLECTION_WITH_INITIAL_VALUE_PATH,
		...createDocumentPath(["attachment"])
	],
	NOTE_FIELD_IN_INITIAL_VALUE_COLLECTION_PATH: [
		...ATTACHMENT_COLLECTION_WITH_INITIAL_VALUE_PATH,
		...createDocumentPath(["noteField"])
	],
	ATTACHMENT_SIZE_IN_INITIAL_VALUE_COLLECTION_PATH: [
		...ATTACHMENT_COLLECTION_WITH_INITIAL_VALUE_PATH,
		...createDocumentPath(["attachment"]),
		...createDocumentPath(["size"])
	],
	COMPUTED_FIELD_MULTI_FILE_UPLOAD_PATH: [
		...MULTI_FILE_UPLOAD_GROUP_PATH,
		...createDocumentPath(["computedFieldMultiFileUpload"])
	],
	ERROR_FIELD_MULTI_FILE_UPLOAD_PATH: [
		...MULTI_FILE_UPLOAD_GROUP_PATH,
		...createDocumentPath(["errorFieldMultiFileUpload"])
	],
	getDocument(options: {
		fieldValueChange?: GroupInstance;
		multiSelectValueChange?: GroupInstance;
		attachmentValueChange?: GroupInstance;
		multiFileUpload?: GroupInstance;
		multiFileUploadAttachmentError?: GroupInstance;
		multiFileUploadWithInitialValue?: GroupInstance;
	}) {
		const {
			fieldValueChange,
			multiSelectValueChange,
			attachmentValueChange,
			multiFileUpload,
			multiFileUploadAttachmentError,
			multiFileUploadWithInitialValue
		} = options;

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
				},
				...(multiFileUploadAttachmentError
					? { multiFileUploadAttachmentError: multiFileUploadAttachmentError }
					: {}),
				...(multiFileUploadWithInitialValue
					? { multiFileUploadWithInitialValue: multiFileUploadWithInitialValue }
					: {})
			}
		};
	}
};
