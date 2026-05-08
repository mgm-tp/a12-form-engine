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

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type {
	EntityInstancePath,
	GroupInstance
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import { DocumentHelpers } from "../document-helpers.js";
import { ModelHelpers } from "../model-helpers.js";

const { createDocumentPath } = DocumentHelpers;

export namespace DOCUMENT_MODEL {
	export const ROOT_GROUP = "validation";
	export const VISIBLE_FIELDS_GROUP = "visibleFields";
	export const MASTER_BOOLEAN = "masterBoolean";
	export const MASTER_ENUM = "masterEnum";
	export const MASTER_ENUM2 = "masterEnum2";
	export const DEPENDENT_GROUP_MASTER = "dependentGroupMaster";
	export const REQUIRED_STRING = "requiredString";
	export const NUMBER_FIELD = "numberField";
	export const NUMBER_FIELD2 = "numberField2";
	export const REPEATABLE_GROUP_1 = "repeatableGroup1";
	export const REPEATABLE_GROUP_2 = "repeatableGroup2";
	export const REPEATABLE_GROUP_3 = "repeatableGroup3";
	export const NESTED_REPEATABLE_GROUP = "nestedRepeatableGroup";
	export const NESTED_NON_REPEATABLE_GROUP = "nestedNonRepeatableGroup";
	export const STRING_FIELD = "stringField";
	export const ERROR_MESSAGES_GROUP = "errorMessages";
	export const VALUE_REFERENCED_GROUP = "valueReferencedInMessage";
	export const DATE_RANGE_FIELD = "DateRangeField1";
	export const LOCAL_MASTER_FIELD = "localMaster";
	export const LOCAL_DEPENDENT_HIDDEN_FIELD = "localDependentHidden";

	export const INDEXED_CONTROLS_GROUP = "indexedControls";
	export const INDEXED_CONTROLS_REPEATABLE_GROUP_1 = "repeatableGroup1";
	export const INDEXED_CONTROLS_REPEATABLE_GROUP_2 = "repeatableGroup2";
	export const INDEX_FIELD = "indexField";

	export const pathToMasterBooleanField = createDocumentPath(
		[ROOT_GROUP],
		[VISIBLE_FIELDS_GROUP],
		[MASTER_BOOLEAN]
	);
	export const pathToRequiredString = createDocumentPath(
		[ROOT_GROUP],
		[VISIBLE_FIELDS_GROUP],
		[REQUIRED_STRING]
	);

	export const pathToMasterEnumField = createDocumentPath(
		[ROOT_GROUP],
		[VISIBLE_FIELDS_GROUP],
		[MASTER_ENUM]
	);
	export const pathToMasterEnum2Field = createDocumentPath(
		[ROOT_GROUP],
		[VISIBLE_FIELDS_GROUP],
		[MASTER_ENUM2]
	);
	export const pathToDependentGroupMaster = createDocumentPath(
		[ROOT_GROUP],
		[VISIBLE_FIELDS_GROUP],
		[DEPENDENT_GROUP_MASTER]
	);

	export const pathToNumberField = createDocumentPath(
		[ROOT_GROUP],
		[VISIBLE_FIELDS_GROUP],
		[NUMBER_FIELD]
	);
	export const pathToNumberField2 = createDocumentPath(
		[ROOT_GROUP],
		[VISIBLE_FIELDS_GROUP],
		[NUMBER_FIELD2]
	);
	export const pathToDateRangeField = createDocumentPath(
		[ROOT_GROUP],
		[ERROR_MESSAGES_GROUP],
		[VALUE_REFERENCED_GROUP],
		[DATE_RANGE_FIELD]
	);

	export const pathToIndexedNumberField1 = createDocumentPath(
		[ROOT_GROUP],
		[INDEXED_CONTROLS_GROUP],
		[INDEXED_CONTROLS_REPEATABLE_GROUP_1],
		[NUMBER_FIELD]
	);

	export const pathToIndexField1 = createDocumentPath(
		[ROOT_GROUP],
		[INDEXED_CONTROLS_GROUP],
		[INDEXED_CONTROLS_REPEATABLE_GROUP_1],
		[INDEX_FIELD]
	);

	export const pathToIndexedNumberField2 = createDocumentPath(
		[ROOT_GROUP],
		[INDEXED_CONTROLS_GROUP],
		[INDEXED_CONTROLS_REPEATABLE_GROUP_2],
		[NUMBER_FIELD]
	);

	export const pathToIndexField2 = createDocumentPath(
		[ROOT_GROUP],
		[INDEXED_CONTROLS_GROUP],
		[INDEXED_CONTROLS_REPEATABLE_GROUP_2],
		[INDEX_FIELD]
	);

	export function pathToGroup1RepeatableStringField(index: number): EntityInstancePath {
		return createDocumentPath([ROOT_GROUP], [REPEATABLE_GROUP_1, index], [REQUIRED_STRING]);
	}

	export function pathToGroup2RepeatInstance(index: number): EntityInstancePath {
		return createDocumentPath([ROOT_GROUP], [REPEATABLE_GROUP_2, index]);
	}

	export function pathToGroup2RepeatableStringField(index: number): EntityInstancePath {
		return [...pathToGroup2RepeatInstance(index), ...createDocumentPath([STRING_FIELD])];
	}

	export function pathToGroup2RepeatableLocalMasterField(index: number): EntityInstancePath {
		return createDocumentPath([ROOT_GROUP], [REPEATABLE_GROUP_2, index], [LOCAL_MASTER_FIELD]);
	}

	export function pathToGroup2RepeatableDependentHiddenField(index: number): EntityInstancePath {
		return createDocumentPath(
			[ROOT_GROUP],
			[REPEATABLE_GROUP_2, index],
			[LOCAL_DEPENDENT_HIDDEN_FIELD]
		);
	}

	export function pathToGroup3RepeatableStringField(index: number): EntityInstancePath {
		return createDocumentPath([ROOT_GROUP], [REPEATABLE_GROUP_3, index], [REQUIRED_STRING]);
	}

	export function pathToGroup3RepeatInvisibleField(index: number): EntityInstancePath {
		return createDocumentPath(
			[ROOT_GROUP],
			[REPEATABLE_GROUP_3, index],
			["requireFieldOnlyShownInErTable"]
		);
	}

	export function pathToNestedRepeatableGroupStringField(index: number): EntityInstancePath {
		return createDocumentPath(
			[ROOT_GROUP],
			[REPEATABLE_GROUP_2],
			[NESTED_REPEATABLE_GROUP, index],
			[REQUIRED_STRING]
		);
	}

	export function pathToNestedNonRepeatableGroupStringField(index: number): EntityInstancePath {
		return createDocumentPath(
			[ROOT_GROUP],
			[REPEATABLE_GROUP_2, index],
			[NESTED_NON_REPEATABLE_GROUP],
			[STRING_FIELD]
		);
	}

	export function visiblePreFilledInlineRepeatWithHiddenColumns(): GroupInstance {
		// shows inline and detached repeats in mcs
		// hides columns
		return visiblePreFilledRepeat({
			masterEnum: "showMCS",
			masterEnum2: "hideColumn",
			localMaster: "hideField"
		});
	}

	export function visiblePreFilledInlineRepeatWithVisibleColumn(): GroupInstance {
		// shows inline and detached repeats in mcs
		return visiblePreFilledRepeat({ masterEnum: "showMCS" });
	}

	export function visiblePreFilledEmbeddedRepeatWithHiddenColumns(): GroupInstance {
		// shows embedded repeat
		// hides columns
		return visiblePreFilledRepeat({
			masterEnum: "showSecERGroup2",
			masterEnum2: "hideColumn",
			localMaster: "hideField"
		});
	}

	export function visiblePreFilledEmbeddedRepeatWithVisibleColumn(): GroupInstance {
		// shows embedded repeat
		return visiblePreFilledRepeat({ masterEnum: "showSecERGroup2" });
	}

	function visiblePreFilledRepeat(options: {
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
	}

	export function dependentGroupNoHiddenColumnsInlineRepeat(): GroupInstance {
		return dependentGroup({ masterEnum: "showSecIRGroup1" });
	}

	export function dependentGroupNoHiddenColumnsEmbeddedRepeat(): GroupInstance {
		return dependentGroup({ masterEnum: "showSecERGroup1" });
	}

	export function dependentGroupHiddenColumnsInlineRepeat(): GroupInstance {
		return dependentGroup({
			masterEnum: "showSecIRGroup1",
			dependentGroupMaster: true
		});
	}

	export function dependentGroupHiddenColumnsEmbeddedRepeat(): GroupInstance {
		return dependentGroup({
			masterEnum: "showSecERGroup1",
			dependentGroupMaster: true
		});
	}

	function dependentGroup(options: {
		masterEnum: string;
		dependentGroupMaster?: boolean;
	}): GroupInstance {
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
	}

	export function dependentGroupHiddenColumnsInSomeRowsInlineRepeat(): GroupInstance {
		return dependentGroupHiddenColumnsInSomeRows("showMCS");
	}

	export function dependentGroupHiddenColumnsInSomeRowsEmbeddedRepeat(): GroupInstance {
		return dependentGroupHiddenColumnsInSomeRows("showSecERGroup2");
	}

	function dependentGroupHiddenColumnsInSomeRows(masterEnum: string): GroupInstance {
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
	}

	export function hiddenSection(): GroupInstance {
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
	}

	export function visibleSection(): GroupInstance {
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
	}

	export function hiddenMCS(): GroupInstance {
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
	}

	export function hiddenCG(): GroupInstance {
		return {
			validation: {
				visibleFields: {
					numberField: 123
				}
			}
		};
	}

	export function visibleCG(): GroupInstance {
		return {
			validation: {
				visibleFields: {
					masterEnum: "showCG"
				}
			}
		};
	}

	export function collapsedByDefault(): GroupInstance {
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
	}

	export function embeddedRepeat(): GroupInstance {
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
	}

	export function indexedControlsDocument(showRepeats?: boolean): GroupInstance {
		return {
			[ROOT_GROUP]: {
				[INDEXED_CONTROLS_GROUP]: {
					showRepeats,
					[INDEXED_CONTROLS_REPEATABLE_GROUP_1]: [{ numberField: 1, indexField: "Index 1" }],
					[INDEXED_CONTROLS_REPEATABLE_GROUP_2]: [{ numberField: 2, indexField: "Index 1" }]
				}
			}
		};
	}

	export function documentRepeat(options: {
		detachedRepeat?: boolean;
		embeddedRepeat?: boolean;
	}): GroupInstance {
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
}

export namespace VISIBLE_FIELDS {
	export const secIRGroup1ModelPath: ModelPath = [
		{ elementName: "Screen1" },
		{ elementName: "sec-IR-group1" }
	];
	export const sec2ModelPath: ModelPath = [{ elementName: "Screen1" }, { elementName: "sec-2" }];

	export const requiredStringControl = ModelHelpers.createModelPath(
		"Screen1",
		"cg1",
		"row-40455",
		"control-46ba2"
	);

	export const irInMCS = ModelHelpers.createModelPath(
		"Screen1",
		"mcs-1",
		"inline-repeat-repeatableGroup2"
	);

	export const requiredStringInIRInMCS = [
		...irInMCS,
		...ModelHelpers.createModelPath("fieldbasedrepeatoverviewcolumn-3368f")
	];

	export const localDependentHiddenInIRInMCS = [
		...irInMCS,
		...ModelHelpers.createModelPath("fieldbasedrepeatoverviewcolumn-21c56")
	];

	export const nestedNonRepeatableStringInIRInMCS = [
		...irInMCS,
		...ModelHelpers.createModelPath("fieldbasedrepeatoverviewcolumn-4533f")
	];

	export const erCgGroup2 = ModelHelpers.createModelPath(
		"Screen1",
		"sec-ER-group2",
		"embedded-repeat-repeatableGroup2",
		"cg"
	);

	export const requiredStringInERGroup2 = [
		...erCgGroup2,
		...ModelHelpers.createModelPath("row_bf244", "control_95ff0")
	];

	export const localDependentHiddenInERGroup2 = [
		...erCgGroup2,
		...ModelHelpers.createModelPath("row_36444", "control_fa7ea")
	];

	export const nestedNonRepeatableStringInERGroup2 = [
		...erCgGroup2,
		...ModelHelpers.createModelPath("row_89708", "control_ffaf7")
	];

	export const requiredStringInIRGroup1 = ModelHelpers.createModelPath(
		"Screen1",
		"sec-IR-group1",
		"inline-repeat-repeatableGroup1",
		"fieldbasedrepeatoverviewcolumn-6ebbd"
	);

	export const requiredStringInERGroup1 = ModelHelpers.createModelPath(
		"Screen1",
		"sec-ER-group1",
		"embedded-repeat-repeatableGroup1",
		"cg",
		"row_e8c3a",
		"control_bbf07"
	);

	export const numberField = ModelHelpers.createModelPath(
		"Screen1",
		"cg-2",
		"row-e2392",
		"control-d93b6"
	);

	export const numberField2 = ModelHelpers.createModelPath(
		"Screen1",
		"sec-2",
		"cg-5",
		"row-ff049",
		"control-e833b"
	);

	export const masterEnumField = ModelHelpers.createModelPath(
		"Screen1",
		"sec-1",
		"cg-4",
		"row-ebeb8",
		"control-89b40"
	);

	export const requiredStringInDRDetailScreen = ModelHelpers.createModelPath(
		"Screen2",
		"inline-repeat-repeatableGroup",
		"inline-repeat-repeatableGroup-detail-screen",
		"cg",
		"row-4ba00",
		"control-73f5f"
	);

	export const requiredStringInNestedRepeat = ModelHelpers.createModelPath(
		"Screen2",
		"inline-repeat-repeatableGroup",
		"inline-repeat-repeatableGroup-detail-screen",
		"inline-repeat-nestedRepeatableGroup",
		"fieldbasedrepeatoverviewcolumn-6a119"
	);

	export const requiredStringInEmbeddedRepeatCG = ModelHelpers.createModelPath(
		"Screen2",
		"embedded-repeat-repeatableGroup3",
		"cg",
		"row-98c77",
		"control-ff7ef"
	);

	export const indexedControl1 = ModelHelpers.createModelPath(
		"Screen6",
		"cg",
		"row_25e3f",
		"control_a4f9c"
	);

	export const indexColumnInInlineRepeat1 = ModelHelpers.createModelPath(
		"Screen6",
		"sec",
		"repeat-indexedControls1",
		"fieldbasedrepeatoverviewcolumn_2f965"
	);

	export const indexedControl2 = ModelHelpers.createModelPath(
		"Screen6",
		"cg",
		"row_25e3f",
		"control_d03d1"
	);

	export const indexColumnInInlineRepeat2 = ModelHelpers.createModelPath(
		"Screen6",
		"sec",
		"repeat-indexedControls2",
		"fieldbasedrepeatoverviewcolumn_bccca"
	);
}
