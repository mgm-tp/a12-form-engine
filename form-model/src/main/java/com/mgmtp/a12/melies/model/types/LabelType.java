// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

import java.io.Serializable;

public class LabelType implements Serializable {

	private static final long serialVersionUID = -998364455104772351L;
	protected LabelEnumType type;
	protected MultilingualTextType multilingualText;
	protected String expressionText;

	public LabelEnumType getType() {
		return type;
	}

	public void setType(LabelEnumType type) {
		this.type = type;
	}

	public boolean isTypeSet() {
		return (this.type != null);
	}

	public MultilingualTextType getMultilingualText() {
		return multilingualText;
	}

	public void setMultilingualText(MultilingualTextType multilingualText) {
		this.multilingualText = multilingualText;
	}

	public boolean isMultilingualTextSet() {
		return (this.multilingualText != null);
	}

	public String getExpressionText() {
		return expressionText;
	}

	public void setExpressionText(String expressionText) {
		this.expressionText = expressionText;
	}

	public boolean isExpressionTextSet() {
		return (this.expressionText != null);
	}

	public LabelType withType(LabelEnumType type) {
		setType(type);
		return this;
	}

	public LabelType withMultilingualText(MultilingualTextType multilingualText) {
		setMultilingualText(multilingualText);
		return this;
	}

	public LabelType withExpressionText(String expressionText) {
		setExpressionText(expressionText);
		return this;
	}
}
