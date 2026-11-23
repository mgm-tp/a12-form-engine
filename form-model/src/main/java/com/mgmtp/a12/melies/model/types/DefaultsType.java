// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

import java.io.Serializable;

public class DefaultsType implements Serializable {
	private static final long serialVersionUID = 8663378482024370003L;

	protected RepeatButtonLabelsType buttonLabels;
	protected ConfirmationTextsType confirmationTexts;

	public RepeatButtonLabelsType getButtonLabels() {
		return this.buttonLabels;
	}

	public void setButtonLabels(final RepeatButtonLabelsType buttonLabels) {
		this.buttonLabels = buttonLabels;
	}

	public boolean isButtonLabelsSet() {
		return (this.buttonLabels != null);
	}

	public DefaultsType withButtonLabels(final RepeatButtonLabelsType value) {
		setButtonLabels(value);
		return this;
	}

	public ConfirmationTextsType getConfirmationTexts() {
		return this.confirmationTexts;
	}

	public void setConfirmationTexts(final ConfirmationTextsType confirmationTexts) {
		this.confirmationTexts = confirmationTexts;
	}

	public boolean isConfirmationTextsSet() {
		return (this.confirmationTexts != null);
	}

	public DefaultsType withConfirmationTexts(final ConfirmationTextsType value) {
		this.setConfirmationTexts(value);
		return this;
	}
}
