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
package com.mgmtp.a12.migration;

import com.google.gson.JsonParser;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

import static com.mgmtp.a12.migration.ModelCheck.scanModelTuple;

public class Main {
	public static void main(String[] args) throws IOException {
		if (args.length < 1) {
			System.out.println("Usage: java -jar analyzer.jar <path>");
			System.out.println(
				"<path> must either be a path to a form model file or a path to a directory that contains form models");
			System.exit(0);
		}

		final Path inputPath = Paths.get(args[0]);

		if (Files.isRegularFile(inputPath)) {
			// single file scanning mode
			final Path documentModelDirPath = inputPath.toAbsolutePath().getParent();

			// 1. search directory recursively for all DMs and build a map of modelName -> path
			final var dmMapping = findDMsInDirectory(documentModelDirPath);

			ModelLoader.LoadedModels loadedModels = null;
			try {
				loadedModels = ModelLoader.load(inputPath, dmMapping);
			} catch (final IOException e) {
				System.err.println(e);

				System.exit(-1);
			}

			var findings = scanModelTuple(loadedModels.meliesModel(), loadedModels.documentModel());

			if (!findings.isEmpty()) {
				System.out.println("Some potential inconsistencies were found:\n");
				findings.forEach(System.out::println);
			} else {
				System.out.println("No potential inconsistencies were found.");
			}

			System.exit(0);

		} else {
			// bulk scanning mode

			// 1. search directory recursively for all DMs and build a map of modelName -> path
			final var dmMapping = findDMsInDirectory(inputPath);

			// 2. search directory recursively for all FMs and scan each of them using the DM lookup map from #1
			final AtomicInteger modelsWithoutIssues = new AtomicInteger();
			final AtomicInteger modelsWithIssues = new AtomicInteger();

			Files.walk(inputPath, 100).forEach(path -> {
				if (path.toString().endsWith(".json") && Files.isRegularFile(path)) {
					try {
						final var fileContent = Files.readString(path, StandardCharsets.UTF_8);
						final var jsonObj = JsonParser.parseString(fileContent).getAsJsonObject();
						if (jsonObj.has("header")) {
							final var header = jsonObj.getAsJsonObject("header");
							if (header.has("modelType")) {
								final var modelType = header.get("modelType").getAsString();
								if (modelType.equals("form")) {
									ModelLoader.LoadedModels loadedModels;
									try {
										loadedModels = ModelLoader.load(path, dmMapping);
									} catch (final IOException e) {
										System.err.println(e);
										return;
									}

									System.out.println(path);
									var findings =
										scanModelTuple(loadedModels.meliesModel(), loadedModels.documentModel());

									if (!findings.isEmpty()) {
										findings.forEach(System.out::println);
										modelsWithIssues.getAndIncrement();
									} else {
										System.out.println("No potential inconsistencies were found.");
										modelsWithoutIssues.getAndIncrement();
									}
								}
							}
						}
					} catch (final IOException e) {
						// do nothing
						System.err.println("Failed to read file: " + path);
					}
				}
			});
			// 3. print output incl. a summary
			System.out.println(System.lineSeparator() + "Summary");
			System.out.println("-------");
			System.out.println(modelsWithIssues.get() + " models with issues were found.");
			System.out.println(modelsWithoutIssues.get() + " models without issues were found.");
		}
	}

	private static Map<String, Path> findDMsInDirectory(final Path dirPath) throws IOException {
		final var dmMapping = new HashMap<String, Path>();
		Files.walk(dirPath, 100).forEach(path -> {
			if (path.toString().endsWith(".json") && Files.isRegularFile(path)) {
				try {
					final var fileContent = Files.readString(path, StandardCharsets.UTF_8);
					final var jsonObj = JsonParser.parseString(fileContent).getAsJsonObject();
					if (jsonObj.has("header")) {
						final var header = jsonObj.getAsJsonObject("header");
						if (header.has("modelType") && header.has("id")) {
							final var modelType = header.get("modelType").getAsString();
							final var name = header.get("id").getAsString();

							if (modelType.equals("document") && !name.isBlank()) {
								dmMapping.put(name, path);
							}
						}
					}
				} catch (final IOException e) {
					// do nothing
					System.err.println("Failed to read file: " + path);
				}
			}
		});
		return dmMapping;
	}
}
