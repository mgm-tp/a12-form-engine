// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { FormModel } from "../../../../../models/index.js";
import type { FormModelMap } from "../../../configuration/engine-configuration.js";

/** @internal */
export interface RepeatProps {
	readonly modelElement: FormModel.Repeat;
	readonly config: FormModelMap.RenderConfiguration;
	readonly disabled: boolean;
	readonly readonly: boolean;
}
