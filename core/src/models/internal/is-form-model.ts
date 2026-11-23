// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { isModelInstance } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";

import type { FormModel } from "./form-model.js";

/**
 * Determines for a given value if it is a form model.
 */
export function isFormModel(value: unknown): value is FormModel {
	return isModelInstance(value) && value.header.modelType === "form";
}
