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
