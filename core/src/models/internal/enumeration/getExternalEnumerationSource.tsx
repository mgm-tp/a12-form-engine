// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";

import type { FormModel } from "../form-model.js";

/** @internal */
export function getExternalEnumerationSource(
	formModel: FormModel,
	elementPath: ModelPath
): string | undefined {
	const fce = formModel.content.fieldConfiguration.fieldMap[ModelPath.toString(elementPath)];
	return fce?.externalEnumeration?.src;
}
