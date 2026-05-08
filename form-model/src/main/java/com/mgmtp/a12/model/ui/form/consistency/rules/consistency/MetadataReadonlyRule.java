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
package com.mgmtp.a12.model.ui.form.consistency.rules.consistency;

import com.mgmtp.a12.kernel.md.model.api.IElement;
import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.internal.DocumentModelAccess;
import com.mgmtp.a12.melies.model.types.DependentFieldType;
import com.mgmtp.a12.melies.model.types.FieldConfigurationEntryType;
import com.mgmtp.a12.melies.model.types.FieldConfigurationType;
import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.FormModelCategory;
import com.mgmtp.a12.model.ui.form.consistency.FormModelConsistencyRule;
import com.mgmtp.a12.model.ui.form.consistency.FormModelProblemSource;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static com.mgmtp.a12.model.ui.form.consistency.DocumentModelHelper.isMetadataField;

public class MetadataReadonlyRule extends AbstractRuleWithDocumentModelService<MeliesModel>
	implements FormModelConsistencyRule {

	@Override
	public List<Problem> executeRule(final MeliesModel model) {
		final List<Problem> problems = new ArrayList<>();
		final DocumentModelAccess dmAccess = createDocumentModelService(model, problems);
		final FieldConfigurationType fieldConfiguration = model.getContent().getFieldConfiguration();
		for (final FieldConfigurationEntryType field : fieldConfiguration.getField()) {
			if (!field.isDependentFieldSet() && !field.isExternalEnumerationSet()) {
				continue;
			}
			final String elementRef = field.getElementRef();
			final Optional<IElement> element = dmAccess.findElementById(elementRef);
			if (element.isEmpty() || !isMetadataField(element.get())) {
				continue;
			}
			if (field.isDependentFieldSet() && hasValueOrFieldRef(field.getDependentField())) {
				problems.add(new ConsistencyProblem(
					model.getHeaderId(),
					FormModelCategory.FORM_MODEL_DEPENDENT_FIELD_ON_METADATA,
					new FormModelProblemSource(field.getElementRef()),
					field.getElementRef(),
					element.get().getName()
				));
			} else if (field.isExternalEnumerationSet()) {
				problems.add(new ConsistencyProblem(
					model.getHeaderId(),
					FormModelCategory.FORM_MODEL_EXTERNAL_ENUM_ON_METADATA,
					new FormModelProblemSource(field.getElementRef()),
					field.getElementRef(),
					element.get().getName()
				));
			}
		}
		return problems;
	}

	private boolean hasValueOrFieldRef(final DependentFieldType dependentField) {
		return dependentField.isCaseSet()
			&& dependentField.getCase().stream().anyMatch(x -> x.isValueSet() || x.isFieldRefSet());
	}
}
