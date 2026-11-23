// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.expression;

import javax.script.Bindings;
import java.util.ArrayList;
import java.util.List;

public class ExpressionUtil {

	public static ExpressionNode convertToNode(final Object obj) {

		final ExpressionNode node = new ExpressionNode();
		if (obj instanceof Bindings) {
			final Bindings bindings = (Bindings) obj;
			node.setType(bindings.get("type"));
			node.setName(bindings.get("name"));
			node.setContent(bindings.get("content"));
			node.setChildren(convertToNodes(bindings.get("children")));
		}

		return node;
	}

	private static List<ExpressionNode> convertToNodes(final Object children) {
		final List<ExpressionNode> childNodes = new ArrayList<>();

		if (children == null) {
			return childNodes;
		}

		for (final Object element : ((Bindings) children).values()) {
			childNodes.add(convertToNode(element));
		}

		return childNodes;
	}

}
