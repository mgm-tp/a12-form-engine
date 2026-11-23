// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { actionCreatorFactory } from "typescript-fsa";

const acf = actionCreatorFactory("StringList");

/** @internal */
export const AddEntry = acf("Add");

/** @internal */
export const DeleteEntry = acf<DeleteEntryPayload>("Delete");

/** @internal */
export interface DeleteEntryPayload {
	readonly rowIndex: number;
}

/** @internal */
export const ChangeEntry = acf<ChangeEntryPayload>("Change");

/** @internal */
export interface ChangeEntryPayload {
	readonly rowIndex: number;
	readonly value: string;
}
