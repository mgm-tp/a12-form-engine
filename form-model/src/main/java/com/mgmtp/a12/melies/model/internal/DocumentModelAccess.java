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
package com.mgmtp.a12.melies.model.internal;

import java.util.Optional;

import java.util.Objects;

import com.mgmtp.a12.kernel.core.tool.a12internal.api.services.ICalculationService;
import com.mgmtp.a12.kernel.md.facade.DocumentModelServiceFactory;
import com.mgmtp.a12.kernel.md.model.a12internal.DocumentModel;
import com.mgmtp.a12.kernel.md.model.a12internal.services.DocumentModelService;
import com.mgmtp.a12.kernel.md.model.api.IDocumentModel;
import com.mgmtp.a12.kernel.md.model.api.IElement;
import com.mgmtp.a12.kernel.md.model.api.IField;
import com.mgmtp.a12.kernel.md.model.api.IGroup;
import com.mgmtp.a12.kernel.md.model.api.services.IDocumentModelSearchService;
import com.mgmtp.a12.kernel.md.model.api.services.IDocumentModelService;
import com.mgmtp.a12.kernel.md.model.internal.wrapper.DocumentModelWrapper;

/**
 * Only for internal use. No API!
 *
 */
public class DocumentModelAccess {

	private final IDocumentModelSearchService searchService;
	private final IDocumentModelService documentModelService;
	private final IDocumentModel documentModel;

	public DocumentModelAccess(final IDocumentModel documentModel) {
		Objects.requireNonNull(documentModel);
		this.documentModel = documentModel;
		this.searchService = new DocumentModelServiceFactory().createDocumentModelSearchService(documentModel);
		this.documentModelService = new DocumentModelServiceFactory().createDocumentModelService();
	}

	public Optional<IElement> findElementById(final String id) {
		return searchService.getById(id);
	}

	public Optional<IElement> findElementByPath(final String path) {
		final String normalizedPath = path.startsWith("/")
			? path
			: "/" + path;
		return searchService.getByPath(normalizedPath);
	}

	public Optional<IElement> findElementByPath(final IGroup context, final String path) {
		final String contextPath = documentModelService.getPath(context);
		final String normalizedPath = path.startsWith("/")
			? path
			: "/" + path;
		return searchService.getByPath(contextPath + normalizedPath);
	}

	public Optional<IField> findFieldById(final String id) {
		final Optional<IElement> element = searchService.getById(id);
		return element.map(field -> field instanceof IField ? (IField) field : null);
	}

	public Optional<IField> findFieldByPath(final String path) {
		final String normalizedPath = path.startsWith("/")
			? path
			: "/" + path;
		final Optional<IElement> element = searchService.getByPath(normalizedPath);
		return element.map(field -> field instanceof IField ? (IField) field : null);
	}

	public Optional<IGroup> findGroupById(final String id) {
		final Optional<IElement> element = searchService.getById(id);
		return element.map(field -> field instanceof IGroup ? (IGroup) field : null);
	}

	/**
	 * Constructs the path of the given element.
	 */
	public Optional<String> getElementPath(final String elementId) {
		final Optional<IElement> elementOptional = findElementById(elementId);
		if (!elementOptional.isPresent()) {
			return Optional.empty();
		}
		return Optional.of(documentModelService.getPath(elementOptional.get()));
	}

	public IDocumentModel getDocumentModel() {
		return documentModel;
	}

	public String getDocumentModelId() {
		return this.documentModel.getHeader().getId();
	}

	public ICalculationService getCalculationService() {
		DocumentModel dm = ((DocumentModelWrapper) this.documentModel).getDocumentModel();

		/* 
		 * Use the a12 internal DocumentModelService to retrieve the calculation service,
		 * because the public IDocumentModelService does not provide the method
		 * getCalculationServiceForModel.
		 */
		return new DocumentModelService().getCalculationServiceForModel(dm, null);
	}
}
