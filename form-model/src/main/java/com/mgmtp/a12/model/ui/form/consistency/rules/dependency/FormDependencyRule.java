// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.dependency;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

import com.mgmtp.a12.kernel.core.tool.a12internal.api.services.ICalculationService;
import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.internal.DocumentModelAccess;
import com.mgmtp.a12.melies.model.types.FieldConfigurationType;
import com.mgmtp.a12.melies.model.types.GroupConfigurationType;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.rules.consistency.AbstractRuleWithDocumentModelService;

/**
 * Finds cyclic references between fields.
 */
public class FormDependencyRule extends AbstractRuleWithDocumentModelService<MeliesModel> {

	@Override
	public List<Problem> executeRule(final MeliesModel model) {
		return new ArrayList<>(checkFieldReferences(model));
	}

	private List<Problem> checkFieldReferences(final MeliesModel model) {
		final List<Problem> problems = new LinkedList<>();

		final DocumentModelAccess dmAccess = createDocumentModelService(model, problems);
		final ICalculationService calcService = dmAccess.getCalculationService();

		final DependencyCycleChecker dependencyCycleChecker =
			new DependencyCycleChecker(model.getHeaderId(), dmAccess, calcService);

		final FieldConfigurationType fieldConfiguration = model.getContent().getFieldConfiguration();
		final GroupConfigurationType groupConfiguration = model.getContent().getGroupConfiguration();
		problems.addAll(dependencyCycleChecker.checkFieldCycleReference(fieldConfiguration, groupConfiguration));
		
		return problems;
	}
}
