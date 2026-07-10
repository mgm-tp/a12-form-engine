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
package com.mgmtp.a12.formengine.consistency.rules.consistency;

import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;

import com.mgmtp.a12.kernel.md.model.api.IField;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IEnumerationType;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IEnumerationType.IEnumValue;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IFieldType;

import com.mgmtp.a12.formengine.consistency.DocumentModelHelper;
import com.mgmtp.a12.formengine.consistency.FormModelCategory;
import com.mgmtp.a12.formengine.consistency.FormModelProblemSource;
import com.mgmtp.a12.formengine.model.FormModel;
import com.mgmtp.a12.formengine.model.internal.DocumentModelAccess;
import com.mgmtp.a12.formengine.model.types.DependentEnumerationConstraint;
import com.mgmtp.a12.formengine.model.types.DependentEnumerationConstraintValue;
import com.mgmtp.a12.formengine.model.types.DependentEnumerationType;
import com.mgmtp.a12.formengine.model.types.FieldConfigurationEntryType;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

class DependentEnumerationChecker extends AbstractReferenceChecker {

	public DependentEnumerationChecker(final FormModel formModel, final DocumentModelAccess documentModelService) {
		super(formModel, documentModelService);
	}

	/**
	 * check master of dependent enumeration, if exist and is enumeration field
	 *
	 * @param fieldConfigurationEntry
	 */
	List<Problem> checkDependentEnumeration(final FieldConfigurationEntryType fieldConfigurationEntry) {
		final List<Problem> problems = new ArrayList<>();
		final DependentEnumerationType dependentEnumeration = fieldConfigurationEntry.getDependentEnumeration();
		if (dependentEnumeration != null) {
			// check for master field
			final String masterFieldRef = dependentEnumeration.getMasterField();
			final Optional<IField> masterField = documentModelService.findFieldById(masterFieldRef);
			if (masterField.isPresent()) {
				final IFieldType masterFieldEffectiveDataType = masterField.get().getEffectiveType().orElse(null);
				if (!(masterFieldEffectiveDataType instanceof IEnumerationType)) {
					problems.add(new ConsistencyProblem(
						formModel.getHeaderId(),
						FormModelCategory.DEPENDENT_ENUM_MASTER_FIELD_INVALID_TYPE,
						new FormModelProblemSource(fieldConfigurationEntry.getElementRef()),
						masterFieldRef,
						documentModelService.getDocumentModelId(),
						DocumentModelHelper.getFieldTypeString(masterFieldEffectiveDataType)
					));
				} else {
					problems.addAll(checkEnumerationValuesOfMasterField(
						fieldConfigurationEntry,
						dependentEnumeration.getConstraint(),
						masterFieldRef,
						masterFieldEffectiveDataType
					));
					problems.addAll(checkDependentEnumerationFieldType(fieldConfigurationEntry, dependentEnumeration));
					problems.addAll(checkValueForMasterChangeOfDependentEnumerationField(
						fieldConfigurationEntry,
						dependentEnumeration));
				}
			} else {
				problems.add(
					new ConsistencyProblem(
						formModel.getHeaderId(),
						FormModelCategory.MISSING_DM_FIELD_IN_DEPENDENT_ENUMERATION_MASTER,
						new FormModelProblemSource(fieldConfigurationEntry.getElementRef()),
						masterFieldRef,
						documentModelService.getDocumentModelId()));
			}
		}
		return problems;
	}

	private List<Problem> checkEnumerationValuesOfMasterField(
		final FieldConfigurationEntryType fieldConfigurationEntry,
		final List<DependentEnumerationConstraint> constraints,
		final String masterFieldRef,
		final IFieldType masterFieldEffectiveDataType
	) {
		final List<Problem> problems = new ArrayList<>();
		// get enumeration values from master field
		final IEnumerationType masterFieldEnumerationData = (IEnumerationType) masterFieldEffectiveDataType;
		final List<String> masterEnumerationVales = new ArrayList<>();
		for (final IEnumValue enumerationDataValue : masterFieldEnumerationData.getValues()) {
			masterEnumerationVales.add(enumerationDataValue.getValue());
		}

		// check enumeration values from master field
		for (final DependentEnumerationConstraint constraint : constraints) {
			if (!masterEnumerationVales.contains(constraint.getMasterValue())) {
				problems.add(new ConsistencyProblem(
					formModel.getHeaderId(),
					FormModelCategory.DEPENDENT_ENUM_INVALID_MASTER_ENUMERATION_VALUE,
					new FormModelProblemSource(fieldConfigurationEntry.getElementRef()),
					masterFieldRef,
					documentModelService.getDocumentModelId(),
					constraint.getMasterValue()
				));
			}
		}
		return problems;
	}

