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
package com.mgmtp.a12.formengine.consistency.rules.exposition;

import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;

import com.mgmtp.a12.kernel.md.model.api.IElement;
import com.mgmtp.a12.kernel.md.model.api.IField;
import com.mgmtp.a12.kernel.md.model.api.IGroup;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IStringType;

import com.mgmtp.a12.formengine.consistency.ConsistencyValidationException;
import com.mgmtp.a12.formengine.consistency.DocumentModelHelper;
import com.mgmtp.a12.formengine.consistency.FormModelCategory;
import com.mgmtp.a12.formengine.consistency.FormModelProblemSource;
import com.mgmtp.a12.formengine.consistency.Granularity;
import com.mgmtp.a12.formengine.consistency.rules.consistency.ConsistencyRule;
import com.mgmtp.a12.formengine.model.FormModel;
import com.mgmtp.a12.formengine.model.internal.DocumentModelAccess;
import com.mgmtp.a12.formengine.model.types.AncestorUtil;
import com.mgmtp.a12.formengine.model.types.DetachedRepeatType;
import com.mgmtp.a12.formengine.model.types.EmbeddedRepeatType;
import com.mgmtp.a12.formengine.model.types.FieldConfigurationEntryType;
import com.mgmtp.a12.formengine.model.types.FieldConfigurationType;
import com.mgmtp.a12.formengine.model.types.InlineRepeatType;
import com.mgmtp.a12.formengine.model.types.MultiFileUploadRepeat;
import com.mgmtp.a12.formengine.model.types.RepeatType;
import com.mgmtp.a12.formengine.model.visitor.ModelVisitor;
import com.mgmtp.a12.formengine.model.visitor.ModelWalker;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Temporary rule (A12E-3691): `isMarkdownEditor` is only permitted on a string field, and is
 * mutually exclusive with `exposition` on the same field configuration entry.
 * `markdownAttachmentRepeat` is only permitted when `isMarkdownEditor` is set, and must reference
 * an existing repeat configured for multi-file upload whose Document Model group does not lie
 * inside a repeatable group. The markdown field itself must not lie inside that repeat's Document
 * Model group - uploading into rows of the group that also holds the uploading field breaks at
 * runtime, no matter which form model repeat renders the field.
 */
public class MarkdownEditorExpositionRule implements ConsistencyRule {

	@Override
	public List<Problem> execute(final FormModel model, final DocumentModelAccess documentModelAccess) throws ConsistencyValidationException {
		final List<Problem> problems = new ArrayList<>();

		final Map<String, RepeatType> repeatsById = new HashMap<>();
		new ModelWalker(new RepeatCollectingVisitor(repeatsById))
			.acceptScreenGroupRootElement(model.getContent().getScreens());

		final FieldConfigurationType fieldConfiguration = model.getContent().getFieldConfiguration();

		for (final FieldConfigurationEntryType fieldConfig : fieldConfiguration.getField()) {
			final String elementRef = fieldConfig.getElementRef();
			final Optional<IElement> elementOptional = documentModelAccess.findElementById(elementRef);
			if (!elementOptional.isPresent()) {
				// Case is covered by FormFieldReferenceConsistencyRule
				continue;
			}
			final IElement element = elementOptional.get();

			final boolean isMarkdownEditor = Boolean.TRUE.equals(fieldConfig.getIsMarkdownEditor());

			if (isMarkdownEditor && fieldConfig.isExpositionSet()) {
				problems.add(new ConsistencyProblem(
					model.getHeaderId(),
					FormModelCategory.FORM_MODEL_MARKDOWN_EDITOR_WITH_EXPOSITION,
					FormModelProblemSource.involving(elementRef),
					elementRef,
					element.getName()));
			}

			if (isMarkdownEditor && !isStringField(element)) {
				problems.add(new ConsistencyProblem(
					model.getHeaderId(),
					FormModelCategory.FORM_MODEL_MARKDOWN_EDITOR_INVALID_DATATYPE,
					FormModelProblemSource.involving(elementRef),
					elementRef,
					element.getName(),
					describeType(element)));
			}

			if (!fieldConfig.isMarkdownAttachmentRepeatSet()) {
				continue;
			}

			if (!isMarkdownEditor) {
				problems.add(new ConsistencyProblem(
					model.getHeaderId(),
					FormModelCategory.FORM_MODEL_MARKDOWN_ATTACHMENT_REPEAT_WITHOUT_MARKDOWN_EDITOR,
					FormModelProblemSource.involving(elementRef),
					elementRef,
					element.getName()));
			}

			final String attachmentRepeatId = fieldConfig.getMarkdownAttachmentRepeat();
			final RepeatType attachmentRepeat = repeatsById.get(attachmentRepeatId);

			if (attachmentRepeat == null) {
				problems.add(new ConsistencyProblem(
					model.getHeaderId(),
					FormModelCategory.FORM_MODEL_MARKDOWN_ATTACHMENT_REPEAT_NOT_FOUND,
					FormModelProblemSource.involving(elementRef),
					elementRef,
					element.getName(),
					attachmentRepeatId));
				continue;
			}

			if (!isMultiFileUploadEnabled(attachmentRepeat)) {
				problems.add(new ConsistencyProblem(
					model.getHeaderId(),
					FormModelCategory.FORM_MODEL_MARKDOWN_ATTACHMENT_REPEAT_NOT_MULTI_FILE_UPLOAD,
					FormModelProblemSource.involving(elementRef, attachmentRepeat.getId()),
					elementRef,
					element.getName(),
					attachmentRepeat.getId()));
			}

			// An attachment repeat whose group has no repeatable ancestor, with a markdown field
			// lying outside that group, is the combination verified to work - the same one SME
			// offers as `markdownAttachmentRepeat` candidates (see its isValidMarkdownAttachmentTarget,
			// which these two checks mirror). Any other nesting relationship is unsupported, not
			// because it is known to break, but because it has not been checked.
			// An unresolvable group is covered by FormGroupReferenceRule and yields no granularity.
			final Granularity attachmentGranularity = documentModelAccess.findElementById(attachmentRepeat.getGroupRef())
				.map(Granularity::computeGranularity)
				.orElseGet(() -> new Granularity(List.of()));

			if (attachmentGranularity.getRepeatableGroups().size() > 1) {
				problems.add(new ConsistencyProblem(
					model.getHeaderId(),
					FormModelCategory.FORM_MODEL_MARKDOWN_ATTACHMENT_REPEAT_NESTED,
					FormModelProblemSource.involving(elementRef, nestingInvolvedElements(attachmentRepeat)),
					elementRef,
					element.getName(),
					attachmentRepeat.getId()));
			} else if (isInRowOf(Granularity.computeGranularity(element), attachmentGranularity)) {
				problems.add(new ConsistencyProblem(
					model.getHeaderId(),
					FormModelCategory.FORM_MODEL_MARKDOWN_ATTACHMENT_REPEAT_SELF_NESTED,
					FormModelProblemSource.involving(elementRef, attachmentRepeat.getId()),
					elementRef,
					element.getName(),
					attachmentRepeat.getGroupRef(),
					attachmentRepeat.getId()));
			}
		}
		return problems;
	}

