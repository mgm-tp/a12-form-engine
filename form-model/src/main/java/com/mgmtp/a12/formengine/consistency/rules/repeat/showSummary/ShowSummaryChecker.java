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
package com.mgmtp.a12.formengine.consistency.rules.repeat.showSummary;

import static com.mgmtp.a12.formengine.consistency.FormModelCategory.FORM_MODEL_REPEAT_SHOW_SUMMARY_INVALID_TYPE;

import com.mgmtp.a12.model.consistency.ConsistencyProblem;

import com.mgmtp.a12.kernel.md.model.api.IField;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IFieldType;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.INumberType;

import com.mgmtp.a12.formengine.consistency.FormModelProblemSource;
import com.mgmtp.a12.formengine.consistency.rules.repeat.AbstractRepeatChecker;
import com.mgmtp.a12.formengine.model.FormModel;
import com.mgmtp.a12.formengine.model.internal.DocumentModelAccess;
import com.mgmtp.a12.formengine.model.types.FieldBasedRepeatOverviewColumnType;
import com.mgmtp.a12.formengine.model.types.RepeatOverviewColumnType;
import com.mgmtp.a12.formengine.model.types.RepeatType;

public class ShowSummaryChecker extends AbstractRepeatChecker {

	private final FormModel model;
	private final DocumentModelAccess documentModelService;

	public ShowSummaryChecker(final FormModel model, final DocumentModelAccess documentModelService) {
		this.model = model;
		this.documentModelService = documentModelService;
	}

	@Override
	public void executeChecker(final RepeatType repeat, final String checkedElement) {

		for (final RepeatOverviewColumnType column : repeat.getRepeatOverviewColumn()) {
			if (isInvalid(column)) {
				repeatProblems.add(new ConsistencyProblem(
					model.getHeaderId(),
					FORM_MODEL_REPEAT_SHOW_SUMMARY_INVALID_TYPE,
					new FormModelProblemSource(column.getId()),
					column.getId(),
					repeat.getId(),
					repeat.getName()
				));
			}
		}
	}

	private boolean isInvalid(final RepeatOverviewColumnType column) {

		if (column instanceof FieldBasedRepeatOverviewColumnType && ((FieldBasedRepeatOverviewColumnType) column).isShowSummarySet()) {
			final String elementRef = ((FieldBasedRepeatOverviewColumnType) column).getElementRef();
			final IField field = documentModelService.findFieldById(elementRef).orElse(null);

			final IFieldType effectiveDataType = field.getEffectiveType().orElse(null);

			return !(effectiveDataType instanceof INumberType);
		}
		return false;
	}
}
