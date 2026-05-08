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

import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import { DocumentHelpers } from "../document-helpers.js";
import { ModelHelpers } from "../model-helpers.js";
import { createValidationEntry } from "../validation.js";

export namespace FORM_MODEL {
	export namespace SCREENS {
		export const GENERAL = "Screen1";
		export const PAGING = "Screen2";
		export const INFINITE_SCROLLING = "Screen3";
		export const INITIAL_VALUES = "Screen4";
		export const ACCESSIBILITY = "Screen5";
	}

	export namespace IR {
		export const repeatFormModelPath = ModelHelpers.createModelPath(
			"Screen1",
			"Sec",
			"inline-repeat-AttachmentCollection"
		);
		export const repeatId = "a12-inlinerepeat-7fbe3-table";

		export const attachmentPreviewId = "a12-fieldbasedrepeatoverviewcolumn-f45bf-cell-0";

		export const repeatPagingFormModelPath = ModelHelpers.createModelPath(
			"Screen2",
			"SecPaging",
			"inline-repeat-AttachmentCollection"
		);
		export const repeatPagingId = "a12-inlinerepeat-a46bf-table";

		export const repeatInfiniteScrollingFormModelPath = ModelHelpers.createModelPath(
			"Screen3",
			"SecInfiniteScrolling",
			"inline-repeat-AttachmentCollection"
		);
		export const repeatInfiniteScrollingId = "a12-inlinerepeat-4f19f-table";

		export const repeatInitialValuesFormModelPath = ModelHelpers.createModelPath(
			"Screen4",
			"SecInitialValues",
			"inline-repeat-AttachmentCollection"
		);
		export const repeatInitialValuesId = "a12-inlinerepeat-5619e-table";

		export const repeatInitialValuesAndErrorFormModelPath = ModelHelpers.createModelPath(
			"Screen4",
			"SecInitialValuesAndError",
			"inline-repeat-AttachmentCollection"
		);
		export const repeatInitialValuesAndErrorId = "a12-inlinerepeat-7ccf6-table";

		export const nestedRepeatFormModelPath = ModelHelpers.createModelPath(
			"Screen1",
			"Sec",
			"detached-repeat-Repeatable",
			"detached-repeat-Repeatable-detail-screen",
			"inline-repeat-AttachmentCollection"
		);
		export const nestedRepeatId = "a12-inlinerepeat-738b7-table";

		export const repeatHiddenLabelsFormModelPath = ModelHelpers.createModelPath(
			"Screen5",
			"SecAccessibility",
			"inline-repeat-AttachmentCollection"
		);
		export const repeatHiddenLabelsId = "a12-inlinerepeat-1ade7-table";
	}

	export namespace ER {
		export const repeatFormModelPath = ModelHelpers.createModelPath(
			"Screen1",
			"Sec",
			"embedded-repeat-AttachmentCollection"
		);
		export const repeatId = "a12-embeddedrepeat-f31d6-table";

		export const repeatPagingFormModelPath = ModelHelpers.createModelPath(
			"Screen2",
			"SecPaging",
			"embedded-repeat-AttachmentCollection"
		);
		export const repeatPagingId = "a12-embeddedrepeat-9aed5-table";

		export const repeatInitialValuesFormModelPath = ModelHelpers.createModelPath(
			"Screen4",
			"SecInitialValues",
			"embedded-repeat-AttachmentCollection"
		);
		export const repeatInitialValuesId = "a12-embeddedrepeat-951be-table";

		export const repeatInitialValuesAndErrorFormModelPath = ModelHelpers.createModelPath(
			"Screen4",
			"SecInitialValuesAndError",
			"embedded-repeat-AttachmentCollection"
		);
		export const repeatInitialValuesAndErrorId = "a12-embeddedrepeat-01cf7-table";

		export const nestedRepeatFormModelPath = ModelHelpers.createModelPath(
			"Screen1",
			"Sec",
			"detached-repeat-Repeatable",
			"detached-repeat-Repeatable-detail-screen",
			"embedded-repeat-AttachmentCollection"
		);
		export const nestedRepeatId = "a12-embeddedrepeat-183b1-table";

		export const repeatHiddenLabelsFormModelPath = ModelHelpers.createModelPath(
			"Screen5",
			"SecAccessibility",
			"embedded-repeat-AttachmentCollection"
		);
		export const repeatHiddenLabelsId = "a12-embeddedrepeat-d740d-table";
	}

