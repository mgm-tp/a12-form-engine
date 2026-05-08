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
package com.mgmtp.a12.model.ui.form.consistency;

import com.mgmtp.a12.model.Model;
import com.mgmtp.a12.model.consistency.rules.ModelConsistencyRule;
import com.mgmtp.a12.model.consistency.rules.ModelConsistencyRulesProvider;
import com.mgmtp.a12.model.ui.form.FormModel;
import com.mgmtp.a12.model.ui.form.consistency.rules.button.FormNavigationButtonRule;
import com.mgmtp.a12.model.ui.form.consistency.rules.condition.HideConditionRule;
import com.mgmtp.a12.model.ui.form.consistency.rules.consistency.FormFieldReferenceConsistencyRule;
import com.mgmtp.a12.model.ui.form.consistency.rules.consistency.FormGroupReferenceRule;
import com.mgmtp.a12.model.ui.form.consistency.rules.consistency.FormReferenceConsistencyRule;
import com.mgmtp.a12.model.ui.form.consistency.rules.consistency.FormUniqueIdsRule;
import com.mgmtp.a12.model.ui.form.consistency.rules.consistency.LabelConsistencyRule;
import com.mgmtp.a12.model.ui.form.consistency.rules.consistency.MetadataReadonlyRule;
import com.mgmtp.a12.model.ui.form.consistency.rules.control.ControlConsistencyRule;
import com.mgmtp.a12.model.ui.form.consistency.rules.controlgrid.ExpressionCellFieldReferenceRule;
import com.mgmtp.a12.model.ui.form.consistency.rules.dependency.DependentFieldTypeCompatibilityRule;
import com.mgmtp.a12.model.ui.form.consistency.rules.dependency.ExternalEnumerationRule;
import com.mgmtp.a12.model.ui.form.consistency.rules.dependency.FormDependencyRule;
import com.mgmtp.a12.model.ui.form.consistency.rules.enableSelectAll.EnableSelectAllRule;
import com.mgmtp.a12.model.ui.form.consistency.rules.exposition.DataTypeExpositionMatchRule;
import com.mgmtp.a12.model.ui.form.consistency.rules.layout.FormColumnIndexRule;
import com.mgmtp.a12.model.ui.form.consistency.rules.layout.FormLayoutRule;
import com.mgmtp.a12.model.ui.form.consistency.rules.layout.FormOffsetSpanRule;
import com.mgmtp.a12.model.ui.form.consistency.rules.metadata.FormCheckStylesRule;
import com.mgmtp.a12.model.ui.form.consistency.rules.metadata.FormEmptyRolesRule;
import com.mgmtp.a12.model.ui.form.consistency.rules.metadata.FormLocalesRule;
import com.mgmtp.a12.model.ui.form.consistency.rules.metadata.FormSchemaVersionPatternRule;
import com.mgmtp.a12.model.ui.form.consistency.rules.metadata.FormSchemaVersionRule;
import com.mgmtp.a12.model.ui.form.consistency.rules.metadata.LocaleCompatibilityRule;
import com.mgmtp.a12.model.ui.form.consistency.rules.name.DuplicateSiblingNameRule;
import com.mgmtp.a12.model.ui.form.consistency.rules.other.AmountSuffixRule;
import com.mgmtp.a12.model.ui.form.consistency.rules.other.AutoExpandAreaRule;
import com.mgmtp.a12.model.ui.form.consistency.rules.other.FormDependentControlRule;
import com.mgmtp.a12.model.ui.form.consistency.rules.other.FormPicusValidationRule;
import com.mgmtp.a12.model.ui.form.consistency.rules.other.SecretAreaLineBreaksRule;
import com.mgmtp.a12.model.ui.form.consistency.rules.placeholder.PlaceholderRule;
import com.mgmtp.a12.model.ui.form.consistency.rules.repeat.autoComplete.RepeatAutoCompleteRule;
import com.mgmtp.a12.model.ui.form.consistency.rules.repeat.columnWidth.RepeatColumnWidthRule;
import com.mgmtp.a12.model.ui.form.consistency.rules.repeat.fieldreferences.ExpressionColumnFieldReferenceRule;
import com.mgmtp.a12.model.ui.form.consistency.rules.repeat.fieldreferences.FieldColumnReferenceRule;
import com.mgmtp.a12.model.ui.form.consistency.rules.repeat.infinitescrolling.InfiniteScrollingRule;
import com.mgmtp.a12.model.ui.form.consistency.rules.repeat.multiFileUpload.MultiFileUploadRule;
import com.mgmtp.a12.model.ui.form.consistency.rules.repeat.nesting.RepeatNestingRule;
import com.mgmtp.a12.model.ui.form.consistency.rules.repeat.numberOfInitialRows.NumberOfInitialRowsRule;
import com.mgmtp.a12.model.ui.form.consistency.rules.repeat.rowaction.DefaultRowActionRule;
import com.mgmtp.a12.model.ui.form.consistency.rules.repeat.rowaction.FormRepeatCustomRowActionsRule;
import com.mgmtp.a12.model.ui.form.consistency.rules.repeat.showCommaSeparated.ShowCommaSeparatedRule;
import com.mgmtp.a12.model.ui.form.consistency.rules.repeat.showSummary.ShowSummaryRule;
import com.mgmtp.a12.model.ui.form.consistency.rules.repeat.thumbnailColumn.RepeatThumbnailColumnRule;

import org.kohsuke.MetaInfServices;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@MetaInfServices
public class FormModelConsistencyRulesProvider implements ModelConsistencyRulesProvider {

	@Override
	public Class<? extends Model> modelType() {
		return FormModel.class;
	}

	@Override
	public boolean supports(final Class clazz) {
		Objects.requireNonNull(clazz);
		return FormModel.class.isAssignableFrom(clazz);
	}

	@Override
	public List<ModelConsistencyRule> getRules() {
		final List<ModelConsistencyRule> formModelRules = new ArrayList<>();
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
		formModelRules.add(new FormPicusValidationRule());
		formModelRules.add(new FormRepeatCustomRowActionsRule());
		formModelRules.add(new ExpressionColumnFieldReferenceRule());
		formModelRules.add(new ExpressionCellFieldReferenceRule());
		formModelRules.add(new FieldColumnReferenceRule());
		formModelRules.add(new FormReferenceConsistencyRule());
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

		return formModelRules;
	}
}
