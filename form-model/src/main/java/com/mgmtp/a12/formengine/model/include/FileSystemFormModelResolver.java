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
 * 1. Open-Source License - EUPL v1.2
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
package com.mgmtp.a12.formengine.model.include;

import com.mgmtp.a12.kernel.md.model.api.IDocumentModel;

import com.mgmtp.a12.formengine.model.FormModel;
import com.mgmtp.a12.formengine.model.internal.DocumentModelAccess;
import com.mgmtp.a12.formengine.serialization.DocumentModelLoader;
import com.mgmtp.a12.formengine.serialization.IncludeAwareFormModelJsonSerializer;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Objects;

import org.apache.commons.lang3.Validate;

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

		final FormModel formModel;
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
			formModel = new IncludeAwareFormModelJsonSerializer(this.baseDirectory).deserialize(modelFileContent);

		} catch (final IOException ioe) {
			throw new RuntimeException(ioe);
		}

		final var docModelAccess = loadDocumentModel(formModel);

		return new FormModelResolver.FormModelResult(formModel, docModelAccess);
	}

	private DocumentModelAccess loadDocumentModel(final FormModel formModel) {
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
