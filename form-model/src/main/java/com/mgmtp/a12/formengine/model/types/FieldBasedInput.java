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
