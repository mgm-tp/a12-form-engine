// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.include;

import com.mgmtp.a12.kernel.md.facade.DocumentModelServiceFactory;
import com.mgmtp.a12.kernel.md.model.api.IDocumentModel;

import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

public class TestDocumentModelResolver {

	private final String basePath;

	public TestDocumentModelResolver(final String basePath) {
		this.basePath = basePath;
	}

	public IDocumentModel resolve(final String modelReference) {
		final var serializer = new DocumentModelServiceFactory().createDocumentModelSerializer();
		final IDocumentModel documentModel;
		
		final String path = modelReference.endsWith(".json") ? basePath + modelReference : basePath + modelReference + ".json";
		
		try (
			final var stream = TestDocumentModelResolver.class.getResourceAsStream(path);
			final var reader = new InputStreamReader(stream, StandardCharsets.UTF_8);
		) {
			return serializer.deserialize(reader);
		} catch (final IOException | NullPointerException ioe) {
			ioe.printStackTrace(System.err);
			throw new RuntimeException(ioe);
		}
	}
}
