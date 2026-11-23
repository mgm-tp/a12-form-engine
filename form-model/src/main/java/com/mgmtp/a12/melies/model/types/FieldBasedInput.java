// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.types;

import java.io.Serializable;
import java.util.List;

public interface FieldBasedInput extends Serializable {

	public LabelType getLabel();

	public void setLabel(final LabelType value);

	public boolean isLabelSet();

	public MultilingualTextType getHint();

	public void setHint(final MultilingualTextType value);

	public boolean isHintSet();

	public List<StyleType> getStyle();

	public boolean isStyleSet();

	public void unsetStyle();

	public String getReadonly();

	public void setReadonly(final String value);

	public boolean isReadonlySet();

	public String getSecret();

	public void setSecret(final String value);

	public boolean isSecretSet();

	public DatePickerConfigurationType getDatePickerConfig();

	public void setDatePickerConfig(final DatePickerConfigurationType value);

	public boolean isDatePickerConfigSet();

	public MessageExpositionEnumType getMessageExposition();

	public void setMessageExposition(final MessageExpositionEnumType value);

	public boolean isMessageExpositionSet();

	public String getAutoExpand();

	public void setAutoExpand(final String value);

	public boolean isAutoExpandSet();

	public String getTruncateSuffix();

	public void setTruncateSuffix(final String value);

	public boolean isTruncateSuffixSet();

	public String getElementRef();

	public void setElementRef(final String value);

	public boolean isElementRefSet();

	public String getAutoComplete();

	public void setAutoComplete(final String value);

	public boolean isAutoCompleteSet();

	public MarkingOfRequiredFieldsEnumType getMarkingOfRequiredFields();

	public void setMarkingOfRequiredFields(final MarkingOfRequiredFieldsEnumType value);

	public boolean isMarkingOfRequiredFieldsSet();
}
