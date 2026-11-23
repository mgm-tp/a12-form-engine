// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
