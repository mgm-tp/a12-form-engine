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
