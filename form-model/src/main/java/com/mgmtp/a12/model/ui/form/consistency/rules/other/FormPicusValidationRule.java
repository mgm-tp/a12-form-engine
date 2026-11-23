// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.other;

import com.mgmtp.a12.kernel.md.facade.DocumentModelServiceFactory;
import com.mgmtp.a12.kernel.md.model.api.IDocumentModel;
import com.mgmtp.a12.kernel.md.model.api.services.DocumentModelExpansionException;
import com.mgmtp.a12.kernel.md.model.api.services.IDocumentModelReferenceResolver;
import com.mgmtp.a12.kernel.md.model.api.services.IDocumentModelService;
import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.MeliesModelUtil;
import com.mgmtp.a12.model.Model;
import com.mgmtp.a12.model.consistency.ConsistencyCategory;
import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.consistency.rules.FatalRuleProblemException;
import com.mgmtp.a12.model.data.document.consistency.AbstractRuleWithModelResolver;
import com.mgmtp.a12.model.data.document.consistency.DocumentModelCategory;
import com.mgmtp.a12.model.ui.form.consistency.FormModelCategory;
import com.mgmtp.a12.model.ui.form.consistency.FormModelProblemSource;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

public class FormPicusValidationRule extends AbstractRuleWithModelResolver<MeliesModel> {

	private final IDocumentModelService
		documentModelService =
		new DocumentModelServiceFactory().createDocumentModelService();

	@Override
	public List<Problem> executeRule(final MeliesModel model) {

		final String documentModelName = MeliesModelUtil.getPicusFileReference(model);
		try {
			final Optional<Model> resolvedModel = getModelResolver().getModel(documentModelName);
			if (resolvedModel.isEmpty() || !(resolvedModel.get() instanceof IDocumentModel)) {
				return List.of(new ConsistencyProblem(
					model.getHeaderId(),
					DocumentModelCategory.MODEL_COULD_NOT_BE_RESOLVED,
					new FormModelProblemSource(model.getHeaderId()),
					documentModelName));
			} else {
				final IDocumentModel documentModel = (IDocumentModel) resolvedModel.get();
				documentModelService.expand(
					documentModel, new IDocumentModelReferenceResolver() {

						@Override
						public IDocumentModel getDocumentModel(final String arg0) {
							final Optional<Model> resolvedModel = getModelResolver().getModel(arg0);
							return resolvedModel.isPresent() && resolvedModel.get() instanceof IDocumentModel
								? (IDocumentModel) resolvedModel.get()
								: null;
						}
					});
				// documentModelService.checkConsistency() no longer returns List<Problem>
				// that is why we have to map to Problem instances ourselves
				var problems = new ArrayList<Problem>();
				documentModelService.checkConsistency(
					documentModel, rankedNotification -> {
						problems.add(new ConsistencyProblem(
							documentModelName, new ConsistencyCategory() {
							@Override
							public String getKeyValue() {
								return "generic.document.model.problem";
							}

							@Override
							public String getLocalizedMessage(Locale locale, String s) {
								return rankedNotification.getMessage();
							}
						}, new FormModelProblemSource(model.getHeaderId())));
					});
				return problems;
			}
		} catch (final DocumentModelExpansionException dmee) {
			final Problem problem = new ConsistencyProblem(
				documentModelName,
				FormModelCategory.PICUS_MODEL_EXPANSION_EXCEPTION,
				new FormModelProblemSource(model.getHeaderId()),
				documentModelName,
				dmee.getMessage());
			throw new FatalRuleProblemException("Unable to expand document model", Arrays.asList(problem));
		}

	}
}
