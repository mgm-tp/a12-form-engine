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
package com.mgmtp.a12.model.ui.form.consistency.rules.consistency;

import com.mgmtp.a12.melies.model.internal.DocumentModelAccess;
import com.mgmtp.a12.melies.model.types.ControlType;
import com.mgmtp.a12.melies.model.types.DetachedRepeatType;
import com.mgmtp.a12.melies.model.types.EmbeddedRepeatType;
import com.mgmtp.a12.melies.model.types.ExpressionRepeatOverviewColumnType;
import com.mgmtp.a12.melies.model.types.FieldBasedRepeatOverviewColumnType;
import com.mgmtp.a12.melies.model.types.InlineRepeatType;
import com.mgmtp.a12.melies.model.types.RepeatOverviewColumnType;
import com.mgmtp.a12.melies.model.types.RepeatType;
import com.mgmtp.a12.melies.model.visitor.ModelVisitor;
import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.ui.form.consistency.ElementReferenceFinder;
import com.mgmtp.a12.model.ui.form.consistency.FormModelCategory;
import com.mgmtp.a12.model.ui.form.consistency.FormModelProblemSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;

/**
 * Provides consistency checks during Melies model traversal.
 */
class ConsistencyCheckMeliesVisitor extends ModelVisitor {

	private static final Logger LOG = LoggerFactory.getLogger(ConsistencyCheckMeliesVisitor.class);

	private final String modelId;
	private final List<Problem> problems;
	private final DocumentModelAccess documentModelService;
	private final ElementReferenceFinder elementReferenceFinder;

	ConsistencyCheckMeliesVisitor(final String modelId, final DocumentModelAccess documentModelService) {
		this.modelId = modelId;
		problems = new ArrayList<Problem>();
		this.documentModelService = documentModelService;
		this.elementReferenceFinder = new ElementReferenceFinder(documentModelService);

	}

	@Override
	public boolean visitControl(final ControlType control) {
		final String elementRef = control.getElementRef();

		if (!(
			elementReferenceFinder.isField(elementRef) || elementReferenceFinder.isSupportedCustomType(elementRef)
		)) {
			problems.add(
				new ConsistencyProblem(
					modelId,
					FormModelCategory.PICUS_MISSING_ELEMENT_IN_CONTROL,
					new FormModelProblemSource(control.getId()),
					elementRef,
					control.getId(),
					documentModelService.getDocumentModelId()
				));
			LOG.warn("Missing document model field or attachment group with ID " + elementRef);
		}
		return true;
	}

	@Override
	public boolean visitDetachedRepeat(final DetachedRepeatType repeat) {
		return validateRepeat(repeat);
	}

	@Override
	public boolean visitInlineRepeat(final InlineRepeatType repeat) {
		return validateRepeat(repeat);
	}

	@Override
	public boolean visitEmbeddedRepeat(final EmbeddedRepeatType repeat) {
		return validateRepeat(repeat);
	}

	private boolean validateRepeat(final RepeatType repeat) {
		validateRepeatOverviewColumns(repeat.getId(), repeat.getRepeatOverviewColumn());
		validateGroupReference(repeat.getGroupRef(), repeat.getId());
		return true;
	}

	List<Problem> getProblems() {
		return problems;
	}

	private void validateRepeatOverviewColumns(
		final String repeatId, final List<RepeatOverviewColumnType> repeatOverviewColumns
	) {
		for (final RepeatOverviewColumnType repeatOverviewColumn : repeatOverviewColumns) {
			if (repeatOverviewColumn instanceof FieldBasedRepeatOverviewColumnType) {
				final FieldBasedRepeatOverviewColumnType fieldBasedRepeatOverviewColumn =
					(FieldBasedRepeatOverviewColumnType) repeatOverviewColumn;
				final String elementRef = fieldBasedRepeatOverviewColumn.getElementRef();

				if (!(
					elementReferenceFinder.isField(elementRef) || elementReferenceFinder.isSupportedCustomType(
						elementRef)
				)) {
					problems.add(new ConsistencyProblem(
						modelId,
						FormModelCategory.PICUS_MISSING_ELEMENT_IN_OVERVIEW_COLUMN,
						new FormModelProblemSource(repeatOverviewColumn.getId()),
						elementRef,
						repeatId,
						documentModelService.getDocumentModelId()
					));
					LOG.warn("Missing document model field or attachment group with ID " + elementRef);
				}
			} else if (repeatOverviewColumn instanceof ExpressionRepeatOverviewColumnType) {
				// not supported right now
			}
		}
	}

	private void validateGroupReference(final String groupRef, final String repeatId) {
		if (!elementReferenceFinder.isGroup(groupRef)) {
			problems.add(new ConsistencyProblem(
				modelId,
				FormModelCategory.FORM_MODEL_INVALID_GROUP_REF,
				new FormModelProblemSource(repeatId),
				groupRef,
				documentModelService.getDocumentModelId()
			));
			LOG.warn("Missing document model group with ID " + groupRef);
		}
	}
}
