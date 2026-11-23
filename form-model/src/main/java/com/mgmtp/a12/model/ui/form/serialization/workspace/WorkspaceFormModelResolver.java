// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.serialization.workspace;

import com.mgmtp.a12.kernel.md.model.api.IDocumentModel;
import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.include.FormModelResolver;
import com.mgmtp.a12.melies.model.internal.DocumentModelAccess;
import com.mgmtp.a12.model.ui.form.serialization.DocumentModelLoader;
import com.mgmtp.a12.model.ui.form.serialization.FormModelJsonSerializer;
import java.util.Objects;
import org.apache.commons.lang3.Validate;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

/**
 * An implementation of {@link FormModelResolver} that locates and loads {@link com.mgmtp.a12.model.ui.form.FormModel}s
 * within a given model workspace in the file system.
 */
public class WorkspaceFormModelResolver implements FormModelResolver {

	private final FileSystemWorkspaceLoader loader;

	public WorkspaceFormModelResolver(final FileSystemWorkspaceLoader loader) {
		Objects.requireNonNull(loader);
		this.loader = loader;
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
			final var modelFileContent = loader.loadFileByName(modelReferenceWithExtension);
			if(modelFileContent.isEmpty()) {
				throw new RuntimeException("Cannot find form model '" + modelReference + "'");
			}
			// recursion happens here:
			// by deserializing the referenced form model again with this specific serializer, its nested includes will
			// be expanded first before inserting them into the host form
			formModel = (MeliesModel) new IncludeAwareFormModelJsonSerializer(loader).deserialize(modelFileContent.get());

		} catch (final IOException ioe) {
			throw new RuntimeException(ioe);
		}

		final var docModelAccess = loadDocumentModel(formModel);

		return new FormModelResult(formModel, docModelAccess);
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
			hostDocumentModel = WorkspaceDocumentModelLoader.loadFile(loader, docModelReference.getReference());
		} catch (final IOException ioe) {
			throw new RuntimeException(ioe);
		}

		return new DocumentModelAccess(hostDocumentModel);
	}
}