	/**
	 * Whether `element` is a field the markdown editor can render: the editor interprets the
	 * field's value as markup, which only a string field holds. A type definition resolving to a
	 * string qualifies, a custom field type does not.
	 */
	private static boolean isStringField(final IElement element) {
		return element instanceof IField field
			&& field.getEffectiveType().orElse(null) instanceof IStringType;
	}

	/**
	 * The type of `element` as shown in messages, e.g. "Number", "Type Definition (Number)", the
	 * usage type of a group such as "attachment", or "Group".
	 */
	private static String describeType(final IElement element) {
		if (element instanceof IField field) {
			return DocumentModelHelper.buildFieldTypeInfo(field);
		}
		return element instanceof IGroup group
			? group.getUsageType().orElse("Group")
			: element.getClass().getSimpleName();
	}

	/**
	 * Whether an element of `elementGranularity` lies in a row of the attachment repeat's group, at
	 * any depth. A non-repeatable attachment group has no rows - that case is reported by
	 * RepeatNestingRule - and must not match every element.
	 */
	private static boolean isInRowOf(final Granularity elementGranularity, final Granularity attachmentGranularity) {
		return !attachmentGranularity.getRepeatableGroups().isEmpty()
			&& elementGranularity.contains(attachmentGranularity);
	}

	/**
	 * The elements involved in a nested attachment repeat besides the markdown field: the attachment
	 * repeat and - like {@link com.mgmtp.a12.formengine.consistency.rules.repeat.nesting.RepeatNestingRule}
	 * - the form model repeat enclosing it, if any.
	 */
	private static String[] nestingInvolvedElements(final RepeatType attachmentRepeat) {
		final RepeatType parentRepeat = AncestorUtil.findAncestorOfType(attachmentRepeat, RepeatType.class);
		return parentRepeat == null
			? new String[] { attachmentRepeat.getId() }
			: new String[] { attachmentRepeat.getId(), parentRepeat.getId() };
	}

	private static boolean isMultiFileUploadEnabled(final RepeatType repeat) {
		return repeat instanceof MultiFileUploadRepeat
			&& ((MultiFileUploadRepeat) repeat).isMultiFileUploadSet()
			&& Boolean.TRUE.equals(((MultiFileUploadRepeat) repeat).getMultiFileUpload());
	}

	private static class RepeatCollectingVisitor extends ModelVisitor {

		private final Map<String, RepeatType> repeatsById;

		RepeatCollectingVisitor(final Map<String, RepeatType> repeatsById) {
			this.repeatsById = repeatsById;
		}

		@Override
		public boolean visitInlineRepeat(final InlineRepeatType repeat) {
			repeatsById.put(repeat.getId(), repeat);
			return true;
		}

		@Override
		public boolean visitEmbeddedRepeat(final EmbeddedRepeatType repeat) {
			repeatsById.put(repeat.getId(), repeat);
			return true;
		}

		@Override
		public boolean visitDetachedRepeat(final DetachedRepeatType repeat) {
			repeatsById.put(repeat.getId(), repeat);
			return true;
		}
	}

}
