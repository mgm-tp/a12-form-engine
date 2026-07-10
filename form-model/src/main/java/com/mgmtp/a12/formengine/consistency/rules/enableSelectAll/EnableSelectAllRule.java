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
package com.mgmtp.a12.formengine.consistency.rules.enableSelectAll;

import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;

import com.mgmtp.a12.kernel.md.model.api.IElement;

import com.mgmtp.a12.formengine.consistency.ConsistencyValidationException;
import com.mgmtp.a12.formengine.consistency.DocumentModelHelper;
import com.mgmtp.a12.formengine.consistency.FormModelCategory;
import com.mgmtp.a12.formengine.consistency.FormModelProblemSource;
import com.mgmtp.a12.formengine.consistency.rules.consistency.ConsistencyRule;
import com.mgmtp.a12.formengine.model.FormModel;
import com.mgmtp.a12.formengine.model.internal.DocumentModelAccess;
import com.mgmtp.a12.formengine.model.types.ExpositionPresentationEnumType;
import com.mgmtp.a12.formengine.model.types.FieldConfigurationEntryType;
import com.mgmtp.a12.formengine.model.types.FieldConfigurationType;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * EnableSelectAll can only be set for: MultiSelect (auto complete) inputs
 */
public class EnableSelectAllRule implements ConsistencyRule {

	@Override
	public List<Problem> execute(final FormModel model, final DocumentModelAccess documentModelAccess) throws ConsistencyValidationException {
		final List<Problem> problems = new ArrayList<>();

		final FieldConfigurationType fieldConfiguration = model.getContent().getFieldConfiguration();

		final List<FieldConfigurationEntryType> fieldConfigurations = fieldConfiguration.getField();
		for (final FieldConfigurationEntryType fieldConfig : fieldConfigurations) {
			final String elementRef = fieldConfig.getElementRef();
			final Optional<IElement> elementOptional = documentModelAccess.findElementById(elementRef);
			if (!elementOptional.isPresent()) {
				// Case is covered by FormFieldReferenceConsistencyRule
				continue;
			}
			final IElement element = elementOptional.get();

			if (fieldConfig.isEnableSelectAllSet()) {
				if (!isValidDataType(element)) {
					problems.add(new ConsistencyProblem(
						model.getHeaderId(),
						FormModelCategory.FORM_MODEL_ENABLE_SELECT_ALL_INVALID_DATATYPE,
						new FormModelProblemSource(fieldConfig.getElementRef()),
						elementRef,
						element.getName()));
				} else if (!isValidExposition(fieldConfig)) {
					problems.add(new ConsistencyProblem(
						model.getHeaderId(),
						FormModelCategory.FORM_MODEL_ENABLE_SELECT_ALL_INVALID_EXPOSITION,
						new FormModelProblemSource(fieldConfig.getElementRef()),
						elementRef,
						element.getName()));
				}
			}
		}
		return problems;
	}

	private static boolean isValidDataType(final IElement element) {
		return DocumentModelHelper.isMultiSelectGroup(element);
	}

	private static boolean isValidExposition(final FieldConfigurationEntryType fieldConfig) {
		final ExpositionPresentationEnumType exposition = fieldConfig.getExposition();

		return ExpositionPresentationEnumType.FULL.equals(exposition) || ExpositionPresentationEnumType.INLINE.equals(
			exposition);
	}

}
