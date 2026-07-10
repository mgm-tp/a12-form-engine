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
package com.mgmtp.a12.formengine.serialization;

import com.mgmtp.a12.kernel.md.combination.a12internal.CombinationModelService;
import com.mgmtp.a12.kernel.md.facade.DocumentModelServiceFactory;
import com.mgmtp.a12.kernel.md.model.api.IDocumentModel;
import com.mgmtp.a12.kernel.md.model.api.services.IDocumentModelSerializer;

import com.mgmtp.a12.formengine.consistency.FileBasedDocumentModelResolver;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

import org.apache.commons.lang3.Validate;

public class DocumentModelLoader {

	/**
	 * Loads the document model for given filename.
	 *
	 * @param modelFilePath document model path. May not be null.
	 * @throws IOException
	 */
	public IDocumentModel loadFile(final Path modelFilePath) throws IOException {
		Validate.notNull(modelFilePath, "filename must not be empty");
		if (!Files.exists(modelFilePath)) {
			throw new RuntimeException(
				"File '"
				+ modelFilePath.toString()
				+ "' does not exist. Cannot load document model.");
		}

		final IDocumentModelSerializer documentModelSerializer =
			new DocumentModelServiceFactory().createDocumentModelSerializer();
		try (final BufferedReader reader = Files.newBufferedReader(modelFilePath, StandardCharsets.UTF_8)) {
			final IDocumentModel documentModel = documentModelSerializer.deserialize(reader);

			final FileBasedDocumentModelResolver modelResolver = new FileBasedDocumentModelResolver();
			modelResolver.setBaseDirectory(modelFilePath.getParent());
			return CombinationModelService.expand(documentModel, modelResolver,
					CombinationModelService.CombinationModelExpandParams.builder().build())
				.orElse(documentModel);
		}
	}

}
