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

import com.mgmtp.a12.model.header.Annotation;

import java.io.Serializable;
import java.util.Collection;
import java.util.List;

public class ButtonPanelType extends ScreenElementType implements Serializable {

	private final static long serialVersionUID = 8232763281590907034L;
	private List<ButtonType> button = new ButtonPanelList(this);

	public ButtonPanelType() {
	}

	public List<ButtonType> getButton() {
		if (button == null) {
			button = new ButtonPanelList(this);
		}
		return button;
	}

	public boolean isButtonSet() {
		return ((this.button != null) && (!this.button.isEmpty()));
	}

	public void unsetButton() {
		this.button = null;
	}

	public ButtonPanelType withButton(final ButtonType... values) {
		if (values != null) {
			for (final ButtonType value : values) {
				getButton().add(value);
			}
		}
		return this;
	}

	public ButtonPanelType withButton(final Collection<ButtonType> values) {
		if (values != null) {
			getButton().addAll(values);
		}
		return this;
	}

	@Override
	public ButtonPanelType withTitle(final LabelType value) {
		setTitle(value);
		return this;
	}

	@Override
	public ButtonPanelType withStyle(final StyleType... values) {
		if (values != null) {
			for (final StyleType value : values) {
				getStyle().add(value);
			}
		}
		return this;
	}

	@Override
	public ButtonPanelType withStyle(final Collection<StyleType> values) {
		if (values != null) {
			getStyle().addAll(values);
		}
		return this;
	}

	@Override
	public ButtonPanelType withReadonly(final String value) {
		setReadonly(value);
		return this;
	}

	@Override
	public ButtonPanelType withAnnotation(final Annotation... values) {
		if (values != null) {
			for (final Annotation value : values) {
				getAnnotations().add(value);
			}
		}
		return this;
	}

	@Override
	public ButtonPanelType withAnnotation(final Collection<Annotation> values) {
		if (values != null) {
			getAnnotations().addAll(values);
		}
		return this;
	}

	@Override
	public ButtonPanelType withId(final String value) {
		setId(value);
		return this;
	}

	@Override
	public ButtonPanelType withName(final String value) {
		setName(value);
		return this;
	}

	private static class ButtonPanelList extends NodeTreeList<ButtonType> {

		private final ButtonPanelType owner;

		public ButtonPanelList(final ButtonPanelType owner) {
			this.owner = owner;
		}

		@Override
		protected void onAdd(final ButtonType e) {
			if (e.getParent() != null) {
				throw new IllegalArgumentException("cannot add a button whose parent is already set");
			}
			e.setParent(owner);
		}

		@Override
		protected void onRemove(final ButtonType e) {
			e.setParent(null);
		}
	}
}
