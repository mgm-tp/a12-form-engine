// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.repeat.thumbnailColumn;

import com.mgmtp.a12.kernel.md.model.api.IElement;
import com.mgmtp.a12.kernel.md.model.api.IGroup;
import com.mgmtp.a12.melies.model.internal.DocumentModelAccess;
import com.mgmtp.a12.melies.model.types.ExpositionPresentationEnumType;
import com.mgmtp.a12.melies.model.types.FieldBasedRepeatOverviewColumnType;
import com.mgmtp.a12.melies.model.types.RepeatOverviewColumnType;
import com.mgmtp.a12.melies.model.types.RepeatType;
import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.ui.form.consistency.DocumentModelHelper;
import com.mgmtp.a12.model.ui.form.consistency.FormModelCategory;
import com.mgmtp.a12.model.ui.form.consistency.FormModelProblemSource;
import com.mgmtp.a12.model.ui.form.consistency.rules.repeat.AbstractRepeatChecker;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

class RepeatThumbnailColumnChecker extends AbstractRepeatChecker {

	private final String modelName;
	private final DocumentModelAccess documentModelService;

	RepeatThumbnailColumnChecker(final String modelName, final DocumentModelAccess documentModelService) {
		this.modelName = modelName;
		this.documentModelService = documentModelService;
	}

	@Override
	public void executeChecker(final RepeatType repeat, final String checkedElement) {
		final Optional<IGroup> group = documentModelService.findGroupById(repeat.getGroupRef());
		if (!group.isPresent()) {
			return;
		}

		final List<RepeatOverviewColumnType> fieldColumns = repeat.getRepeatOverviewColumn()
			.stream()
			.filter(c -> c instanceof RepeatOverviewColumnType)
			.map(RepeatOverviewColumnType.class::cast)
			.collect(Collectors.toList());

		checkColumns(repeat, group.get(), fieldColumns);
	}

	private void checkColumns(
		final RepeatType repeat,
		final IGroup boundGroup,
		final List<RepeatOverviewColumnType> fieldColumns
	) {
		for (final RepeatOverviewColumnType fieldColumn : fieldColumns) {
			if (fieldColumn instanceof FieldBasedRepeatOverviewColumnType) {
				final String elementRef = ((FieldBasedRepeatOverviewColumnType) fieldColumn).getElementRef();
				final IElement element = documentModelService.findElementById(elementRef).orElse(null);

				final ExpositionPresentationEnumType
					exposition =
					((FieldBasedRepeatOverviewColumnType) fieldColumn).getExposition();

				if (
					ExpositionPresentationEnumType.THUMBNAIL_OR_ICON.equals(exposition) &&
						!DocumentModelHelper.isAttachmentGroup(element)
				) {
					repeatProblems.add(new ConsistencyProblem(
						modelName,
						FormModelCategory.FORM_MODEL_REPEAT_THUMBNAIL_COLUMN_INVALID_ELEMENT,
						new FormModelProblemSource(fieldColumn.getId()),
						fieldColumn.getId(),
						repeat.getId(),
						repeat.getName()
					));
				}
			}
		}
	}
}
