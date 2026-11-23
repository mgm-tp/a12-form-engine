// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { readFileSync, writeFileSync } from "node:fs";

import { DocumentServiceFactory } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/facade.js";

const TEST_RESOURCES_PATH = "src/test/resources/";

export function readDocumentModel(fname: string) {
	return new DocumentServiceFactory()
		.getDocumentModelSerializer()
		.deserialize(readTestResource(fname));
}

export function readTestJSON(fname: string) {
	return JSON.parse(readTestResource(fname));
}

function readTestResource(fname: string) {
	return readFileSync(TEST_RESOURCES_PATH + fname, "utf-8");
}

export function writeTestJSON(fname: string, json: unknown) {
	writeFileSync(TEST_RESOURCES_PATH + fname, JSON.stringify(json, undefined, "  "));
}
