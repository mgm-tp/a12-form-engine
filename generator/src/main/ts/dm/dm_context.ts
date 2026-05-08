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
 * 1. Open-Source License – EUPL v1.2
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

import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import { isGroup } from "./dm_types.js";

/**
 * These functions for DM elements are sensitive to the position of the element
 * in the document model.
 *
 * When calling the factory function DocumentModelContextAPI, a map to lookup
 * the parent element is constructed.
 */
export function DocumentModelContextAPI(dm: DocumentModel) {
	const parents = collectParents(dm);

	// determine if the given element or an ancestor has readonly semantics
	const isReadonly: DocumentModelPredicate = element => {
		const parent = getParent(element);
		return isDirectlyReadonly(element) || (parent !== undefined && isReadonly(parent));
	};

	function isDirectlyReadonly(e: DocumentModel.Element): boolean {
		return isGroup(e) && e.usageType === "metadata";
	}

	function getParent(e: DocumentModel.Element) {
		return parents[e.id];
	}

	return {
		isReadonly
	};
}

export type DocumentModelPredicate = (e: DocumentModel.Element) => boolean;

// lookup map element id -> parent element
type ElementParentById = Record<string, DocumentModel.Group | undefined>;

// walk the model and, for each element, collect the parent element
function collectParents(dm: DocumentModel) {
	const parents: ElementParentById = {};

	const addParent: ParentVisitor = (parent, element) => {
		parents[element.id] = parent;
	};

	ParentWalker(dm, addParent).walk();

	return parents;
}

type ParentVisitor = (parent: DocumentModel.Group, element: DocumentModel.Element) => void;

// walker part (no side-effects)
function ParentWalker(dm: DocumentModel, v: ParentVisitor) {
	return {
		walk
	};

	function walk() {
		walkRecursively(dm.content.modelRoot);
	}

	function walkRecursively(group: DocumentModel.Group): void {
		group.elements.forEach(e => {
			v(group, e);
			if (isGroup(e)) {
				walkRecursively(e);
			}
		});
	}
}
