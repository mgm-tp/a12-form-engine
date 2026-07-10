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

import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import { createDocumentPath } from "../createDocumentPath.js";
import { createModelPath } from "../createModelPath.js";
import { createValidationEntry } from "../validation.js";

export const FORM_MODEL = {
	SCREENS: {
		GENERAL: "Screen1",
		PAGING: "Screen2",
		INFINITE_SCROLLING: "Screen3",
		INITIAL_VALUES: "Screen4",
		ACCESSIBILITY: "Screen5"
	},
	IR: {
		repeatFormModelPath: createModelPath("Screen1", "Sec", "inline-repeat-AttachmentCollection"),
		repeatId: "a12-inlinerepeat-7fbe3-table",
		attachmentPreviewId: "a12-fieldbasedrepeatoverviewcolumn-f45bf-cell-0",
		repeatPagingFormModelPath: createModelPath(
			"Screen2",
			"SecPaging",
			"inline-repeat-AttachmentCollection"
		),
		repeatPagingId: "a12-inlinerepeat-a46bf-table",
		repeatInfiniteScrollingFormModelPath: createModelPath(
			"Screen3",
			"SecInfiniteScrolling",
			"inline-repeat-AttachmentCollection"
		),
		repeatInfiniteScrollingId: "a12-inlinerepeat-4f19f-table",
		repeatInitialValuesFormModelPath: createModelPath(
			"Screen4",
			"SecInitialValues",
			"inline-repeat-AttachmentCollection"
		),
		repeatInitialValuesId: "a12-inlinerepeat-5619e-table",
		repeatInitialValuesAndErrorFormModelPath: createModelPath(
			"Screen4",
			"SecInitialValuesAndError",
			"inline-repeat-AttachmentCollection"
		),
		repeatInitialValuesAndErrorId: "a12-inlinerepeat-7ccf6-table",
		nestedRepeatFormModelPath: createModelPath(
			"Screen1",
			"Sec",
			"detached-repeat-Repeatable",
			"detached-repeat-Repeatable-detail-screen",
			"inline-repeat-AttachmentCollection"
		),
		nestedRepeatId: "a12-inlinerepeat-738b7-table",
		repeatHiddenLabelsFormModelPath: createModelPath(
			"Screen5",
			"SecAccessibility",
			"inline-repeat-AttachmentCollection"
		),
		repeatHiddenLabelsId: "a12-inlinerepeat-1ade7-table"
	},
	ER: {
		repeatFormModelPath: createModelPath("Screen1", "Sec", "embedded-repeat-AttachmentCollection"),
		repeatId: "a12-embeddedrepeat-f31d6-table",
		repeatPagingFormModelPath: createModelPath(
			"Screen2",
			"SecPaging",
			"embedded-repeat-AttachmentCollection"
		),
		repeatPagingId: "a12-embeddedrepeat-9aed5-table",
		repeatInitialValuesFormModelPath: createModelPath(
			"Screen4",
			"SecInitialValues",
			"embedded-repeat-AttachmentCollection"
		),
		repeatInitialValuesId: "a12-embeddedrepeat-951be-table",
		repeatInitialValuesAndErrorFormModelPath: createModelPath(
			"Screen4",
			"SecInitialValuesAndError",
			"embedded-repeat-AttachmentCollection"
		),
		repeatInitialValuesAndErrorId: "a12-embeddedrepeat-01cf7-table",
		nestedRepeatFormModelPath: createModelPath(
			"Screen1",
			"Sec",
			"detached-repeat-Repeatable",
			"detached-repeat-Repeatable-detail-screen",
			"embedded-repeat-AttachmentCollection"
		),
		nestedRepeatId: "a12-embeddedrepeat-183b1-table",
		repeatHiddenLabelsFormModelPath: createModelPath(
			"Screen5",
			"SecAccessibility",
			"embedded-repeat-AttachmentCollection"
		),
		repeatHiddenLabelsId: "a12-embeddedrepeat-d740d-table"
	},
	DR: {
		repeatFormModelPath: createModelPath("Screen1", "Sec", "detached-repeat-Repeatable"),
		repeatId: "a12-detachedrepeat-12ced-table"
	}
} as const;

export const DOCUMENT_MODEL = {
	attachmentCollectionModelPath: createModelPath("Root", "AttachmentCollection"),
	attachmentModelPath: createModelPath("Root", "AttachmentCollection", "Attachment01"),
	nestedAttachmentCollectionModelPath: createModelPath(
		"Root",
		"Repeatable",
		"AttachmentCollection"
	),
	nestedAttachmentModelPath: createModelPath(
		"Root",
		"Repeatable",
		"AttachmentCollection",
		"Attachment01"
	),
	getAttachmentCollectionDocPath(index: number): EntityInstancePath {
		return createDocumentPath(["Root"], ["AttachmentCollection", index]);
	},
	getAttachmentDocPath(index: number, attachmentIndex?: number): EntityInstancePath {
		return createDocumentPath(
			["Root"],
			["AttachmentCollection", index],
			["Attachment01", attachmentIndex]
		);
	},
	getNestedAttachmentCollectionDocPath(index: number): EntityInstancePath {
		return createDocumentPath(["Root"], ["Repeatable"], ["AttachmentCollection", index]);
	},
	getNestedAttachmentDocPath(index: number): EntityInstancePath {
		return createDocumentPath(
			["Root"],
			["Repeatable"],
			["AttachmentCollection", index],
			["Attachment01"]
		);
	},
	attachmentCollectionInitialValuesModelPath: createModelPath(
		"Root",
		"AttachmentCollection_InitialValues"
	),
	attachmentInitialValuesModelPath: createModelPath(
		"Root",
		"AttachmentCollection_InitialValues",
		"Attachment01"
	),
	getAttachmentCollectionInitialValuesDocPath(index: number): EntityInstancePath {
		return createDocumentPath(["Root"], ["AttachmentCollection_InitialValues", index]);
	},

	getAttachmentInitialValuesDocPath(index: number): EntityInstancePath {
		return createDocumentPath(
			["Root"],
			["AttachmentCollection_InitialValues", index],
			["Attachment01"]
		);
	},
	attachmentCollectionInitialValuesAndErrorModelPath: createModelPath(
		"Root",
		"AttachmentCollection_InitialValuesAndError"
	),
	attachmentInitialValuesAndErrorModelPath: createModelPath(
		"Root",
		"AttachmentCollection_InitialValuesAndError",
		"Attachment01"
	),
	getAttachmentCollectionInitialValuesAndErrorDocPath(index: number): EntityInstancePath {
		return createDocumentPath(["Root"], ["AttachmentCollection_InitialValuesAndError", index]);
	},

	getAttachmentInitialValuesAndErrorDocPath(index: number): EntityInstancePath {
		return createDocumentPath(
			["Root"],
			["AttachmentCollection_InitialValuesAndError", index],
			["Attachment01"]
		);
	},
	validationEntry: createValidationEntry({
		path: createDocumentPath(
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
	})
} as const;
