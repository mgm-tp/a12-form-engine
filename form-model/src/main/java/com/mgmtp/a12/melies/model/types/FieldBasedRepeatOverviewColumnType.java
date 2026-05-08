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

import com.mgmtp.a12.model.header.Annotation;

import java.io.Serial;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class FieldBasedRepeatOverviewColumnType extends RepeatOverviewColumnType
	implements FieldBasedInput {

	@Serial
	private static final long serialVersionUID = 1902156415662713196L;

	// FieldBased Input properties
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
	protected MarkingOfRequiredFieldsEnumType markingOfRequiredFields;

	protected ReadonlyPresentationEnumType readonlyPresentation;
	protected Boolean showCommaSeparated;
	protected Boolean showSummary;
	protected ExpositionPresentationEnumType exposition;
	protected FilterExpositionEnumType filterExposition;

	public DatePickerConfigurationType getDatePickerConfig() {
		return datePickerConfig;
	}

	public void setDatePickerConfig(final DatePickerConfigurationType value) {
		this.datePickerConfig = value;
	}

	public boolean isDatePickerConfigSet() {
		return (this.datePickerConfig != null);
	}

	public List<StyleType> getStyle() {
		if (style == null) {
			style = new ArrayList<>();
		}
		return this.style;
	}

	public boolean isStyleSet() {
		return ((this.style != null) && (!this.style.isEmpty()));
	}

	public void unsetStyle() {
		this.style = null;
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

	public String getReadonly() {
		return readonly;
	}

	public void setReadonly(final String value) {
		this.readonly = value;
	}

	public boolean isReadonlySet() {
		return (this.readonly != null);
	}

	public ReadonlyPresentationEnumType getReadonlyPresentation() {
		return readonlyPresentation;
	}

	public void setReadonlyPresentation(ReadonlyPresentationEnumType readonlyPresentation) {
		this.readonlyPresentation = readonlyPresentation;
	}

	public boolean isReadonlyPresentationSet() {
		return (this.readonlyPresentation != null);
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

	public MultilingualTextType getHint() {
		return hint;
	}

	public void setHint(final MultilingualTextType value) {
		this.hint = value;
	}

	public boolean isHintSet() {
		return (this.hint != null);
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

	public Boolean getShowCommaSeparated() {
		return showCommaSeparated;
	}

	public void setShowCommaSeparated(final Boolean value) {
		showCommaSeparated = value;
	}

	public boolean isShowCommaSeparatedSet() {
		return (this.showCommaSeparated != null);
	}

	public Boolean getShowSummary() {
		return showSummary;
	}

	public void setShowSummary(final Boolean value) {
		showSummary = value;
	}

	public boolean isShowSummarySet() {
		return (this.showSummary != null);
	}

	public ExpositionPresentationEnumType getExposition() {
		return exposition;
	}

	public void setExposition(final ExpositionPresentationEnumType value) {
		exposition = value;
	}

	public boolean isExpositionSet() {
		return (this.exposition != null);
	}

	public FilterExpositionEnumType getFilterExposition() {
		return filterExposition;
	}

	public void setExposition(final FilterExpositionEnumType value) {
		filterExposition = value;
	}

	public boolean isFilterExpositionSet() {
		return (this.filterExposition != null);
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

	public FieldBasedRepeatOverviewColumnType withDatePickerConfig(final DatePickerConfigurationType value) {
		setDatePickerConfig(value);
		return this;
	}

	public FieldBasedRepeatOverviewColumnType withStyle(final StyleType... values) {
		if (values != null) {
			for (final StyleType value : values) {
				getStyle().add(value);
			}
		}
		return this;
	}

	public FieldBasedRepeatOverviewColumnType withStyle(final Collection<StyleType> values) {
		if (values != null) {
			getStyle().addAll(values);
		}
		return this;
	}

	public FieldBasedRepeatOverviewColumnType withMessageExposition(final MessageExpositionEnumType value) {
		setMessageExposition(value);
		return this;
	}

	public FieldBasedRepeatOverviewColumnType withAutoExpand(final String value) {
		setAutoExpand(value);
		return this;
	}

	public FieldBasedRepeatOverviewColumnType withTruncateSuffix(final String value) {
		setTruncateSuffix(value);
		return this;
	}

	public FieldBasedRepeatOverviewColumnType withReadonly(final String value) {
		setReadonly(value);
		return this;
	}

	public FieldBasedRepeatOverviewColumnType withElementRef(final String value) {
		setElementRef(value);
		return this;
	}

	@Override
	public FieldBasedRepeatOverviewColumnType withAnnotation(final Annotation... values) {
		if (values != null) {
			for (final Annotation value : values) {
				getAnnotations().add(value);
			}
		}
		return this;
	}

	@Override
	public FieldBasedRepeatOverviewColumnType withAnnotation(final Collection<Annotation> values) {
		if (values != null) {
			getAnnotations().addAll(values);
		}
		return this;
	}

	@Override
	public FieldBasedRepeatOverviewColumnType withId(final String value) {
		setId(value);
		return this;
	}

	@Override
	public FieldBasedRepeatOverviewColumnType withWidth(final float value) {
		setWidth(value);
		return this;
	}

	@Override
	public FieldBasedRepeatOverviewColumnType withSortable(final boolean value) {
		setSortable(value);
		return this;
	}

	@Override
	public FieldBasedRepeatOverviewColumnType withFilterable(final boolean value) {
		setFilterable(value);
		return this;
	}

	@Override
	public FieldBasedRepeatOverviewColumnType withPinDirection(final PinDirectionType value) {
		setPinDirection(value);
		return this;
	}

	@Override
	public FieldBasedRepeatOverviewColumnType withPreferredSorting(final PreferredSortingType value) {
		setPreferredSorting(value);
		return this;
	}

	@Override
	public FieldBasedRepeatOverviewColumnType withLabel(final LabelType value) {
		setLabel(value);
		return this;
	}

	public FieldBasedRepeatOverviewColumnType withHint(final MultilingualTextType value) {
		setHint(value);
		return this;
	}

	public FieldBasedRepeatOverviewColumnType withSecret(final String value) {
		setSecret(value);
		return this;
	}

	public FieldBasedRepeatOverviewColumnType withExposition(final ExpositionPresentationEnumType value) {
		setExposition(value);
		return this;
	}

	public FieldBasedRepeatOverviewColumnType withMarkingOfRequiredFields(final MarkingOfRequiredFieldsEnumType value) {
		setMarkingOfRequiredFields(value);
		return this;
	}
}
