// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { query } from "@com.mgmtp.a12.devtools/react";
import type { Locale } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import type { EngineStore, Models } from "../../../../../../back-end/store/index.js";
import { getInputMocks } from "../../../../../rtl-utils/getInputMocks.js";
import { SetupHelpers } from "../../../../../utils/setup.js";

/**
 * Renders models that contain a specific StringInput. Returns
 * props.modelElement (an Inputs.ModelElement structure) to do the actual
 * asserts.
 */
export function renderStringInput(opts: {
	locale?: Locale;
	models: Models;
	document?: object;
	elementId: string;
	uiState?: Partial<EngineStore.UIState>;
}) {
	const { locale, models, document, elementId, uiState } = opts;
	const inputMap = getInputMocks();
	SetupHelpers.setupFormEngineRendererWithRtl({
		locale,
		models,
		data: document ? { document } : undefined,
		ui: uiState,
		inputMap
	});
	return query(inputMap.StringInput).withProp("uiId", elementId).props().modelElement;
}
