// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.consistency;

import com.mgmtp.a12.kernel.md.model.api.IField;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IBooleanType;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IConfirmType;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IEnumerationType;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IFieldType;
import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.internal.DocumentModelAccess;
import com.mgmtp.a12.model.consistency.ConsistencyCategory;
import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.DocumentModelHelper;
import com.mgmtp.a12.model.ui.form.consistency.FormModelCategory;
import com.mgmtp.a12.model.ui.form.consistency.FormModelProblemSource;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

class AbstractReferenceChecker {

	final MeliesModel meliesModel;
	final DocumentModelAccess documentModelService;

	AbstractReferenceChecker(final MeliesModel meliesModel, final DocumentModelAccess documentModelService) {
		this.meliesModel = meliesModel;
		this.documentModelService = documentModelService;
	}

	protected List<Problem> checkPicusFieldInDependentType(
		final String fieldRef, final boolean isMasterField, final ConsistencyCategory problemCategory
	) {
		final List<Problem> problems = new ArrayList<>();
		if (fieldRef != null) {
			final Optional<IField> foundFieldOptional = documentModelService.findFieldById(fieldRef);
			if (foundFieldOptional.isPresent()) {
				final IField foundField = foundFieldOptional.get();
				if (isMasterField) {
					final IFieldType effectiveDataType = foundField.getEffectiveType().orElse(null);
					if (!(effectiveDataType instanceof IEnumerationType
						|| effectiveDataType instanceof IBooleanType
						|| effectiveDataType instanceof IConfirmType)) {
						problems.add(
							new ConsistencyProblem(
								meliesModel.getHeaderId(),
								FormModelCategory.PICUS_MODEL_DEPENDENT_TYPE_MASTER_FIELD_INVALID_TYPE,
								new FormModelProblemSource(fieldRef),
								fieldRef,
								this.documentModelService.getDocumentModelId(),
								DocumentModelHelper.getFieldTypeString(effectiveDataType)));
					}
				}
			} else {
				problems.add(
					new ConsistencyProblem(
						meliesModel.getHeaderId(),
						problemCategory,
						new FormModelProblemSource(fieldRef),
						fieldRef,
						this.documentModelService.getDocumentModelId()));
			}

		}
		return problems;
	}

}
