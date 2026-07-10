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
package com.mgmtp.a12.formengine.consistency.rules.repeat.rowaction;

import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.notification.Severity;

import com.mgmtp.a12.formengine.consistency.ConsistencyValidationException;
import com.mgmtp.a12.formengine.consistency.FormModelCategory;
import com.mgmtp.a12.formengine.consistency.FormModelProblemSource;
import com.mgmtp.a12.formengine.consistency.rules.consistency.ConsistencyRule;
import com.mgmtp.a12.formengine.model.FormModel;
import com.mgmtp.a12.formengine.model.internal.DocumentModelAccess;
import com.mgmtp.a12.formengine.model.types.DefaultRowActionType;
import com.mgmtp.a12.formengine.model.types.DetachedRepeatType;
import com.mgmtp.a12.formengine.model.types.EmbeddedRepeatType;
import com.mgmtp.a12.formengine.model.types.MultiFileUploadRepeat;
import com.mgmtp.a12.formengine.model.types.RepeatType;
import com.mgmtp.a12.formengine.model.types.RowActionType;
import com.mgmtp.a12.formengine.model.visitor.ModelVisitor;
import com.mgmtp.a12.formengine.model.visitor.ModelWalker;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class DefaultRowActionRule implements ConsistencyRule {

	@Override
	public List<Problem> execute(final FormModel model, final DocumentModelAccess documentModelAccess) throws ConsistencyValidationException {
		final List<Problem> problems = new ArrayList<>();
		new ModelWalker(new DefaultRowActionVisistor(model.getHeaderId(), problems)).acceptScreenGroupRootElement(
			model.getContent().getScreens());
		return problems;
	}

	private static class DefaultRowActionVisistor extends ModelVisitor {

		private final String modelName;
		private final List<Problem> problems;

		DefaultRowActionVisistor(final String modelName, final List<Problem> problems) {
			this.modelName = modelName;
			this.problems = problems;
		}

		public boolean visitDetachedRepeat(final DetachedRepeatType repeat) {
			if (repeat.isDefaultRowActionSet()) {
				check(repeat);
			}
			return true;
		}

		public boolean visitEmbeddedRepeat(final EmbeddedRepeatType repeat) {
			if (repeat.isDefaultRowActionSet()) {
				check(repeat);
			}
			return true;
		}

		private void check(final RepeatType repeat) {
			final DefaultRowActionType defaultRowAction = repeat instanceof DetachedRepeatType
				? ((DetachedRepeatType) repeat).getDefaultRowAction()
				: ((EmbeddedRepeatType) repeat).getDefaultRowAction();
			final String eventName = defaultRowAction.getEvent();
			if (defaultRowAction.isCustomSet()) {
				final Problem missingDefaultRowAction = new ConsistencyProblem(
					modelName,
					FormModelCategory.FORM_MODEL_DEFAULT_ROW_ACTION_MISSING_CUSTOM_EVENT,
					new FormModelProblemSource(repeat.getId()),
					Severity.INFO,
					repeat.getId(),
					repeat.getName(),
					eventName
				);
				if (!repeat.isRowActionGroupSet()) {
					problems.add(missingDefaultRowAction);
				} else {
					final Optional<RowActionType> rowAction = findCustomRowActionEvent(repeat, eventName);
					if (!rowAction.isPresent()) {
						problems.add(missingDefaultRowAction);
					} else if (rowAction.get().getConfirmation() != null) {
						problems.add(new ConsistencyProblem(
							modelName,
							FormModelCategory.FORM_MODEL_DEFAULT_ROW_ACTION_WITH_CONFIRMATION,
							new FormModelProblemSource(repeat.getId()),
							Severity.INFO,
							repeat.getId(),
							repeat.getName(),
							eventName
						));
					}
				}
			} else {
				switch (eventName) {
				case "edit":
					break;// nothing to do - this is always enabled
				case "download": {
					if (
						!(repeat instanceof MultiFileUploadRepeat) ||
							!((MultiFileUploadRepeat) repeat).isMultiFileUploadSet()
					) {
						problems.add(new ConsistencyProblem(
							modelName,
							FormModelCategory.FORM_MODEL_DEFAULT_ROW_ACTION_UNSUPPORTED_EVENT,
							new FormModelProblemSource(repeat.getId()),
							Severity.INFO,
							repeat.getId(),
							repeat.getName(),
							eventName
						));
					}
					break;
				}
				default: {
					problems.add(new ConsistencyProblem(
						modelName,
						FormModelCategory.FORM_MODEL_DEFAULT_ROW_ACTION_UNSUPPORTED_EVENT,
						new FormModelProblemSource(repeat.getId()),
						Severity.INFO,
						repeat.getId(),
						repeat.getName(),
						eventName
					));
				}
				}

			}
		}

		private Optional<RowActionType> findCustomRowActionEvent(
			final RepeatType repeat, final String eventName
		) {
			for (final RowActionType action : repeat.getRowActionGroup().getAction()) {
				if (eventName.equals(action.getEvent())) {
					return Optional.of(action);
				}
			}
			return Optional.empty();
		}
	}
}
