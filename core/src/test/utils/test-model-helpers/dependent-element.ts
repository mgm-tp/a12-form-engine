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

import type { EngineStore, Models } from "../../../back-end/store/internal/store.js";

import { createDocumentPath } from "../createDocumentPath.js";
import { createModelPath } from "../createModelPath.js";
import { createTestStore } from "../setup.js";

export const DEP_ELEMENT = {
	pathToMasterEnumerationField: createDocumentPath(
		["Wrapper"],
		["MasterGroup"],
		["MasterEnumerationField"]
	),
	pathToMasterEnumerationGroup: createDocumentPath(
		["Wrapper"],
		["MasterGroup"],
		["MasterEnumerationGroup"]
	),
	pathToMasterBooleanField: createDocumentPath(
		["Wrapper"],
		["MasterGroup"],
		["MasterBooleanField"]
	),
	pathToMasterBooleanGroup: createDocumentPath(
		["Wrapper"],
		["MasterGroup"],
		["MasterBooleanGroup"]
	),
	pathToMasterConfirmField: createDocumentPath(
		["Wrapper"],
		["MasterGroup"],
		["MasterConfirmField"]
	),
	pathToMasterConfirmGroup: createDocumentPath(
		["Wrapper"],
		["MasterGroup"],
		["MasterConfirmGroup"]
	),
	pathToDepRepeatMasterField: createDocumentPath(
		["Wrapper"],
		["DependentRepContainer"],
		["DependentRepeatableGroup"],
		["DepRepeatMasterField"]
	),
	pathToRepeatGroupMasterField: createDocumentPath(
		["Wrapper"],
		["DependentRepContainer"],
		["RepeatGroupMasterField"]
	),
	getPathToDependentRepeatableGroup(rowIndex?: number) {
		return createDocumentPath(
			["Wrapper"],
			["DependentRepContainer"],
			["DependentRepeatableGroup", rowIndex]
		);
	},
	DEPENDENT_REPEAT_FIELD_MASTER_OUTSIDE: "DepRepeatFieldMasterOutside",
	SET_VALUE_FIELD: "DependentValue",
	SET_FIELD_VALUE_FIELD: "DependentFieldValue",
	READONLY_FIELD: "DependentReadonly",
	DEPENDENT_GROUP: createDocumentPath(["Wrapper"], ["DependentGroup"]),
	DEPENDENT_GROUP_WITHOUT_INITIAL_VALUES: createDocumentPath(
		["Wrapper"],
		["DependentGroupWithoutInitialValues"]
	),
	ENUMERATION: {
		screenName: "Dependent Field Screen",
		ID_DEP_READONLY: "a12-DependentReadonly-F92",
		ID_DEP_HIDDEN: "",
		ID_DEP_FIELD_ONE: "a12-DependentGroupFieldOne-F101",
		dr_locationPath: createModelPath("Dependent Field Screen", "repeats", "dr1", "Details"),
		er_locationPath: createModelPath("Dependent Field Screen", "repeats", "er1"),
		ID_DR_DEP_FIELD_MASTER_OUTSIDE: "a12-DepRepeatFieldMasterOutside-F112",
		ID_DR_DEP_FIELD: "a12-DepRepeatField-F105",
		ID_NOT_RELEVANT_FIELD: "a12-DependentNotRelevant-F93",
		ID_ER_DEP_FIELD_MASTER_OUTSIDE: "a12-DepRepeatFieldMasterOutside-F112-2",
		ID_ER_DEP_FIELD: "a12-DepRepeatField-F105-2",
		ID_IR_DEP_FIELD_MASTER_OUTSIDE: "a12-fieldOverviewColumn-2-cell-0",
		ID_IR_DEP_FIELD: "a12-fieldbasedrepeatoverviewcolumn-9769b-cell-0",
		ID_ER: "embeddedrepeat-bdcea",
		DEPENDENT_FIELD_GROUP: createDocumentPath(["Wrapper"], ["DependentFields"])
	},
	BOOLEAN: {
		screenName: "Dependent Boolean",
		ID_DEP_READONLY_TRUE: "a12-DependentReadonly-F135",
		ID_DEP_READONLY_FALSE: "a12-DependentReadonly-fieldimpl_a5ab8",
		ID_RO_STRING_FIELD_TRUE: "a12-stringField1-F164",
		ID_RO_STRING_FIELD_FALSE: "a12-stringField1-fieldimpl_13711",
		ID_NOT_RELEVANT_TRUE: "a12-DependentNotRelevant-F136",
		ID_NOT_RELEVANT_FALSE: "a12-DependentNotRelevant-fieldimpl_0b994",
		ID_NOT_RELEVANT_STRING_FIELD_TRUE: "a12-stringField1-F155",
		ID_NOT_RELEVANT_STRING_FIELD_FALSE: "a12-stringField1-fieldimpl_6a3b7",
		DEPENDENT_FIELD_GROUP_TRUE: createDocumentPath(["Wrapper"], ["DependentFieldsForBooleanTrue"]),
		DEPENDENT_FIELD_GROUP_FALSE: createDocumentPath(["Wrapper"], ["DependentFieldsForBooleanFalse"])
	},
	CONFIRM: {
		screenName: "Dependent Confirm",
		ID_DEP_READONLY: "a12-DependentReadonly-F128",
		ID_RO_STRING_FIELD: "a12-stringField1-F174",
		ID_NOT_RELEVANT: "a12-DependentNotRelevant-F129",
		ID_NOT_RELEVANT_STRING_FIELD: "a12-stringField1-F168"
	},
	setupStore({
		models,
		data = {},
		ui = {}
	}: {
		models: Models;
		data?: Partial<EngineStore.DataState>;
		ui?: Partial<EngineStore.UIState>;
	}) {
		return createTestStore({ storeConfig: { models, data, ui } });
	},

	createDocument(): GroupInstance {
		const document = {
			Wrapper: {
				DependentFields: {
					DependentReadonly: "FieldValue",
					DependentClear: 101
				},
				DependentFieldsForBooleanTrue: {
					DependentReadonly: "FieldValue",
					DependentFieldsInRepeatableGroup: Array(3).fill({
						FieldValueInsideRepeat: "FieldValueInsideRepeat"
					})
				},
				DependentFieldsForBooleanFalse: {
					DependentReadonly: "FieldValue",
					DependentFieldsInRepeatableGroup: Array(3).fill({
						FieldValueInsideRepeat: "FieldValueInsideRepeat"
					})
				},
				DependentRepContainer: {
					DependentRepeatableGroup: Array(3).fill({
						FieldValueInsideRepeat: "FieldValueInsideRepeat",
						DepRepeatField: "somewhere over the ocean"
					})
				}
			}
		};

		return document;
	}
} as const;
