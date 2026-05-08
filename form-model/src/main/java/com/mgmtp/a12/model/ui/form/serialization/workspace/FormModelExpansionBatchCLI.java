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
package com.mgmtp.a12.model.ui.form.serialization.workspace;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.model.header.DefaultHeaderParser;
import com.mgmtp.a12.model.header.HeaderParseException;
import com.mgmtp.a12.model.ui.form.serialization.FormModelJsonSerializer;
import com.mgmtp.a12.model.ui.form.serialization.FormModelSerializationProvider;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

/**
 * Executes the form model expansion on all form models within the workspace that is passed via the single program argument.
 */
public class FormModelExpansionBatchCLI {

	public static void main(final String[] args) throws IOException {
		if (args.length != 1) {
			final var errorMsg = "Usage: "
								 + FormModelExpansionBatchCLI.class.getSimpleName()
								 + " [<A12 models directory>]"
								 + System.lineSeparator()
								 + "<A12 models directory>\t: path to the directory that contains all relevant A12 models";
			System.err.println(errorMsg);
			System.exit(-1);
		}
		System.out.printf("Starting batch expansion of form models in %s.%n", args[0]);
		expandModels(args[0]);
	}

	private static void expandModels(final String baseDirStr) throws IOException {
		final var baseDirPath = Paths.get("").toAbsolutePath().resolve(Paths.get(baseDirStr)).normalize();
		final var loader = new FileSystemWorkspaceLoader(baseDirPath);
		final var formModelExpander = new IncludeAwareFormModelJsonSerializer(loader);
		System.out.printf("Starting to search models in '%s'.%n", baseDirPath);

		Files.walk(baseDirPath)
			.filter(Files::isRegularFile)
			.filter(filePath -> filePath.getFileName().toString().endsWith(".json"))
			.forEach(modelPath -> {
				var serializedExpandedModel = "";
				try {
					final var fileContent = Files.readString(modelPath);
					final var isFormModel = new FormModelSerializationProvider().isModelJson(fileContent);
					final var formModelHeader = new DefaultHeaderParser().parseJson(fileContent);

					if(isFormModel) {
						final var relativePath = baseDirPath.relativize(modelPath);
						final var modelVersion = formModelHeader.getModelVersion();
						if(!modelVersion.equals(MeliesModel.MODEL_VERSION)) {
							System.out.printf("Form model '%s' has unsupported version %s and will be skipped.%n", relativePath, modelVersion);
						} else {
							System.out.printf("Running form model expansion on '%s'. ", relativePath);
							final var expandedModel = formModelExpander.deserialize(fileContent);
							serializedExpandedModel = new FormModelJsonSerializer().serialize(expandedModel);

							try {
								Files.writeString(modelPath, serializedExpandedModel);
								System.out.println("Done.");
							} catch (final IOException ioe) {
								System.err.println("Error trying to write the expanded form model back to: " + modelPath);
								ioe.printStackTrace(System.err);
							}
						}
					}
				} catch (final IOException ioe) {
					System.err.println("Error trying to load the form model from path: " + modelPath);
					ioe.printStackTrace(System.err);
				} catch (final HeaderParseException e) {
					e.printStackTrace(System.err);
				}
			});
	}
}
