// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

import java.io.Serializable;

public class MultiFileUploadOptionType implements Serializable {
	private static final long serialVersionUID = -4154024394474080554L;
	
	private String elementRef;
	private Boolean enableDownload;
	private MultilingualTextType fileUploadDescription;
	private Boolean hideFileUploadDescription;
	private MultilingualTextType fileUploadButtonText;
	private Boolean hideFileUploadButtonText;
	private MultilingualTextType fileUploadHelperText;
	
	public String getElementRef() {
		return elementRef;
	}
	
	public void setElementRef(String elementRef) {
		this.elementRef = elementRef;
	}
	
	public boolean isElementRefSet() {
		return (this.elementRef != null);
	}
	
	public Boolean getEnableDownload() {
		return enableDownload;
	}
	
	public void setEnableDownload(Boolean enableDownload) {
		this.enableDownload = enableDownload;
	}
	
	public boolean isEnableDownloadSet() {
		return (this.enableDownload != null);
	}
	
	public MultilingualTextType getFileUploadDescription() {
		return fileUploadDescription;
	}
	
	public void setFileUploadDescription(MultilingualTextType fileUploadDescription) {
		this.fileUploadDescription = fileUploadDescription;
	}
	
	public boolean isFileUploadDescriptionSet() {
		return (this.fileUploadDescription != null);
	}
	
	public Boolean getHideFileUploadDescription() {
		return hideFileUploadDescription;
	}
	
	public void setHideFileUploadDescription(Boolean hideFileUploadDescription) {
		this.hideFileUploadDescription = hideFileUploadDescription;
	}
	
	public boolean isHideFileUploadDescriptionSet() {
		return (this.hideFileUploadDescription != null);
	}
	
	public MultilingualTextType getFileUploadButtonText() {
		return fileUploadButtonText;
	}
	
	public void setFileUploadButtonText(MultilingualTextType fileUploadButtonText) {
		this.fileUploadButtonText = fileUploadButtonText;
	}
	
	public boolean isFileUploadButtonTextSet() {
		return (this.fileUploadButtonText != null);
	}
	
	public Boolean getHideFileUploadButtonText() {
		return hideFileUploadButtonText;
	}
	
	public void setHideFileUploadButtonText(Boolean hideFileUploadButtonText) {
		this.hideFileUploadButtonText = hideFileUploadButtonText;
	}
	
	public boolean isHideFileUploadButtonTextSet() {
		return (this.hideFileUploadButtonText != null);
	}
	
	public MultilingualTextType getFileUploadHelperText() {
		return fileUploadHelperText;
	}
	
	public void setFileUploadHelperText(MultilingualTextType fileUploadHelperText) {
		this.fileUploadHelperText = fileUploadHelperText;
	}
	
	public boolean isFileUploadHelperTextSet() {
		return (this.fileUploadHelperText != null);
	}
	
	public MultiFileUploadOptionType withElementRef(final String value) {
		setElementRef(value);
		return this;
	}
	
	public MultiFileUploadOptionType withEnableDownload(final Boolean value) {
		setEnableDownload(value);
		return this;
	}
	
	public MultiFileUploadOptionType withFileUploadDescription(final MultilingualTextType value) {
		setFileUploadDescription(value);
		return this;
	}
	
	public MultiFileUploadOptionType withHideFileUploadDescription(final Boolean value) {
		setHideFileUploadDescription(value);
		return this;
	}
	
	public MultiFileUploadOptionType withFileUploadButtonText(final MultilingualTextType value) {
		setFileUploadButtonText(value);
		return this;
	}
	
	public MultiFileUploadOptionType withHideFileUploadButtonText(final Boolean value) {
		setHideFileUploadButtonText(value);
		return this;
	}
	
	public MultiFileUploadOptionType withFileUploadHelperText(final MultilingualTextType value) {
		setFileUploadHelperText(value);
		return this;
	}
}
