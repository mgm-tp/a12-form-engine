// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.serialization;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

public class FormModelExpansionBatchCLI {

	public static void main(final String[] args) {
		if (args.length == 0) {
			final var errorMsg = "Usage: "
								 + FormModelExpansionBatchCLI.class.getSimpleName()
								 + " [<form model file>]+"
								 + System.lineSeparator()
								 + "<form model file>\t: path to the corresponding form model which should be expanded.";
			System.err.println(errorMsg);
			System.exit(-1);
		}
		expandModels(args);
	}

	private static void expandModels(final String[] args) {
		for (final String arg : args) {
			final var modelPath = Paths.get(arg);

			if (!Files.isRegularFile(modelPath)) {
				System.err.println("The path to the form model does not point to a file. Path: " + modelPath);
				continue;
			}

			String serializedExpandedModel = "";
			try {
				final var fileContent = Files.readString(modelPath);
				final var expandedModel =
					new IncludeAwareFormModelJsonSerializer(modelPath.getParent()).deserialize(fileContent);

				serializedExpandedModel = new FormModelJsonSerializer().serialize(expandedModel);
			} catch (final IOException ioe) {
				System.err.println("Error trying to load the form model from path: " + modelPath);
				ioe.printStackTrace(System.err);
				continue;
			}

			try {
				Files.writeString(modelPath, serializedExpandedModel);
			} catch (final IOException ioe) {
				System.err.println("Error trying to write the expanded form model back to: " + modelPath);
				ioe.printStackTrace(System.err);
				continue;
			}
		}
	}
}
