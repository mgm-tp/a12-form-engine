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
import com.mgmtp.a12.kernel.md.model.api.services.IDocumentModelSerializer;
import com.mgmtp.a12.model.ui.form.consistency.DocumentModelLoadingException;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.Validate;

import java.io.IOException;
import java.io.StringReader;

/**
 * Can load and expand documents models within a given model workspace in the file system.
 */
public class WorkspaceDocumentModelLoader {

	/**
	 * Loads and expands the document model for given filename. The expansion requires a
	 * {@link FileSystemWorkspaceLoader} to locate and load the included document models.
	 *
	 * @param loader the workspace loader that can scans all files and directories within the workspace
	 * @param modelName document model name. May not be null.
	 * @throws IOException
	 */
	public static IDocumentModel loadFile(final FileSystemWorkspaceLoader loader, final String modelName) throws IOException {
		Validate.notNull(loader, "loader must not be null");
		Validate.notNull(modelName, "modelName must not be empty");

		final var fileName = modelName.endsWith(".json") ? modelName : modelName + ".json";
		final var modelFileContent = loader.loadFileByName(fileName);

		if (modelFileContent.isEmpty()) {
			throw new RuntimeException("Model with name '" + modelName + "' does not exist. Cannot load document model.");
		}

		final IDocumentModelSerializer documentModelSerializer = new DocumentModelServiceFactory().createDocumentModelSerializer();
		try (final StringReader reader = new StringReader(modelFileContent.get())) {
			final IDocumentModel documentModel = documentModelSerializer.deserialize(reader);

			if (
				CollectionUtils.emptyIfNull(documentModel.getHeader().getModelReferences())
							   .stream()
							   .anyMatch(ref -> ref.getReference().contains("\\"))
			) {
				throw new DocumentModelLoadingException(
					String.format(
						"The document model [name: %s] contains model references that use an invalid \\ as a path "
						+ "separator. Please open and save this document model with the Data Modeler to fix this problem.",
						documentModel.getHeader().getId()
					)
				);
			}

			final WorkspaceDocumentModelResolver modelResolver = new WorkspaceDocumentModelResolver(loader);
			new DocumentModelServiceFactory().createDocumentModelService().expand(documentModel, modelResolver);

			return documentModel;
		}
	}

}
