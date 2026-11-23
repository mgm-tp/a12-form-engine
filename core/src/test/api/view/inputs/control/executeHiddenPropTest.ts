// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { query } from "@com.mgmtp.a12.devtools/react";
import type {
	EntityInstancePath,
	GroupInstance
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { EngineStore, Models } from "../../../../../back-end/store/index.js";
import { DocumentUtils } from "../../../../../models/internal/utils/document-utils.js";
import { SetupHelpers } from "../../../../utils/setup.js";

export interface HiddenPropTestOptions {
	models: Models;
	document?: GroupInstance;
	path: EntityInstancePath;
	value: string | boolean | null;
	uiState?: Partial<EngineStore.UIState>;
	componentId: string;
	shouldBeHidden: boolean;
}

export async function executeHiddenPropTest(options: HiddenPropTestOptions): Promise<void> {
	const { models, document, path, value, uiState, componentId, shouldBeHidden } = options;

	const newDocument = DocumentUtils.setValue(document ?? {}, path, value, models.documentModel);

	const { widgetMap } = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
		models,
		ui: uiState,
		data: { document: newDocument }
	});

	const expectedRenders = shouldBeHidden ? 0 : 1;
	query(widgetMap.TextLineStateless).withId(componentId).assertRenderedTimes(expectedRenders);
}
