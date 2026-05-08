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
package com.mgmtp.a12.model.ui.form.serialization.workspace;

import com.mgmtp.a12.kernel.md.facade.DocumentModelServiceFactory;
import com.mgmtp.a12.kernel.md.model.api.IDocumentModel;
import com.mgmtp.a12.kernel.md.model.api.services.IDocumentModelReferenceResolver;
import com.mgmtp.a12.kernel.md.model.api.services.IDocumentModelSerializer;
import com.mgmtp.a12.model.ui.form.consistency.DocumentModelLoadingException;

import java.io.IOException;
import java.io.StringReader;
import java.nio.file.Paths;

/**
 * An implementation of {@link IDocumentModelReferenceResolver} that locates document models within a given model
 * workspace in the file system.
 */
public class WorkspaceDocumentModelResolver implements IDocumentModelReferenceResolver {

	private final FileSystemWorkspaceLoader fileLoader;

	public WorkspaceDocumentModelResolver(final FileSystemWorkspaceLoader fileLoader) {
		this.fileLoader = fileLoader;
	}

	@Override
	public final IDocumentModel getDocumentModel(final String reference) {
		if (reference.contains("\\")) {
			throw new DocumentModelLoadingException(
				String.format(
					"Invalid model reference to \"%s\" using \\ as a path separator encountered during include expansion."
					+ " Please open and save the document model with this model reference/include in the Data Modeler to fix this problem.",
					reference
				)
			);
		}

		final var fileName = reference.endsWith(".json") ? reference : reference + ".json";
		// the following line is used to remove any preceding relative paths segments before the filename
		final var filePath = Paths.get((fileName)).getFileName();
		try {
			final var modelFileContent = fileLoader.loadFileByName(filePath.toString());
			if(modelFileContent.isEmpty()) {
				return null;
			}

			final IDocumentModelSerializer documentModelSerializer =
				new DocumentModelServiceFactory().createDocumentModelSerializer();

			IDocumentModel documentModel;
			try (final StringReader reader = new StringReader(modelFileContent.get())) {
				return documentModelSerializer.deserialize(reader);
			} catch (final Exception e) {
				return null;
			}
		} catch (IOException e) {
			return null;
		}
	}

}
