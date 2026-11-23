// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

/**
 * Generic tree view that allows walking up in the hierarchical structure of a {@link
 * com.mgmtp.a12.melies.model.types.ModelType}.
 * <p>
 * Although this hierarchy is the equivalent of the document model {@link com.mgmtp.a12.picus.model.types.TreeNode} - there are
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
