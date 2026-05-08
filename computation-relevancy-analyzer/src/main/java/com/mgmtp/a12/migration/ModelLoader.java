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
