// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.migration;

import com.mgmtp.a12.kernel.md.facade.DocumentModelServiceFactory;
import com.mgmtp.a12.kernel.md.model.api.IDocumentModel;
import com.mgmtp.a12.kernel.md.model.api.services.IDocumentModelReferenceResolver;

import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

public class FileBasedDocumentModelResolver implements IDocumentModelReferenceResolver {

	private final String directory;

	public FileBasedDocumentModelResolver(final String directory) {
		this.directory = directory;
	}

	@Override
	public IDocumentModel getDocumentModel(final String reference) {
		IDocumentModel documentModel;
		final String basePath = "/" + directory + "/" + reference;
		final String path = reference.endsWith(".json") ? basePath : basePath + ".json";

		try {
			final var inputStream = getClass().getResourceAsStream(path);
			final InputStreamReader reader = new InputStreamReader(inputStream, StandardCharsets.UTF_8);
			documentModel = new DocumentModelServiceFactory().createDocumentModelSerializer().deserialize(reader);
		} catch (final Exception e) {
			documentModel = null;
		}
		return documentModel;
	}

	public IDocumentModel getExpandedModel(final String reference) {
		final var dm = getDocumentModel(reference);
		new DocumentModelServiceFactory().createDocumentModelService().expand(dm, this);
		return dm;
	}
}
