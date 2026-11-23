// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.migration;

import com.mgmtp.a12.kernel.md.model.api.IDocumentModel;
import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.MeliesModelUtil;
import com.mgmtp.a12.model.ui.form.serialization.FormModelJsonSerializer;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;

/**
 * Provides model loading functionality for a set of form and document model, including DM include expansion.
 */
class ModelLoader {

	static LoadedModels load(final Path formModelPath, final Map<String, Path> dmMapping) throws IOException {
		final String formModelAsString = Files.readString(formModelPath, StandardCharsets.UTF_8);
		final var formModel = (MeliesModel) new FormModelJsonSerializer().deserialize(formModelAsString);

		final var dmRef = MeliesModelUtil.getPicusFileReference(formModel);
		final var dmReference = dmRef.endsWith(".json") ? dmRef.substring(0, dmRef.length() - ".json".length()) : dmRef;

		if (!dmMapping.containsKey(dmReference)) {
			throw new RuntimeException(String.format(
				"Cannot load document model from reference [%s]. Model is not contained in given directory.",
				dmReference
			));
		}

		final var documentModel = new FileBasedDocumentModelResolver(dmMapping).getModel(dmReference).orElseThrow(
			() -> new IOException(String.format(
				"Form model [%s]: Cannot load document model from reference [%s]",
				formModelPath,
				dmRef
			))
		);

		return new LoadedModels(formModel, documentModel);
	}

	record LoadedModels(MeliesModel meliesModel, IDocumentModel documentModel) {
	}

}
