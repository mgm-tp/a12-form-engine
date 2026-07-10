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

export const FORM_MODEL = {
	ID_NUMBER_TYPE: "a12-NumberType-F4",
	INPUT_NUMBER_OF_WARNINGS: "a12-Warnings-F47",
	INPUT_NUMBER_OF_ERRORS: "a12-Errors-F48",
	STRING_TYPE: "a12-StringType-F3",
	NUMBER_TYPE: "a12-NumberType-F4",
	BOOLEAN_TYPE: "a12-BooleanType-F5",
	DATE_TYPE: "a12-DateType-F6",
	DATE_TIME_TYPE: "a12-DateTimeType-F7",
	TIME_TYPE: "a12-TimeType-F8",
	ENUMERATION_TYPE: "a12-EnumerationType-F9",
	NUMBER_TYPE_EXPRESSION_ID: "a12-expressioncell-65a41-expression",
	INPUT_NUMBER_OF_WARNINGS_IR: "a12-fieldbasedrepeatoverviewcolumn-c3b37-cell",
	INPUT_NUMBER_OF_ERRORS_IR: "a12-fieldbasedrepeatoverviewcolumn-00a88-cell",
	STRING_TYPE_IR: "a12-fieldbasedrepeatoverviewcolumn-1635d-cell",
	DETACHED_REPEAT_ADD_BUTTON_ID: "a12-add-button-inlinerepeat-8795f",
	INLINE_REPEAT_ADD_BUTTON_ID: "a12-add-button-inlinerepeat-5255e",
	INPUT_DR_NUMBER_OF_WARNINGS: "a12-Warnings-F49",
	SHOW_ALL_ISSUES_TEXT: "Show All Issues",
	SHOW_DETAILS_TEXT: "Show details",
	HIDE_DETAILS_TEXT: "Hide details",
	BACK: "Back",
	NEXT: "Next",
	NEXT_ISSUE: "Next issue",
	PREVIOUS_ISSUE: "Previous issue",
	EXPAND_MESSAGE: "Expand Message",
	COLLAPSE_MESSAGE: "Collapse Message",
	GO_TO_ISSUE: "Go to Issue",
	PREVIOUS: "Previous",
	SHOW_ALL: "Show All",
	ID_VALIDATE_FULL: "a12-button-fc4dd",
	ID_VALIDATION_BAR: "a12-validation-bar",
	ID_VALIDATION_BAR_MODAL: "a12-validation-bar-modal",
	ID_VALIDATION_BAR_CONTENT: "a12-validation-bar-content",
	ID_CORRECTION_SCREEN_BAR: "a12-correction-screen-bar",
	EXIT_CORRECTION_MODE: "Exit correction mode",
	VALIDATE: "Validate",
	ID_FORM_MODEL: "computation-validation.errors_and_warnings_and_infos-form"
} as const;

export const DOCUMENT = {
	pathString: createDocumentPath(["group"], ["StringType"]),
	pathNumber: createDocumentPath(["group"], ["NumberType"]),
	pathBoolean: createDocumentPath(["group"], ["BooleanType"]),
	pathDate: createDocumentPath(["group"], ["DateType"]),
	pathDateTime: createDocumentPath(["group"], ["DateTimeType"]),
	pathTime: createDocumentPath(["group"], ["TimeType"]),
	pathEnumeration: createDocumentPath(["group"], ["EnumerationType"]),
	pathRepeatNumber: createDocumentPath(["repeat"], ["NumberType"]),
	pathRepeatString2: createDocumentPath(["repeat"], ["StringType2"]),
	pathNestedRepeatString: createDocumentPath(["repeat"], ["nested_repeat"], ["StringType"]),
	pathNestedRepeatNumber: createDocumentPath(["repeat"], ["nested_repeat"], ["NumberType"])
} as const;

export function createDocument(
	numberOfInfos: number,
	numberOfWarnings: number,
	numberOfErrors: number
): GroupInstance {
	return {
		group: {
			Infos: numberOfInfos,
			Warnings: numberOfWarnings,
			Errors: numberOfErrors,
			StringType: "Test"
		},
		repeat: [
			{
				Infos: numberOfInfos,
				Warnings: numberOfWarnings,
				Errors: numberOfErrors,
				StringType: "Test",
				nested_repeat: [
					{
						Infos: numberOfInfos,
						Warnings: numberOfWarnings,
						Errors: numberOfErrors,
						StringType: "Test"
					}
				]
			}
		]
	};
}
