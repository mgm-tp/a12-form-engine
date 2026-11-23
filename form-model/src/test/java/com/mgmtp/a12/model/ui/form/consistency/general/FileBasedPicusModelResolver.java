// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.general;

import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

import com.mgmtp.a12.kernel.md.facade.DocumentModelServiceFactory;
import com.mgmtp.a12.kernel.md.model.api.IDocumentModel;
import com.mgmtp.a12.kernel.md.model.api.services.IDocumentModelReferenceResolver;
import com.mgmtp.a12.model.Model;
import com.mgmtp.a12.model.data.document.ModelResolver;

public class FileBasedPicusModelResolver implements ModelResolver, IDocumentModelReferenceResolver {

	private final String directory;

	public FileBasedPicusModelResolver() {
		directory = "models/";
	}

	public FileBasedPicusModelResolver(final String directory) {
		this.directory = directory;
	}

	@Override
	public IDocumentModel getDocumentModel(final String reference) {
		IDocumentModel documentModel;
		final String path = reference.endsWith(".json") ? directory + reference : directory + reference + ".json";

		try {
			final InputStreamReader reader =
				new InputStreamReader(getClass().getClassLoader().getResourceAsStream(path), StandardCharsets.UTF_8);
			documentModel = new DocumentModelServiceFactory().createDocumentModelSerializer().deserialize(reader);
		} catch (final Exception e) {
			documentModel = null;
		}
		return documentModel;
	}

	@Override
	public Optional<Model> getModel(final String modelName) {
		final IDocumentModel documentModel = getDocumentModel(modelName);
		return Optional.ofNullable(documentModel);
	}

}
