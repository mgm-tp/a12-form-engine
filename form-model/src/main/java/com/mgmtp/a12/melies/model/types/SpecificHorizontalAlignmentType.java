// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

import java.io.Serializable;

public class SpecificHorizontalAlignmentType implements Serializable {

	private final static long serialVersionUID = 3032626941310686564L;

	protected HorizontalAlignmentType head;
	protected HorizontalAlignmentType body;

	public HorizontalAlignmentType getHead() {
		return head;
	}

	public void setHead(final HorizontalAlignmentType head) {
		this.head = head;
	}

	public boolean isHeadSet() {
		return (this.head != null);
	}

	public HorizontalAlignmentType getBody() {
		return body;
	}

	public void setBody(final HorizontalAlignmentType body) {
		this.body = body;
	}

	public boolean isBodySet() {
		return (this.body != null);
	}

	public SpecificHorizontalAlignmentType withHead(final HorizontalAlignmentType head) {
		setHead(head);
		return this;
	}

	public SpecificHorizontalAlignmentType withBody(final HorizontalAlignmentType body) {
		setBody(body);
		return this;
	}
}
