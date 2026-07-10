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

import type { EngineStore } from "../../../back-end/store/internal/store.js";

import { createDocumentPath } from "../createDocumentPath.js";
import { createModelPath } from "../createModelPath.js";

export const HIDDEN = {
	IR_ID: "a12-inlinerepeat-4bccb",
	DR_ID: "a12-detachedrepeat-cd08e",
	ER_ID: "a12-embeddedrepeat-0db90",
	NESTED_ER_ID: "a12-embeddedrepeat-a9f5d",
	STRINGFIELD2_ID: "a12-StringField2-field_68171",
	DR_DATEFIELD_ID: "a12-fieldbasedrepeatoverviewcolumn-05240-bodycell-0",
	ER_DATEFIELD_ID: "a12-fieldbasedrepeatoverviewcolumn-56c09-bodycell-0",
	ER_EXPRESSION_CELL_ID: "a12-expressionrepeatoverviewcolumn-b8d65-bodycell-0",
	NESTED_ER_EXPRESSION_CELL_ID: "a12-expressionrepeatoverviewcolumn-6d282-bodycell-0",
	DATEFIELD_DEFAULT_VALUE: "01/06/2020",
	STRINGFIELD3_DEFAULT_VALUE: "abc"
} as const;

export function createNestedDrUiState(): Partial<EngineStore.UIState> {
	return {
		screenLocation: [
			{
				locationPath: createModelPath("Screen1"),
				path: []
			},
			{
				locationPath: createModelPath(
					"Screen1",
					"detached-repeat-rep",
					"detached-repeat-rep-detail-screen"
				),
				path: createDocumentPath(["base"], ["rep"])
			}
		]
	};
}

export function createDocumentThatHidesEverything(): GroupInstance {
	return {
		base: {
			BooleanField: false
		}
	};
}

export function createDocumentThatShowsEverything(): GroupInstance {
	return {
		base: {
			BooleanField: true
		}
	};
}

export function createDocumentWithAllValuesFilled(): GroupInstance {
	return {
		base: {
			BooleanField: true,
			StringField: "123",
			rep: [
				{
					EnumField: "c",
					DateField: new Date("2020-01-06T00:00:00.000Z"),
					NumberField: 123,
					nested_rep: [
						{
							StringField3: "abc"
						}
					]
				}
			]
		}
	};
}

export function createDocumentWithSomeFieldsHidden(): GroupInstance {
	return {
		base: {
			BooleanField: true,
			StringField: "abc",
			StringField2: "def",
			rep: [
				{
					EnumField: "a",
					DateField: new Date("2020-01-06T00:00:00.000Z"),
					NumberField: 123,
					nested_rep: [
						{
							StringField3: "abc"
						}
					]
				}
			]
		}
	};
}
