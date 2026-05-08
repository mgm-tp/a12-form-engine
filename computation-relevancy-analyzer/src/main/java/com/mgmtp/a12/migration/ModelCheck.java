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

import com.mgmtp.a12.kernel.core.codegen.internal.utils.CalculationCodeGenUtilities;
import com.mgmtp.a12.kernel.core.parsetree.a12internal.api.IEntityId;
import com.mgmtp.a12.kernel.core.parsetree.a12internal.api.condition.ICondition;
import com.mgmtp.a12.kernel.md.model.a12internal.services.DocumentModelService;
import com.mgmtp.a12.kernel.md.model.api.IDocumentModel;
import com.mgmtp.a12.melies.model.MeliesModel;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static com.mgmtp.a12.migration.FormModelAccess.collectNonRelevantElements;

/**
 * Traverses as set of form and document models to find all combinations of DM computations and FM dependencies (using notRelevant)
 * that could be affected by a changing behavior after migration from "hide+clear" to "notRelevant" in A12 2024.06.
 */
class ModelCheck {

	static List<Finding> scanModelTuple(MeliesModel formModel, IDocumentModel documentModel) {
		final var nonRelevantElements = collectNonRelevantElements(formModel, documentModel);

		final DocumentModelService dmService = new DocumentModelService();
		final var dm = dmService.convertFromExternal(documentModel);

		final var calculationService = dmService.getCalculationServiceForModel(dm, null);
		final var elementContainer = dmService.convert(dm, null);

		final var findings = new ArrayList<Finding>();

		elementContainer.getAllCalculations().forEach(calculation -> {
			final var calcInfo =
				calculationService.extractCalculationInfo(calculation, problem -> {})
								  .orElseThrow(() -> new RuntimeException(
									  "Failed to extract calculation info for calculation ["
									  + calculation.getRule()
												   .getFullName()
									  + "]"));
			final Set<IEntityId> operands =
				CalculationCodeGenUtilities.getOperandenMenge(Collections.singletonList(calcInfo), elementContainer);
			final Set<IEntityId> referencesInAllParts = new HashSet<>();
			calcInfo.getCommonPrecondition()
					.ifPresent(preCondition -> referencesInAllParts.addAll(collectReferencesFromCondition(preCondition)));
			calcInfo.getPartialCalculations()
					.stream()
					.forEach(partialCalculation -> {
						if(partialCalculation.getKey() != null) {
							referencesInAllParts.addAll(collectReferencesFromCondition(	partialCalculation.getKey()));
						}
					});
			referencesInAllParts.addAll(operands);

			// cases that should be covered:
			// - 1. direct match on expanded set of non-relevant elements (transitive closure of non-relevant elements)
			// - 2. group operand contains non-relevant element which is not(!) repeatable
			// - 3. operand is (transitively) dependent on non-relevant field (requires dependency graphs of FM dependency chains) -- how important is this?

			// 1.
			final var directMatches = referencesInAllParts
				.stream()
				.map(IEntityId::getFullName)
				.filter(fullName -> nonRelevantElements.contains(fullName))
				.collect(Collectors.toSet());
			if (!directMatches.isEmpty()) {
				findings.add(new Finding(
					calculation.getRule().getFullName(),
					new NonRelevantOperandIssue(directMatches)
				));
			}

			// 2.
			final var groupExpander = new GroupExpander(documentModel);
			final var containedMatches = referencesInAllParts
				.stream()
				// only groups
				.filter(op -> !op.isField())
				.map(op -> op.getFullName())
				// expand group path to paths of all transitively contained fields
				.map(groupExpander::expand)
				// find overlap with non-relevant elements
				.map(op -> new GroupExpander.ExpandedGroup(
						 op.groupPath(),
						 op.elementPaths().stream().filter(e -> nonRelevantElements.contains(e)).collect(Collectors.toSet())
					 )
				)
				// remove all expanded groups that do not contain non-relevant elements
				.filter(expandedGroup -> !expandedGroup.elementPaths().isEmpty())
				// do no report contained matches for direct matches on groups (again)
				.filter(expandedGroup -> !directMatches.contains(expandedGroup.groupPath()))
				.collect(Collectors.toSet());
			if (!containedMatches.isEmpty()) {
				findings.add(new Finding(calculation.getRule().getFullName(), new GroupOperandIssue(containedMatches)));
			}

			// 3.
			// TODO: how to get a dependency graph of FM dependencies?
		});

		return findings;
	}

	private static Set<IEntityId> collectReferencesFromCondition(final ICondition condition) {
		final var visitor = new ElementReferenceCollectionVisitor();
		condition.traverse(visitor);
		return visitor.getCollectedEntities();
	}
}
