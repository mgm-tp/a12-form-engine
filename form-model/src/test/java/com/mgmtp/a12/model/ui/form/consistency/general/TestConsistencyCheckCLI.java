// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.general;

import com.mgmtp.a12.melies.common.ConsoleOutputCapturer;
import com.mgmtp.a12.model.ui.form.consistency.ConsistencyCheckCLI;
import org.apache.commons.io.FileUtils;
import org.testng.Assert;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.Locale;

public class TestConsistencyCheckCLI {

	private static final int SUCCESS = 0;
	private static final int FAIL = 1;

	private static final String[] TEST_MODELS = new String[] {
		"TestCliFilter.json",
		"TestCliIncludeFail.json",
		"TestCliNoProblem.json",
		"TestDataModel.json",
		"TestDataModel2.json"
	};
	private static final String NL = System.lineSeparator();
	private static final String EXPECTED_UNFILTERED_OUTPUT =
		"Problems:"
		+ NL
		+ "\tThe form model element [id: controlgrid-1c5e9, name: cg3, type: ControlGridType] has children with duplicate names: row1."
		+ NL
		+ "\tThe element [textcell-f03daf] exceeds for layout lg with offset [0] the defined maximum index [2] for the control grid [cg3]."
		+ NL
		+ NL;
	private static final String EXPECTED_FILTERED_OUTPUT =
		"Problems:"
		+ NL
		+ "\tThe form model element [id: controlgrid-1c5e9, name: cg3, type: ControlGridType] has children with duplicate names: row1."
		+ NL
		+ NL;
	private static final String EXPECTED_DATA_MODEL_PROBLEM_OUTPUT =
		"Problems:" + NL + "\tThe document model [name: TestDataModel2] could not be expanded, due to the following problem: [Cannot open included document model 'NonExistingModel'.]";
	private Path tempFolder;

	@BeforeMethod
	public void prepare() throws IOException {
		tempFolder = Files.createTempDirectory("ConsistencyCheckCliTest");

		Arrays.stream(TEST_MODELS).forEach(testModel -> {
			try {
				final Path copyPath = Files.createFile(tempFolder.resolve(testModel));
				Files.copy(
					getClass().getResourceAsStream("cli/" + testModel),
					copyPath,
					StandardCopyOption.REPLACE_EXISTING
				);
			} catch (final IOException e) {
				Assert.fail(e.getMessage());
			}
		});
	}

	@AfterClass
	public void cleanUp() throws IOException {
		FileUtils.deleteDirectory(tempFolder.toFile());
	}

	@Test
	public void testNoProblem() throws IOException {
		Locale.setDefault(Locale.ENGLISH);
		final ConsoleOutputCapturer consoleCapturer = new ConsoleOutputCapturer();
		consoleCapturer.start();
		final int checkResult = new ConsistencyCheckCLI().check(new String[] {
			tempFolder.resolve(TEST_MODELS[2])
					  .toAbsolutePath().toString()
		});
		System.out.flush();
		final String consoleOutput = consoleCapturer.stop();

		Assert.assertEquals(checkResult, SUCCESS);
		Assert.assertFalse(consoleOutput.contains("Problems:"));
	}

	@Test
	public void testIncludeFail() throws IOException {
		Locale.setDefault(Locale.ENGLISH);
		final ConsoleOutputCapturer consoleCapturer = new ConsoleOutputCapturer();
		consoleCapturer.start();
		final int checkResult = new ConsistencyCheckCLI().check(new String[] {
			tempFolder.resolve(TEST_MODELS[1]).toAbsolutePath().toString()
		});
		System.out.flush();
		final String consoleOutput = consoleCapturer.stop();

		Assert.assertEquals(checkResult, FAIL);
		System.out.println(consoleOutput.toString());
		Assert.assertTrue(consoleOutput.contains(EXPECTED_DATA_MODEL_PROBLEM_OUTPUT));
	}

	@Test
	public void testUnfiltered() throws IOException {
		Locale.setDefault(Locale.ENGLISH);
		final ConsoleOutputCapturer consoleCapturer = new ConsoleOutputCapturer();
		consoleCapturer.start();
		final int checkResult = new ConsistencyCheckCLI().check(new String[] {
			tempFolder.resolve(TEST_MODELS[0])
					  .toAbsolutePath().toString()
		});
		System.out.flush();
		final String consoleOutput = consoleCapturer.stop();

		Assert.assertEquals(checkResult, FAIL);
		Assert.assertTrue(consoleOutput.endsWith(EXPECTED_UNFILTERED_OUTPUT));
	}

	@Test
	public void testFiltered() throws IOException {
		Locale.setDefault(Locale.ENGLISH);
		final ConsoleOutputCapturer consoleCapturer = new ConsoleOutputCapturer();
		consoleCapturer.start();
		final int checkResult = new ConsistencyCheckCLI().check(new String[] {
			"-f", "FORM_MODEL_DUPLICATE_ELEMENT_NAME", tempFolder.resolve(TEST_MODELS[0]).toAbsolutePath().toString()
		});
		System.out.flush();
		final String consoleOutput = consoleCapturer.stop();

		Assert.assertEquals(checkResult, FAIL);
		Assert.assertTrue(consoleOutput.endsWith(EXPECTED_FILTERED_OUTPUT));
	}

	@Test
	public void testUnknowCategory() throws IOException {
		final ConsoleOutputCapturer consoleCapturer = new ConsoleOutputCapturer();
		consoleCapturer.start();
		final int checkResult = new ConsistencyCheckCLI().check(new String[] { "-f", "abc" });
		System.out.flush();
		final String consoleOutput = consoleCapturer.stop();

		Assert.assertEquals(checkResult, FAIL);
		Assert.assertEquals(consoleOutput, "Filter category 'abc' does not exist." + NL);
	}

	@Test
	public void testFix() throws IOException {
		final ConsoleOutputCapturer consoleCapturer = new ConsoleOutputCapturer();
		consoleCapturer.start();
		final int checkResult =
			new ConsistencyCheckCLI().check(
				new String[] {
					"-f",
					"FORM_MODEL_DUPLICATE_ELEMENT_NAME",
					"-fix",
					tempFolder.resolve(TEST_MODELS[0]).toAbsolutePath().toString()
				});
		System.out.flush();
		final String consoleOutput = consoleCapturer.stop();

		Assert.assertEquals(checkResult, SUCCESS);
		Assert.assertEquals(consoleOutput, "Problem(s) fixed." + NL);
	}

	@Test
	public void testFixNotAvailable() throws IOException {
		final ConsoleOutputCapturer consoleCapturer = new ConsoleOutputCapturer();
		consoleCapturer.start();
		final int checkResult =
			new ConsistencyCheckCLI().check(
				new String[] {
					"-f",
					"FORM_MODEL_WRONG_COLUMN_INDEX",
					"-fix",
					tempFolder.resolve(TEST_MODELS[0]).toAbsolutePath().toString()
				});
		System.out.flush();
		final String consoleOutput = consoleCapturer.stop();

		Assert.assertEquals(checkResult, FAIL);
		Assert.assertEquals(
			consoleOutput,
			"There is no fix available for problem category 'FORM_MODEL_WRONG_COLUMN_INDEX'." + NL
		);
	}

}
