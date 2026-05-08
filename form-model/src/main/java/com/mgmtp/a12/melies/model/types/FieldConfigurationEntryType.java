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
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import com.mgmtp.a12.model.header.Annotation;

public class FieldConfigurationEntryType implements Serializable, Annotated {

	private final static long serialVersionUID = 4275561475137693259L;
	protected MultilingualTextType suffix;
	protected LabelType label;
	protected MultilingualTextType hint;
	protected String initialValue;
	protected ExpositionPresentationEnumType exposition;
	protected String readonly;
	protected String secret;
	protected MultilingualTextType placeholder;
	protected DependentEnumerationType dependentEnumeration;
	protected ExternalEnumerationType externalEnumeration;
	protected DependentFieldType dependentField;
	protected List<Annotation> annotations;
	protected String elementRef;
	protected String enableSelectAll;
	protected AttachmentConfigType attachmentConfig;

	public LabelType getLabel() {
		return label;
	}

	public void setLabel(final LabelType value) {
		this.label = value;
	}

	public boolean isLabelSet() {
		return (this.label != null);
	}

	public MultilingualTextType getHint() {
		return hint;
	}

	public void setHint(final MultilingualTextType value) {
		this.hint = value;
	}

	public boolean isHintSet() {
		return (this.hint != null);
	}

	public String getInitialValue() {
		return initialValue;
	}

	public void setInitialValue(final String value) {
		this.initialValue = value;
	}

	public boolean isInitialValueSet() {
		return (this.initialValue != null);
	}

	public ExpositionPresentationEnumType getExposition() {
		return exposition;
	}

	public void setExposition(final ExpositionPresentationEnumType value) {
		this.exposition = value;
	}

	public boolean isExpositionSet() {
		return (this.exposition != null);
	}

	public String getReadonly() {
		return readonly;
	}

	public void setReadonly(final String value) {
		this.readonly = value;
	}

	public boolean isReadonlySet() {
		return (this.readonly != null);
	}

	public String getSecret() {
		return secret;
	}

	public void setSecret(final String value) {
		this.secret = value;
	}

	public boolean isSecretSet() {
		return (this.secret != null);
	}

	public MultilingualTextType getSuffix() {
		return suffix;
	}

	public void setSuffix(final MultilingualTextType value) {
		this.suffix = value;
	}

	public boolean isSuffixSet() {
		return (this.suffix != null);
	}

	public MultilingualTextType getPlaceholder() {
		return placeholder;
	}

	public void setPlaceholder(final MultilingualTextType value) {
		this.placeholder = value;
	}

	public boolean isPlaceholderSet() {
		return (this.placeholder != null);
	}

	public DependentEnumerationType getDependentEnumeration() {
		return dependentEnumeration;
	}

	public void setDependentEnumeration(final DependentEnumerationType value) {
		this.dependentEnumeration = value;
	}

	public boolean isDependentEnumerationSet() {
		return (this.dependentEnumeration != null);
	}

	public ExternalEnumerationType getExternalEnumeration() {
		return externalEnumeration;
	}

	public void setExternalEnumeration(final ExternalEnumerationType value) {
		this.externalEnumeration = value;
	}

	public boolean isExternalEnumerationSet() {
		return (this.externalEnumeration != null);
	}

	public DependentFieldType getDependentField() {
		return dependentField;
	}

	public void setDependentField(final DependentFieldType value) {
		this.dependentField = value;
	}

	public boolean isDependentFieldSet() {
		return (this.dependentField != null);
	}

	public List<Annotation> getAnnotations() {
		if (annotations == null) {
			annotations = new ArrayList<Annotation>();
		}
		return this.annotations;
	}

	public boolean isAnnotationSet() {
		return ((this.annotations != null) && (!this.annotations.isEmpty()));
	}

	public void unsetAnnotation() {
		this.annotations = null;
	}

	public String getElementRef() {
		return elementRef;
	}

	public void setElementRef(final String value) {
		this.elementRef = value;
	}

	public boolean isElementRefSet() {
		return (this.elementRef != null);
	}

	public String getEnableSelectAll() {
		return enableSelectAll;
	}

	public void setEnableSelectAll(String enableSelectAll) {
		this.enableSelectAll = enableSelectAll;
	}

	public boolean isEnableSelectAllSet() {
		return (this.enableSelectAll != null);
	}

	public AttachmentConfigType getAttachmentConfig() {
		return attachmentConfig;
	}

	public void setAttachmentConfig(AttachmentConfigType attachmentConfig) {
		this.attachmentConfig = attachmentConfig;
	}

	public boolean isAttachmentConfigSet() {
		return (this.attachmentConfig != null);
	}

	public FieldConfigurationEntryType withLabel(final LabelType value) {
		setLabel(value);
		return this;
	}

	public FieldConfigurationEntryType withHint(final MultilingualTextType value) {
		setHint(value);
		return this;
	}

	public FieldConfigurationEntryType withInitialValue(final String value) {
		setInitialValue(value);
		return this;
	}

	public FieldConfigurationEntryType withExposition(final ExpositionPresentationEnumType value) {
		setExposition(value);
		return this;
	}

	public FieldConfigurationEntryType withReadonly(final String value) {
		setReadonly(value);
		return this;
	}

	public FieldConfigurationEntryType withSecret(final String value) {
		setSecret(value);
		return this;
	}

	public FieldConfigurationEntryType withSuffix(final MultilingualTextType value) {
		setSuffix(value);
		return this;
	}

	public FieldConfigurationEntryType withPlaceholder(final MultilingualTextType value) {
		setPlaceholder(value);
		return this;
	}

	public FieldConfigurationEntryType withDependentEnumeration(final DependentEnumerationType value) {
		setDependentEnumeration(value);
		return this;
	}

	public FieldConfigurationEntryType withExternalEnumeration(final ExternalEnumerationType value) {
		setExternalEnumeration(value);
		return this;
	}

	public FieldConfigurationEntryType withDependentField(final DependentFieldType value) {
		setDependentField(value);
		return this;
	}

	public FieldConfigurationEntryType withAnnotation(final Annotation... values) {
		if (values != null) {
			for (final Annotation value : values) {
				getAnnotations().add(value);
			}
		}
		return this;
	}

	public FieldConfigurationEntryType withAnnotation(final Collection<Annotation> values) {
		if (values != null) {
			getAnnotations().addAll(values);
		}
		return this;
	}

	public FieldConfigurationEntryType withElementRef(final String value) {
		setElementRef(value);
		return this;
	}

	public FieldConfigurationEntryType withEnableSelectAll(final String value) {
		setEnableSelectAll(value);
		return this;
	}

	public FieldConfigurationEntryType withAttachmentConfig(final AttachmentConfigType attachmentConfig) {
		setAttachmentConfig(attachmentConfig);
		return this;
	}

}
