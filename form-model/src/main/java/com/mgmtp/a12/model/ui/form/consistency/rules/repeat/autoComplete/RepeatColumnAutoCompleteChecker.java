// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.repeat.autoComplete;

import com.mgmtp.a12.kernel.md.model.api.IGroup;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.ICustomFieldType;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IStringType;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.ITypeDefType;
import com.mgmtp.a12.melies.model.internal.DocumentModelAccess;
import com.mgmtp.a12.melies.model.types.FieldBasedRepeatOverviewColumnType;
import com.mgmtp.a12.melies.model.types.RepeatType;
import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.ui.form.consistency.FormModelCategory;
import com.mgmtp.a12.model.ui.form.consistency.FormModelProblemSource;
import com.mgmtp.a12.model.ui.form.consistency.rules.repeat.AbstractRepeatChecker;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

class RepeatColumnAutoCompleteChecker extends AbstractRepeatChecker {

	private final String modelName;

	private final DocumentModelAccess documentModelService;

	RepeatColumnAutoCompleteChecker(final String modelName, final DocumentModelAccess documentModelService) {
		this.modelName = modelName;
		this.documentModelService = documentModelService;
	}

	@Override
	public void executeChecker(final RepeatType repeat, final String checkedElement) {
		final Optional<IGroup> group = documentModelService.findGroupById(repeat.getGroupRef());
		if (group.isEmpty()) {
			// error will be covered by RepeatNestingRule
			return;
		}

		final List<FieldBasedRepeatOverviewColumnType>
			fieldColumns =
			repeat
				.getRepeatOverviewColumn()
				.stream()
				.filter(c -> c instanceof FieldBasedRepeatOverviewColumnType)
				.map(FieldBasedRepeatOverviewColumnType.class::cast)
				.collect(Collectors.toList());

		checkAutocomplete(fieldColumns);
	}

	private void checkAutocomplete(final List<FieldBasedRepeatOverviewColumnType> fieldColumns) {
		for (final FieldBasedRepeatOverviewColumnType fieldColumn : fieldColumns) {
			documentModelService
				.findFieldById(fieldColumn.getElementRef())
				.filter(field -> fieldColumn.isAutoCompleteSet() && !(field
					.getEffectiveType()
					.orElse(null) instanceof IStringType || field
					.getEffectiveType()
					.orElse(null) instanceof ITypeDefType || field
					.getEffectiveType()
					.orElse(null) instanceof ICustomFieldType))
				.ifPresent(field -> repeatProblems.add(new ConsistencyProblem(
					modelName,
					FormModelCategory.FORM_MODEL_AUTOCOMPLETE_ONLY_ALLOWED_FOR_STRING_FIELDS,
					new FormModelProblemSource(fieldColumn.getId()),
					field.getName(),
					fieldColumn.getId(),
					fieldColumn.getElementRef())));
		}
	}
}
