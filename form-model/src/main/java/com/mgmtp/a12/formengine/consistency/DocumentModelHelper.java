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
package com.mgmtp.a12.formengine.consistency;

import com.mgmtp.a12.kernel.md.model.api.IDescribed;
import com.mgmtp.a12.kernel.md.model.api.IElement;
import com.mgmtp.a12.kernel.md.model.api.IField;
import com.mgmtp.a12.kernel.md.model.api.IGroup;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IFieldType;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.ITypeDefType;
import com.mgmtp.a12.kernel.md.model.api.visitor.DocumentModelVisitor;
import com.mgmtp.a12.kernel.md.model.api.visitor.DocumentModelWalker;
import com.mgmtp.a12.kernel.md.model.api.visitor.DocumentModelWalker.VisitProcess;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.function.Predicate;

import org.apache.commons.lang3.Strings;

public class DocumentModelHelper {
	private static final String attachmentType = "attachment";
	private static final String multiSelectType = "multi-select";
	private static final String metadataType = "metadata";

	/**
	 * Build a string representing the type information of a field, e.g.: "String" or "Type Definition (String)"
	 *
	 * @param field the field
	 * @return string representing
	 */
	public static String buildFieldTypeInfo(final IField field) {
		final IFieldType fieldType = field.getFieldType();
		return fieldType instanceof ITypeDefType
			? "Type Definition (" + getFieldTypeString(field.getEffectiveType().get()) + ")"
			: getFieldTypeString(fieldType);
	}

	public static String getFieldTypeString(final IFieldType type) {
		return Strings.CS.removeEnd(type.getClass().getSimpleName(), "TypeWrapper");
	}

	/**
	 * Returns the internal description of an element in the given locale
	 */
	public static String getInternalDescription(final IDescribed element, final Optional<Locale> locale) {
		if (locale.isEmpty()) {
			return "";
		}
		return element.getInternalDescription().getOrDefault(locale.get(), "");
	}

	public static boolean isField(final Object element) {
		return element instanceof IField;
	}

	public static boolean isRepeatableGroupWithoutCustomType(final Object element) {
		return element instanceof IGroup && ((IGroup) element).getRepeatability() > 1
			&& !DocumentModelHelper.isCustomTypeGroup(element);
	}

	public static boolean isAttachmentGroup(final Object element) {
		return (element instanceof IGroup && attachmentType.equals(((IGroup) element).getUsageType().orElse("")));
	}

	public static boolean isMultiSelectGroup(final Object element) {
		return (element instanceof IGroup && multiSelectType.equals(((IGroup) element).getUsageType().orElse("")));
	}

	public static IField getMultiSelectGroupField(final IGroup group) {
		if(!isMultiSelectGroup(group)) {
			return null;
		}

		final IElement fieldValue = group.getElements()
				.stream().findFirst()
				.orElse(null);

		if(!(fieldValue instanceof IField)) {
			return null;
		}

		return (IField) fieldValue;
	}

	public static boolean isCustomTypeGroup(final Object element) {
		return isAttachmentGroup(element) || isMultiSelectGroup(element);
	}

	public static boolean isFormField(final Object element) {
		return isField(element) || isCustomTypeGroup(element);
	}

	public static boolean isMetadataField(final IElement element) {
		return hasMatchingAncestor(element, parent -> {
			final Optional<String> usageType = element.getParent().getUsageType();
			return usageType.isPresent() && metadataType.equals(usageType.get());
		});
	}

	public static boolean isAttachmentCollection(final IGroup element) {
		if (!isRepeatableGroupWithoutCustomType(element)) {
			return false;
		}

		final String attachmentGroupRef = getAttachmentGroupRefOfCollection(element);

		return attachmentGroupRef != null;
	}

	public static String getAttachmentGroupRefOfCollection(final IGroup element) {
		if (!isRepeatableGroupWithoutCustomType(element)) {
			return null;
		}

		final List<IGroup> allAttachmentGroups = findAllAttachmentsInGroup(element);

		if (allAttachmentGroups.size() != 1) {
			return null;
		}

		IGroup attachmentGroup = allAttachmentGroups.get(0);
		IGroup ancestor = attachmentGroup.getParent();

		while (ancestor != null && !ancestor.getId().equals(element.getId())) {
			if (ancestor.getRepeatability() > 1) {
				return null;
			}

			ancestor = ancestor.getParent();
		}

		return attachmentGroup.getId();
	}

	private static boolean hasMatchingAncestor(final IElement element, final Predicate<IGroup> predicate) {
		IGroup parent = element.getParent();
		while (parent != null) {
			if (predicate.test(parent)) {
				return true;
			}
			parent = parent.getParent();
		}
		return false;
	}

	private static List<IGroup> findAllAttachmentsInGroup(final IGroup element) {
		final List<IGroup> allAttachmentGroups = new ArrayList<>();

		new DocumentModelWalker().acceptElements(Collections.singletonList(element), new DocumentModelVisitor() {
			@Override
			public VisitProcess visitGroup(final IGroup group) {
				if (isAttachmentGroup(group)) {
					allAttachmentGroups.add(group);
					return VisitProcess.CONTINUE_BUT_DONT_GO_DEEPER;
				}

				if (isMultiSelectGroup(group)) {
					return VisitProcess.CONTINUE_BUT_DONT_GO_DEEPER;
				}

				return VisitProcess.CONTINUE_TRAVERSAL;
			}
		});

		return allAttachmentGroups;
	}
}
