// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.include;

import com.mgmtp.a12.kernel.md.facade.DocumentModelServiceFactory;
import com.mgmtp.a12.kernel.md.model.api.IDocumentModel;
import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.internal.DocumentModelAccess;
import com.mgmtp.a12.model.ui.form.consistency.FileBasedDocumentModelResolver;
import com.mgmtp.a12.model.ui.form.serialization.FormModelJsonStreamSerializer;

public class TestFormModelResolver implements FormModelResolver {

	private final String subPath;

	public TestFormModelResolver() {
		this("");
	}

	public TestFormModelResolver(final String subPath) {
		this.subPath = subPath;
	}

	@Override
	public FormModelResult resolveFormModel(final String modelReference) {
		final var formModel =
			(MeliesModel) new FormModelJsonStreamSerializer()
				.deserialize(TestFormModelResolver.class.getResourceAsStream(subPath + modelReference + ".json"));

		final var docModelReference =
			formModel.getHeader()
					 .getModelReferences()
					 .stream()
					 .filter(modelRef -> "document".equals(modelRef.getModelType()))
					 .findFirst()
					 .orElseThrow(() ->
									  new RuntimeException(String.format(
										  "Form model '%s' does not contain a document model reference.",
										  formModel.getHeaderId()
									  )));

		final IDocumentModel documentModel =
			new TestDocumentModelResolver(subPath).resolve(docModelReference.getReference());

		final var dmService = new DocumentModelServiceFactory().createDocumentModelService();

		dmService.expand(documentModel, new TestDocumentModelReferenceResolver(subPath));

		return new FormModelResult(formModel, new DocumentModelAccess(documentModel));
	}
}
