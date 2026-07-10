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

import com.mgmtp.a12.model.consistency.ConsistencyValidator;
import com.mgmtp.a12.model.consistency.Problem;
import com.mgmtp.a12.model.serialization.DefaultJsonModelTypeIdentifier;
import com.mgmtp.a12.model.serialization.ModelSerializationException;

import com.mgmtp.a12.formengine.consistency.fixes.ProblemFix;
import com.mgmtp.a12.formengine.consistency.fixes.ProblemFixFinder;
import com.mgmtp.a12.formengine.model.FormModel;
import com.mgmtp.a12.formengine.serialization.FormModelJsonStreamSerializer;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.InvalidPathException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.*;
import java.util.stream.Collectors;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.DefaultParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.ParseException;
import org.apache.commons.cli.help.HelpFormatter;

public class ConsistencyCheckCLI {

	private static final String ANSI_RESET = "\u001B[0m";
	private static final String ANSI_RED = "\u001B[31m";

	private static final String FILE_EXTENSION = ".json";
	private static final int SUCCESS = 0;
	private static final int FAILED = 1;
	private static final Options OPTIONS = new Options();

	static {
		OPTIONS.addOption("h", "help", false, "display this help");
		OPTIONS.addOption("f", "filter", true, "filter by problem category");
		OPTIONS.addOption("pc", "problem-categories", false, "show problem categories");
		OPTIONS.addOption("fix", "fix-problem", false, "fix problem - must be used with filter!");
	}

	public ConsistencyCheckCLI() {
	}

	/**
	 * The entry point of application.
	 *
	 * @param args the input arguments
	 */
	public static void main(final String[] args) {
		final int checkResult = new ConsistencyCheckCLI().check(args);
		System.exit(checkResult);
	}

	private static void showHelp() {
		showHelp(null);
	}

	private static void showHelp(final String error) {
		final HelpFormatter helpFormatter = HelpFormatter.builder().get();
		final StringBuilder header = new StringBuilder();
		if (error != null) {
			header.append("\terror: ");
			header.append(error);
		}
		header.append("\noptions:");
		try {
			helpFormatter.printHelp("java -jar form-model-consistency-check-cli-VERSION.jar MODEL_FILE/DIRECTORY", header.toString(), OPTIONS, null, false);
		} catch (IOException e) {
			println("Failed to print help: " + e.getMessage());
		}
	}

	private static void showProblemCategories() {
		for (final FormModelCategory category : FormModelCategory.values()) {
			final boolean fixAvailable = ProblemFixFinder.find(category).isPresent();
			println(category.name() + (fixAvailable ? ANSI_RED + " -> automated fix available!" + ANSI_RESET : ""));
		}
	}

	private static void printConsistencyProblems(final Collection<Problem> problems) {
		println("Problems:");
		for (final Problem problem : problems) {
			println("\t" + problem.getLocalizedMessage(Locale.getDefault()));
		}
	}

	private static Collection<Problem> filterProblems(
		final Collection<Problem> problems,
		final FormModelCategory filterCategory
	) {
		final Collection<Problem> filteredProblems;
		if (filterCategory != null) {
			filteredProblems = problems.stream()
				.filter(problem -> problem.getCategory().equals(filterCategory))
				.collect(Collectors.toList());
		} else {
			filteredProblems = problems;
		}
		return filteredProblems;
	}

	private static void println(final String message) {
		System.out.println(message);
	}

	/**
	 * Conduct the actual consistency check.
	 *
	 * @param args the input arguments
	 */
	public int check(final String[] args) {
		final CommandLineParser parser = new DefaultParser();
		final CommandLine commandLine;
		try {
			commandLine = parser.parse(OPTIONS, args, false);
		} catch (final ParseException e) {
			showHelp(e.getMessage());
			return FAILED;
		}

		if (commandLine.hasOption('h')) {
			showHelp();
			return SUCCESS;
		}

		if (commandLine.hasOption("pc")) {
			showProblemCategories();
			return SUCCESS;
		}

		final FormModelCategory filterCategory;
		if (commandLine.hasOption('f')) {
			final String optionValue = commandLine.getOptionValue('f');
			try {
				filterCategory = FormModelCategory.valueOf(optionValue);
			} catch (final IllegalArgumentException iae) {
				println(String.format("Filter category '%s' does not exist.", optionValue));
				return FAILED;
			}
		} else {
			filterCategory = null;
		}

		if (commandLine.getArgs().length != 1) {
			showHelp("Please specify a model file or directory!");
			return FAILED;
		}

		final Path inputPath;
		try {
			inputPath = Paths.get(commandLine.getArgs()[0]);
		} catch (final InvalidPathException e) {
			showHelp("Invalid path: " + commandLine.getArgs()[0]);
			return FAILED;
		}

		if (Files.isRegularFile(inputPath)) {
			return processSingleModel(inputPath, filterCategory, commandLine.hasOption("fix"));

		} else if (Files.isDirectory(inputPath)) {
			return processDirectoryRecursively(inputPath, filterCategory, commandLine.hasOption("fix"));

		} else {
			showHelp("Not a file or directory: " + commandLine.getArgs()[0]);
			return FAILED;
		}
	}

