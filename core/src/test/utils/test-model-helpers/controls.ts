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
import type { GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { EngineStore } from "../../../back-end/store/index.js";
import type { Models } from "../../../back-end/store/internal/store.js";
import type { ReadonlyObjectMap } from "../../../models/index.js";

import { DocumentHelpers } from "../document-helpers.js";
import { ModelHelpers } from "../model-helpers.js";

import type { RenderWithInputMap } from "./render-with-inputmocks.js";
import { renderWithInputMocks } from "./render-with-inputmocks.js";

const { createDocumentPath } = DocumentHelpers;
const { createModelPath } = ModelHelpers;

export namespace CONTROLS {
	export const ROOT = "root";
	export const L0_Number = "L0_Number";
	export const L1_Number = "L1_Number";
	export const repeatableGroup = "repeatableGroup";
	export const screenName = "Screen1";
	export const er_locationPath = createModelPath(screenName, "sec1", "er");
	export const dr_locationPath = createModelPath(screenName, "sec1", "dr", "dr-detail-screen");
	export const dr_readonly_locationPath = createModelPath(
		screenName,
		"sec2",
		"dr",
		"dr-detail-screen"
	);
	export const er_readonly_locationPath = createModelPath(screenName, "sec2", "er");

	export const ID_L0_NUMBER = "a12-L0_Number-field_91630";
	export const PATH_L0_NUMBER = createModelPath(
		screenName,
		"sec1",
		"cg1",
		"row-c444e",
		"control-ee992"
	);

	export const ID_L0_NUMBER_IN_ER = "a12-L0_Number-field_91630-2";
	export const ID_L0_NUMBER_IN_RO_ER = "a12-L0_Number-field_91630-5";

	export const ID_L1_NUMBER_IN_ER = "a12-L1_Number-fieldimpl_5022f";
	export const ID_L1_NUMBER_IN_RO_ER = "a12-L1_Number-fieldimpl_5022f-3";

	export const ID_L0_NUMBER_IN_DR = "a12-L0_Number-field_91630-3";
	export const ID_L1_NUMBER_IN_DR = "a12-L1_Number-fieldimpl_5022f-2";

	export const ID_L0_NUMBER_IN_RO_DR = "a12-L0_Number-field_91630-6";
	export const ID_L1_NUMBER_IN_RO_DR = "a12-L1_Number-fieldimpl_5022f-4";

	export const ID_IR_L0_NUMBER = "a12-fieldbasedrepeatoverviewcolumn-6c608-cell-0";
	export const ID_IR_L1_NUMBER = "a12-fieldbasedrepeatoverviewcolumn-01601-cell-0";

	export const L0_NUMBER_VALUE_BACKUP = 100;
	export const L0_NUMBER_VALUE = 200;
	export const L1_NUMBER_VALUE = 300;
}

export function createDocumentForControlsModels(values: {
	L0_Number: number;
	L1_Number?: number;
}): GroupInstance {
	return {
		root: {
			L0_Number: values.L0_Number,
			repeatableGroup: [values.L1_Number ? { L1_Number: values.L1_Number } : {}]
		}
	};
}

export type LocationStackPosition = "embedded" | "detached";

export function locationStackForControlsModel(options: {
	locationPath?: ModelPath;
	repeatInstanceState?: ReadonlyObjectMap<EngineStore.Repeat.InstanceState>;
}) {
	const repeatPath = createDocumentPath([CONTROLS.ROOT], [CONTROLS.repeatableGroup, 1]);
	const screenLocation: EngineStore.ScreenState[] = [
		{
			locationPath: [{ elementName: CONTROLS.screenName }],
			path: [],
			repeatInstanceState: options.repeatInstanceState
		}
	];

	if (options.locationPath) {
		screenLocation.push({
			path: repeatPath,
			locationPath: options.locationPath
		});
	}

	return screenLocation;
}

export function setupForControlsModel(options: {
	models: Models;
	locationPath?: ModelPath;
	document: GroupInstance;
	backupDocument?: GroupInstance;
	messages?: ReadonlyObjectMap<EngineStore.Validation.Entry>;
	backupMessages?: ReadonlyObjectMap<EngineStore.Validation.Entry>;
	repeatInstanceState?: ReadonlyObjectMap<EngineStore.Repeat.InstanceState>;
}): Promise<RenderWithInputMap> {
	return renderWithInputMocks({
		models: options.models,
		data: { document: options.document },
		ui: {
			messages: options.messages,
			backup: options.backupDocument
				? [
						{
							document: options.backupDocument,
							messages: options.backupMessages ? options.backupMessages : {}
						}
					]
				: [],
			screenLocation: locationStackForControlsModel({
				locationPath: options.locationPath,
				repeatInstanceState: options.repeatInstanceState
			})
		}
	});
}
