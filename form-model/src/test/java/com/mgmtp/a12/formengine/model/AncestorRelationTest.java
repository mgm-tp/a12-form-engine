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
package com.mgmtp.a12.formengine.model;

import com.mgmtp.a12.formengine.model.types.Id;
import com.mgmtp.a12.formengine.model.types.RowType;
import com.mgmtp.a12.formengine.model.types.TreeNode;
import com.mgmtp.a12.formengine.model.visitor.ModelVisitor;
import com.mgmtp.a12.formengine.model.visitor.ModelWalker;
import com.mgmtp.a12.formengine.serialization.FormModelJsonStreamSerializer;

import java.util.ArrayDeque;
import java.util.Deque;

import org.testng.Assert;
import org.testng.annotations.Test;

/**
 * Test for ancestor relations. Loads the test model, traverses it and checks the synthetic parent attribute provided by
 * {@link TreeNode}.
 */
public class AncestorRelationTest {

	@Test
	public void test() {
		final FormModel model = load();
		new ModelWalker(new TestingVisitor<RowType>()).acceptScreenGroupRootElement(model.getContent().getScreens());
	}

	private FormModel load() {
		return new FormModelJsonStreamSerializer().deserialize(AncestorRelationTest.class.getResourceAsStream(
			"AncestorRelationTestFormModel.json"));
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
