// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { query } from "@com.mgmtp.a12.devtools/react";
import type {
	EntityInstancePath,
	GroupInstance
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { EngineStore } from "../../../../../back-end/store/index.js";
import type { Models } from "../../../../../back-end/store/internal/store.js";
import { DocumentUtils } from "../../../../../models/internal/utils/document-utils.js";
import { SetupHelpers } from "../../../../utils/setup.js";

export async function executeReadonlyPropTest(options: {
	models: Models;
	document?: GroupInstance;
	path: EntityInstancePath;
	value: string | boolean | null;
	uiState?: Partial<EngineStore.UIState>;
	withComponentMap?: true;
	componentId: string;
	shouldBeReadonly: boolean;
}): Promise<void> {
	const {
		models,
		document,
		path,
		value,
		uiState,
		withComponentMap,
		componentId,
		shouldBeReadonly
	} = options;

	const newDocument = DocumentUtils.setValue(document ?? {}, path, value, models.documentModel);

	const renderOptions = {
		models,
		data: { document: newDocument },
		ui: uiState,
		withWidgets: withComponentMap
	};

	const { widgetMap } = await SetupHelpers.setupFormEngineRendererWithRtlAsync(renderOptions);

	query(widgetMap.TextLineStateless)
		.withId(componentId)
		.withProp("readonly", shouldBeReadonly)
		.assertRendered();
}