	export namespace DR {
		export const repeatFormModelPath = ModelHelpers.createModelPath(
			"Screen1",
			"Sec",
			"detached-repeat-Repeatable"
		);
		export const repeatId = "a12-detachedrepeat-12ced-table";
	}
}

export namespace DOCUMENT_MODEL {
	export const attachmentCollectionModelPath = ModelHelpers.createModelPath(
		"Root",
		"AttachmentCollection"
	);
	export const attachmentModelPath = ModelHelpers.createModelPath(
		"Root",
		"AttachmentCollection",
		"Attachment01"
	);

	export function getAttachmentCollectionDocPath(index: number): EntityInstancePath {
		return DocumentHelpers.createDocumentPath(["Root"], ["AttachmentCollection", index]);
	}

	export function getAttachmentDocPath(
		index: number,
		attachmentIndex?: number
	): EntityInstancePath {
		return DocumentHelpers.createDocumentPath(
			["Root"],
			["AttachmentCollection", index],
			["Attachment01", attachmentIndex]
		);
	}

	export const nestedAttachmentCollectionModelPath = ModelHelpers.createModelPath(
		"Root",
		"Repeatable",
		"AttachmentCollection"
	);
	export const nestedAttachmentModelPath = ModelHelpers.createModelPath(
		"Root",
		"Repeatable",
		"AttachmentCollection",
		"Attachment01"
	);

	export function getNestedAttachmentCollectionDocPath(index: number): EntityInstancePath {
		return DocumentHelpers.createDocumentPath(
			["Root"],
			["Repeatable"],
			["AttachmentCollection", index]
		);
	}

	export function getNestedAttachmentDocPath(index: number): EntityInstancePath {
		return DocumentHelpers.createDocumentPath(
			["Root"],
			["Repeatable"],
			["AttachmentCollection", index],
			["Attachment01"]
		);
	}

	export const attachmentCollectionInitialValuesModelPath = ModelHelpers.createModelPath(
		"Root",
		"AttachmentCollection_InitialValues"
	);
	export const attachmentInitialValuesModelPath = ModelHelpers.createModelPath(
		"Root",
		"AttachmentCollection_InitialValues",
		"Attachment01"
	);

	export function getAttachmentCollectionInitialValuesDocPath(index: number): EntityInstancePath {
		return DocumentHelpers.createDocumentPath(
			["Root"],
			["AttachmentCollection_InitialValues", index]
		);
	}

	export function getAttachmentInitialValuesDocPath(index: number): EntityInstancePath {
		return DocumentHelpers.createDocumentPath(
			["Root"],
			["AttachmentCollection_InitialValues", index],
			["Attachment01"]
		);
	}

	export const attachmentCollectionInitialValuesAndErrorModelPath = ModelHelpers.createModelPath(
		"Root",
		"AttachmentCollection_InitialValuesAndError"
	);
	export const attachmentInitialValuesAndErrorModelPath = ModelHelpers.createModelPath(
		"Root",
		"AttachmentCollection_InitialValuesAndError",
		"Attachment01"
	);

	export function getAttachmentCollectionInitialValuesAndErrorDocPath(
		index: number
	): EntityInstancePath {
		return DocumentHelpers.createDocumentPath(
			["Root"],
			["AttachmentCollection_InitialValuesAndError", index]
		);
	}

	export function getAttachmentInitialValuesAndErrorDocPath(index: number): EntityInstancePath {
		return DocumentHelpers.createDocumentPath(
			["Root"],
			["AttachmentCollection_InitialValuesAndError", index],
			["Attachment01"]
		);
	}

	export const validationEntry = createValidationEntry({
		path: DocumentHelpers.createDocumentPath(
			["Root"],
			["AttachmentCollection_InitialValuesAndError"],
			["ComputedField"]
		),
		errorText: [
			{
				key: "documentModel.ruleErrorMessage.repeat\\pmulti-file-upload-document.Root.AttachmentCollection_InitialValuesAndError.Validation",
				args: {},
				defaults: {
					de: "Nur Werte unter 100 sind erlaubt",
					en: "Only values below 100 are allowed"
				}
			}
		],
		errorCode: "Error rule_38106",
		errorKey: "/Root/AttachmentCollection_InitialValuesAndError/Validation"
	});
}
