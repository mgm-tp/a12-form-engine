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
 * 1. Open-Source License – EUPL v1.2
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
