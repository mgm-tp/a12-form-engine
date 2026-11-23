// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";

import type { FormModelMap } from "../../configuration/engine-configuration.js";

/** @internal */
export interface ContentBoxRenderConfiguration {
	/**
	 * Current form model path until the parent of the current
	 * form model element.
	 */
	readonly parentPath: ModelPath;
	readonly renderOptions: FormModelMap.RenderOptions;
}
