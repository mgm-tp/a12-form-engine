// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

import java.io.Serializable;
import java.util.Collection;
import java.util.List;

import com.mgmtp.a12.model.header.Annotation;

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
