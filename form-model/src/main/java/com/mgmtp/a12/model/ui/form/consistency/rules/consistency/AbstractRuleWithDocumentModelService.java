// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.consistency;

import com.mgmtp.a12.kernel.md.model.api.IDocumentModel;
import com.mgmtp.a12.kernel.md.model.api.services.DocumentModelExpansionException;
import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.MeliesModelUtil;
import com.mgmtp.a12.melies.model.internal.DocumentModelAccess;
import com.mgmtp.a12.model.Model;
import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.consistency.rules.FatalRuleProblemException;
import com.mgmtp.a12.model.data.document.consistency.AbstractRuleWithModelResolver;
import com.mgmtp.a12.model.ui.form.consistency.FormModelCategory;
import com.mgmtp.a12.model.ui.form.consistency.FormModelProblemSource;

import java.util.List;
import java.util.Optional;

public abstract class AbstractRuleWithDocumentModelService<M extends Model> extends AbstractRuleWithModelResolver<M> {

	protected DocumentModelAccess createDocumentModelService(
		final MeliesModel meliesModel,
		final List<Problem> problems)
		throws FatalRuleProblemException {
		final String documentModelName = MeliesModelUtil.getPicusFileReference(meliesModel);
		try {
			final Optional<Model> resolvedModel = getModelResolver().getModel(documentModelName);
			if (resolvedModel.isEmpty() || !(resolvedModel.get() instanceof IDocumentModel dm)) {
				throw new FatalRuleProblemException("Unable to find document model " + documentModelName, problems);
			}
			return new DocumentModelAccess(DocumentModelMetaDataEnricher.getInstance().enrichDocumentModel(dm));
		} catch (final DocumentModelExpansionException dmee) {
			problems.add(new ConsistencyProblem(
				documentModelName,
				FormModelCategory.PICUS_MODEL_EXPANSION_EXCEPTION,
				new FormModelProblemSource(documentModelName),
				documentModelName,
				dmee.getMessage())
			);
			throw new FatalRuleProblemException("Unable to expand document model " + documentModelName, problems);
		}
	}
}
