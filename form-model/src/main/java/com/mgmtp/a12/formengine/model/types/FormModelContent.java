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

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class FormModelContent implements Serializable, com.mgmtp.a12.model.Content {

	private final static long serialVersionUID = 4288081853936378386L;
	protected AmountSuffixType amountSuffix;
	protected List<StyleType> styles;
	protected LabelType subtitle;
	protected HeaderFooterType subHeaderBox;
	protected HeaderFooterType footerBox;
	protected List<ScreenType> screens = new ArrayList<>();
	protected FieldConfigurationType fieldConfiguration;
	protected GroupConfigurationType groupConfiguration;
	protected DefaultsType defaults;
	protected ReadonlyPresentationEnumType readonlyPresentation;
	protected ReadonlyPresentationEnumType inlineRepeatReadonlyPresentation;
	protected MarkingOfRequiredFieldsEnumType markingOfRequiredFields;
	protected DisableRuleConfirmationEnumType disableRuleConfirmation;
	protected Boolean hideConfirmationSummary;
	private EnablementEnumType detachedRepeatCommitButtonEnablement;
	protected OpenDocumentPreProcessingEnumType openNewDocumentPreProcessing;
	protected OpenDocumentPreProcessingEnumType openExistingDocumentPreProcessing;

	public AmountSuffixType getAmountSuffix() {
		return amountSuffix;
	}

	public void setAmountSuffix(final AmountSuffixType amountSuffix) {
		this.amountSuffix = amountSuffix;
	}

	public boolean isAmountSuffixSet() {
		return (this.amountSuffix != null);
	}

	public List<StyleType> getStyles() {
		if (styles == null) {
			styles = new ArrayList<StyleType>();
		}
		return this.styles;
	}

	public boolean isStylesSet() {
		return ((this.styles != null) && (!this.styles.isEmpty()));
	}

	public void unsetStyles() {
		this.styles = null;
	}

	public LabelType getSubtitle() {
		return subtitle;
	}

	public void setSubtitle(final LabelType value) {
		this.subtitle = value;
	}

	public boolean isSubtitleSet() {
		return (this.subtitle != null);
	}

	public HeaderFooterType getSubHeaderBox() {
		return subHeaderBox;
	}

	public void setSubHeaderBox(final HeaderFooterType value) {
		this.subHeaderBox = value;
	}

	public boolean isSubHeaderBoxSet() {
		return (this.subHeaderBox != null);
	}

	public HeaderFooterType getFooterBox() {
		return footerBox;
	}

	public void setFooterBox(final HeaderFooterType value) {
		this.footerBox = value;
	}

	public boolean isFooterBoxSet() {
		return (this.footerBox != null);
	}

	public List<ScreenType> getScreens() {
		return screens;
	}

	public void setScreens(final List<ScreenType> value) {
		this.screens = value;
	}

	public boolean isScreensSet() {
		return (this.screens != null);
	}

	public FieldConfigurationType getFieldConfiguration() {
		return fieldConfiguration;
	}

	public void setFieldConfiguration(final FieldConfigurationType value) {
		this.fieldConfiguration = value;
	}

	public boolean isFieldConfigurationSet() {
		return (this.fieldConfiguration != null);
	}

	public GroupConfigurationType getGroupConfiguration() {
		return groupConfiguration;
	}

	public void setGroupConfiguration(final GroupConfigurationType value) {
		this.groupConfiguration = value;
	}

	public boolean isGroupConfigurationSet() {
		return (this.groupConfiguration != null);
	}

	public DefaultsType getDefaults() {
		return defaults;
	}

	public void setDefaults(final DefaultsType value) {
		this.defaults = value;
	}

	public boolean isDefaultsSet() {
		return (this.defaults != null);
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

	public ReadonlyPresentationEnumType getInlineRepeatReadonlyPresentation() {
		return inlineRepeatReadonlyPresentation;
	}

	public void setInlineRepeatReadonlyPresentation(final ReadonlyPresentationEnumType value) {
		this.inlineRepeatReadonlyPresentation = value;
	}

	public boolean isInlineRepeatReadonlyPresentationSet() {
		return (this.inlineRepeatReadonlyPresentation != null);
	}

	public MarkingOfRequiredFieldsEnumType getMarkingOfRequiredFields() {
		return markingOfRequiredFields;
	}

	public void setMarkingOfRequiredFields(MarkingOfRequiredFieldsEnumType markingOfRequiredFields) {
		this.markingOfRequiredFields = markingOfRequiredFields;
	}

	public DisableRuleConfirmationEnumType getDisableRuleConfirmation() {
		return disableRuleConfirmation;
	}

	public void setDisableRuleConfirmation(DisableRuleConfirmationEnumType disableRuleConfirmation) {
		this.disableRuleConfirmation = disableRuleConfirmation;
	}

	public Boolean getHideConfirmationSummary() {
		return hideConfirmationSummary;
	}

	public void setHideConfirmationSummary(Boolean hideConfirmationSummary) {
		this.hideConfirmationSummary = hideConfirmationSummary;
	}

	public EnablementEnumType getDetachedRepeatCommitButtonEnablement() {
		return detachedRepeatCommitButtonEnablement;
	}

	public void setDetachedRepeatCommitButtonEnablement(final EnablementEnumType enablement) {
		this.detachedRepeatCommitButtonEnablement = enablement;
	}

	public boolean isDetachedRepeatCommitButtonEnablementSet() {
		return this.detachedRepeatCommitButtonEnablement != null;
	}

	public OpenDocumentPreProcessingEnumType getOpenNewDocumentPreProcessing() {
		return openNewDocumentPreProcessing;
	}

	public void setOpenNewDocumentPreProcessing(final OpenDocumentPreProcessingEnumType openNewDocumentPreProcessing) {
		this.openNewDocumentPreProcessing = openNewDocumentPreProcessing;
	}

	public boolean isOpenNewDocumentPreProcessingSet() {
		return (this.openNewDocumentPreProcessing != null);
	}

	public OpenDocumentPreProcessingEnumType getOpenExistingDocumentPreProcessing() {
		return openExistingDocumentPreProcessing;
	}

	public void setOpenExistingDocumentPreProcessing(final OpenDocumentPreProcessingEnumType openExistingDocumentPreProcessing) {
		this.openExistingDocumentPreProcessing = openExistingDocumentPreProcessing;
	}

	public boolean isOpenExistingDocumentPreProcessingSet() {
		return (this.openExistingDocumentPreProcessing != null);
	}

	public FormModelContent withAmountSuffix(final AmountSuffixType value) {
		setAmountSuffix(value);
		return this;
	}

	public FormModelContent withStyles(final StyleType... values) {
		if (values != null) {
			for (final StyleType value : values) {
				getStyles().add(value);
			}
		}
		return this;
	}

	public FormModelContent withStyles(final Collection<StyleType> values) {
		if (values != null) {
			getStyles().addAll(values);
		}
		return this;
	}

	public FormModelContent withSubtitle(final LabelType value) {
		setSubtitle(value);
		return this;
	}

	public FormModelContent withSubHeaderBox(final HeaderFooterType value) {
		setSubHeaderBox(value);
		return this;
	}

	public FormModelContent withFooterBox(final HeaderFooterType value) {
		setFooterBox(value);
		return this;
	}

	public FormModelContent withScreens(final List<ScreenType> value) {
		setScreens(value);
		return this;
	}

	public FormModelContent withFieldConfiguration(final FieldConfigurationType value) {
		setFieldConfiguration(value);
		return this;
	}

	public FormModelContent withGroupConfiguration(final GroupConfigurationType value) {
		setGroupConfiguration(value);
		return this;
	}

	public FormModelContent withDefaults(final DefaultsType value) {
		setDefaults(value);
		return this;
	}

	public FormModelContent withReadonlyPresentation(final ReadonlyPresentationEnumType value) {
		setReadonlyPresentation(value);
		return this;
	}

	public FormModelContent withInlineRepeatReadonlyPresentation(final ReadonlyPresentationEnumType value) {
		setInlineRepeatReadonlyPresentation(value);
		return this;
	}

	public FormModelContent withMarkingOfRequiredFields(final MarkingOfRequiredFieldsEnumType value) {
		setMarkingOfRequiredFields(value);
		return this;
	}

	public FormModelContent withDisableRuleConfirmation(final DisableRuleConfirmationEnumType value) {
		setDisableRuleConfirmation(value);
		return this;
	}

	public FormModelContent withHideConfirmationSummary(final Boolean value) {
		setHideConfirmationSummary(value);
		return this;
	}

	public FormModelContent withEnablement(final EnablementEnumType value) {
		setDetachedRepeatCommitButtonEnablement(value);
		return this;
	}

	public FormModelContent withOpenNewDocumentPreProcessing(final OpenDocumentPreProcessingEnumType value) {
		setOpenNewDocumentPreProcessing(value);
		return this;
	}

	public FormModelContent withOpenExistingDocumentPreProcessing(final OpenDocumentPreProcessingEnumType value) {
		setOpenExistingDocumentPreProcessing(value);
		return this;
	}
}
