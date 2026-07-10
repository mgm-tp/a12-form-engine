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
package com.mgmtp.a12.formengine.consistency.rules;

import com.mgmtp.a12.model.Model;
import com.mgmtp.a12.model.data.document.ModelResolver;

import com.mgmtp.a12.kernel.md.model.api.IDocumentModel;

import com.mgmtp.a12.formengine.consistency.rules.consistency.DocumentModelMetaDataEnricher;
import com.mgmtp.a12.formengine.model.FormModel;
import com.mgmtp.a12.formengine.model.FormModelUtil;
import com.mgmtp.a12.formengine.model.internal.DocumentModelAccess;

import java.util.Optional;

/**
 * Helper class for creating DocumentModelAccess for consistency rule tests.
 */
public class RuleTestHelper {

	/**
	 * Creates a DocumentModelAccess from the given ModelResolver and form model.
	 * Returns null if the document model cannot be resolved.
	 *
	 * @param modelResolver the model resolver
	 * @param model         the form model being tested
	 * @return DocumentModelAccess or null if not resolvable
	 */
	public static DocumentModelAccess createDocumentModelAccess(final ModelResolver modelResolver, final FormModel model) {
		final String documentModelName = FormModelUtil.getDocumentModelReference(model);
		final Optional<Model> resolvedModel = modelResolver.getModel(documentModelName);
		if (resolvedModel.isPresent() && resolvedModel.get() instanceof IDocumentModel dm) {
			return new DocumentModelAccess(
				DocumentModelMetaDataEnricher.getInstance().enrichDocumentModel(dm)
			);
		}
		return null;
	}
}
