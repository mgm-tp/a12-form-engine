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
package com.mgmtp.a12.formengine.serialization.workspace;

import com.mgmtp.a12.kernel.md.model.api.IDocumentModel;

import com.mgmtp.a12.formengine.model.FormModel;
import com.mgmtp.a12.formengine.model.include.FormModelResolver;
import com.mgmtp.a12.formengine.model.internal.DocumentModelAccess;

import java.io.IOException;
import java.util.Objects;

import org.apache.commons.lang3.Validate;

/**
 * An implementation of {@link FormModelResolver} that locates and loads {@link com.mgmtp.a12.formengine.FormModel}s
 * within a given model workspace in the file system.
 */
public class WorkspaceFormModelResolver implements FormModelResolver {

	private final FileSystemWorkspaceLoader loader;

	public WorkspaceFormModelResolver(final FileSystemWorkspaceLoader loader) {
		Objects.requireNonNull(loader);
		this.loader = loader;
	}

	@Override
	public FormModelResult resolveFormModel(final String modelReference) {
		Validate.notBlank(modelReference);
		final String modelReferenceWithExtension =
			modelReference.endsWith(".json")
			? modelReference
			: modelReference + ".json";

		final FormModel formModel;
		try {
			final var modelFileContent = loader.loadFileByName(modelReferenceWithExtension);
			if(modelFileContent.isEmpty()) {
				throw new RuntimeException("Cannot find form model '" + modelReference + "'");
			}
			// recursion happens here:
			// by deserializing the referenced form model again with this specific serializer, its nested includes will
			// be expanded first before inserting them into the host form
			formModel = new IncludeAwareFormModelJsonSerializer(loader).deserialize(modelFileContent.get());

		} catch (final IOException ioe) {
			throw new RuntimeException(ioe);
		}

		final var docModelAccess = loadDocumentModel(formModel);

		return new FormModelResult(formModel, docModelAccess);
	}

	private DocumentModelAccess loadDocumentModel(final FormModel formModel) {
		final var docModelReference =
			formModel.getHeader()
					 .getModelReferences()
					 .stream()
					 .filter(modelRef -> "document".equals(modelRef.getModelType()))
					 .findFirst()
					 .orElseThrow(() ->
									  new RuntimeException(String.format(
										  "Form model '%s' does not contain a document model reference.",
										  formModel.getHeaderId()
									  )));

		final IDocumentModel hostDocumentModel;
		try {
			hostDocumentModel = WorkspaceDocumentModelLoader.loadFile(loader, docModelReference.getReference());
		} catch (final IOException ioe) {
			throw new RuntimeException(ioe);
		}

		return new DocumentModelAccess(hostDocumentModel);
	}
}
