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
package com.mgmtp.a12.formengine.consistency.rules.other;

import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;

import com.mgmtp.a12.kernel.md.model.api.IField;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IEnumerationType;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IFieldType;

import com.mgmtp.a12.formengine.consistency.FormModelCategory;
import com.mgmtp.a12.formengine.consistency.FormModelProblemSource;
import com.mgmtp.a12.formengine.consistency.rules.consistency.ConsistencyRule;
import com.mgmtp.a12.formengine.model.FormModel;
import com.mgmtp.a12.formengine.model.internal.DocumentModelAccess;
import com.mgmtp.a12.formengine.model.types.AmountSuffixType;
import com.mgmtp.a12.formengine.model.types.DynamicAmountSuffixType;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class AmountSuffixRule implements ConsistencyRule {

	@Override
	public List<Problem> execute(final FormModel model, final DocumentModelAccess documentModelAccess) {
		final List<Problem> problems = new ArrayList<>();

		if (model.getContent().isAmountSuffixSet()) {
			final AmountSuffixType amountSuffix = model.getContent().getAmountSuffix();

			if (amountSuffix instanceof DynamicAmountSuffixType) {
				final String fieldRef = ((DynamicAmountSuffixType) amountSuffix).getFieldRef();

				final Optional<IField> foundFieldOptional = documentModelAccess.findFieldById(fieldRef);

				if (foundFieldOptional.isPresent()) {
					final IFieldType effectiveDataType = foundFieldOptional.get().getEffectiveType().orElse(null);
					if (!(effectiveDataType instanceof IEnumerationType)) {
						problems.add(
							new ConsistencyProblem(
								model.getHeaderId(),
								FormModelCategory.FORM_MODEL_AMOUNT_SUFFIX_INVALID_TYPE,
								new FormModelProblemSource(model.getHeaderId())
							)
						);
					}
				} else {
					problems.add(
						new ConsistencyProblem(
							model.getHeaderId(),
							FormModelCategory.FORM_MODEL_AMOUNT_SUFFIX_FIELD_MISSING,
							new FormModelProblemSource(model.getHeaderId()),
							fieldRef,
							documentModelAccess.getDocumentModelId()
						)
					);
				}
			}
		}
		return problems;
	}
}
