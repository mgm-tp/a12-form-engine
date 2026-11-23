// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.migration;

import com.mgmtp.a12.kernel.core.parsetree.a12internal.api.IEntityId;
import com.mgmtp.a12.kernel.core.parsetree.a12internal.api.IEntityIdList;
import com.mgmtp.a12.kernel.core.parsetree.a12internal.ast.ASTVisitor;

import java.util.HashSet;
import java.util.Set;

/**
 * Collects all groups and field references in a validation language AST
 */
class ElementReferenceCollectionVisitor extends ASTVisitor {

	private final Set<IEntityId> collectedEntities = new HashSet<>();

	public boolean visit(IEntityId p) {
		collectedEntities.add(p);
		return visitGeneral(p);
	}

	public boolean visit(IEntityIdList p) {
		collectedEntities.addAll(p.getEntityIdList());
		return visitGeneral(p);
	}

	Set<IEntityId> getCollectedEntities() {
		return collectedEntities;
	}
}
