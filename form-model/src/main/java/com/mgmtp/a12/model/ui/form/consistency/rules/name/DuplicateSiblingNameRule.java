// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.name;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.types.HeaderFooterType;
import com.mgmtp.a12.melies.model.types.Id;
import com.mgmtp.a12.melies.model.types.Named;
import com.mgmtp.a12.melies.model.visitor.ModelWalker;
import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.consistency.rules.FatalRuleProblemException;
import com.mgmtp.a12.model.notification.Severity;
import com.mgmtp.a12.model.ui.form.consistency.FormModelCategory;
import com.mgmtp.a12.model.ui.form.consistency.FormModelConsistencyRule;
import com.mgmtp.a12.model.ui.form.consistency.FormModelProblemSource;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.Strings;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

public class DuplicateSiblingNameRule implements FormModelConsistencyRule {

	private static final String UNDESIRED_TYPE_SUFFIX = "Ext";

	private static <T extends Named> Problem problemFromNamed(
		final MeliesModel model,
		final T element,
		final Collection<String> childNames
	) {
		return problem(
			model,
			element,
			element instanceof Id ? ((Id) element).getId() : "-",
			element.getName(),
			childNames
		);
	}

	private static Problem problem(
		final MeliesModel model,
		final Object element,
		final String elementId,
		final String elementName,
		final Collection<String> childNames
	) {
		return new ConsistencyProblem(
			model.getHeaderId(),
			FormModelCategory.FORM_MODEL_DUPLICATE_ELEMENT_NAME,
			new FormModelProblemSource(elementId),
			Severity.INFO,
			elementId,
			elementName,
			Strings.CS.removeEnd(element.getClass().getSimpleName(), UNDESIRED_TYPE_SUFFIX),
			String.join(",", childNames)
		);
	}

	@Override
	public List<Problem> executeRule(final MeliesModel model) throws FatalRuleProblemException {
		final List<Problem> problemCollection = new ArrayList<>();

		final DuplicateNamesDetectionVisitor.Handler problemHandler = new DuplicateNamesDetectionVisitor.Handler() {
			@Override
			public void handle(
				final MeliesModel model,
				final Object modelElement,
				final String modelElementId,
				final String elementName,
				final Set<String> duplicateChildNames
			) {
				final Problem problem = modelElement instanceof HeaderFooterType
					? problem(model, modelElement, modelElementId, elementName, duplicateChildNames)
					: problemFromNamed(model, (Named) modelElement, duplicateChildNames);
				problemCollection.add(problem);
			}
		};
		final ModelWalker walker = new ModelWalker(new DuplicateNamesDetectionVisitor(model, problemHandler));
		walker.acceptModel(model);

		addDuplicateScreenNames(model, problemCollection);

		return problemCollection;
	}

	private void addDuplicateScreenNames(final MeliesModel model, final List<Problem> problemCollection) {
		final List<String> duplicateScreenNames =
			model.getContent()
				.getScreens()
				.stream()
				.map(Named::getName)
				.collect(Collectors.groupingBy(Function.identity(), Collectors.counting()))
				.entrySet()
				.stream()
				.filter(p -> p.getValue() > 1)
				.map(Map.Entry::getKey)
				.collect(Collectors.toList());
		if (!duplicateScreenNames.isEmpty()) {
			problemCollection.add(
				problem(
					model,
					model.getContent().getScreens(),
					"-",
					"screens",
					duplicateScreenNames
				));
		}
	}
}
