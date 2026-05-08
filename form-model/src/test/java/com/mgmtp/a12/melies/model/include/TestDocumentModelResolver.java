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
