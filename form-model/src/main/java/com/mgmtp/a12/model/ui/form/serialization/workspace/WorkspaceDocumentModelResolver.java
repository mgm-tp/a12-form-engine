// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
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
