// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
