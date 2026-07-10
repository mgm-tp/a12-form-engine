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

import { DocumentPath } from "../../../models/index.js";

import { createDocumentPath } from "../createDocumentPath.js";
import { createModelPath } from "../createModelPath.js";
import { createValidationMessage } from "../validation.js";

export const IDS = {
	L0_STRING: "a12-L0_String-field_30aa3",
	IR_BODY_ROW: "a12-inlinerepeat-97f35-bodyrow",
	IR_L1_STRING: "a12-fieldbasedrepeatoverviewcolumn-0d9da-cell",
	IR_L1_DATE: "a12-fieldbasedrepeatoverviewcolumn-0bb9f-cell",
	IR_L1_DATE_TIME: "a12-fieldbasedrepeatoverviewcolumn-710df-cell",
	IR_L1_TIME: "a12-fieldbasedrepeatoverviewcolumn-37a66-cell",
	IR_L1_ENUMERATION: "a12-fieldbasedrepeatoverviewcolumn-42842-cell",
	IR_SORTING_COLUMN: "fieldbasedrepeatoverviewcolumn-44a07",
	ER_L1_STRING: "a12-L1_String-field_ea294-2",
	ER_L1_DATE: "a12-L1_Date-field_43f56-2",
	ER_L1_ENUMERATION: "a12-L1_Enumeration-fieldimpl_6110d-2",
	ER_BODY_ROW: "a12-embeddedrepeat-6bd83-bodyrow",
	ER_REMOVE_BUTTON: "a12-remove-button-embeddedrepeat-6bd83",
	ER_SORTING_COLUMN: "fieldbasedrepeatoverviewcolumn-efe75",
	DR_BODY_ROW: "a12-detachedrepeat-d162f-bodyrow",
	DR_REMOVE_BUTTON: "a12-remove-button-detachedrepeat-d162f",
	DR_SORTING_COLUMN: "fieldbasedrepeatoverviewcolumn-87f01"
} as const;

const screenName = "Screen1";

export const FORM_MODEL = {
	screenName,
	inlineRepeatModelPath: createModelPath(screenName, "inline-repeat"),
	detachedRepeatModelPath: createModelPath(screenName, "detached-repeat"),
	embeddedRepeatModelPath: createModelPath(screenName, "embedded-repeat")
} as const;

export const DOCUMENT_MODEL = {
	rootGroup: "root",
	repeatGroup: "repGroup1",
	indexField: "indexField",
	numberField1: "numberField1"
} as const;

export function createDocumentForRepeatValidation(
	values?: { numberField1?: number; indexField?: string }[]
): GroupInstance {
	return {
		root: {
			repGroup1: values
				? values.map(v => ({ numberField1: v.numberField1, indexField: v.indexField }))
				: []
		}
	};
}

export const message = (index: number) => {
	const errorField = createDocumentPath(
		[DOCUMENT_MODEL.rootGroup],
		[DOCUMENT_MODEL.repeatGroup, index],
		["numberField1"]
	);
	return {
		[DocumentPath.toString(errorField)]: {
			validationMessages: [
				createValidationMessage({
					path: errorField,
					errorCode: "Error rule_7d1c4",
					errorKey: "/root/NewRule_1",
					errorText: [
						{
							key: "documentModel.ruleErrorMessage.repeat\\pvalidation-document.root.NewRule_1",
							defaults: {
								de: "numberField1 oder numberField2 sollten gefüllt sein",
								en: "numberField1 or numberField2 should be filled"
							},
							args: {}
						}
					],
					referencedFields: [
						createDocumentPath(
							[DOCUMENT_MODEL.rootGroup],
							[DOCUMENT_MODEL.repeatGroup, index],
							["numberField1"]
						),
						createDocumentPath(
							[DOCUMENT_MODEL.rootGroup],
							[DOCUMENT_MODEL.repeatGroup, index],
							["numberField2"]
						)
					]
				})
			]
		}
	};
};
