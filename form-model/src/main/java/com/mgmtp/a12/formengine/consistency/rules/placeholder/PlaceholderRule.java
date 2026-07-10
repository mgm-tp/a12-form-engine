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
package com.mgmtp.a12.formengine.consistency.rules.placeholder;

import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;

import com.mgmtp.a12.kernel.md.model.api.IElement;
import com.mgmtp.a12.kernel.md.model.api.IField;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IBooleanType;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.ICustomFieldType;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IDateFragmentType;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IDateRangeType;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IDateTimeType;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IDateType;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IEnumerationType;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IFieldType;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.INumberType;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IStringType;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.ITimeType;

import com.mgmtp.a12.formengine.consistency.ConsistencyValidationException;
import com.mgmtp.a12.formengine.consistency.DocumentModelHelper;
import com.mgmtp.a12.formengine.consistency.FormModelCategory;
import com.mgmtp.a12.formengine.consistency.FormModelProblemSource;
import com.mgmtp.a12.formengine.consistency.rules.consistency.ConsistencyRule;
import com.mgmtp.a12.formengine.model.FormModel;
import com.mgmtp.a12.formengine.model.FormModelUtil;
import com.mgmtp.a12.formengine.model.internal.DocumentModelAccess;
import com.mgmtp.a12.formengine.model.types.ExpositionPresentationEnumType;
import com.mgmtp.a12.formengine.model.types.FieldConfigurationEntryType;
import com.mgmtp.a12.formengine.model.types.FieldConfigurationType;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Placeholder can only be set for: String, Number, Date, DateTime, Time, DateFragment, DateRange, Custom,
 * Boolean (boolean_select), Enumeration (auto complete and compact) and MultiSelect (auto complete) inputs
 */
public class PlaceholderRule implements ConsistencyRule {

	@Override
	public List<Problem> execute(final FormModel model, final DocumentModelAccess documentModelAccess) throws ConsistencyValidationException {
		final List<Problem> problems = new ArrayList<>();

		final FieldConfigurationType fieldConfiguration = model.getContent().getFieldConfiguration();

		final List<FieldConfigurationEntryType> fieldConfigurations = fieldConfiguration.getField();
		for (final FieldConfigurationEntryType fieldConfig : fieldConfigurations) {
			if (!fieldConfig.isPlaceholderSet()) {
				continue;
			}
			final String elementRef = fieldConfig.getElementRef();
			final Optional<IElement> elementOptional = documentModelAccess.findElementById(elementRef);
			if (elementOptional.isEmpty()) {
				// Case is covered by FormFieldReferenceConsistencyRule
				continue;
			}

			final IElement element = elementOptional.get();
			if (!isValidDataType(element, fieldConfig)) {
				problems.add(new ConsistencyProblem(
					model.getHeaderId(),
					FormModelCategory.FORM_MODEL_PLACEHOLDER_INVALID_DATATYPE,
					new FormModelProblemSource(elementRef),
					elementRef,
					element.getName()));
			}
		}
		return problems;
	}

	private static boolean isValidDataType(final IElement element, final FieldConfigurationEntryType fieldConfig) {
		final ExpositionPresentationEnumType exposition = FormModelUtil.getExpositionWithDefault(element, fieldConfig);
		if (element instanceof IField field) {
			final IFieldType dataType = field.getEffectiveType().orElse(null);
			return (dataType instanceof IStringType ||
				(dataType instanceof IEnumerationType && exposition == ExpositionPresentationEnumType.COMPACT || exposition == ExpositionPresentationEnumType.AUTOCOMPLETE) ||
				dataType instanceof INumberType ||
				dataType instanceof IDateType ||
				dataType instanceof IDateTimeType ||
				dataType instanceof ITimeType ||
				dataType instanceof IDateFragmentType ||
				dataType instanceof IDateRangeType ||
				dataType instanceof ICustomFieldType) ||
				(dataType instanceof IBooleanType && exposition == ExpositionPresentationEnumType.BOOLEAN_SELECT);
		} else if (DocumentModelHelper.isMultiSelectGroup(element)) {
			return exposition == ExpositionPresentationEnumType.AUTOCOMPLETE;
		}
		return false;
	}
}
