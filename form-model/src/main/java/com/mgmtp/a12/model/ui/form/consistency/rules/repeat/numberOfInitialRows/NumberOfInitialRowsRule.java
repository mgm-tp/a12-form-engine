// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.repeat.numberOfInitialRows;

import com.mgmtp.a12.kernel.md.model.api.IGroup;
import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.internal.DocumentModelAccess;
import com.mgmtp.a12.melies.model.types.GroupConfigurationEntryType;
import com.mgmtp.a12.melies.model.types.GroupConfigurationType;
import com.mgmtp.a12.melies.model.types.InlineRepeatType;
import com.mgmtp.a12.melies.model.types.RepeatType;
import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.FormModelProblemSource;
import com.mgmtp.a12.model.ui.form.consistency.rules.repeat.AbstractRepeatChecker;
import com.mgmtp.a12.model.ui.form.consistency.rules.repeat.AbstractRepeatRule;

import java.util.List;

import static com.mgmtp.a12.model.ui.form.consistency.FormModelCategory.FORM_MODEL_REPEAT_NUMBER_OF_INITIAL_ROWS_INVALID;
import static com.mgmtp.a12.model.ui.form.consistency.FormModelCategory.FORM_MODEL_REPEAT_NUMBER_OF_INITIAL_ROWS_TOO_BIG;

public class NumberOfInitialRowsRule extends AbstractRepeatRule {

	@Override
	public AbstractRepeatChecker getRuleChecker(final MeliesModel model, final List<Problem> problems) {
		GroupConfigurationType groupConfig = model.getContent().getGroupConfiguration();
		return new NumberOfInitialRowsChecker(
			model.getHeaderId(),
			groupConfig,
			problems,
			createDocumentModelService(model, problems));
	}

	private static class NumberOfInitialRowsChecker extends AbstractRepeatChecker {

		private final String modelName;
		private final GroupConfigurationType groupConfig;
		private final List<Problem> problems;
		private final DocumentModelAccess documentModelService;

		NumberOfInitialRowsChecker(
			final String modelName,
			final GroupConfigurationType groupConfig,
			final List<Problem> problems,
			final DocumentModelAccess documentModelService) {
			this.modelName = modelName;
			this.groupConfig = groupConfig;
			this.problems = problems;
			this.documentModelService = documentModelService;
		}

		@Override
		public void executeChecker(final RepeatType repeat, final String checkedElement) {

			int repeatability = 1;
			Integer numberOfInitialRows = null;

			IGroup group = documentModelService.findGroupById(repeat.getGroupRef()).orElse(null);
			GroupConfigurationEntryType gce = groupConfig.getGroup().stream()
				.filter(g -> g.getGroupRef().equals(repeat.getGroupRef())).findFirst().orElse(null);

			if (group != null) {
				repeatability = group.getRepeatability();
			}
			if (gce != null) {
				numberOfInitialRows = gce.getNumberOfInitialRows();
			}

			if (numberOfInitialRows == null) {
				return;
			} else {
				if (repeat instanceof InlineRepeatType) {
					if (numberOfInitialRows > repeatability) {
						problems.add(
							new ConsistencyProblem(
								modelName,
								FORM_MODEL_REPEAT_NUMBER_OF_INITIAL_ROWS_TOO_BIG,
								new FormModelProblemSource(repeat.getId()),
								repeat.getId(),
								repeat.getName()));
					}
				} else {
					problems.add(
						new ConsistencyProblem(
							modelName,
							FORM_MODEL_REPEAT_NUMBER_OF_INITIAL_ROWS_INVALID,
							new FormModelProblemSource(repeat.getId()),
							repeat.getId(),
							repeat.getName()));
				}
			}
		}
	}
}
