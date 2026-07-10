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

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import type { EntityInstancePath, GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import type { EngineStore } from "../../../back-end/store/index.js";
import type { Models } from "../../../back-end/store/internal/store.js";
import type { ReadonlyObjectMap } from "../../../models/index.js";
import type { InputMap } from "../../../view/internal/configuration/componentMap/input/input-map.js";

import { createModelPath } from "../createModelPath.js";
import { setupFormEngineRendererWithRtl } from "../setup.js";

export const DR = {
	ROOT: "Root",
	repeatableGroup: "Nested_L1",
	SortingAndFiltering: {
		screenName: "SortingAndFiltering",
		repeatNameSec1: "inline-repeat-Nested_L1",
		dr_locationPath: createModelPath(
			"SortingAndFiltering",
			"sec1",
			"inline-repeat-Nested_L1",
			"inline-repeat-Nested_L1-detail-screen"
		),
		repeatFormModelPath: createModelPath("SortingAndFiltering", "sec1", "inline-repeat-Nested_L1"),
		embeddedRepeatFormModelPath: createModelPath(
			"SortingAndFiltering",
			"sec4",
			"embedded-repeat-Nested_L1"
		),
		ID_COLUMN_L1_STRING: "a12-fieldbasedrepeatoverviewcolumn-2c388-bodycell-0",
		ID_COLUMN_L1_NUMBER: "a12-fieldbasedrepeatoverviewcolumn-adcda-bodycell-0",
		ID_COLUMN_L1_BOOLEAN: "a12-fieldbasedrepeatoverviewcolumn-1ccd0-bodycell-0",
		ID_COLUMN_L1_CONFIRM: "a12-fieldbasedrepeatoverviewcolumn-577a0-bodycell-0",
		ID_COLUMN_L1_ENUMERATION: "a12-fieldbasedrepeatoverviewcolumn-07a2d-bodycell-0",
		ID_COLUMN_L1_DATE: "a12-fieldbasedrepeatoverviewcolumn-2f3cf-bodycell-0",
		ID_COLUMN_L1_DATETIME: "a12-fieldbasedrepeatoverviewcolumn-98625-bodycell-0",
		ID_COLUMN_L1_TIME: "a12-fieldbasedrepeatoverviewcolumn-35944-bodycell-0",
		ID_COLUMN_L1_MULTI_SELECT: "a12-fieldbasedrepeatoverviewcolumn-9813b-bodycell-0",
		ID_COLUMN_L1_EXPRESSION: "a12-expressionrepeatoverviewcolumn-f18f8-bodycell-0",
		ID_L1_NUMBER: "a12-L1_Number-F19",
		ID_REPEAT: "a12-inlinerepeat-da601",
		ID_ADD_BUTTON: "a12-add-button-inlinerepeat-da601",
		ID_NESTED_ADD_BUTTON: "a12-add-button-inlinerepeat-12f2a",
		repeatFormModelPathSec3: createModelPath(
			"SortingAndFiltering",
			"sec3",
			"detached-repeat-Nested_L6"
		),
		drRepeatDetailScreen: createModelPath(
			"SortingAndFiltering",
			"sec3",
			"detached-repeat-Nested_L6",
			"detached-repeat-Nested_L6-detail-screen"
		)
	},
	NestedRepeat: {
		screenName: "NestedRepeat",
		dr_locationPath: createModelPath(
			"NestedRepeat",
			"sec2",
			"inline-repeat-Nested_L1",
			"inline-repeat-Nested_L1-detail-screen"
		),
		nested_dr_dr_locationPath: [
			...createModelPath(
				"NestedRepeat",
				"sec1",
				"inline-repeat-Nested_L1",
				"inline-repeat-Nested_L1-detail-screen"
			),
			...createModelPath("inline-repeat-Nested_L2", "inline-repeat-Nested_L2-detail-screen")
		],
		nested_dr_er_locationPath: [
			...createModelPath(
				"NestedRepeat",
				"sec3",
				"inline-repeat-Nested_L1",
				"inline-repeat-Nested_L1-detail-screen"
			),
			...createModelPath("inline-repeat-Nested_L2")
		],
		ID_L2_NUMBER: "a12-fieldbasedrepeatoverviewcolumn-71c16-cell-0",
		ID_NESTED_DR_DR_L2_NUMBER: "a12-L2_Number-F28",
		ID_NESTED_DR_ER_L2_NUMBER: "a12-L2_Number-F28-2",
		ID_L1_NUMBER_IN_NESTED_DR_DR: "a12-L1_Number-F19-4",
		ID_L1_NUMBER_IN_NESTED_DR_IR: "a12-fieldbasedrepeatoverviewcolumn-90e22-cell-0",
		ID_L1_NUMBER_IN_NESTED_DR_ER: "a12-L1_Number-F19-7"
	},
	ColumnProperties: {
		screen: "ColumnProperties",
		ID_REPEAT_PINNING: "a12-inlinerepeat-a44be",
		ID_COLUMN_WIDTH: "a12-inlinerepeat-b99b2",
		ID_LEFT_1: "a12-fieldbasedrepeatoverviewcolumn-75664-cell-0",
		ID_LEFT_2: "a12-fieldbasedrepeatoverviewcolumn-abb7c-cell-0",
		ID_NONE_1: "a12-fieldbasedrepeatoverviewcolumn-03a0f-cell-0",
		ID_NONE_2: "a12-fieldbasedrepeatoverviewcolumn-6dc91-cell-0",
		ID_RIGHT_1: "a12-fieldbasedrepeatoverviewcolumn-bb84e-cell-0",
		ID_RIGHT_2: "a12-fieldbasedrepeatoverviewcolumn-150ee-cell-0",
		ID_REPEAT_VERTICAL_ALIGNMENT: "a12-detachedrepeat-63a05"
	},
	TableStyle: {
		ID_COLUMN_L1_STRING: "a12-fieldbasedrepeatoverviewcolumn-30dd9-bodycell-0",
		ID_COLUMN_L1_MULTI_SELECT: "a12-fieldbasedrepeatoverviewcolumn-12f7a-bodycell-0",
		ID_COLUMN_L1_EXPRESSION: "a12-expressionrepeatoverviewcolumn-14ea6-bodycell-0"
	}
};

export function createDocumentForDetachedRepeat(
	values: { L1_Number?: number; L2_Number?: number }[]
): GroupInstance {
	const nestedL1 = [];

	for (const entry of values) {
		const nestedL2 = entry.L2_Number ? { Nested_L2: [{ L2_Number: entry.L2_Number }] } : {};
		const nestedL1Entry = entry.L1_Number
			? {
					L1_Number: entry.L1_Number,
					...nestedL2
				}
			: { ...nestedL2 };
		nestedL1.push(nestedL1Entry);
	}

	return {
		Root: {
			Nested_L1: nestedL1
		}
	};
}

function locationStackForDetachedRepeat(options: {
	detailScreenOpen?: boolean;
	locationPath: ReadonlyArray<ModelPath>;
	paths: ReadonlyArray<EntityInstancePath>;
	repeatInstanceStates?: ReadonlyArray<ReadonlyObjectMap<EngineStore.Repeat.InstanceState>>;
}) {
	const screenLocation: EngineStore.ScreenState[] = [];
	for (let i = 0; i < options.locationPath.length; i++) {
		screenLocation.push({
			locationPath: options.locationPath[i],
			path: options.paths[i],
			repeatInstanceState: options.repeatInstanceStates
				? options.repeatInstanceStates[i]
				: undefined
		});
	}
	return screenLocation;
}

export function setupForDetachedRepeat(options: {
	withWidgets?: true;
	inputMap: InputMap;
	models: Models;
	erOpen?: boolean;
	document: GroupInstance;
	backupDocument?: GroupInstance;
	messages?: ReadonlyObjectMap<EngineStore.Validation.Entry>;
	backupMessages?: ReadonlyObjectMap<EngineStore.Validation.Entry>;
	locationPaths: ReadonlyArray<ModelPath>;
	repeatInstanceStates?: ReadonlyArray<ReadonlyObjectMap<EngineStore.Repeat.InstanceState>>;
	paths: ReadonlyArray<EntityInstancePath>;
}) {
	return setupFormEngineRendererWithRtl({
		withWidgets: options.withWidgets,
		inputMap: options.inputMap,
		models: options.models,
		data: { document: options.document },
		ui: {
			messages: options.messages,
			backup: options.backupDocument
				? [
						{
							document: options.backupDocument,
							messages: options.backupMessages ? options.backupMessages : {}
						},
						{ document: options.backupDocument, messages: {} }
					]
				: [],
			screenLocation: locationStackForDetachedRepeat({
				detailScreenOpen: true,
				locationPath: options.locationPaths,
				paths: options.paths,
				repeatInstanceStates: options.repeatInstanceStates
			})
		}
	});
}
