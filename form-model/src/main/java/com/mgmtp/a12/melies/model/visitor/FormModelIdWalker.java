// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.visitor;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.types.Id;
import com.mgmtp.a12.melies.model.types.ScreenElementType;

import java.util.function.Consumer;

/**
 * Traverses elements of a {@link com.mgmtp.a12.model.ui.form.FormModel} recursively, collecting all instances of {@link Id}.
 * Can be used to collect all IDs of a form model.
 */
public class FormModelIdWalker {

	private final Consumer<Id> visit;

	public FormModelIdWalker(final Consumer<Id> visit) {
		this.visit = visit;
	}

	public void accept(final ScreenElementType screenElement) {
		new ModelWalker(new IdSearchVisitor(visit)).acceptScreenElement(screenElement);
	}

	public void accept(final MeliesModel model) {
		new ModelWalker(new IdSearchVisitor(visit)).acceptModel(model);
	}

	private static class IdSearchVisitor extends ModelVisitor {

		private final Consumer<Id> visit;

		IdSearchVisitor(final Consumer<Id> visit) {
			this.visit = visit;
		}

		public void enter(final Object obj) {
			if (obj instanceof Id) {
				visit.accept((Id) obj);
			}
		}
	}
}
