// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.enableSelectAll;

import com.mgmtp.a12.kernel.md.model.api.IElement;
import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.internal.DocumentModelAccess;
import com.mgmtp.a12.melies.model.types.ExpositionPresentationEnumType;
import com.mgmtp.a12.melies.model.types.FieldConfigurationEntryType;
import com.mgmtp.a12.melies.model.types.FieldConfigurationType;
import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.consistency.rules.FatalRuleProblemException;
import com.mgmtp.a12.model.ui.form.consistency.DocumentModelHelper;
import com.mgmtp.a12.model.ui.form.consistency.FormModelCategory;
import com.mgmtp.a12.model.ui.form.consistency.FormModelProblemSource;
import com.mgmtp.a12.model.ui.form.consistency.rules.consistency.AbstractRuleWithDocumentModelService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * EnableSelectAll can only be set for: MultiSelect (auto complete) inputs
 */
public class EnableSelectAllRule extends AbstractRuleWithDocumentModelService<MeliesModel> {

	@Override
	public List<Problem> executeRule(final MeliesModel model) throws FatalRuleProblemException {
		final List<Problem> problems = new ArrayList<>();

		final DocumentModelAccess documentModelService = createDocumentModelService(model, problems);

		final FieldConfigurationType fieldConfiguration = model.getContent().getFieldConfiguration();

		final List<FieldConfigurationEntryType> fieldConfigurations = fieldConfiguration.getField();
		for (final FieldConfigurationEntryType fieldConfig : fieldConfigurations) {
			final String elementRef = fieldConfig.getElementRef();
			final Optional<IElement> elementOptional = documentModelService.findElementById(elementRef);
			if (!elementOptional.isPresent()) {
				// Case is covered by FormFieldReferenceConsistencyRule
				continue;
			}
			final IElement element = elementOptional.get();

			if (fieldConfig.isEnableSelectAllSet()) {
				if (!isValidDataType(element)) {
					problems.add(new ConsistencyProblem(
						model.getHeaderId(),
						FormModelCategory.FORM_MODEL_ENABLE_SELECT_ALL_INVALID_DATATYPE,
						new FormModelProblemSource(fieldConfig.getElementRef()),
						elementRef,
						element.getName()));
				} else if (!isValidExposition(fieldConfig)) {
					problems.add(new ConsistencyProblem(
						model.getHeaderId(),
						FormModelCategory.FORM_MODEL_ENABLE_SELECT_ALL_INVALID_EXPOSITION,
						new FormModelProblemSource(fieldConfig.getElementRef()),
						elementRef,
						element.getName()));
				}
			}
		}
		return problems;
	}

	private static boolean isValidDataType(final IElement element) {
		return DocumentModelHelper.isMultiSelectGroup(element);
	}

	private static boolean isValidExposition(final FieldConfigurationEntryType fieldConfig) {
		final ExpositionPresentationEnumType exposition = fieldConfig.getExposition();

		return ExpositionPresentationEnumType.FULL.equals(exposition) || ExpositionPresentationEnumType.INLINE.equals(
			exposition);
	}

}
