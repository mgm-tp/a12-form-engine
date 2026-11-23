// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency;

import com.mgmtp.a12.kernel.md.model.api.IElement;
import com.mgmtp.a12.melies.model.internal.DocumentModelAccess;

public class ElementReferenceFinder {

	private final DocumentModelAccess documentModelService;

	public ElementReferenceFinder(final DocumentModelAccess documentModelService) {
		this.documentModelService = documentModelService;
	}

	public boolean isField(final String elementRef) {
		return documentModelService.findFieldById(elementRef).isPresent();
	}

	public boolean isGroup(final String elementRef) {
		return documentModelService.findGroupById(elementRef).isPresent();
	}

	public boolean isAttachmentGroup(final String elementRef) {
		final IElement element = documentModelService.findElementById(elementRef).orElse(null);
		return DocumentModelHelper.isAttachmentGroup(element);
	}

	public boolean isMultiSelectGroup(final String elementRef) {
		final IElement element = documentModelService.findElementById(elementRef).orElse(null);
		return DocumentModelHelper.isMultiSelectGroup(element);
	}

	public boolean isSupportedCustomType(final String elementRef) {
		return isAttachmentGroup(elementRef) || isMultiSelectGroup(elementRef);
	}

}
