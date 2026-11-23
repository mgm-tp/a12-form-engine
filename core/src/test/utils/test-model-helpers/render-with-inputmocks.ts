// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { InputMap } from "../../../view/internal/configuration/componentMap/input/input-map.js";
import { getInputMocks } from "../../rtl-utils/getInputMocks.js";
import type { RtlRenderWrapper, SetupWithRtlOptions } from "../../rtl-utils/render-wrapper.js";

import { SetupHelpers } from "../setup.js";

export interface RenderWithInputMap extends RtlRenderWrapper {
	readonly inputMap: InputMap;
}

export async function renderWithInputMocks(
	options: SetupWithRtlOptions
): Promise<RenderWithInputMap> {
	const inputMap = getInputMocks();
	const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
		...options,
		inputMap
	});
	return {
		...wrapper,
		inputMap
	};
}
