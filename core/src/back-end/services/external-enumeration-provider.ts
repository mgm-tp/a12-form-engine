// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ReadonlyObjectMap } from "../../models/internal/utils/json.js";

/**
 * Provider returns a list of enumeration values for a specific source
 */
export interface IExternalEnumerationProvider {
	(source: string): ReadonlyObjectMap<{ [key: string]: string | undefined }>;
}

// TODO: Remove with A12-17671
export default IExternalEnumerationProvider;

/**
 * Implementation of an external enumeration provider.
 * @returns a provider which will always return an empty array.
 */
export const EmptyExternalEnumerationProvider: IExternalEnumerationProvider =
	function EmptyExternalEnumerationProvider() {
		return {};
	};

/**
 * Implementation of an external enumeration provider.
 * @returns a provider which will always throw an error.
 */
export const MissingExternalEnumerationProvider: IExternalEnumerationProvider =
	function MissingExternalEnumerationProvider() {
		throw new Error("missing external enumeration provider");
	};
