// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { actionCreatorFactory } from "typescript-fsa";

import type { LocalizedText } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

const acf = actionCreatorFactory("LocalizedText");

/** @internal */
export const AddLocalizedText = acf("Add");

/** @internal */
export const DeleteLocalizedText = acf<DeleteLocalizedTextPayload>("Delete");

/** @internal */
export interface DeleteLocalizedTextPayload {
	readonly rowIndex: number;
}

/** @internal */
export const ChangeLocalizedText = acf<ChangeLocalizedTextPayload>("Change");

/** @internal */
export interface ChangeLocalizedTextPayload {
	readonly rowIndex: number;
	readonly localizedText: Partial<LocalizedText>;
}
