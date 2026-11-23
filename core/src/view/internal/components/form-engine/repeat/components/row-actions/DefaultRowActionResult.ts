// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import type { Localizable } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import type { LocalizableFactory } from "../../../../../../../back-end/localization/internal/localization.js";

/** @internal */
export interface DefaultRowActionResult {
	triggerAction(rowPath: EntityInstancePath, repeatFormModelPath: ModelPath): void;
	getLocalizables(localizationFactory: LocalizableFactory): Localizable[];
	eventName: string;
}
