// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.other;

import com.mgmtp.a12.kernel.md.model.api.IField;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IEnumerationType;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IFieldType;
import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.internal.DocumentModelAccess;
import com.mgmtp.a12.melies.model.types.AmountSuffixType;
import com.mgmtp.a12.melies.model.types.DynamicAmountSuffixType;
import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.FormModelCategory;
import com.mgmtp.a12.model.ui.form.consistency.FormModelProblemSource;
import com.mgmtp.a12.model.ui.form.consistency.rules.consistency.AbstractRuleWithDocumentModelService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class AmountSuffixRule extends AbstractRuleWithDocumentModelService<MeliesModel> {

	@Override
	public List<Problem> executeRule(final MeliesModel model) {
		final List<Problem> problems = new ArrayList<>();

		if (model.getContent().isAmountSuffixSet()) {
			final AmountSuffixType amountSuffix = model.getContent().getAmountSuffix();

			if (amountSuffix instanceof DynamicAmountSuffixType) {
				final String fieldRef = ((DynamicAmountSuffixType) amountSuffix).getFieldRef();

				final DocumentModelAccess dmService = createDocumentModelService(model, problems);
				final Optional<IField> foundFieldOptional = dmService.findFieldById(fieldRef);

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
							dmService.getDocumentModelId()
						)
					);
				}
			}
		}
		return problems;
	}
}
