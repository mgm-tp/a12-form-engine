// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.consistency;

import java.util.ArrayList;
import java.util.List;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.internal.DocumentModelAccess;
import com.mgmtp.a12.melies.model.types.DependentFieldCaseType;
import com.mgmtp.a12.melies.model.types.DependentFieldType;
import com.mgmtp.a12.melies.model.types.FieldConfigurationEntryType;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.FormModelCategory;

class DependentFieldChecker extends AbstractReferenceChecker {

	public DependentFieldChecker(final MeliesModel meliesModel, final DocumentModelAccess documentModelService) {
		super(meliesModel, documentModelService);
	}

	/**
	 * check case of dependent field, if master field exists, and is of type enum/boolean and foreach case, if fieldRef
	 * specified, check if it exists
	 *
	 * @param fieldConfigurationEntry
	 * @return
	 */
	List<Problem> checkDependentField(final FieldConfigurationEntryType fieldConfigurationEntry) {
		final List<Problem> problems = new ArrayList<>();
		final DependentFieldType dependentField = fieldConfigurationEntry.getDependentField();
		if (dependentField != null) {
			problems.addAll(checkPicusFieldInDependentType(
				dependentField.getMasterField(),
				true,
				FormModelCategory.PICUS_MISSING_FIELD_IN_DEPENDENT_FIELD_MASTER
			));
			for (final DependentFieldCaseType dependentFieldCase : dependentField.getCase()) {
				problems.addAll(checkPicusFieldInDependentType(
					dependentFieldCase.getFieldRef(),
					false,
					FormModelCategory.PICUS_MISSING_FIELD_IN_DEPENDENT_FIELD_CASE
				));
			}
		}
		return problems;
	}

}
