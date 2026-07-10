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
 * 1. Open-Source License - EUPL v1.2
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
package com.mgmtp.a12.formengine.model.types;

import com.mgmtp.a12.model.header.Annotation;

import java.io.Serial;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class ControlType extends CellType implements FieldBasedInput {

	@Serial
	private static final long serialVersionUID = 2996901814313138614L;

	// FieldBased Input properties
	protected LabelType label;
	protected MultilingualTextType hint;
	protected List<StyleType> style;
	protected String readonly;
	protected String secret;
	protected DatePickerConfigurationType datePickerConfig;
	protected MessageExpositionEnumType messageExposition;
	protected String autoExpand;
	protected String truncateSuffix;
	protected String elementRef;
	protected String autoComplete;
	protected ControlIndexType index;
	protected MarkingOfRequiredFieldsEnumType markingOfRequiredFields;

	// Other properties
	protected String tooltipsOnTop;
	protected String labelHiddenButRead;
	protected ReadonlyPresentationEnumType readonlyPresentation;
	protected ExpositionPresentationEnumType exposition;
	protected DependentControlsType dependentControls;

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

	public List<StyleType> getStyle() {
		if (style == null) {
			style = new ArrayList<StyleType>();
		}
		return this.style;
	}

	public boolean isStyleSet() {
		return ((this.style != null) && (!this.style.isEmpty()));
	}

	public void unsetStyle() {
		this.style = null;
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

	public DatePickerConfigurationType getDatePickerConfig() {
		return datePickerConfig;
	}

	public void setDatePickerConfig(final DatePickerConfigurationType value) {
		this.datePickerConfig = value;
	}

	public boolean isDatePickerConfigSet() {
		return (this.datePickerConfig != null);
	}

	public MessageExpositionEnumType getMessageExposition() {
		return messageExposition;
	}

	public void setMessageExposition(final MessageExpositionEnumType value) {
		this.messageExposition = value;
	}

	public boolean isMessageExpositionSet() {
		return (this.messageExposition != null);
	}

	public String getTooltipsOnTop() {
		return tooltipsOnTop;
	}

	public void setTooltipsOnTop(final String value) {
		this.tooltipsOnTop = value;
	}

	public boolean isTooltipsOnTopSet() {
		return (this.tooltipsOnTop != null);
	}

	public String getLabelHiddenButRead() {
		return labelHiddenButRead;
	}

	public void setLabelHiddenButRead(final String value) {
		this.labelHiddenButRead = value;
	}

	public boolean isLabelHiddenButReadSet() {
		return (this.labelHiddenButRead != null);
	}

	public String getAutoExpand() {
		return autoExpand;
	}

	public void setAutoExpand(final String value) {
		this.autoExpand = value;
	}

	public boolean isAutoExpandSet() {
		return (this.autoExpand != null);
	}

	public String getTruncateSuffix() {
		return truncateSuffix;
	}

	public void setTruncateSuffix(final String value) {
		this.truncateSuffix = value;
	}

	public boolean isTruncateSuffixSet() {
		return (this.truncateSuffix != null);
	}

	public DependentControlsType getDependentControls() {
		return dependentControls;
	}

	public void setDependentControls(final DependentControlsType value) {
		this.dependentControls = value;
	}

	public boolean isDependentControlsSet() {
		return (this.dependentControls != null);
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

	public String getAutoComplete() {
		return autoComplete;
	}

	public void setAutoComplete(String value) {
		this.autoComplete = value;
	}

	public boolean isAutoCompleteSet() {
		return (this.autoComplete != null);
	}

	public ReadonlyPresentationEnumType getReadonlyPresentation() {
		return readonlyPresentation;
	}

	public void setReadonlyPresentation(final ReadonlyPresentationEnumType value) {
		this.readonlyPresentation = value;
	}

	public boolean isReadonlyPresentationSet() {
		return (this.readonlyPresentation != null);
	}

	public ControlIndexType getIndex() {
		return index;
	}

	public void setIndex(ControlIndexType index) {
		this.index = index;
	}

	public Boolean isIndexSet() {
		return (this.index != null);
	}

	@Override
	public MarkingOfRequiredFieldsEnumType getMarkingOfRequiredFields() {
		return markingOfRequiredFields;
	}

	@Override
	public void setMarkingOfRequiredFields(final MarkingOfRequiredFieldsEnumType value) {
		this.markingOfRequiredFields = value;
	}

	@Override
	public boolean isMarkingOfRequiredFieldsSet() {
		return markingOfRequiredFields != null;
	}

	public ControlType withLabel(final LabelType value) {
		setLabel(value);
		return this;
	}

	public ControlType withHint(final MultilingualTextType value) {
		setHint(value);
		return this;
	}

	public ControlType withStyle(final StyleType... values) {
		if (values != null) {
			for (final StyleType value : values) {
				getStyle().add(value);
			}
		}
		return this;
	}

	public ControlType withStyle(final Collection<StyleType> values) {
		if (values != null) {
			getStyle().addAll(values);
		}
		return this;
	}

	public ControlType withExposition(final ExpositionPresentationEnumType value) {
		setExposition(value);
		return this;
	}

	public ControlType withReadonly(final String value) {
		setReadonly(value);
		return this;
	}

	public ControlType withSecret(final String value) {
		setSecret(value);
		return this;
	}

	public ControlType withDatePickerConfig(final DatePickerConfigurationType value) {
		setDatePickerConfig(value);
		return this;
	}

	public ControlType withMessageExposition(final MessageExpositionEnumType value) {
		setMessageExposition(value);
		return this;
	}

	public ControlType withTooltipsOnTop(final String value) {
		setTooltipsOnTop(value);
		return this;
	}

	public ControlType withLabelHiddenButRead(final String value) {
		setLabelHiddenButRead(value);
		return this;
	}

	public ControlType withAutoExpand(final String value) {
		setAutoExpand(value);
		return this;
	}

	public ControlType withTruncateSuffix(final String value) {
		setTruncateSuffix(value);
		return this;
	}

	public ControlType withDependentControls(final DependentControlsType value) {
		setDependentControls(value);
		return this;
	}

	public ControlType withElementRef(final String value) {
		setElementRef(value);
		return this;
	}

	@Override
	public ControlType withAnnotation(final Annotation... values) {
		if (values != null) {
			for (final Annotation value : values) {
				getAnnotations().add(value);
			}
		}
		return this;
	}

	@Override
	public ControlType withAnnotation(final Collection<Annotation> values) {
		if (values != null) {
			getAnnotations().addAll(values);
		}
		return this;
	}

	@Override
	public ControlType withOffset(final SizedIntegerType value) {
		setOffset(value);
		return this;
	}

	@Override
	public ControlType withSpan(final SizedIntegerType value) {
		setSpan(value);
		return this;
	}

	@Override
	public ControlType withId(final String value) {
		setId(value);
		return this;
	}

	public ControlType withReadonlyPresentation(final ReadonlyPresentationEnumType value) {
		setReadonlyPresentation(value);
		return this;
	}

	public ControlType withIndex(final ControlIndexType value) {
		setIndex(value);
		return this;
	}

	public ControlType withMarkingOfRequiredFields(final MarkingOfRequiredFieldsEnumType value) {
		setMarkingOfRequiredFields(value);
		return this;
	}
}
