// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { act } from "react";

import type { RtlRenderWrapper } from "../../../../rtl-utils/render-wrapper.js";

import type { RenderSideEffect } from "./render-sideeffect.js";

export type Interaction = RenderSideEffect | RenderSideEffect[];

export async function run(wrapper: RtlRenderWrapper, interaction: Interaction): Promise<void> {
	const actions = Array.isArray(interaction) ? interaction : [interaction];
	for (const action of actions) {
		await act(() => action(wrapper));
	}
}
