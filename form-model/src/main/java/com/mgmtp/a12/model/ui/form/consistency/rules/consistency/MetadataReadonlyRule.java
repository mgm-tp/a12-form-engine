// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
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
