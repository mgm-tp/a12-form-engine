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
package com.mgmtp.a12.formengine.consistency.rules.repeat.numberOfInitialRows;

import static com.mgmtp.a12.formengine.consistency.FormModelCategory.FORM_MODEL_REPEAT_NUMBER_OF_INITIAL_ROWS_INVALID;
import static com.mgmtp.a12.formengine.consistency.FormModelCategory.FORM_MODEL_REPEAT_NUMBER_OF_INITIAL_ROWS_TOO_BIG;

import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;

import com.mgmtp.a12.kernel.md.model.api.IGroup;

import com.mgmtp.a12.formengine.consistency.FormModelProblemSource;
import com.mgmtp.a12.formengine.consistency.rules.repeat.AbstractRepeatChecker;
import com.mgmtp.a12.formengine.consistency.rules.repeat.AbstractRepeatRule;
import com.mgmtp.a12.formengine.model.FormModel;
import com.mgmtp.a12.formengine.model.internal.DocumentModelAccess;
import com.mgmtp.a12.formengine.model.types.GroupConfigurationEntryType;
import com.mgmtp.a12.formengine.model.types.GroupConfigurationType;
import com.mgmtp.a12.formengine.model.types.InlineRepeatType;
import com.mgmtp.a12.formengine.model.types.RepeatType;

import java.util.List;

public class NumberOfInitialRowsRule extends AbstractRepeatRule {

	@Override
	public AbstractRepeatChecker getRuleChecker(final FormModel model, final List<Problem> problems, final DocumentModelAccess documentModelAccess) {
		GroupConfigurationType groupConfig = model.getContent().getGroupConfiguration();
		return new NumberOfInitialRowsChecker(
			model.getHeaderId(),
			groupConfig,
			problems,
			documentModelAccess);
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
