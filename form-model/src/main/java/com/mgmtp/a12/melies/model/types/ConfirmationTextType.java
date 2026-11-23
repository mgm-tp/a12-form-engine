// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

import java.io.Serializable;

public class ConfirmationTextType implements Serializable {

	private static final long serialVersionUID = -640604025247212262L;
	protected MultilingualTextType title;
	protected MultilingualTextType message;

	public MultilingualTextType getMessage() {
		return message;
	}

	public void setMessage(final MultilingualTextType message) {
		this.message = message;
	}

	public ConfirmationTextType withMessage(final MultilingualTextType message) {
		this.setMessage(message);
		return this;
	}

	public MultilingualTextType getTitle() {
		return title;
	}

	public void setTitle(final MultilingualTextType title) {
		this.title = title;
	}

	public ConfirmationTextType withTitle(final MultilingualTextType title) {
		this.setTitle(title);
		return this;
	}
}
