// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import { DocumentPath } from "../../../models/internal/utils/document-utils.js";

/**
 * @internal
 *
 * Computes a reduced list of relevant field paths by filtering out redundant
 * paths. Paths will only be kept if:
 * - they point to a list of field instances (i.e. paths with 0-indices)
 * - they point to a single field instance, where this single field
 *   instance is not contained in any more generic path
 *
 * For example: Given the following document paths
 *
 * - Group[1]/Field[1]
 * - Group[0]/Field[1]
 *
 * The first path points to a single field instance, while the second path
 * points to a list of field instances. This list already contains the instance
 * Group[1]/Field[1], so that specific path can be removed.
 *
 * Note:
 * 1) Duplicates are not eliminated here, because the RelevantFieldsCollector
 *    already ensures lists without duplicates.
 * 2) Removing such unnecessary paths is necessary, so that the Kernel correctly
 *    handles paths with 0 indices.
 */
export function getEffectiveRelevantFields(
	relevantPaths: EntityInstancePath[]
): EntityInstancePath[] {
	// paths with at least one 0 index
	const genericPaths = relevantPaths.filter(p => isGenericPath(p));

	return relevantPaths.filter(
		p => isGenericPath(p) || !genericPaths.some(gp => DocumentPath.matches(p, gp))
	);

	function isGenericPath(path: EntityInstancePath): boolean {
		return path.some(e => e.index === 0);
	}
}
