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
package com.mgmtp.a12.formengine.consistency.rules.repeat.nesting;

import static com.mgmtp.a12.formengine.consistency.rules.repeat.ParentUtil.isEqualById;
import static com.mgmtp.a12.formengine.consistency.rules.repeat.ParentUtil.isParent;

import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;

import com.mgmtp.a12.kernel.md.model.api.IGroup;

import com.mgmtp.a12.formengine.consistency.FormModelCategory;
import com.mgmtp.a12.formengine.consistency.FormModelProblemSource;
import com.mgmtp.a12.formengine.consistency.rules.repeat.AbstractRepeatChecker;
import com.mgmtp.a12.formengine.consistency.rules.repeat.AbstractRepeatRule;
import com.mgmtp.a12.formengine.model.FormModel;
import com.mgmtp.a12.formengine.model.internal.DocumentModelAccess;
import com.mgmtp.a12.formengine.model.types.AncestorUtil;
import com.mgmtp.a12.formengine.model.types.RepeatType;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

public class RepeatNestingRule extends AbstractRepeatRule {
	@Override
	public AbstractRepeatChecker getRuleChecker(final FormModel model, final List<Problem> problems, final DocumentModelAccess documentModelAccess) {
		return new RepeatNestingChecker(model.getHeaderId(), documentModelAccess);
	}

	private static class RepeatNestingChecker extends AbstractRepeatChecker {

		private final String modelName;
		private final DocumentModelAccess documentModelService;

		public RepeatNestingChecker(final String modelName, final DocumentModelAccess documentModelService) {
			this.modelName = modelName;
			this.documentModelService = documentModelService;
		}

		@Override
		public void executeChecker(final RepeatType repeat, final String checkedElement) {

			final Optional<IGroup> groupOptional = documentModelService.findGroupById(repeat.getGroupRef());
			if (!groupOptional.isPresent()) {
				repeatProblems.add(new ConsistencyProblem(
					modelName,
					FormModelCategory.FORM_MODEL_INVALID_GROUP_REF,
					new FormModelProblemSource(repeat.getId()),
					repeat.getGroupRef()
				));
				return;
			}
			final IGroup group = groupOptional.get();

			if (group.getRepeatability() == 1) {
				repeatProblems.add(new ConsistencyProblem(
					modelName,
					FormModelCategory.FORM_MODEL_NON_REPEATABLE_REPEAT_GROUP,
					new FormModelProblemSource(group.getId()),
					repeat.getId(),
					group.getId(),
					group.getName()
				));
				return;
			}

			final Optional<RepeatType> parentRepeat = findParentRepeat(repeat);

			if (parentRepeat.isPresent()) {
				final String parentRepeatGroupRef = parentRepeat.get().getGroupRef();
				final Optional<IGroup> parentRepeatGroup = documentModelService.findGroupById(parentRepeatGroupRef);
				if (!parentRepeatGroup.isPresent()) {
					repeatProblems.add(new ConsistencyProblem(
						modelName,
						FormModelCategory.FORM_MODEL_INVALID_GROUP_REF,
						new FormModelProblemSource(parentRepeat.get().getId()),
						parentRepeatGroupRef
					));
					return;
				}

				repeatProblems.addAll(verifyCorrectNesting(repeat, group, parentRepeatGroup.get()));

			} else {
				if (hasRepeatableAncestor(group)) {
					repeatProblems.add(new ConsistencyProblem(
						modelName,
						FormModelCategory.FORM_MODEL_INVALID_NESTING_REPEATABLE_PARENT,
						new FormModelProblemSource(repeat.getId()),
						repeat.getId()
					));
				}
			}

		}

		private boolean hasRepeatableAncestor(final IGroup group) {
			IGroup current = group.getParent();
			while (current != null && current.getParent() != null) {
				if (current.getRepeatability() > 1) {
					return true;
				}
				current = current.getParent();
			}
			return false;
		}

		private Optional<RepeatType> findParentRepeat(final RepeatType repeat) {
			return Optional.ofNullable(AncestorUtil.findAncestorOfType(repeat, RepeatType.class));
		}

		private Collection<? extends Problem> verifyCorrectNesting(
			final RepeatType repeat,
			final IGroup boundGroup,
			final IGroup parentRepeatBoundGroup
		) {
			if (!isParent(parentRepeatBoundGroup, boundGroup)) {
				return Collections.singletonList(new ConsistencyProblem(
					modelName,
					FormModelCategory.FORM_MODEL_INVALID_NESTING_PARENT,
					new FormModelProblemSource(repeat.getId()),
					repeat.getId(),
					parentRepeatBoundGroup.getId(),
					parentRepeatBoundGroup.getName()
				));

			} else if (hasRepeatableGroupInBetween(boundGroup, parentRepeatBoundGroup)) {
				return Collections.singletonList(new ConsistencyProblem(
					modelName,
					FormModelCategory.FORM_MODEL_INVALID_NESTING_REPEATABLE_BETWEEN,
					new FormModelProblemSource(repeat.getId()),
					repeat.getId(),
					parentRepeatBoundGroup.getId(),
					parentRepeatBoundGroup.getName()
				));

			} else {
				return Collections.emptyList();
			}
		}

		private boolean hasRepeatableGroupInBetween(final IGroup group, final IGroup parentGroup) {
			IGroup current = group.getParent();
			while (!isEqualById(current, parentGroup)) {
				if (current.getRepeatability() > 1) {
					return true;
				}
				current = current.getParent();
			}
			return false;
		}
	}
}
