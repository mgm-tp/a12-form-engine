// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.consistency;

import com.mgmtp.a12.kernel.md.model.api.IField;
import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.internal.DocumentModelAccess;
import com.mgmtp.a12.melies.model.types.DependentEnumerationType;
import com.mgmtp.a12.melies.model.types.DependentFieldType;
import com.mgmtp.a12.melies.model.types.FieldConfigurationEntryType;
import com.mgmtp.a12.melies.model.types.FieldConfigurationType;
import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.FormModelCategory;
import com.mgmtp.a12.model.ui.form.consistency.FormModelProblemSource;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class CrossDependencyChecker extends AbstractReferenceChecker {
	public CrossDependencyChecker(final MeliesModel meliesModel, final DocumentModelAccess documentModelService) {
		super(meliesModel, documentModelService);
	}

	List<Problem> checkDependentEnumerationAndDependentField(final FieldConfigurationType fieldConfiguration) {
		final List<Problem> problems = new ArrayList<>();
		for (final FieldConfigurationEntryType fieldConfigurationEntry : fieldConfiguration.getField()) {
			final DependentEnumerationType dependentEnumeration = fieldConfigurationEntry.getDependentEnumeration();
			final DependentFieldType dependentField = fieldConfigurationEntry.getDependentField();
			if (
				dependentField != null
					&& dependentEnumeration != null
					&& hasDependentFieldAValueSetOrFieldRefSetCase(dependentField)
			) {
				final Optional<IField> dependentEnumerationField
					= documentModelService.findFieldById(fieldConfigurationEntry.getElementRef());
				dependentEnumerationField.ifPresent(iField -> problems.add(new ConsistencyProblem(
					meliesModel.getHeaderId(),
					FormModelCategory.PICUS_MODEL_DEPENDENT_COMBINATION_ENUM_FIELD,
					new FormModelProblemSource(fieldConfigurationEntry.getElementRef()),
					iField.getId()
				)));
			}
		}
		return problems;
	}

	private boolean hasDependentFieldAValueSetOrFieldRefSetCase(final DependentFieldType dependentField) {
		return dependentField.isCaseSet()
			&& dependentField.getCase().stream().anyMatch(x -> x.isValueSet() || x.isFieldRefSet());
	}
}
