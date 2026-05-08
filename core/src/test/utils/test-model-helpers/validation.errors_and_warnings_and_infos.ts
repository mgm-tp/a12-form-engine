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

import type { GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import { createDocumentPath } from "./dependent-enumeration.js";

export namespace FORM_MODEL {
	export const ID_NUMBER_TYPE = "a12-NumberType-F4";
	export const INPUT_NUMBER_OF_WARNINGS = "a12-Warnings-F47";
	export const INPUT_NUMBER_OF_ERRORS = "a12-Errors-F48";
	export const STRING_TYPE = "a12-StringType-F3";
	export const NUMBER_TYPE = "a12-NumberType-F4";
	export const BOOLEAN_TYPE = "a12-BooleanType-F5";
	export const DATE_TYPE = "a12-DateType-F6";
	export const DATE_TIME_TYPE = "a12-DateTimeType-F7";
	export const TIME_TYPE = "a12-TimeType-F8";
	export const ENUMERATION_TYPE = "a12-EnumerationType-F9";
	export const NUMBER_TYPE_EXPRESSION_ID = "a12-expressioncell-65a41-expression";
	export const INPUT_NUMBER_OF_WARNINGS_IR = "a12-fieldbasedrepeatoverviewcolumn-c3b37-cell";
	export const INPUT_NUMBER_OF_ERRORS_IR = "a12-fieldbasedrepeatoverviewcolumn-00a88-cell";
	export const STRING_TYPE_IR = "a12-fieldbasedrepeatoverviewcolumn-1635d-cell";

	export const DETACHED_REPEAT_ADD_BUTTON_ID = "a12-add-button-inlinerepeat-8795f";
	export const INLINE_REPEAT_ADD_BUTTON_ID = "a12-add-button-inlinerepeat-5255e";

	export const INPUT_DR_NUMBER_OF_WARNINGS = "a12-Warnings-F49";

	export const SHOW_ALL_ISSUES_TEXT = "Show All Issues";
	export const SHOW_DETAILS_TEXT = "Show details";
	export const HIDE_DETAILS_TEXT = "Hide details";
	export const BACK = "Back";
	export const NEXT = "Next";
	export const NEXT_ISSUE = "Next issue";
	export const PREVIOUS_ISSUE = "Previous issue";
	export const EXPAND_MESSAGE = "Expand Message";
	export const COLLAPSE_MESSAGE = "Collapse Message";
	export const GO_TO_ISSUE = "Go to Issue";
	export const PREVIOUS = "Previous";
	export const SHOW_ALL = "Show All";

	export const ID_VALIDATE_FULL = "a12-button-fc4dd";
	export const ID_VALIDATION_BAR = "a12-validation-bar";
	export const ID_VALIDATION_BAR_MODAL = "a12-validation-bar-modal";
	export const ID_VALIDATION_BAR_CONTENT = "a12-validation-bar-content";
	export const ID_CORRECTION_SCREEN_BAR = "a12-correction-screen-bar";

	export const EXIT_CORRECTION_MODE = "Exit correction mode";
	export const VALIDATE = "Validate";

	export const ID_FORM_MODEL = "computation-validation.errors_and_warnings_and_infos-form";
}

export namespace DOCUMENT {
	export const pathString = createDocumentPath(["group"], ["StringType"]);
	export const pathNumber = createDocumentPath(["group"], ["NumberType"]);
	export const pathBoolean = createDocumentPath(["group"], ["BooleanType"]);
	export const pathDate = createDocumentPath(["group"], ["DateType"]);
	export const pathDateTime = createDocumentPath(["group"], ["DateTimeType"]);
	export const pathTime = createDocumentPath(["group"], ["TimeType"]);
	export const pathEnumeration = createDocumentPath(["group"], ["EnumerationType"]);

	export const pathRepeatNumber = createDocumentPath(["repeat"], ["NumberType"]);
	export const pathRepeatString2 = createDocumentPath(["repeat"], ["StringType2"]);

	export const pathNestedRepeatString = createDocumentPath(
		["repeat"],
		["nested_repeat"],
		["StringType"]
	);
	export const pathNestedRepeatNumber = createDocumentPath(
		["repeat"],
		["nested_repeat"],
		["NumberType"]
	);
}

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
