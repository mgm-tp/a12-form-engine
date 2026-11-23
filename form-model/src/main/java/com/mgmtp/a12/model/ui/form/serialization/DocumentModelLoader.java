// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.serialization;

import com.mgmtp.a12.kernel.md.facade.DocumentModelServiceFactory;
import com.mgmtp.a12.kernel.md.model.api.IDocumentModel;
import com.mgmtp.a12.kernel.md.model.api.services.IDocumentModelSerializer;
import com.mgmtp.a12.model.ui.form.consistency.DocumentModelLoadingException;
import com.mgmtp.a12.model.ui.form.consistency.FileBasedDocumentModelResolver;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.Validate;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

public class DocumentModelLoader {

	/**
	 * Loads the document model for given filename.
	 *
	 * @param modelFilePath document model path. May not be null.
	 * @throws IOException
	 */
	public IDocumentModel loadFile(final Path modelFilePath) throws IOException {
		Validate.notNull(modelFilePath, "filename must not be empty");
		if (!Files.exists(modelFilePath)) {
			throw new RuntimeException(
				"File '"
				+ modelFilePath.toString()
				+ "' does not exist. Cannot load document model.");
		}

		final IDocumentModelSerializer documentModelSerializer =
			new DocumentModelServiceFactory().createDocumentModelSerializer();
		try (final BufferedReader reader = Files.newBufferedReader(modelFilePath, StandardCharsets.UTF_8)) {
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

			final FileBasedDocumentModelResolver modelResolver = new FileBasedDocumentModelResolver();
			modelResolver.setBaseDirectory(modelFilePath.getParent());
			new DocumentModelServiceFactory().createDocumentModelService().expand(documentModel, modelResolver);

			return documentModel;
		}
	}

}
