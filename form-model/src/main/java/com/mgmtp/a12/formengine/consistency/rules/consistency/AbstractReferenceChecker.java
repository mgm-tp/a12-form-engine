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
package com.mgmtp.a12.formengine.consistency.rules.consistency;

import com.mgmtp.a12.model.consistency.ConsistencyCategory;
import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;

import com.mgmtp.a12.kernel.md.model.api.IField;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IBooleanType;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IConfirmType;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IEnumerationType;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IFieldType;

import com.mgmtp.a12.formengine.consistency.DocumentModelHelper;
import com.mgmtp.a12.formengine.consistency.FormModelCategory;
import com.mgmtp.a12.formengine.consistency.FormModelProblemSource;
import com.mgmtp.a12.formengine.model.FormModel;
import com.mgmtp.a12.formengine.model.internal.DocumentModelAccess;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

class AbstractReferenceChecker {

	final FormModel formModel;
	final DocumentModelAccess documentModelService;

	AbstractReferenceChecker(final FormModel formModel, final DocumentModelAccess documentModelService) {
		this.formModel = formModel;
		this.documentModelService = documentModelService;
	}

	protected List<Problem> checkDmFieldInDependentType(
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
								formModel.getHeaderId(),
								FormModelCategory.DEPENDENT_TYPE_MASTER_FIELD_INVALID_TYPE,
								new FormModelProblemSource(fieldRef),
								fieldRef,
								this.documentModelService.getDocumentModelId(),
								DocumentModelHelper.getFieldTypeString(effectiveDataType)));
					}
				}
			} else {
				problems.add(
					new ConsistencyProblem(
						formModel.getHeaderId(),
						problemCategory,
						new FormModelProblemSource(fieldRef),
						fieldRef,
						this.documentModelService.getDocumentModelId()));
			}

		}
		return problems;
	}

}
