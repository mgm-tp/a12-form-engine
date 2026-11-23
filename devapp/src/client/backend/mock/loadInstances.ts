// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { sanityCheck } from "../utils.js";

export async function loadMockInstances(dmName: string): Promise<string[]> {
	sanityCheck("mock");

	const response = fetch(`data/instances.json`);

	const instances = (await response.then(r => r.json())) as Record<string, string[]>;

	return instances[dmName] ?? [];
}
