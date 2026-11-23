// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model;

import com.mgmtp.a12.melies.model.types.Id;
import com.mgmtp.a12.melies.model.types.RowType;
import com.mgmtp.a12.melies.model.types.TreeNode;
import com.mgmtp.a12.melies.model.visitor.ModelVisitor;
import com.mgmtp.a12.melies.model.visitor.ModelWalker;
import com.mgmtp.a12.model.ui.form.serialization.FormModelJsonStreamSerializer;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.util.ArrayDeque;
import java.util.Deque;

/**
 * Test for ancestor relations. Loads the test model, traverses it and checks the synthetic parent attribute provided by
 * {@link TreeNode}.
 */
public class AncestorRelationTest {

	@Test
	public void test() {
		final MeliesModel model = load();
		new ModelWalker(new TestingVisitor<RowType>()).acceptScreenGroupRootElement(model.getContent().getScreens());
	}

	private MeliesModel load() {
		return (MeliesModel) new FormModelJsonStreamSerializer().deserialize(AncestorRelationTest.class.getResourceAsStream(
			"AncestorRelationTestMeliesModel.json"));
	}

	private static class TestingVisitor<T extends TreeNode & Id> extends ModelVisitor {
		private final Deque<T> stack = new ArrayDeque<>();
		private int level = 0;

		private static boolean isValidAncestor(final Object obj) {
			return !(obj instanceof RowType);
		}

		private static String id(final Object obj) {
			if (obj instanceof Id) {
				return ((Id) obj).getId();
			} else {
				return obj.getClass().getSimpleName();
			}
		}

		@Override
		public void enter(final Object obj) {
			if (obj instanceof TreeNode) {
				@SuppressWarnings("unchecked")
				final T node = (T) obj;
				@SuppressWarnings("unchecked")
				final T parent = (T) node.getParentNode();
				// EITHER parent must exist and match nearest ancestor on stack
				// OR if parent is null then is must be a top level element i.e. stack must be empty
				if (parent != null) {
					Assert.assertEquals(id(nearestAncestorOnStack()), id(parent));
				} else {
					Assert.assertTrue(stack.isEmpty());
				}
				stack.push(node);
			}

			level++;
		}

		@Override
		public void leave(final Object obj) {
			level--;
			if (obj instanceof TreeNode) {
				stack.pop();
			}
		}

		private T nearestAncestorOnStack() {
			for (final T t : stack) {
				if (isValidAncestor(t)) {
					return t;
				}
			}
			return null;
		}
	}
}
