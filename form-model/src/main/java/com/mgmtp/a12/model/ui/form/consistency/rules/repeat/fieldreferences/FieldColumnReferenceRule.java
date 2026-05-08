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
package com.mgmtp.a12.model.ui.form.consistency.rules.repeat.fieldreferences;

import com.mgmtp.a12.kernel.md.model.api.IElement;
import com.mgmtp.a12.kernel.md.model.api.IGroup;
import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.internal.DocumentModelAccess;
import com.mgmtp.a12.melies.model.types.FieldBasedRepeatOverviewColumnType;
import com.mgmtp.a12.melies.model.types.RepeatType;
import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.FormModelCategory;
import com.mgmtp.a12.model.ui.form.consistency.FormModelProblemSource;
import com.mgmtp.a12.model.ui.form.consistency.Granularity;
import com.mgmtp.a12.model.ui.form.consistency.rules.repeat.AbstractRepeatChecker;
import com.mgmtp.a12.model.ui.form.consistency.rules.repeat.AbstractRepeatRule;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Field rules columns must reference fields which are accessible from the bound group of the repeat.
 */
public class FieldColumnReferenceRule extends AbstractRepeatRule {

	@Override
	public AbstractRepeatChecker getRuleChecker(final MeliesModel model, final List<Problem> problems) {

		return new FieldColumnReferenceChecker(
			model.getHeaderId(),
			createDocumentModelService(model, problems)
		);
	}

	private static class FieldColumnReferenceChecker extends AbstractRepeatChecker {

		private final String modelName;
		private final DocumentModelAccess documentModelService;

		FieldColumnReferenceChecker(final String modelName, final DocumentModelAccess documentModelService) {
			this.modelName = modelName;
			this.documentModelService = documentModelService;
		}

		@Override
		public void executeChecker(final RepeatType repeat, final String checkedElement) {

			final Optional<IGroup> group = documentModelService.findGroupById(repeat.getGroupRef());
			if (!group.isPresent()) {
				// error will be covered by RepeatNestingRule
				return;
			}

			final List<FieldBasedRepeatOverviewColumnType> fieldColumns = repeat.getRepeatOverviewColumn()
				.stream()
				.filter(c -> c instanceof FieldBasedRepeatOverviewColumnType)
				.map(FieldBasedRepeatOverviewColumnType.class::cast)
				.collect(Collectors.toList());

			checkColumns(repeat, group.get(), fieldColumns);
		}

		private void checkColumns(
			final RepeatType repeat,
			final IGroup boundGroup,
			final List<FieldBasedRepeatOverviewColumnType> fieldColumns
		) {
			for (final FieldBasedRepeatOverviewColumnType fieldColumn : fieldColumns) {
				final Optional<IElement> elementOptional =
					documentModelService.findElementById(fieldColumn.getElementRef());
				if (!elementOptional.isPresent()) {
					repeatProblems.add(new ConsistencyProblem(
						modelName,
						FormModelCategory.FORM_MODEL_UNKNOWN_ELEMENTREF,
						new FormModelProblemSource(fieldColumn.getId()),
						"field based column",
						fieldColumn.getId(),
						fieldColumn.getElementRef()
					));
					continue;
				}

				final IElement element = elementOptional.get();

				final Granularity boundGroupGranularity = Granularity.computeGranularity(boundGroup);
				final Granularity elementGranularity = Granularity.computeGranularity(element);
				if (!boundGroupGranularity.contains(elementGranularity)) {
					repeatProblems.add(new ConsistencyProblem(
						modelName,
						FormModelCategory.FORM_MODEL_FIELD_COLUMN_ELEMENTREF,
						new FormModelProblemSource(fieldColumn.getId()),
						fieldColumn.getId(),
						repeat.getId(),
						repeat.getName(),
						element.getId(),
						element.getName()
					));
				}
			}
		}
	}
}
