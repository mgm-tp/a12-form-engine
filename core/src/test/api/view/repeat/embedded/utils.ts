// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
