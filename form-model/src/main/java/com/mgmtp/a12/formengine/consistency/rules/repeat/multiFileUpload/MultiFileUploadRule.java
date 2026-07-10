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
package com.mgmtp.a12.formengine.consistency.rules.repeat.multiFileUpload;

import static com.mgmtp.a12.formengine.consistency.FormModelCategory.FORM_MODEL_REPEAT_MULTI_FILE_UPLOAD_NO_ATTACHMENT_COLLECTION;
import static com.mgmtp.a12.formengine.consistency.FormModelCategory.FORM_MODEL_REPEAT_MULTI_FILE_UPLOAD_NO_ELEMENT_REF;
import static com.mgmtp.a12.formengine.consistency.FormModelCategory.FORM_MODEL_REPEAT_MULTI_FILE_UPLOAD_UNUSED_OPTIONS;

import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;

import com.mgmtp.a12.kernel.md.model.api.IGroup;

import com.mgmtp.a12.formengine.consistency.DocumentModelHelper;
import com.mgmtp.a12.formengine.consistency.FormModelProblemSource;
import com.mgmtp.a12.formengine.consistency.rules.repeat.AbstractRepeatChecker;
import com.mgmtp.a12.formengine.consistency.rules.repeat.AbstractRepeatRule;
import com.mgmtp.a12.formengine.model.FormModel;
import com.mgmtp.a12.formengine.model.internal.DocumentModelAccess;
import com.mgmtp.a12.formengine.model.types.MultiFileUploadOptionType;
import com.mgmtp.a12.formengine.model.types.MultiFileUploadRepeat;
import com.mgmtp.a12.formengine.model.types.RepeatType;

import java.util.List;

/**
 * Multi file upload can only be enabled for inline/embedded repeats, that are based on an attachment collection, i.e. a
 * group, which * is repeatable * contains exactly one attachment group * the attachment is in the same repeatability
 * context, i.e. not nested in further repeatable groups
 */
public class MultiFileUploadRule extends AbstractRepeatRule {

	@Override
	public AbstractRepeatChecker getRuleChecker(final FormModel model, final List<Problem> problems, final DocumentModelAccess documentModelAccess) {
		return new MultiFileUploadChecker(model.getHeaderId(), problems, documentModelAccess);
	}

	private static class MultiFileUploadChecker extends AbstractRepeatChecker {

		private final String modelName;
		private final List<Problem> problems;
		private final DocumentModelAccess documentModelService;

		MultiFileUploadChecker(
			final String modelName,
			final List<Problem> problems,
			final DocumentModelAccess documentModelService) {
			this.modelName = modelName;
			this.problems = problems;
			this.documentModelService = documentModelService;
		}

		@Override
		public void executeChecker(final RepeatType repeat, final String checkedElement) {
			Boolean multiFileUploadEnabled = false;
			MultiFileUploadOptionType options = null;

			if (repeat instanceof MultiFileUploadRepeat) {
				multiFileUploadEnabled = ((MultiFileUploadRepeat) repeat).isMultiFileUploadSet()
					? ((MultiFileUploadRepeat) repeat).getMultiFileUpload()
					: false;
				options = ((MultiFileUploadRepeat) repeat).getMultiFileUploadOptions();
			}

			IGroup group = documentModelService.findGroupById(repeat.getGroupRef()).orElse(null);

			if (multiFileUploadEnabled && !DocumentModelHelper.isAttachmentCollection(group)) {
				problems.add(
					new ConsistencyProblem(
						modelName,
						FORM_MODEL_REPEAT_MULTI_FILE_UPLOAD_NO_ATTACHMENT_COLLECTION,
						new FormModelProblemSource(repeat.getId()),
						repeat.getId(),
						repeat.getName(),
						repeat.getGroupRef()));
			}
			if (!multiFileUploadEnabled && options != null) {
				problems.add(
					new ConsistencyProblem(
						modelName,
						FORM_MODEL_REPEAT_MULTI_FILE_UPLOAD_UNUSED_OPTIONS,
						new FormModelProblemSource(repeat.getId()),
						repeat.getId(),
						repeat.getName()));
			}
			if (multiFileUploadEnabled && (options == null || !options.isElementRefSet())) {
				problems.add(
					new ConsistencyProblem(
						modelName,
						FORM_MODEL_REPEAT_MULTI_FILE_UPLOAD_NO_ELEMENT_REF,
						new FormModelProblemSource(repeat.getId()),
						repeat.getId(),
						repeat.getName()));
			}
		}
	}

}
