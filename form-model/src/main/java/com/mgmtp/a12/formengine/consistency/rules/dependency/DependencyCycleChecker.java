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
package com.mgmtp.a12.formengine.consistency.rules.dependency;

import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;

import com.mgmtp.a12.kernel.core.tool.a12internal.api.error.ProblemException;
import com.mgmtp.a12.kernel.core.tool.a12internal.api.services.ICalculationService;
import com.mgmtp.a12.kernel.core.tool.a12internal.api.services.ICalculationService.IRefType;
import com.mgmtp.a12.kernel.core.tool.a12internal.api.services.ICalculationService.IRuleRef;
import com.mgmtp.a12.kernel.md.model.api.IElement;
import com.mgmtp.a12.kernel.md.model.api.IIdNamed;

import com.mgmtp.a12.formengine.consistency.FormModelCategory;
import com.mgmtp.a12.formengine.consistency.FormModelProblemSource;
import com.mgmtp.a12.formengine.model.internal.DocumentModelAccess;
import com.mgmtp.a12.formengine.model.types.DependentEnumerationType;
import com.mgmtp.a12.formengine.model.types.DependentFieldType;
import com.mgmtp.a12.formengine.model.types.FieldConfigurationEntryType;
import com.mgmtp.a12.formengine.model.types.FieldConfigurationType;
import com.mgmtp.a12.formengine.model.types.GroupConfigurationType;

import java.util.AbstractMap;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import org.apache.commons.lang3.tuple.Pair;

/**
 * Check for cyclic references inside field, enumeration dependencies and computations
 */
class DependencyCycleChecker {

	record DependencyInfo(String masterFieldPath, String dependencyType) {

	}

	private final String modelName;
	private final ICalculationService calcService;
	private final DocumentModelAccess dmAccess;

	public DependencyCycleChecker(
		final String modelName,
		final DocumentModelAccess dmAccess,
		final ICalculationService calcService) {
		this.modelName = modelName;
		this.calcService = calcService;
		this.dmAccess = dmAccess;
	}

	/**
	 * Check, whether the dependencies from the given field/group configurations and the computations from the current
	 * document model lead to any cyclic references between fields.
	 */
	public List<Problem> checkFieldCycleReference(
		final FieldConfigurationType fieldConfig,
		final GroupConfigurationType groupConfig) {
		final Map<String, List<DependencyInfo>> formModelDependencies = calculateDependencies(fieldConfig, groupConfig);

		final List<Problem> cycleProblems = new LinkedList<>();

		try {
			final Map<String, Set<String>>
				dependenciesForCycleChecker =
				convertDependenciesForCycleChecker(formModelDependencies);
			final Optional<List<Pair<String, IRefType>>> cycle = calcService.checkForCycle(dependenciesForCycleChecker);

			cycle.ifPresent(cycleSegments -> {
				final String firstCycleElementId = findFirstCycleElementId(cycle.get()).orElse(null);
				cycleProblems.add(mapCycleToProblem(
					orderCycle(cycleSegments),
					formModelDependencies,
					firstCycleElementId));
			});
		} catch (final ProblemException e) {
			throw new RuntimeException(e);
		}

		return cycleProblems;
	}

	/**
	 * Calculates a map of dependencies in the form model, which maps the field path of dependent fields to a list of
	 * DependencyInfo objects, where each DependencyInfo object corresponds to a dependency in the form model. <br/>
	 * Iterates through all dependencies in the given field and group configurations. All "relevant" dependencies are
	 * added to the result. A dependency is relevant if it could theoretically lead to a value change of the dependent
	 * field.
	 */
	private Map<String, List<DependencyInfo>> calculateDependencies(
		final FieldConfigurationType fieldConfig,
		final GroupConfigurationType groupConfig) {
		// TODO: Isn't it a bug that we are ignoring the group config here?
		final Map<String, List<DependencyInfo>> formModelDependencies = new HashMap<>();

		for (final FieldConfigurationEntryType fce : fieldConfig.getField()) {
			final String elementRef = fce.getElementRef();
			final String elementPath = dmAccess.getElementPath(elementRef).orElse(null);

			if (fce.isDependentFieldSet()) {
				final DependentFieldType depField = fce.getDependentField();

				final boolean relevant = depField.getCase().stream().anyMatch(c -> c.isFieldRefSet() || c.isValueSet());

				if (relevant) {
					depField.getCase().stream().filter(f -> f.isFieldRefSet()).forEach(f -> {
						final String fieldRef = f.getFieldRef();
						final String fieldPath = dmAccess.getElementPath(fieldRef).orElse(null);
						updateDependencies(formModelDependencies, elementPath, fieldPath, "Field Dependency");
					});
					final String masterRef = depField.getMasterField();
					final String masterPath = dmAccess.getElementPath(masterRef).orElse(null);

					updateDependencies(formModelDependencies, elementPath, masterPath, "Field Dependency");
				}
			}

			if (fce.isDependentEnumerationSet()) {
				final DependentEnumerationType depEnum = fce.getDependentEnumeration();

				final String masterRef = depEnum.getMasterField();
				final String masterPath = dmAccess.getElementPath(masterRef).orElse(null);

				updateDependencies(formModelDependencies, elementPath, masterPath, "Enumeration Dependency");
			}
		}
		return formModelDependencies;
	}

