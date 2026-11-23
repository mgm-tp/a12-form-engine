// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { EngineStore } from "../../../back-end/store/internal/store.js";

import { createDocumentPath, createModelPath } from "./dependent-enumeration.js";

export namespace HIDDEN {
	export const IR_ID = "a12-inlinerepeat-4bccb";
	export const DR_ID = "a12-detachedrepeat-cd08e";
	export const ER_ID = "a12-embeddedrepeat-0db90";
	export const NESTED_ER_ID = "a12-embeddedrepeat-a9f5d";
	export const STRINGFIELD2_ID = "a12-StringField2-field_68171";
	export const DR_DATEFIELD_ID = "a12-fieldbasedrepeatoverviewcolumn-05240-bodycell-0";
	export const ER_DATEFIELD_ID = "a12-fieldbasedrepeatoverviewcolumn-56c09-bodycell-0";
	export const ER_EXPRESSION_CELL_ID = "a12-expressionrepeatoverviewcolumn-b8d65-bodycell-0";
	export const NESTED_ER_EXPRESSION_CELL_ID = "a12-expressionrepeatoverviewcolumn-6d282-bodycell-0";

	export const DATEFIELD_DEFAULT_VALUE = "01/06/2020";
	export const STRINGFIELD3_DEFAULT_VALUE = "abc";
}

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
