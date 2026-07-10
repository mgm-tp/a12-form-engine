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

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Loads text files from a workspace in a file system. The workspace is identified by a file system path.
 *
 * The files to load must be uniquely identifiable by name. I.e. there may not be any file name duplicates within all
 * subdirectories of the workspace directory!
 */
public class FileSystemWorkspaceLoader {

	private final Path baseDirectory;
	private final Map<String, String> fileCache = new HashMap<>();

	public FileSystemWorkspaceLoader(final Path baseDirectory) {
		this.baseDirectory = baseDirectory;
	}

	/**
	 * Loading a file only requires passing the file name.
	 * The loader scans all files (incl. all subdirectories) to find and read the respective file.
	 * @param name the name of the file to load and read into a string
	 * @return the file content or nothing
	 * @throws IOException
	 */
	public Optional<String> loadFileByName(final String name) throws IOException {
		if(!fileCache.containsKey(name)) {
			final var file = findModelFileByName(name);
			if(file.isPresent()) {
				final var fileContent = Files.readString(file.get(), StandardCharsets.UTF_8);
				fileCache.put(name, fileContent);
			}
		}
		return Optional.ofNullable(fileCache.get(name));
	}

	private Optional<Path> findModelFileByName(final String modelName) throws IOException {
		final var fileName = modelName.endsWith(".json") ? modelName : modelName + ".json";
		return Files.walk(baseDirectory).filter(path -> path.endsWith(fileName)).findFirst();
	}
}