	private List<Problem> checkDependentEnumerationFieldType(
		final FieldConfigurationEntryType fieldConfigurationEntry,
		final DependentEnumerationType dependentEnumeration
	) {
		final List<Problem> problems = new ArrayList<>();
		final Optional<IField> dependentEnumerationField =
			documentModelService.findFieldById(fieldConfigurationEntry.getElementRef());

		if (!dependentEnumerationField.isPresent()) {
			problems.add(new ConsistencyProblem(
				formModel.getHeaderId(),
				FormModelCategory.MISSING_DM_FIELD_IN_DEPENDENT_ENUMERATION,
				new FormModelProblemSource(fieldConfigurationEntry.getElementRef()),
				fieldConfigurationEntry.getElementRef(),
				documentModelService.getDocumentModelId()
			));
			return problems;
		}

		final Optional<IFieldType> dependentFieldDataType = dependentEnumerationField.get().getEffectiveType();
		if (!dependentFieldDataType.isPresent() || !(dependentFieldDataType.get() instanceof IEnumerationType)) {
			problems.add(
				new ConsistencyProblem(
					formModel.getHeaderId(),
					FormModelCategory.DEPENDENT_ENUM_DEPENDENT_FIELD_INVALID_TYPE,
					new FormModelProblemSource(fieldConfigurationEntry.getElementRef()),
					dependentEnumerationField.get().getId(),
					documentModelService.getDocumentModelId(),
					DocumentModelHelper.getFieldTypeString(dependentFieldDataType.get())));
		} else {
			problems.addAll(
				checkEnumerationValuesOfDependentEnumerationField(
					fieldConfigurationEntry,
					dependentEnumeration,
					dependentEnumerationField.get(),
					dependentFieldDataType.get()));
		}
		return problems;
	}

	private List<Problem> checkEnumerationValuesOfDependentEnumerationField(
		final FieldConfigurationEntryType fieldConfigurationEntry,
		final DependentEnumerationType dependentEnumeration,
		final IField dependentEnumerationField,
		final IFieldType dependentFieldEffectiveDataType
	) {
		final List<Problem> problems = new ArrayList<>();
		final IEnumerationType dependentFieldEnumerationData = (IEnumerationType) dependentFieldEffectiveDataType;
		final List<String> dependentEnumerationValues = new ArrayList<>();
		for (final IEnumValue enumerationDataValue : dependentFieldEnumerationData.getValues()) {
			dependentEnumerationValues.add(enumerationDataValue.getValue());
		}
		// compare enumeration values from dependent field with values in each dependent enumeration constraint
		for (final DependentEnumerationConstraint constraint : dependentEnumeration.getConstraint()) {
			for (final DependentEnumerationConstraintValue constraintValue : constraint.getConstraintValues()) {
				if (!dependentEnumerationValues.contains(constraintValue.getValue())) {
					problems.add(new ConsistencyProblem(
						formModel.getHeaderId(),
						FormModelCategory.DEPENDENT_ENUM_INVALID_DEPENDENT_ENUMERATION_VALUE,
						new FormModelProblemSource(fieldConfigurationEntry.getElementRef()),
						dependentEnumerationField.getId(),
						documentModelService.getDocumentModelId(),
						constraintValue.getValue()
					));
				}
			}

		}
		return problems;
	}

	private List<Problem> checkValueForMasterChangeOfDependentEnumerationField(
		final FieldConfigurationEntryType fieldConfigurationEntry,
		final DependentEnumerationType dependentEnumeration
	) {
		final List<Problem> problems = new ArrayList<>();
		final Optional<IField>
			dependentEnumerationField =
			documentModelService.findFieldById(fieldConfigurationEntry.getElementRef());
		if (!dependentEnumerationField.isPresent()) {
			// Covered by other check
			return problems;
		}

		// compare valueForMasterChange from dependent field with values in each dependent enumeration constraint
		for (final DependentEnumerationConstraint constraint : dependentEnumeration.getConstraint()) {
			if (!constraint.isValueForMasterChangeSet()) {
				continue;
			}

			final String constraintValue = constraint.getValueForMasterChange();
			if (constraintValue != null && !constraint
				.getConstraintValues()
				.stream()
				.anyMatch(c -> c.getValue().equals(constraintValue))) {
				problems.add(new ConsistencyProblem(
					formModel.getHeaderId(),
					FormModelCategory.DEPENDENT_ENUM_INVALID_VALUE_FOR_MASTER_CHANGE_ENUMERATION_VALUE,
					new FormModelProblemSource(fieldConfigurationEntry.getElementRef()),
					dependentEnumerationField.get().getId(),
					documentModelService.getDocumentModelId(),
					constraintValue
				));
			}
		}

		return problems;
	}

}
