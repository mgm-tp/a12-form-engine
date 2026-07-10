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
package com.mgmtp.a12.formengine.consistency;

import com.mgmtp.a12.model.Model;
import com.mgmtp.a12.model.data.document.ModelResolver;

import com.mgmtp.a12.kernel.md.combination.a12internal.CombinationModelService;
import com.mgmtp.a12.kernel.md.combination.a12internal.DMLike;
import com.mgmtp.a12.kernel.md.combination.a12internal.DMWrapper;
import com.mgmtp.a12.kernel.md.combination.a12internal.IUnexpandedModelResolver;
import com.mgmtp.a12.kernel.md.facade.DocumentModelServiceFactory;
import com.mgmtp.a12.kernel.md.model.api.IDocumentModel;
import com.mgmtp.a12.kernel.md.model.api.services.IDocumentModelReferenceResolver;
import com.mgmtp.a12.kernel.md.model.api.services.IDocumentModelSerializer;

import java.io.BufferedReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Optional;

import lombok.NonNull;
import org.apache.commons.lang3.StringUtils;

public class FileBasedDocumentModelResolver implements ModelResolver, IDocumentModelReferenceResolver, IUnexpandedModelResolver {

	private Path baseDirectory;

	public void setBaseDirectory(final Path baseDirectory) {
		this.baseDirectory = baseDirectory;
	}

	@Override
	public Optional<Model> getModel(final String modelName) {
		final IDocumentModel documentModel = getDocumentModel(modelName);

		if (documentModel != null) {
			final String fileSystemPath = modelName.endsWith(".json") ? modelName : modelName + ".json";
			final Path dmFilePath = this.baseDirectory.resolve(fileSystemPath);
			if (!Files.isRegularFile(dmFilePath)) {
				return Optional.empty();
			}
			final FileBasedDocumentModelResolver includeResolver = new FileBasedDocumentModelResolver();
			includeResolver.setBaseDirectory(dmFilePath.getParent());
			final Optional<IDocumentModel> expandedModel = CombinationModelService.expand(documentModel, includeResolver,
				CombinationModelService.CombinationModelExpandParams.builder().build());
			if (expandedModel.isEmpty()) {
				return Optional.empty();
			}
			return Optional.of(expandedModel.get());
		} else {
			return Optional.empty();
		}
	}

	@Override
	public @NonNull DMLike resolve(@NonNull String dmId) {
		return new DMWrapper((IDocumentModel) getModel(dmId).get());

	}

	@Override
	public final IDocumentModel getDocumentModel(final String reference) {
		if (this.baseDirectory == null || StringUtils.isBlank(reference)) {
			return null;
		}

		final String fileSystemPath = reference.endsWith(".json") ? reference : reference + ".json";
		final Path dmFilePath = this.baseDirectory.resolve(fileSystemPath);
		if (!Files.isRegularFile(dmFilePath)) {
			return null;
		}

		final IDocumentModelSerializer documentModelSerializer =
			new DocumentModelServiceFactory().createDocumentModelSerializer();
		IDocumentModel documentModel;
		try (final BufferedReader reader = Files.newBufferedReader(dmFilePath, StandardCharsets.UTF_8)) {
			documentModel = documentModelSerializer.deserialize(reader);
		} catch (final Exception e) {
			documentModel = null;
		}
		return documentModel;
	}
}
