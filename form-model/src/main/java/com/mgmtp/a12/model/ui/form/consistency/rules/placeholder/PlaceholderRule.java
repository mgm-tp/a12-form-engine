// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.placeholder;

import com.mgmtp.a12.kernel.md.model.api.IElement;
import com.mgmtp.a12.kernel.md.model.api.IField;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IBooleanType;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.ICustomFieldType;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IDateFragmentType;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IDateRangeType;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IDateTimeType;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IDateType;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IEnumerationType;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IFieldType;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.INumberType;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IStringType;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.ITimeType;
import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.MeliesModelUtil;
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
 * Placeholder can only be set for: String, Number, Date, DateTime, Time, DateFragment, DateRange, Custom,
 * Boolean (boolean_select), Enumeration (auto complete and compact) and MultiSelect (auto complete) inputs
 */
public class PlaceholderRule extends AbstractRuleWithDocumentModelService<MeliesModel> {

	@Override
	public List<Problem> executeRule(final MeliesModel model) throws FatalRuleProblemException {
		final List<Problem> problems = new ArrayList<>();

		final DocumentModelAccess documentModelService = createDocumentModelService(model, problems);

		final FieldConfigurationType fieldConfiguration = model.getContent().getFieldConfiguration();

		final List<FieldConfigurationEntryType> fieldConfigurations = fieldConfiguration.getField();
		for (final FieldConfigurationEntryType fieldConfig : fieldConfigurations) {
			if (!fieldConfig.isPlaceholderSet()) {
				continue;
			}
			final String elementRef = fieldConfig.getElementRef();
			final Optional<IElement> elementOptional = documentModelService.findElementById(elementRef);
			if (elementOptional.isEmpty()) {
				// Case is covered by FormFieldReferenceConsistencyRule
				continue;
			}

			final IElement element = elementOptional.get();
			if (!isValidDataType(element, fieldConfig)) {
				problems.add(new ConsistencyProblem(
					model.getHeaderId(),
					FormModelCategory.FORM_MODEL_PLACEHOLDER_INVALID_DATATYPE,
					new FormModelProblemSource(elementRef),
					elementRef,
					element.getName()));
			}
		}
		return problems;
	}

	private static boolean isValidDataType(final IElement element, final FieldConfigurationEntryType fieldConfig) {
		final ExpositionPresentationEnumType exposition = MeliesModelUtil.getExpositionWithDefault(element, fieldConfig);
		if (element instanceof IField field) {
			final IFieldType dataType = field.getEffectiveType().orElse(null);
			return (dataType instanceof IStringType ||
				(dataType instanceof IEnumerationType && exposition == ExpositionPresentationEnumType.COMPACT || exposition == ExpositionPresentationEnumType.AUTOCOMPLETE) ||
				dataType instanceof INumberType ||
				dataType instanceof IDateType ||
				dataType instanceof IDateTimeType ||
				dataType instanceof ITimeType ||
				dataType instanceof IDateFragmentType ||
				dataType instanceof IDateRangeType ||
				dataType instanceof ICustomFieldType) ||
				(dataType instanceof IBooleanType && exposition == ExpositionPresentationEnumType.BOOLEAN_SELECT);
		} else if (DocumentModelHelper.isMultiSelectGroup(element)) {
			return exposition == ExpositionPresentationEnumType.AUTOCOMPLETE;
		}
		return false;
	}
}