	/**
	 * Adds a new dependency to the given dependency map.
	 */
	private void updateDependencies(
		final Map<String, List<DependencyInfo>> formModelDependencies,
		final String elementPath,
		final String masterPath,
		final String dependencyType) {
		if (elementPath != null && masterPath != null) {
			final List<DependencyInfo> current = formModelDependencies.get(elementPath);
			final DependencyInfo newDependencyInfo = new DependencyInfo(masterPath, dependencyType);

			if (current != null) {
				current.add(newDependencyInfo);
			} else {
				final List<DependencyInfo> dependencyList = new ArrayList<>();
				dependencyList.add(newDependencyInfo);

				formModelDependencies.put(elementPath, dependencyList);
			}
		}
	}

	/**
	 * Converts the given dependency map to the input format for {@link ICalculationService#checkForCycle(Map)}
	 */
	private Map<String, Set<String>> convertDependenciesForCycleChecker(final Map<String, List<DependencyInfo>> formModelDependencies) {
		return formModelDependencies.entrySet().stream().map(e -> {
			final List<DependencyInfo> dependencyList = e.getValue();
			final Set<String>
				masterFieldSet =
				dependencyList.stream().map(DependencyInfo::masterFieldPath).collect(Collectors.toSet());

			return new AbstractMap.SimpleEntry<>(e.getKey(), masterFieldSet);
		}).collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
	}

	private List<Pair<String, IRefType>> orderCycle(final List<Pair<String, IRefType>> cycleSegments) {
		final List<String> result = cycleSegments.stream().map(DependencyCycleChecker::cycleLinkString).toList();
		// Cycle strings should never be empty and therefore always a min should be found
		final String min = result.stream().min(Comparator.comparing(Function.identity())).orElse("");
		assert !min.isEmpty();
		final int index = result.indexOf(min);
		// Rotate the original list so that the smallest item is first
		Collections.rotate(cycleSegments, -index);
		return cycleSegments;
	}

	// this function is only used to serialize a cycle segment to determine an ordering based on this representation
	private static String cycleLinkString(final Pair<String, ICalculationService.IRefType> link) {
		return String.format("name: %s", link.getLeft());
	}

	private Optional<String> findFirstCycleElementId(final List<Pair<String, IRefType>> cycleSegments) {
		final String firstCycleElementPath = cycleSegments.getFirst().getLeft();
		final Optional<IElement> firstCycleElement = dmAccess.findElementByPath(firstCycleElementPath);
		return firstCycleElement.map(IIdNamed::getId);
	}

	private Problem mapCycleToProblem(
		final List<Pair<String, IRefType>> cycleSegments,
		final Map<String, List<DependencyInfo>> formModelDependencies,
		final String firstCycleElementId) {
		return new ConsistencyProblem(
			modelName,
			FormModelCategory.FORM_MODEL_FIELD_CYCLE_REFERENCE,
			new FormModelProblemSource(firstCycleElementId),
			constructCyclePath(cycleSegments, formModelDependencies));
	}

	/**
	 * FIXME: This method currently always produces English output. This should be fixed when
	 * the Java Localization API is available => A12-13739
	 */
	private String constructCyclePath(
		final List<Pair<String, IRefType>> cycleSegments,
		final Map<String, List<DependencyInfo>> formModelDependencies) {
		return IntStream.range(0, cycleSegments.size()).mapToObj(index -> {
			final Pair<String, IRefType> currSegment = cycleSegments.get(index);

			final int nextIndex = index == cycleSegments.size() - 1 ? 0 : index + 1;
			final Pair<String, IRefType> nextSegment = cycleSegments.get(nextIndex);

			final String fieldPath = currSegment.getKey();
			final IRefType reference = currSegment.getValue();

			final List<DependencyInfo> currDependencies = formModelDependencies.get(currSegment.getKey());

			final DependencyInfo
				currDependency =
				currDependencies != null ? currDependencies
					.stream()
					.filter(d -> d.masterFieldPath().equals(nextSegment.getKey()))
					.findFirst()
					.orElse(null) : null;

			final String dependencyType = currDependency != null ? currDependency.dependencyType() : "";

			final String
				referencedBy =
				reference instanceof IRuleRef
					? "Computation [path: " + ((IRuleRef) reference).getFullName() + "]"
					: dependencyType;

			return "Field [path: " + fieldPath + "] referenced by " + referencedBy;
		}).collect(Collectors.joining(" -> "));
	}
}
