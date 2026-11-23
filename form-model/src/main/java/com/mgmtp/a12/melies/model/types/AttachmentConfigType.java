// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

import java.io.Serializable;

public class AttachmentConfigType implements Serializable {

	private static final long serialVersionUID = -6143034424706065095L;

	protected PlaceholderIconEnumType placeholderIcon;
	protected String accept;
	protected AttachmentDefaultActionEnumType defaultAction;

	public PlaceholderIconEnumType getPlaceholderIcon() {
		return placeholderIcon;
	}

	public void setPlaceholderIcon(PlaceholderIconEnumType placeholderIcon) {
		this.placeholderIcon = placeholderIcon;
	}

	public boolean isPlaceholderIconSet() {
		return (this.placeholderIcon != null);
	}

	public String getAccept() {
		return accept;
	}

	public void setAccept(String accept) {
		this.accept = accept;
	}

	public boolean isAcceptSet() {
		return (this.accept != null);
	}
	
	public AttachmentDefaultActionEnumType getDefaultAction() {
		return defaultAction;
	}

	public void setDefaultAction(AttachmentDefaultActionEnumType defaultAction) {
		this.defaultAction = defaultAction;
	}

	public boolean isDefaultActionSet() {
		return (this.defaultAction != null);
	}

	public AttachmentConfigType withPlaceholderIcon(PlaceholderIconEnumType placeholderIcon) {
		setPlaceholderIcon(placeholderIcon);
		return this;
	}

	public AttachmentConfigType withAccept(String accept) {
		setAccept(accept);
		return this;
	}
	
	public AttachmentConfigType withDefaultAction(AttachmentDefaultActionEnumType defaultAction) {
		setDefaultAction(defaultAction);
		return this;
	}
}
