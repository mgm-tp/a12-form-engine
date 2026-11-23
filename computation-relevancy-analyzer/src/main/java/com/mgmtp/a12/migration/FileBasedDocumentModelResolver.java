// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.migration;

import com.mgmtp.a12.kernel.md.facade.DocumentModelServiceFactory;
import com.mgmtp.a12.kernel.md.model.api.IDocumentModel;
import com.mgmtp.a12.kernel.md.model.api.services.IDocumentModelReferenceResolver;
import com.mgmtp.a12.kernel.md.model.api.services.IDocumentModelSerializer;
import com.mgmtp.a12.model.ui.form.consistency.DocumentModelLoadingException;
import org.apache.commons.lang3.StringUtils;

import java.io.BufferedReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.Optional;

class FileBasedDocumentModelResolver implements IDocumentModelReferenceResolver {

	private final Map<String, Path> dmMapping;

	FileBasedDocumentModelResolver(final Map<String, Path> dmMapping) {
		this.dmMapping = dmMapping;
	}

	/**
	 * @return an {@link Optional} containing the expanded document model with the given name or null if it is not contained in the dm mapping
	 */
	public Optional<IDocumentModel> getModel(final String modelName) {
		final IDocumentModel documentModel = getDocumentModel(modelName);

		if (documentModel != null) {
			new DocumentModelServiceFactory().createDocumentModelService().expand(documentModel, this);
		} else {
			return Optional.empty();
		}
		return Optional.of(documentModel);
	}

	/**
	 * @return the non-expanded document model with the given name or null if it is not contained in the dm mapping
	 */
	@Override
	public final IDocumentModel getDocumentModel(final String modelName) {
		if (this.dmMapping == null || StringUtils.isBlank(modelName)) {
			return null;
		}

		if (modelName.contains("\\")) {
			throw new DocumentModelLoadingException(
				String.format(
					"Invalid model reference to \"%s\" using \\ as a path separator encountered during include expansion."
					+ " Please open and save the document model with this model reference/include in the Simple Model Editor to fix this problem.",
					modelName
				)
			);
		}

		final String dmName = modelName.endsWith(".json") ? modelName.substring(0, modelName.length() - ".json".length()) : modelName;
		final Path picusFilePath = this.dmMapping.get(dmName);
		if (picusFilePath == null || !Files.isRegularFile(picusFilePath)) {
			return null;
		}

		final IDocumentModelSerializer documentModelSerializer =
			new DocumentModelServiceFactory().createDocumentModelSerializer();
		IDocumentModel documentModel;
		try (final BufferedReader reader = Files.newBufferedReader(picusFilePath, StandardCharsets.UTF_8)) {
			documentModel = documentModelSerializer.deserialize(reader);
		} catch (final Exception e) {
			documentModel = null;
		}
		return documentModel;
	}

}
