// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.dependency;

import com.mgmtp.a12.melies.model.types.ExpositionPresentationEnumType;
import com.mgmtp.a12.melies.model.types.ExternalEnumerationType;
import com.mgmtp.a12.melies.model.types.FieldConfigurationEntryType;
import com.mgmtp.a12.melies.model.types.FieldConfigurationType;
import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.FormModelCategory;
import com.mgmtp.a12.model.ui.form.consistency.FormModelProblemSource;

import java.util.ArrayList;
import java.util.List;

class InvalidAllowCustomValuesChecker {

	private final String modelName;

	InvalidAllowCustomValuesChecker(final String modelName) {
		this.modelName = modelName;
	}

	List<Problem> check(final FieldConfigurationType fieldConfiguration) {
		final List<Problem> problems = new ArrayList<>();

		for (final FieldConfigurationEntryType fieldConfigurationEntry : fieldConfiguration.getField()) {
			if (fieldConfigurationEntry.isExternalEnumerationSet()) {

				final ExpositionPresentationEnumType exposition = fieldConfigurationEntry.getExposition();
				final ExternalEnumerationType externalEnumeration = fieldConfigurationEntry.getExternalEnumeration();

				if (externalEnumeration.isCustomValuesAllowedSet()
					&& !exposition.equals(ExpositionPresentationEnumType.AUTOCOMPLETE)) {
					problems.add(new ConsistencyProblem(
						modelName,
						FormModelCategory.FORM_MODEL_EXTERNAL_ENUM_INVALID_ALLOW_CUSTOM_VALUE,
						new FormModelProblemSource(fieldConfigurationEntry.getElementRef()),
						fieldConfigurationEntry.getElementRef()
					));
				}

			}
		}

		return problems;
	}
}