	private int processSingleModel(final Path inputPath, final FormModelCategory filterCategory, final boolean fix) {
		final Path parentDir = inputPath.getParent() != null ? inputPath.getParent() : Paths.get(".");
		final FileBasedDocumentModelResolver modelResolver = new FileBasedDocumentModelResolver();
		modelResolver.setBaseDirectory(parentDir);
		final ConsistencyValidator<FormModel> validator = new FormModelValidator(modelResolver);

		final FormModel formModel;
		try (final InputStream is = Files.newInputStream(inputPath, StandardOpenOption.READ)) {
			formModel = new FormModelJsonStreamSerializer().deserialize(is);
		} catch (final IOException ioex) {
			println("Form model loading failed: " + ioex.getMessage());
			return FAILED;
		}

		try {
			final List<Problem> problems = validator.validate(formModel);
			if (problems.isEmpty()) {
				return SUCCESS;
			} else {
				final Collection<Problem> filteredProblems =
					filterProblems(problems, filterCategory);
				if (!filteredProblems.isEmpty()) {
					if (fix) {
						if (fixProblems(filterCategory, formModel)) {
							new FormModelJsonStreamSerializer().serialize(
								formModel,
								Files.newOutputStream(
									inputPath,
									StandardOpenOption.TRUNCATE_EXISTING
								)
							);
							println("Problem(s) fixed.");
							return SUCCESS;
						} else {
							println(String.format(
								"There is no fix available for problem category '%s'.",
								filterCategory
							));
							return FAILED;
						}
					}
					println(String.format("Form model [%s] is inconsistent.", inputPath.toString()));
					printConsistencyProblems(filteredProblems);
					println("");
					return FAILED;
				}
			}
		} catch (final Exception e) {
			println("Consistency check failed with exception.");
			e.printStackTrace(System.out);
			return FAILED;
		}
		return SUCCESS;
	}

	private boolean fixProblems(
		final FormModelCategory filterCategory,
		final FormModel formModel
	) {
		final Optional<ProblemFix> fix = ProblemFixFinder.find(filterCategory);
		fix.ifPresent(problemFix -> {
			problemFix.fix(formModel);
		});
		return fix.isPresent();
	}

	private int processDirectoryRecursively(
		final Path inputPath,
		final FormModelCategory filterCategory,
		final boolean fix
	) {
		final Map<Path, Integer> resultMap = new HashMap<>();

		try {
			Files.walk(inputPath)
				.filter(Files::isRegularFile)
				.filter(path -> path.getFileName().toString().endsWith(FILE_EXTENSION))
				.filter(this::fileContainsFormModel)
				.forEach(p -> resultMap.put(p, processSingleModel(p, filterCategory, fix)));

		} catch (final IOException e) {
			println(String.format(
				"Failed to traverse directory + '%s'.\nReason: %s",
				inputPath.toString(),
				e.getMessage()
			));
			return FAILED;
		}

		if ((resultMap.values().stream().anyMatch(i1 -> i1 == FAILED))) {
			return FAILED;

		} else {
			printSuccess(resultMap.size());
			return SUCCESS;
		}
	}

	private boolean fileContainsFormModel(final Path path) {
		try {
			final String fileContent = new String(Files.readAllBytes(path), StandardCharsets.UTF_8);
			final Class<?> identifyModelType = new DefaultJsonModelTypeIdentifier().identifyModelType(fileContent);
			return FormModel.class.isAssignableFrom(identifyModelType);
		} catch (final IOException | ModelSerializationException exception) {
			return false;
		}
	}

	private void printSuccess(final int size) {
		println("\n" + size + " form models checked successfully.");
	}
}
