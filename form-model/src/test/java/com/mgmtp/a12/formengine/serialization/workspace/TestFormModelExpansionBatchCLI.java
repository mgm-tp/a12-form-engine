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
package com.mgmtp.a12.formengine.serialization.workspace;

import static org.testng.Assert.assertEquals;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.Objects;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.testng.Assert;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

public class TestFormModelExpansionBatchCLI {

	private static final String[] TEST_MODELS = new String[] {
		"company-form.json",
		"company-document.json",
		"address-form.json",
		"address-document.json",
		"person-form.json",
		"person-document.json"
	};

	private static final String EXPECTED_MODEL = "company-form-expected.json";

	private Path workspacePath;

	/**
	 * Copies the test models into the "workspace path" temp folder.
	 * Each model is copied into its own subdirectory in order to test the workspace model loading.
	 * The subdirectory names are generated from the first letter of the test model names.
	 */
	@BeforeClass
	public void prepareWorkspace() throws IOException {
		workspacePath = Files.createTempDirectory("FormModelBatchExpansionTest");

		Arrays.stream(TEST_MODELS).forEach(testModel -> {
			try {
				final var dirName = testModel.substring(0, 1);
				final var dirPath = workspacePath.resolve(dirName);
				if(!Files.exists(dirPath)) {
					Files.createDirectory(dirPath);
				}
				final Path copyPath = Files.createFile(dirPath.resolve(testModel));
				Files.copy(
					Objects.requireNonNull(getClass().getResourceAsStream(testModel)),
					copyPath,
					StandardCopyOption.REPLACE_EXISTING
				);
			} catch (final IOException e) {
				Assert.fail(e.getMessage());
			}
		});
	}

	/**
	 * Runs the batch expander on the tmp workspace folder and compares the updated "host model" file against its
	 * expected version.
	 */
	@Test
	public void testBatchExpansion() throws IOException {
		FormModelExpansionBatchCLI.main(new String[] { workspacePath.toAbsolutePath().toString() });

		final var expandedModelPath = workspacePath.resolve("c/" + TEST_MODELS[0]);
		final var expandedModel = Files.readString(expandedModelPath, StandardCharsets.UTF_8);

		final String expectedModel =
			IOUtils.toString(
				Objects.requireNonNull(getClass().getResourceAsStream(EXPECTED_MODEL)),
				StandardCharsets.UTF_8
			);

		assertEquals(expandedModel.trim(), expectedModel.trim());
	}

	@AfterClass
	public void tearDownWorkspace() throws IOException {
		FileUtils.deleteDirectory(workspacePath.toFile());
	}
}
