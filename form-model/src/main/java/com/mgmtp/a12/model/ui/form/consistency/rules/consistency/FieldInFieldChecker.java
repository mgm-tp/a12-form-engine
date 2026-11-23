// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.consistency;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.internal.DocumentModelAccess;
import com.mgmtp.a12.melies.model.types.FieldConfigurationEntryType;
import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.ElementReferenceFinder;
import com.mgmtp.a12.model.ui.form.consistency.FormModelCategory;
import com.mgmtp.a12.model.ui.form.consistency.FormModelProblemSource;

import java.util.ArrayList;
import java.util.List;

class FieldInFieldChecker extends AbstractReferenceChecker {

	private final ElementReferenceFinder elementReferenceFinder;

	public FieldInFieldChecker(final MeliesModel meliesModel, final DocumentModelAccess documentModelService) {
		super(meliesModel, documentModelService);
		this.elementReferenceFinder = new ElementReferenceFinder(documentModelService);
	}

	List<Problem> checkFieldInFieldConfiguration(final FieldConfigurationEntryType fieldConfigurationEntry) {
		final List<Problem> problems = new ArrayList<>();
		final String elementRef = fieldConfigurationEntry.getElementRef();

		if (!(elementReferenceFinder.isField(elementRef) || elementReferenceFinder.isSupportedCustomType(elementRef))) {
			problems.add(new ConsistencyProblem(
				meliesModel.getHeaderId(),
				FormModelCategory.PICUS_MISSING_ELEMENT_IN_FIELD_CONFIGURATION,
				new FormModelProblemSource(elementRef),
				elementRef,
				documentModelService.getDocumentModelId()
			));
		}
		return problems;
	}

}
