// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
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
