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

import type { EngineStore, Models } from "../../../back-end/store/index.js";

import { DocumentHelpers } from "../document-helpers.js";
import { ModelHelpers } from "../model-helpers.js";
import { SetupHelpers } from "../setup.js";

const { createModelPath } = ModelHelpers;
const { createDocumentPath } = DocumentHelpers;
const { createTestStore } = SetupHelpers;
export namespace DEP_ELEMENT {
	export const pathToMasterEnumerationField = createDocumentPath(
		["Wrapper"],
		["MasterGroup"],
		["MasterEnumerationField"]
	);
	export const pathToMasterEnumerationGroup = createDocumentPath(
		["Wrapper"],
		["MasterGroup"],
		["MasterEnumerationGroup"]
	);

	export const pathToMasterBooleanField = createDocumentPath(
		["Wrapper"],
		["MasterGroup"],
		["MasterBooleanField"]
	);
	export const pathToMasterBooleanGroup = createDocumentPath(
		["Wrapper"],
		["MasterGroup"],
		["MasterBooleanGroup"]
	);
	export const pathToMasterConfirmField = createDocumentPath(
		["Wrapper"],
		["MasterGroup"],
		["MasterConfirmField"]
	);
	export const pathToMasterConfirmGroup = createDocumentPath(
		["Wrapper"],
		["MasterGroup"],
		["MasterConfirmGroup"]
	);

	export const pathToDepRepeatMasterField = createDocumentPath(
		["Wrapper"],
		["DependentRepContainer"],
		["DependentRepeatableGroup"],
		["DepRepeatMasterField"]
	);
	export const pathToRepeatGroupMasterField = createDocumentPath(
		["Wrapper"],
		["DependentRepContainer"],
		["RepeatGroupMasterField"]
	);

	export function getPathToDependentRepeatableGroup(rowIndex?: number) {
		return createDocumentPath(
			["Wrapper"],
			["DependentRepContainer"],
			["DependentRepeatableGroup", rowIndex]
		);
	}
	export const DEPENDENT_REPEAT_FIELD_MASTER_OUTSIDE = "DepRepeatFieldMasterOutside";

	export const SET_VALUE_FIELD = "DependentValue";
	export const SET_FIELD_VALUE_FIELD = "DependentFieldValue";
	export const READONLY_FIELD = "DependentReadonly";

	export const DEPENDENT_GROUP = createDocumentPath(["Wrapper"], ["DependentGroup"]);
	export const DEPENDENT_GROUP_WITHOUT_INITIAL_VALUES = createDocumentPath(
		["Wrapper"],
		["DependentGroupWithoutInitialValues"]
	);

	export namespace ENUMERATION {
		export const screenName = "Dependent Field Screen";
		export const ID_DEP_READONLY = "a12-DependentReadonly-F92";
		export const ID_DEP_HIDDEN = "";
		export const ID_DEP_FIELD_ONE = "a12-DependentGroupFieldOne-F101";

		export const dr_locationPath = createModelPath(
			"Dependent Field Screen",
			"repeats",
			"dr1",
			"Details"
		);
		export const er_locationPath = createModelPath("Dependent Field Screen", "repeats", "er1");

		export const ID_DR_DEP_FIELD_MASTER_OUTSIDE = "a12-DepRepeatFieldMasterOutside-F112";
		export const ID_DR_DEP_FIELD = "a12-DepRepeatField-F105";

		export const ID_NOT_RELEVANT_FIELD = "a12-DependentNotRelevant-F93";

		export const ID_ER_DEP_FIELD_MASTER_OUTSIDE = "a12-DepRepeatFieldMasterOutside-F112-2";
		export const ID_ER_DEP_FIELD = "a12-DepRepeatField-F105-2";

		export const ID_IR_DEP_FIELD_MASTER_OUTSIDE = "a12-fieldOverviewColumn-2-cell-0";
		export const ID_IR_DEP_FIELD = "a12-fieldbasedrepeatoverviewcolumn-9769b-cell-0";

		export const ID_ER = "embeddedrepeat-bdcea";

		export const DEPENDENT_FIELD_GROUP = createDocumentPath(["Wrapper"], ["DependentFields"]);
	}

	export namespace BOOLEAN {
		export const screenName = "Dependent Boolean";
		export const ID_DEP_READONLY_TRUE = "a12-DependentReadonly-F135";
		export const ID_DEP_READONLY_FALSE = "a12-DependentReadonly-fieldimpl_a5ab8";
		export const ID_RO_STRING_FIELD_TRUE = "a12-stringField1-F164";
		export const ID_RO_STRING_FIELD_FALSE = "a12-stringField1-fieldimpl_13711";
		export const ID_NOT_RELEVANT_TRUE = "a12-DependentNotRelevant-F136";
		export const ID_NOT_RELEVANT_FALSE = "a12-DependentNotRelevant-fieldimpl_0b994";

		export const ID_NOT_RELEVANT_STRING_FIELD_TRUE = "a12-stringField1-F155";
		export const ID_NOT_RELEVANT_STRING_FIELD_FALSE = "a12-stringField1-fieldimpl_6a3b7";

		export const DEPENDENT_FIELD_GROUP_TRUE = createDocumentPath(
			["Wrapper"],
			["DependentFieldsForBooleanTrue"]
		);
		export const DEPENDENT_FIELD_GROUP_FALSE = createDocumentPath(
			["Wrapper"],
			["DependentFieldsForBooleanFalse"]
		);
	}

	export namespace CONFIRM {
		export const screenName = "Dependent Confirm";
		export const ID_DEP_READONLY = "a12-DependentReadonly-F128";
		export const ID_RO_STRING_FIELD = "a12-stringField1-F174";
		export const ID_NOT_RELEVANT = "a12-DependentNotRelevant-F129";
		export const ID_NOT_RELEVANT_STRING_FIELD = "a12-stringField1-F168";
	}

	export function setupStore({
		models,
		data = {},
		ui = {}
	}: {
		models: Models;
		data?: Partial<EngineStore.DataState>;
		ui?: Partial<EngineStore.UIState>;
	}) {
		return createTestStore({ storeConfig: { models, data, ui } });
	}

	export function createDocument(): GroupInstance {
		const document = {
			Wrapper: {
				DependentFields: {
					DependentReadonly: "FieldValue",
					DependentClear: 101
				},
				DependentFieldsForBooleanTrue: {
					DependentReadonly: "FieldValue",
					DependentFieldsInRepeatableGroup: [1, 2, 3].map(e => ({
						FieldValueInsideRepeat: "FieldValueInsideRepeat"
					}))
				},
				DependentFieldsForBooleanFalse: {
					DependentReadonly: "FieldValue",
					DependentFieldsInRepeatableGroup: [1, 2, 3].map(e => ({
						FieldValueInsideRepeat: "FieldValueInsideRepeat"
					}))
				},
				DependentRepContainer: {
					DependentRepeatableGroup: [1, 2, 3].map(e => ({
						FieldValueInsideRepeat: "FieldValueInsideRepeat",
						DepRepeatField: "somewhere over the ocean"
					}))
				}
			}
		};

		return document;
	}
}
