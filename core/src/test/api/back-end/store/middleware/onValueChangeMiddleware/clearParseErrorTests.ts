// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { strictEqual } from "node:assert/strict";

import type { GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { EngineStore, Models } from "../../../../../../back-end/store/index.js";
import { DataSelectors, Events, UiStateSelectors } from "../../../../../../back-end/store/index.js";
import { DocumentUtils } from "../../../../../../models/internal/utils/document-utils.js";
import { DocumentHelpers } from "../../../../../utils/document-helpers.js";
import { DEP_ELEMENT } from "../../../../../utils/test-model-helpers/dependent-element.js";
import {
	createValidationEntry,
	createValidationEntryWithParsingError
} from "../../../../../utils/validation.js";

const { createDocumentPath } = DocumentHelpers;

export function executeClearParseErrorTests(models: Models) {
	const MASTER_FIELD_PATH = createDocumentPath(["ClearParseMessages"], ["master"]);
	const DEPENDENT_GROUP_STRING_PATH = createDocumentPath(
		["ClearParseMessages"],
		["DependentGroup"],
		["StringFieldWithPattern"]
	);
	const DEPENDENT_GROUP_NUMBER_PATH = createDocumentPath(
		["ClearParseMessages"],
		["DependentGroup"],
		["NumberField"]
	);
	const DEPENDENT_GROUP_DATE_PATH = createDocumentPath(
		["ClearParseMessages"],
		["DependentGroup"],
		["DateField"]
	);
	const DEPENDENT_FIELD_NOT_RELEVANT_PATH = createDocumentPath(
		["ClearParseMessages"],
		["DependentFieldGroup"],
		["DateTimeField"]
	);
	const DEPENDENT_FIELD_SET_VALUE_PATH = createDocumentPath(
		["ClearParseMessages"],
		["DependentFieldGroup"],
		["NumberField"]
	);
	const COMPUTED_NUMBER_2_PATH = createDocumentPath(["ClearParseMessages"], ["numberCalc2"]);

	const GROUP_NOT_RELEVANT = "masterNonRelevantGroup";
	const SET_DEPENDENT_FIELDS = "masterSetFields";

	const screenLocation: EngineStore.ScreenState[] = [
		{
			locationPath: [
				{
					elementName: "ClearParseMessages"
				}
			],
			path: []
		}
	];

	it("clears parsing errors, when the master triggers non-relevant on a dependent group", () => {
		const ui = {
			screenLocation,
			messages: {
				...createValidationEntry({ path: DEPENDENT_GROUP_STRING_PATH }),
				...createValidationEntryWithParsingError(
					DEPENDENT_GROUP_NUMBER_PATH,
					"abc",
					"numberContainsIllegalSymbols"
				),
				...createValidationEntryWithParsingError(
					DEPENDENT_GROUP_DATE_PATH,
					"abc",
					"numberContainsIllegalSymbols"
				)
			}
		};
		const store = DEP_ELEMENT.setupStore({ models, ui });

		const messagesBefore = UiStateSelectors.messages()(store.getState());
		strictEqual(Object.keys(messagesBefore).length, 3);

		store.dispatch(
			Events.valueChange({
				path: MASTER_FIELD_PATH,
				value: GROUP_NOT_RELEVANT,
				formModelElementPath: []
			})
		);

		const messagesAfter = UiStateSelectors.messages()(store.getState());
		strictEqual(Object.keys(messagesAfter).length, 0);
	});

	it("clears parsing errors, when the master triggers non-relevant on a dependent field", () => {
		const ui = {
			screenLocation,
			messages: {
				...createValidationEntryWithParsingError(
					DEPENDENT_FIELD_NOT_RELEVANT_PATH,
					"abc",
					"numberContainsIllegalSymbols"
				)
			}
		};
		const store = DEP_ELEMENT.setupStore({ models, ui });

		const messagesBefore = UiStateSelectors.messages()(store.getState());
		strictEqual(Object.keys(messagesBefore).length, 1);

		store.dispatch(
			Events.valueChange({
				path: MASTER_FIELD_PATH,
				value: GROUP_NOT_RELEVANT,
				formModelElementPath: []
			})
		);

		const messagesAfter = UiStateSelectors.messages()(store.getState());
		strictEqual(Object.keys(messagesAfter).length, 0);
	});

	it("clears parsing errors, when the master triggers setting a valid value on a dependent field", () => {
		const ui = {
			screenLocation,
			messages: {
				...createValidationEntryWithParsingError(
					DEPENDENT_FIELD_SET_VALUE_PATH,
					"abc",
					"numberContainsIllegalSymbols"
				)
			}
		};
		const store = DEP_ELEMENT.setupStore({ models, ui });

		const messagesBefore = UiStateSelectors.messages()(store.getState());
		strictEqual(Object.keys(messagesBefore).length, 1);

		store.dispatch(
			Events.valueChange({
				path: MASTER_FIELD_PATH,
				value: SET_DEPENDENT_FIELDS,
				formModelElementPath: []
			})
		);

		const messagesAfter = UiStateSelectors.messages()(store.getState());
		strictEqual(Object.keys(messagesAfter).length, 0);
	});

	it("updates a computed field after an operand with a parsing error was set to a valid value", () => {
		const data = {
			document: {
				ClearParseMessages: {
					DependentFieldGroup: { NumberField: null },
					numberCalc2: 1
				}
			}
		};
		const ui = {
			screenLocation,
			messages: {
				...createValidationEntryWithParsingError(
					DEPENDENT_FIELD_SET_VALUE_PATH,
					"abc",
					"numberContainsIllegalSymbols"
				)
			}
		};
		const store = DEP_ELEMENT.setupStore({ models, data, ui });

		const documentBefore = DataSelectors.document()(store.getState());
		const valueBefore = DocumentUtils.getValue({
			document: documentBefore as GroupInstance,
			path: COMPUTED_NUMBER_2_PATH
		});

		strictEqual(valueBefore, 1);

		store.dispatch(
			Events.valueChange({
				path: MASTER_FIELD_PATH,
				value: SET_DEPENDENT_FIELDS,
				formModelElementPath: []
			})
		);

		const documentAfter = DataSelectors.document()(store.getState());
		const valueAfter = DocumentUtils.getValue({
			document: documentAfter as GroupInstance,
			path: COMPUTED_NUMBER_2_PATH
		});

		strictEqual(valueAfter, 42);
	});
}
