// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
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
