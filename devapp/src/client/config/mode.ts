// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

// injected by bundler
export declare const __DEVAPP_MODE__: "mock" | "services";

/**
 * The environment with which the devapp runs
 *
 * - "mock": No backend, models are loaded locally, data is mocked
 * - "services": Default A12 DataServices backend
 */
export const DEVAPP_MODE = __DEVAPP_MODE__;

export function sleep(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export function isDefaultBackend(): boolean {
	return DEVAPP_MODE === "services";
}
