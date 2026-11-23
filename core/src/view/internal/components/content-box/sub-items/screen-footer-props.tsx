// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { FormModel } from "../../../../../models/internal/form-model.js";

import type { ContentBoxRenderConfiguration } from "../content-box-render-configuration.js";

/** @internal */
export interface ScreenFooterProps {
	readonly element: FormModel.Screen;
	readonly config: ContentBoxRenderConfiguration;
}
