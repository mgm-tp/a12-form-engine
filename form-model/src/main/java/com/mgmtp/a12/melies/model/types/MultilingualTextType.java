// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class MultilingualTextType implements Serializable {

	private final static long serialVersionUID = -7634998985955879963L;

	protected List<TextType> text;

	public List<TextType> getText() {
		if (text == null) {
			text = new ArrayList<TextType>();
		}
		return this.text;
	}

	public boolean isTextSet() {
		return ((this.text != null) && (!this.text.isEmpty()));
	}

	public void unsetText() {
		this.text = null;
	}

	public MultilingualTextType withText(final TextType... values) {
		if (values != null) {
			for (final TextType value : values) {
				getText().add(value);
			}
		}
		return this;
	}

	public MultilingualTextType withText(final Collection<TextType> values) {
		if (values != null) {
			getText().addAll(values);
		}
		return this;
	}

}
