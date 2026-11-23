// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.include;

import com.mgmtp.a12.kernel.md.model.api.IDocumentModel;
import com.mgmtp.a12.kernel.md.model.api.services.IDocumentModelReferenceResolver;

public class TestDocumentModelReferenceResolver implements IDocumentModelReferenceResolver {

	private final String basePath;

	public TestDocumentModelReferenceResolver(final String basePath) {
		this.basePath = basePath;
	}

	@Override
	public IDocumentModel getDocumentModel(final String reference) {
		return new TestDocumentModelResolver(basePath).resolve(reference);
	}
}
