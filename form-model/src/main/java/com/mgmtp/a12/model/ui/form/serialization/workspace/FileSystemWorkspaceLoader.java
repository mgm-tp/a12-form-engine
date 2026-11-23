// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.serialization.workspace;

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
