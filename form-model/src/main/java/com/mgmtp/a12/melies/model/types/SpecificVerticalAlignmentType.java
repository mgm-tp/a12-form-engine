// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

import java.io.Serializable;

public class SpecificVerticalAlignmentType implements Serializable {

	private static final long serialVersionUID = -5149538746455973248L;

	protected VerticalAlignmentType head;
	protected VerticalAlignmentType body;

	public VerticalAlignmentType getHead() {
		return head;
	}

	public void setHead(final VerticalAlignmentType head) {
		this.head = head;
	}

	public boolean isHeadSet() {
		return (this.head != null);
	}

	public VerticalAlignmentType getBody() {
		return body;
	}

	public void setBody(final VerticalAlignmentType body) {
		this.body = body;
	}

	public boolean isBodySet() {
		return (this.body != null);
	}

	public SpecificVerticalAlignmentType withHead(final VerticalAlignmentType head) {
		setHead(head);
		return this;
	}

	public SpecificVerticalAlignmentType withBody(final VerticalAlignmentType body) {
		setBody(body);
		return this;
	}
}
