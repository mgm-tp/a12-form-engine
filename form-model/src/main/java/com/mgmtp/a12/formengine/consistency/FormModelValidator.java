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
package com.mgmtp.a12.formengine.consistency;

import com.mgmtp.a12.model.Model;
import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.ConsistencyValidator;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.data.document.ModelResolver;

import com.mgmtp.a12.kernel.md.model.api.IDocumentModel;

import com.mgmtp.a12.formengine.consistency.rules.button.FormNavigationButtonRule;
import com.mgmtp.a12.formengine.consistency.rules.condition.HideConditionRule;
import com.mgmtp.a12.formengine.consistency.rules.consistency.*;
import com.mgmtp.a12.formengine.consistency.rules.control.ControlConsistencyRule;
import com.mgmtp.a12.formengine.consistency.rules.controlgrid.ExpressionCellFieldReferenceRule;
import com.mgmtp.a12.formengine.consistency.rules.dependency.DependentFieldTypeCompatibilityRule;
import com.mgmtp.a12.formengine.consistency.rules.dependency.ExternalEnumerationRule;
import com.mgmtp.a12.formengine.consistency.rules.dependency.FormDependencyRule;
import com.mgmtp.a12.formengine.consistency.rules.enableSelectAll.EnableSelectAllRule;
import com.mgmtp.a12.formengine.consistency.rules.exposition.DataTypeExpositionMatchRule;
import com.mgmtp.a12.formengine.consistency.rules.layout.FormColumnIndexRule;
import com.mgmtp.a12.formengine.consistency.rules.layout.FormLayoutRule;
import com.mgmtp.a12.formengine.consistency.rules.layout.FormOffsetSpanRule;
import com.mgmtp.a12.formengine.consistency.rules.metadata.*;
import com.mgmtp.a12.formengine.consistency.rules.name.DuplicateSiblingNameRule;
import com.mgmtp.a12.formengine.consistency.rules.other.AmountSuffixRule;
import com.mgmtp.a12.formengine.consistency.rules.other.AutoExpandAreaRule;
import com.mgmtp.a12.formengine.consistency.rules.other.FormDependentControlRule;
import com.mgmtp.a12.formengine.consistency.rules.other.SecretAreaLineBreaksRule;
import com.mgmtp.a12.formengine.consistency.rules.placeholder.PlaceholderRule;
import com.mgmtp.a12.formengine.consistency.rules.repeat.autoComplete.RepeatAutoCompleteRule;
import com.mgmtp.a12.formengine.consistency.rules.repeat.columnWidth.RepeatColumnWidthRule;
import com.mgmtp.a12.formengine.consistency.rules.repeat.fieldreferences.ExpressionColumnFieldReferenceRule;
import com.mgmtp.a12.formengine.consistency.rules.repeat.fieldreferences.FieldColumnReferenceRule;
import com.mgmtp.a12.formengine.consistency.rules.repeat.infinitescrolling.InfiniteScrollingRule;
import com.mgmtp.a12.formengine.consistency.rules.repeat.multiFileUpload.MultiFileUploadRule;
import com.mgmtp.a12.formengine.consistency.rules.repeat.nesting.RepeatNestingRule;
import com.mgmtp.a12.formengine.consistency.rules.repeat.numberOfInitialRows.NumberOfInitialRowsRule;
import com.mgmtp.a12.formengine.consistency.rules.repeat.rowaction.DefaultRowActionRule;
import com.mgmtp.a12.formengine.consistency.rules.repeat.rowaction.FormRepeatCustomRowActionsRule;
import com.mgmtp.a12.formengine.consistency.rules.repeat.showCommaSeparated.ShowCommaSeparatedRule;
import com.mgmtp.a12.formengine.consistency.rules.repeat.showSummary.ShowSummaryRule;
import com.mgmtp.a12.formengine.consistency.rules.repeat.thumbnailColumn.RepeatThumbnailColumnRule;
import com.mgmtp.a12.formengine.model.FormModel;
import com.mgmtp.a12.formengine.model.FormModelUtil;
import com.mgmtp.a12.formengine.model.internal.DocumentModelAccess;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public class FormModelValidator extends ConsistencyValidator<FormModel> {

	private final List<ConsistencyRule> formModelRules;

	public FormModelValidator(final ModelResolver modelResolver) {
		super(modelResolver);

		this.formModelRules = new ArrayList<>();
		formModelRules.add(new SecretAreaLineBreaksRule());
		formModelRules.add(new DuplicateSiblingNameRule());
		formModelRules.add(new FormLocalesRule());
		formModelRules.add(new FormLayoutRule());
		formModelRules.add(new FormOffsetSpanRule());
		formModelRules.add(new FormSchemaVersionPatternRule());
		formModelRules.add(new FormSchemaVersionRule());
		formModelRules.add(new FormColumnIndexRule());
		formModelRules.add(new FormDependentControlRule());
		formModelRules.add(new FormCheckStylesRule());
		formModelRules.add(new FormNavigationButtonRule());
		formModelRules.add(new FormFieldReferenceConsistencyRule());
		formModelRules.add(new FormRepeatCustomRowActionsRule());
		formModelRules.add(new ExpressionColumnFieldReferenceRule());
		formModelRules.add(new ExpressionCellFieldReferenceRule());
		formModelRules.add(new FieldColumnReferenceRule());
		formModelRules.add(new FormElementReferenceRule());
		formModelRules.add(new FormDependencyRule());
		formModelRules.add(new FormGroupReferenceRule());
		formModelRules.add(new RepeatNestingRule());
		formModelRules.add(new RepeatColumnWidthRule());
		formModelRules.add(new ExternalEnumerationRule());
		formModelRules.add(new AutoExpandAreaRule());
		formModelRules.add(new DefaultRowActionRule());
		formModelRules.add(new DependentFieldTypeCompatibilityRule());
		formModelRules.add(new LocaleCompatibilityRule());
		formModelRules.add(new PlaceholderRule());
		formModelRules.add(new DataTypeExpositionMatchRule());
		formModelRules.add(new EnableSelectAllRule());
		formModelRules.add(new InfiniteScrollingRule());
		formModelRules.add(new NumberOfInitialRowsRule());
		formModelRules.add(new ControlConsistencyRule());
		formModelRules.add(new LabelConsistencyRule());
		formModelRules.add(new FormUniqueIdsRule());
		formModelRules.add(new ShowCommaSeparatedRule());
		formModelRules.add(new ShowSummaryRule());
		formModelRules.add(new FormEmptyRolesRule());
		formModelRules.add(new RepeatThumbnailColumnRule());
		formModelRules.add(new MultiFileUploadRule());
		formModelRules.add(new AmountSuffixRule());
		formModelRules.add(new RepeatAutoCompleteRule());
		formModelRules.add(new MetadataReadonlyRule());
		formModelRules.add(new HideConditionRule());
	}

	private Optional<Model> tryGetModel(String modelName) {
		try {
			return getModelResolver().getModel(modelName);
		} catch (Exception e) {
			return Optional.empty();
		}
	}

	@Override
	public List<Problem> validate(FormModel model) {

		final List<Problem> modelProblems = new ArrayList<>();

		final String documentModelName = FormModelUtil.getDocumentModelReference(model);

		final Optional<Model> resolvedModel = tryGetModel(documentModelName);
		if (resolvedModel.isEmpty() || !(resolvedModel.get() instanceof IDocumentModel dm)) {
			return List.of(new ConsistencyProblem(
				model.getHeaderId(),
				FormModelCategory.MODEL_COULD_NOT_BE_RESOLVED,
				new FormModelProblemSource(model.getHeaderId()),
				documentModelName));
		}

		final DocumentModelAccess dmModelAccess = new DocumentModelAccess(DocumentModelMetaDataEnricher.getInstance().enrichDocumentModel(dm));

		for (final ConsistencyRule rule : formModelRules) {
			try {
				modelProblems.addAll(rule.execute(model, dmModelAccess));
			} catch (final ConsistencyValidationException e) {
				final List<Problem> problems = e.getProblems();
				if (problems != null) {
					modelProblems.addAll(problems);
				}
			}
		}

		return modelProblems;
	}

	@Override
	public List<Problem> validateSet(Collection<FormModel> models) {
		final List<Problem> problems = new ArrayList<>();
		for (final FormModel model : models) {
			problems.addAll(validate(model));
		}
		return problems;
	}
}
