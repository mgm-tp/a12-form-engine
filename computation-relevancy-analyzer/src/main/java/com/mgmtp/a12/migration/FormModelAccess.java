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
package com.mgmtp.a12.migration;

import com.mgmtp.a12.kernel.md.model.api.IDocumentModel;
import com.mgmtp.a12.melies.model.MeliesModel;

import java.util.ArrayList;
import java.util.List;

/**
 * Form Model traversal logic to find all non-relevant elements of a document based on the FM dependencies
 * Includes a recursive expansion of all non-relevant groups in order to produce a transitive closure of elements.
 */
class FormModelAccess {

	static List<String> collectNonRelevantElements(final MeliesModel formModel, final IDocumentModel documentModel) {
		final var pathResolver = new ElementPathResolver(documentModel);
		final var groupExpander = new GroupExpander(documentModel);

		final var nonRelevantFields =
			formModel.getContent()
					 .getFieldConfiguration()
					 .getField()
					 .stream()
					 .filter(fce ->
								 fce.isDependentFieldSet()
								 && fce.getDependentField()
									   .getCase()
									   .stream()
									   .anyMatch(caze -> caze.isNotRelevantSet()))
					 .map(fce -> pathResolver.resolvePathById(fce.getElementRef()));

		final var nonRelevantGroups =
			formModel.getContent()
					 .getGroupConfiguration()
					 .getGroup()
					 .stream()
					 .filter(gce ->
								 gce.isDependentGroupSet()
								 && gce.getDependentGroup()
									   .getCase()
									   .stream()
									   .anyMatch(caze -> caze.getNotRelevant() != null))
					 .map(gce -> pathResolver.resolvePathById(gce.getGroupRef()))
					 .toList();

		final var expandedGroups = nonRelevantGroups.stream().map(groupExpander::expand);

		final var result = new ArrayList<>(nonRelevantFields.toList());
		result.addAll(nonRelevantGroups);
		expandedGroups.forEach(eg -> result.addAll(eg.elementPaths()));
		return result;
	}
}
