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
