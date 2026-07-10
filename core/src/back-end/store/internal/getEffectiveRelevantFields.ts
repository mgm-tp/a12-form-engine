/*
 * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
 *
 * Copyright (c) 2012-2026 mgm technology partners GmbH
 *
 * Dual License
 * ------------
 * This source file is part of the mgm A12 Platform and available under
 * a choice of two different licenses:
 *
 * 1. Open-Source License - EUPL v1.2
 *    You may redistribute and/or modify this file under the terms of the
 *    European Union Public License, version 1.2 - see https://eupl.eu/.
 *
 * 2. Commercial License
 *    Alternatively, you may obtain a commercial license from
 *    mgm technology partners GmbH, that permits use of this software
 *    under different terms (including support and maintenance services).
 *
 *    Please contact a12-license@mgm-tp.com for more information.
 *
 * You must select and comply with exactly one of the above license options.
 *
 * Warranty Disclaimer (applies to either option)
 * ----------------------------------------------
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF ANY KIND,
 * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE
 * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.
 */

import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade";

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
	const isGenericPath = (path: EntityInstancePath): boolean => {
		return path.some(e => e.index === 0);
	};

	// paths with at least one 0 index
	const genericPaths = relevantPaths.filter(p => isGenericPath(p));

	return relevantPaths.filter(
		relevantPath =>
			isGenericPath(relevantPath) ||
			!genericPaths.some(genericPath => DocumentPath.matches(relevantPath, genericPath))
	);
}
