// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

function readVersion(fname) {
	const properties = readFileSync(fname, "utf-8");
	return extractVersion(properties);
}

function extractVersion(properties) {
	const lines = properties.split("\n");
	const versionLine = lines.find(line => line.startsWith("MODEL_VERSION="));
	return versionLine?.substring("MODEL_VERSION=".length);
}

function writeVersion(folder, version) {
	const versionFile = `export const FORM_MODEL_VERSION = "${version.trim()}";`;

	mkdirSync(folder, { recursive: true });

	writeFileSync(`${folder}/version.js`, versionFile);
}

function createVersionFile() {
	const version = readVersion("../form-model/src/main/resources/version.properties");
	writeVersion("./lib/main/ts/", version);
}

createVersionFile();
