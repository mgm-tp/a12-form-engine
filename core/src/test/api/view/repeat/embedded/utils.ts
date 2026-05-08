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

import type { Mock } from "node:test";
import { mock } from "node:test";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type {
	EntityInstancePath,
	GroupInstance
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { Models } from "../../../../../back-end/store/internal/store.js";
import type { DispatchConfiguration } from "../../../../../view/index.js";
import { defaultMapDispatchToProps } from "../../../../../view/index.js";
import { getComponentMocks } from "../../../../rtl-utils/getComponentMocks.js";
import type { RtlRenderWrapper } from "../../../../rtl-utils/render-wrapper.js";
import { DocumentHelpers } from "../../../../utils/document-helpers.js";
import { SetupHelpers } from "../../../../utils/setup.js";
import { setupFixture, setupModelsFixture } from "../../../../utils/setupFixture.js";
import { ER } from "../../../../utils/test-model-helpers/embedded.repeat.js";

const { loadData } = SetupHelpers;
const { createDocumentPath } = DocumentHelpers;

const topLevelLocationPath = [{ elementName: ER.SortingAndFiltering.screenSortingAndFiltering }];
const repeatableGroupPath = createDocumentPath([ER.ROOT], [ER.repeatableGroup]);

const stubbedDispatch = defaultMapDispatchToProps(mock.fn());
const dispatchConfig = {
	...stubbedDispatch.eventHandlers,
	repeat: {
		...stubbedDispatch.eventHandlers.repeat,
		addRow: mock.fn(),
		onCloseEmbeddedRepeatRow: mock.fn()
	}
};

export interface EmbeddedRepeatTestEnv {
	models(): Models;
	dependentElementModels(): Models;
	multiFileUploadModels(): Models;
	document(): GroupInstance;
	readonly dispatchConfig: DispatchConfiguration;
	readonly stubs: {
		addRow: Mock<DispatchConfiguration.Repeat["addRow"]>;
		onCloseEmbeddedRepeatRow: Mock<DispatchConfiguration.Repeat["onCloseEmbeddedRepeatRow"]>;
	};
}

export function initEmbeddedRepeatTests(): EmbeddedRepeatTestEnv {
	const dependentElementModels = setupModelsFixture("dependencies.element");
	const models = setupModelsFixture("repeat", "embedded");
	const multiFileUploadModels = setupModelsFixture("repeat.multi-file-upload");
	const fixture = setupFixture(() => ({
		document: loadData("repeat", "dataForEmbeddedRepeatTest", models.documentModel)
	}));

	return {
		dispatchConfig,
		models: () => models,
		dependentElementModels: () => dependentElementModels,
		multiFileUploadModels: () => multiFileUploadModels,
		document: () => fixture.document,
		stubs: {
			onCloseEmbeddedRepeatRow: dispatchConfig.repeat.onCloseEmbeddedRepeatRow,
			addRow: dispatchConfig.repeat.addRow
		}
	};
}

export function setup(options: {
	testEnv: EmbeddedRepeatTestEnv;
	newRow?: boolean;
	expandedRowPath?: EntityInstancePath;
}): Promise<RtlRenderWrapper> {
	const repeatFormModelPath = ER.SortingAndFiltering.repeatFormModelPath;

	return SetupHelpers.setupFormEngineRendererWithRtlAsync({
		models: options.testEnv.models(),
		data: { document: options.testEnv.document() },
		ui: {
			screenLocation: [
				{
					path: [],
					locationPath: topLevelLocationPath,
					repeatInstanceState: {
						[ModelPath.toString(repeatFormModelPath)]: {
							expandedRowPath: options.expandedRowPath,
							newRow: options.newRow
								? {
										rowPath: repeatableGroupPath,
										rowState: "workingOn"
									}
								: undefined
						}
					}
				}
			]
		},
		dispatchConfig,
		componentMap: getComponentMocks(),
		withWidgets: true
	});
}
