// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.metadata;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.header.Annotation;
import com.mgmtp.a12.model.notification.Severity;
import com.mgmtp.a12.model.ui.form.consistency.FormModelCategory;
import com.mgmtp.a12.model.ui.form.consistency.FormModelConsistencyRule;
import com.mgmtp.a12.model.ui.form.consistency.FormModelProblemSource;

import org.apache.commons.collections4.CollectionUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Checks for empty roles annotation. Roles are defined in model settings section.
 */
public class FormEmptyRolesRule implements FormModelConsistencyRule {

	@Override
	public List<Problem> executeRule(final MeliesModel model) {

		final List<Problem> problems = new ArrayList<>();

		final Optional<Annotation>
			rolesAnnotation =
			CollectionUtils
				.emptyIfNull(model.getHeader().getAnnotations())
				.stream()
				.filter(a -> a.getName().equalsIgnoreCase("roles"))
				.findAny();

		if (!rolesAnnotation.isPresent()) {
			problems.add(new ConsistencyProblem(
				model.getHeaderId(),
				FormModelCategory.FORM_MODEL_SETTINGS_ROLES_MISSING,
				new FormModelProblemSource(model.getHeaderId()),
				Severity.INFO));
		}

		return problems;
	}
}
