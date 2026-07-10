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
package com.mgmtp.a12.formengine.model.types;

/**
 * Generic tree view that allows walking up in the hierarchical structure of a {@link
 * com.mgmtp.a12.formengine.model.types.ModelType}.
 * <p>
 * Although this hierarchy is the equivalent of the document model TreeNode - there are
 * some important differences: <ul> <li>There is no common "element" base class, i.e. no equivalent of document model
 * <code>ElementType</code>. <li>Some model elements (e.g. ButtonType) are intentionally excluded from the tree node
 * hierarchy. Inspect the hierarchy of TreeNode to see which elements are included. <li>In some cases the tree node
 * structure differs from the containment structure, e.g. the parent tree node of ControlType and RowType is the
 * containing ControlGridType - even though controls are sub elements of rows. </ul>
 */
public interface TreeNode {
	/**
	 * Return the immediate ancestor (parent) node.
	 *
	 * @return the parent or null if this node is a top level node
	 */
	TreeNode getParentNode();

	/**
	 * Create a detached copy of this TreeNode.
	 */
	TreeNode copy();
}
