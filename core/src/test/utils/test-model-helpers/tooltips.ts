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

import type { EngineStore, Models } from "../../../back-end/store/internal/store.js";
import type { ReadonlyObjectMap } from "../../../models/internal/utils/json.js";
import type { Config } from "../../../view/internal/configuration/engine-configuration.js";

import { DocumentHelpers } from "../document-helpers.js";

import type { RenderWithInputMap } from "./render-with-inputmocks.js";
import { renderWithInputMocks } from "./render-with-inputmocks.js";

const { createDocumentPath } = DocumentHelpers;

export namespace IDS {
	export const NUMBER_TYPE_PATH = createDocumentPath(["root"], ["group"], ["NumberType"]);
	export const NUMBER_TYPE_REPEAT_PATH = createDocumentPath(["root"], ["repeat"], ["NumberType"]);

	export const SCREEN = "Screen1";
	export const WARNING_INPUT = "a12-Warnings-F47";
	export const NUMBER_INPUT = "a12-NumberType-F4";
	export const STRING_INPUT = "a12-StringType-F3";
	export const NUMBER_INPUT_TOOLTIP_ON_TOP = "a12-NumberType-F4-3";
	export const NUMBER_INPUT_INLINE_REPEAT = "a12-fieldbasedrepeatoverviewcolumn-1e8bf-cell-0";

	export const NUMBER_TYPE_VALUE_BACKUP = 100;
	export const NUMBER_TYPE_VALUE = 200;
	export const NUMBER_TYPE_VALUE_REPEAT = 300;
}

export function createDocumentForTooltipsModels(values: {
	NumberType: number;
	NumberTypeRepeat?: number;
}): GroupInstance {
	return {
		root: {
			L0_Number: values.NumberType,
			repeat: [values.NumberTypeRepeat ? { NumberType: values.NumberTypeRepeat } : {}]
		}
	};
}

function locationStackForTooltipsModel(options: {
	locationPath?: ModelPath;
}): EngineStore.ScreenState[] {
	const repeatPath = createDocumentPath(["root"], ["repeat", 1]);
	const screenLocation: EngineStore.ScreenState[] = [
		{
			locationPath: [{ elementName: IDS.SCREEN }],
			path: []
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

export function setupForTooltipsModel(options: {
	models: Models;
	locationPath?: ModelPath;
	document: GroupInstance;
	backupDocument?: GroupInstance;
	messages?: ReadonlyObjectMap<EngineStore.Validation.Entry>;
	backupMessages?: ReadonlyObjectMap<EngineStore.Validation.Entry>;
	config?: Partial<Config>;
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
			screenLocation: locationStackForTooltipsModel({
				locationPath: options.locationPath
			})
		},
		config: options.config
	});
}
