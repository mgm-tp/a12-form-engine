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
 * 1. Open-Source License – EUPL v1.2
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
