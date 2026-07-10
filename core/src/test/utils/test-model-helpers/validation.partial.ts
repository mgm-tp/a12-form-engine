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

import type { EntityInstancePath, GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import { createDocumentPath } from "../createDocumentPath.js";
import { createModelPath } from "../createModelPath.js";

export const ROOT_GROUP = "validation";
const VISIBLE_FIELDS_GROUP = "visibleFields";
const MASTER_BOOLEAN = "masterBoolean";
const MASTER_ENUM = "masterEnum";
const MASTER_ENUM2 = "masterEnum2";
const DEPENDENT_GROUP_MASTER = "dependentGroupMaster";
export const REQUIRED_STRING = "requiredString";
const NUMBER_FIELD = "numberField";
const NUMBER_FIELD2 = "numberField2";
export const REPEATABLE_GROUP_1 = "repeatableGroup1";
const REPEATABLE_GROUP_2 = "repeatableGroup2";
const REPEATABLE_GROUP_3 = "repeatableGroup3";
const NESTED_REPEATABLE_GROUP = "nestedRepeatableGroup";
const NESTED_NON_REPEATABLE_GROUP = "nestedNonRepeatableGroup";
const STRING_FIELD = "stringField";
const ERROR_MESSAGES_GROUP = "errorMessages";
const VALUE_REFERENCED_GROUP = "valueReferencedInMessage";
const DATE_RANGE_FIELD = "DateRangeField1";
const LOCAL_MASTER_FIELD = "localMaster";
const LOCAL_DEPENDENT_HIDDEN_FIELD = "localDependentHidden";
const INDEXED_CONTROLS_GROUP = "indexedControls";
const INDEXED_CONTROLS_REPEATABLE_GROUP_1 = "repeatableGroup1";
const INDEXED_CONTROLS_REPEATABLE_GROUP_2 = "repeatableGroup2";
const INDEX_FIELD = "indexField";

export const DOCUMENT_MODEL = {
	pathToMasterBooleanField: createDocumentPath(
		[ROOT_GROUP],
		[VISIBLE_FIELDS_GROUP],
		[MASTER_BOOLEAN]
	),
	pathToRequiredString: createDocumentPath([ROOT_GROUP], [VISIBLE_FIELDS_GROUP], [REQUIRED_STRING]),
	pathToMasterEnumField: createDocumentPath([ROOT_GROUP], [VISIBLE_FIELDS_GROUP], [MASTER_ENUM]),
	pathToMasterEnum2Field: createDocumentPath([ROOT_GROUP], [VISIBLE_FIELDS_GROUP], [MASTER_ENUM2]),
	pathToDependentGroupMaster: createDocumentPath(
		[ROOT_GROUP],
		[VISIBLE_FIELDS_GROUP],
		[DEPENDENT_GROUP_MASTER]
	),
	pathToNumberField: createDocumentPath([ROOT_GROUP], [VISIBLE_FIELDS_GROUP], [NUMBER_FIELD]),
	pathToNumberField2: createDocumentPath([ROOT_GROUP], [VISIBLE_FIELDS_GROUP], [NUMBER_FIELD2]),
	pathToDateRangeField: createDocumentPath(
		[ROOT_GROUP],
		[ERROR_MESSAGES_GROUP],
		[VALUE_REFERENCED_GROUP],
		[DATE_RANGE_FIELD]
	),
	pathToIndexedNumberField1: createDocumentPath(
		[ROOT_GROUP],
		[INDEXED_CONTROLS_GROUP],
		[INDEXED_CONTROLS_REPEATABLE_GROUP_1],
		[NUMBER_FIELD]
	),
	pathToIndexField1: createDocumentPath(
		[ROOT_GROUP],
		[INDEXED_CONTROLS_GROUP],
		[INDEXED_CONTROLS_REPEATABLE_GROUP_1],
		[INDEX_FIELD]
	),
	pathToIndexedNumberField2: createDocumentPath(
		[ROOT_GROUP],
		[INDEXED_CONTROLS_GROUP],
		[INDEXED_CONTROLS_REPEATABLE_GROUP_2],
		[NUMBER_FIELD]
	),
	pathToIndexField2: createDocumentPath(
		[ROOT_GROUP],
		[INDEXED_CONTROLS_GROUP],
		[INDEXED_CONTROLS_REPEATABLE_GROUP_2],
		[INDEX_FIELD]
	),

	pathToGroup1RepeatableStringField(index: number): EntityInstancePath {
		return createDocumentPath([ROOT_GROUP], [REPEATABLE_GROUP_1, index], [REQUIRED_STRING]);
	},

	pathToGroup2RepeatInstance(index: number): EntityInstancePath {
		return createDocumentPath([ROOT_GROUP], [REPEATABLE_GROUP_2, index]);
	},

	pathToGroup2RepeatableStringField(index: number): EntityInstancePath {
		return [
			...DOCUMENT_MODEL.pathToGroup2RepeatInstance(index),
			...createDocumentPath([STRING_FIELD])
		];
	},

	pathToGroup2RepeatableLocalMasterField(index: number): EntityInstancePath {
		return createDocumentPath([ROOT_GROUP], [REPEATABLE_GROUP_2, index], [LOCAL_MASTER_FIELD]);
	},

	pathToGroup2RepeatableDependentHiddenField(index: number): EntityInstancePath {
		return createDocumentPath(
			[ROOT_GROUP],
			[REPEATABLE_GROUP_2, index],
			[LOCAL_DEPENDENT_HIDDEN_FIELD]
		);
	},

	pathToGroup3RepeatableStringField(index: number): EntityInstancePath {
		return createDocumentPath([ROOT_GROUP], [REPEATABLE_GROUP_3, index], [REQUIRED_STRING]);
	},

	pathToGroup3RepeatInvisibleField(index: number): EntityInstancePath {
		return createDocumentPath(
			[ROOT_GROUP],
			[REPEATABLE_GROUP_3, index],
			["requireFieldOnlyShownInErTable"]
		);
	},

	pathToNestedRepeatableGroupStringField(index: number): EntityInstancePath {
		return createDocumentPath(
			[ROOT_GROUP],
			[REPEATABLE_GROUP_2],
			[NESTED_REPEATABLE_GROUP, index],
			[REQUIRED_STRING]
		);
	},

	pathToNestedNonRepeatableGroupStringField(index: number): EntityInstancePath {
		return createDocumentPath(
			[ROOT_GROUP],
			[REPEATABLE_GROUP_2, index],
			[NESTED_NON_REPEATABLE_GROUP],
			[STRING_FIELD]
		);
	},

	visiblePreFilledInlineRepeatWithHiddenColumns(): GroupInstance {
		// shows inline and detached repeats in mcs
		// hides columns
		return DOCUMENT_MODEL.visiblePreFilledRepeat({
			masterEnum: "showMCS",
			masterEnum2: "hideColumn",
			localMaster: "hideField"
		});
	},

	visiblePreFilledInlineRepeatWithVisibleColumn(): GroupInstance {
		// shows inline and detached repeats in mcs
		return DOCUMENT_MODEL.visiblePreFilledRepeat({ masterEnum: "showMCS" });
	},

	visiblePreFilledEmbeddedRepeatWithHiddenColumns(): GroupInstance {
		// shows embedded repeat
		// hides columns
		return DOCUMENT_MODEL.visiblePreFilledRepeat({
			masterEnum: "showSecERGroup2",
			masterEnum2: "hideColumn",
			localMaster: "hideField"
		});
	},

	visiblePreFilledEmbeddedRepeatWithVisibleColumn(): GroupInstance {
		// shows embedded repeat
		return DOCUMENT_MODEL.visiblePreFilledRepeat({ masterEnum: "showSecERGroup2" });
	},

	visiblePreFilledRepeat(options: {
		masterEnum: string;
		masterEnum2?: string;
		localMaster?: string;
	}): GroupInstance {
		const { masterEnum, masterEnum2, localMaster } = options;
		return {
			validation: {
				visibleFields: {
					masterEnum,
					masterEnum2,
					numberField2: 123
				},
				repeatableGroup2: [
					// inline repeat is bound to this group
					{
						stringField: "abc",
						localMaster
					},
					{
						stringField: "def"
					}
				]
			}
		};
	},

	dependentGroupNoHiddenColumnsInlineRepeat(): GroupInstance {
		return DOCUMENT_MODEL.dependentGroup({ masterEnum: "showSecIRGroup1" });
	},

	dependentGroupNoHiddenColumnsEmbeddedRepeat(): GroupInstance {
		return DOCUMENT_MODEL.dependentGroup({ masterEnum: "showSecERGroup1" });
	},

	dependentGroupHiddenColumnsInlineRepeat(): GroupInstance {
		return DOCUMENT_MODEL.dependentGroup({
			masterEnum: "showSecIRGroup1",
			dependentGroupMaster: true
		});
	},

	dependentGroupHiddenColumnsEmbeddedRepeat(): GroupInstance {
		return DOCUMENT_MODEL.dependentGroup({
			masterEnum: "showSecERGroup1",
			dependentGroupMaster: true
		});
	},

	dependentGroup(options: { masterEnum: string; dependentGroupMaster?: boolean }): GroupInstance {
		const { masterEnum, dependentGroupMaster } = options;
		return {
			validation: {
				visibleFields: {
					masterEnum,
					dependentGroupMaster
				},
				repeatableGroup1: [
					{
						requiredString: "abc"
					},
					{
						requiredString: "def"
					}
				]
			}
		};
	},

	dependentGroupHiddenColumnsInSomeRowsInlineRepeat(): GroupInstance {
		return DOCUMENT_MODEL.dependentGroupHiddenColumnsInSomeRows("showMCS");
	},

	dependentGroupHiddenColumnsInSomeRowsEmbeddedRepeat(): GroupInstance {
		return DOCUMENT_MODEL.dependentGroupHiddenColumnsInSomeRows("showSecERGroup2");
	},

	dependentGroupHiddenColumnsInSomeRows(masterEnum: string): GroupInstance {
		return {
			validation: {
				visibleFields: {
					masterEnum
				},
				repeatableGroup2: [
					// inline repeat is bound to this group
					{
						stringField: "abc",
						localMaster: "hideGroup"
					},
					{
						stringField: "def"
					}
				]
			}
		};
	},

	hiddenSection(): GroupInstance {
		return {
			validation: {
				visibleFields: {},
				repeatableGroup1: [
					{
						requiredString: "abc"
					},
					{
						requiredString: "def"
					}
				]
			}
		};
	},

	visibleSection(): GroupInstance {
		return {
			validation: {
				visibleFields: {
					masterEnum: "showSecIRGroup1"
				},
				repeatableGroup1: [
					{
						requiredString: "abc"
					},
					{
						requiredString: "def"
					}
				]
			}
		};
	},

	hiddenMCS(): GroupInstance {
		return {
			validation: {
				visibleFields: {},
				repeatableGroup2: [
					{
						stringField: "abc"
					},
					{
						stringField: "def"
					}
				]
			}
		};
	},

	hiddenCG(): GroupInstance {
		return {
			validation: {
				visibleFields: {
					numberField: 123
				}
			}
		};
	},

	visibleCG(): GroupInstance {
		return {
			validation: {
				visibleFields: {
					masterEnum: "showCG"
				}
			}
		};
	},

	collapsedByDefault(): GroupInstance {
		return {
			validation: {
				visibleFields: {
					masterEnum: "showSecIRGroup1"
				},
				repeatableGroup1: [
					{
						requiredString: "abc"
					},
					{
						requiredString: "def"
					}
				]
			}
		};
	},

	embeddedRepeat(): GroupInstance {
		return {
			validation: {
				repeatableGroup3: [
					{
						requiredString: "abc"
					},
					{
						requiredString: "def"
					}
				]
			}
		};
	},

	indexedControlsDocument(showRepeats?: boolean): GroupInstance {
		return {
			[ROOT_GROUP]: {
				[INDEXED_CONTROLS_GROUP]: {
					showRepeats,
					[INDEXED_CONTROLS_REPEATABLE_GROUP_1]: [{ numberField: 1, indexField: "Index 1" }],
					[INDEXED_CONTROLS_REPEATABLE_GROUP_2]: [{ numberField: 2, indexField: "Index 1" }]
				}
			}
		};
	},

	documentRepeat(options: { detachedRepeat?: boolean; embeddedRepeat?: boolean }): GroupInstance {
		return {
			validation: {
				repeatableGroup1: [{ requiredString: "ir1" }, { requiredString: "ir2" }],
				...(options.detachedRepeat
					? {
							repeatableGroup2: [
								{
									nestedRepeatableGroup: [{ requiredString: "dr1" }, { requiredString: "dr2" }],
									stringField: "s1"
								}
							]
						}
					: {}),
				...(options.embeddedRepeat
					? {
							repeatableGroup3: [{ requiredString: "s1" }, { requiredString: "s2" }]
						}
					: {})
			}
		};
	}
} as const;

const irInMCS = createModelPath("Screen1", "mcs-1", "inline-repeat-repeatableGroup2");
const erCgGroup2 = createModelPath(
	"Screen1",
	"sec-ER-group2",
	"embedded-repeat-repeatableGroup2",
	"cg"
);

export const VISIBLE_FIELDS = {
	secIRGroup1ModelPath: [{ elementName: "Screen1" }, { elementName: "sec-IR-group1" }],
	sec2ModelPath: [{ elementName: "Screen1" }, { elementName: "sec-2" }],
	requiredStringControl: createModelPath("Screen1", "cg1", "row-40455", "control-46ba2"),
	irInMCS,
	requiredStringInIRInMCS: [...irInMCS, ...createModelPath("fieldbasedrepeatoverviewcolumn-3368f")],
	localDependentHiddenInIRInMCS: [
		...irInMCS,
		...createModelPath("fieldbasedrepeatoverviewcolumn-21c56")
	],
	nestedNonRepeatableStringInIRInMCS: [
		...irInMCS,
		...createModelPath("fieldbasedrepeatoverviewcolumn-4533f")
	],
	erCgGroup2: createModelPath("Screen1", "sec-ER-group2", "embedded-repeat-repeatableGroup2", "cg"),
	requiredStringInERGroup2: [...erCgGroup2, ...createModelPath("row_bf244", "control_95ff0")],
	localDependentHiddenInERGroup2: [...erCgGroup2, ...createModelPath("row_36444", "control_fa7ea")],
	nestedNonRepeatableStringInERGroup2: [
		...erCgGroup2,
		...createModelPath("row_89708", "control_ffaf7")
	],
	requiredStringInIRGroup1: createModelPath(
		"Screen1",
		"sec-IR-group1",
		"inline-repeat-repeatableGroup1",
		"fieldbasedrepeatoverviewcolumn-6ebbd"
	),
	requiredStringInERGroup1: createModelPath(
		"Screen1",
		"sec-ER-group1",
		"embedded-repeat-repeatableGroup1",
		"cg",
		"row_e8c3a",
		"control_bbf07"
	),
	numberField: createModelPath("Screen1", "cg-2", "row-e2392", "control-d93b6"),
	numberField2: createModelPath("Screen1", "sec-2", "cg-5", "row-ff049", "control-e833b"),
	masterEnumField: createModelPath("Screen1", "sec-1", "cg-4", "row-ebeb8", "control-89b40"),
	requiredStringInDRDetailScreen: createModelPath(
		"Screen2",
		"inline-repeat-repeatableGroup",
		"inline-repeat-repeatableGroup-detail-screen",
		"cg",
		"row-4ba00",
		"control-73f5f"
	),
	requiredStringInNestedRepeat: createModelPath(
		"Screen2",
		"inline-repeat-repeatableGroup",
		"inline-repeat-repeatableGroup-detail-screen",
		"inline-repeat-nestedRepeatableGroup",
		"fieldbasedrepeatoverviewcolumn-6a119"
	),
	requiredStringInEmbeddedRepeatCG: createModelPath(
		"Screen2",
		"embedded-repeat-repeatableGroup3",
		"cg",
		"row-98c77",
		"control-ff7ef"
	),
	indexedControl1: createModelPath("Screen6", "cg", "row_25e3f", "control_a4f9c"),
	indexColumnInInlineRepeat1: createModelPath(
		"Screen6",
		"sec",
		"repeat-indexedControls1",
		"fieldbasedrepeatoverviewcolumn_2f965"
	),
	indexedControl2: createModelPath("Screen6", "cg", "row_25e3f", "control_d03d1"),
	indexColumnInInlineRepeat2: createModelPath(
		"Screen6",
		"sec",
		"repeat-indexedControls2",
		"fieldbasedrepeatoverviewcolumn_bccca"
	)
};
