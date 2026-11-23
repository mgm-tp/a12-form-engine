// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model.include;

import com.mgmtp.a12.kernel.md.model.api.IDocumentModel;
import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.internal.DocumentModelAccess;
import com.mgmtp.a12.model.ui.form.serialization.DocumentModelLoader;
import com.mgmtp.a12.model.ui.form.serialization.IncludeAwareFormModelJsonSerializer;
import java.util.Objects;
import org.apache.commons.lang3.Validate;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class FileSystemFormModelResolver implements FormModelResolver {

	private final Path baseDirectory;

	public FileSystemFormModelResolver(final Path baseDirectory) {
		Objects.requireNonNull(baseDirectory);
		this.baseDirectory = baseDirectory;
	}

	@Override
	public FormModelResult resolveFormModel(final String modelReference) {
		Validate.notBlank(modelReference);
		final String modelReferenceWithExtension =
			modelReference.endsWith(".json")
			? modelReference
			: modelReference + ".json";

		final MeliesModel formModel;
		try {
			final var pathToReferencedModel =
				Files.list(baseDirectory)
					 .filter(path -> modelReferenceWithExtension.equals(path.getFileName().toString()))
					 .findFirst()
					 .orElseThrow(() -> new RuntimeException(String.format(
						 "Included form model '%s' cannot be found in directory '%s'",
						 modelReferenceWithExtension,
						 baseDirectory
					 )));

			final var modelFileContent = Files.readString(pathToReferencedModel);
			formModel = (MeliesModel) new IncludeAwareFormModelJsonSerializer(this.baseDirectory).deserialize(modelFileContent);

		} catch (final IOException ioe) {
			throw new RuntimeException(ioe);
		}

		final var docModelAccess = loadDocumentModel(formModel);

		return new FormModelResolver.FormModelResult(formModel, docModelAccess);
	}

	private DocumentModelAccess loadDocumentModel(final MeliesModel formModel) {
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

		final IDocumentModel hostDocumentModel;
		try {
			hostDocumentModel =
				new DocumentModelLoader().loadFile(baseDirectory.resolve(docModelReference.getReference()));
		} catch (final IOException ioe) {
			throw new RuntimeException(ioe);
		}

		return new DocumentModelAccess(hostDocumentModel);
	}
}
