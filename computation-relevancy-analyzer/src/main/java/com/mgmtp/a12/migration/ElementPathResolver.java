// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.migration;

import com.mgmtp.a12.kernel.md.facade.DocumentModelServiceFactory;
import com.mgmtp.a12.kernel.md.model.api.IDocumentModel;
import com.mgmtp.a12.kernel.md.model.api.services.IDocumentModelSearchService;
import com.mgmtp.a12.kernel.md.model.api.services.IDocumentModelService;

/**
 * Returns a model path as string for a given document model and model element id
 */
class ElementPathResolver {

	private final IDocumentModelService dmService = new DocumentModelServiceFactory().createDocumentModelService();
	private final IDocumentModelSearchService searchService;

	ElementPathResolver(final IDocumentModel documentModel) {
		this.searchService = new DocumentModelServiceFactory().createDocumentModelSearchService(documentModel);
	}

	String resolvePathById(final String elementId) {
		final var element = this.searchService.getById(elementId).orElseThrow(() -> new RuntimeException("Failed to find document model element with id: " + elementId));
		return this.dmService.getPath(element);
	}
}
