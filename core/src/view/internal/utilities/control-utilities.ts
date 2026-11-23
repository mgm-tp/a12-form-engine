// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Localizable } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import type { EngineStore } from "../../../back-end/store/internal/store.js";

/** @internal */
export function getErrors(messages: EngineStore.Validation.Message[]): Localizable[] {
	return messages.filter(m => m.severity === "ERROR").flatMap(m => m.errorText);
}

/** @internal */
export function getWarnings(messages: EngineStore.Validation.Message[]): Localizable[] {
	return messages.filter(m => m.severity === "WARNING").flatMap(m => m.errorText);
}

/** @internal */
export function getInfos(messages: EngineStore.Validation.Message[]): Localizable[] {
	return messages.filter(m => m.severity === "INFO").flatMap(m => m.errorText);
}
