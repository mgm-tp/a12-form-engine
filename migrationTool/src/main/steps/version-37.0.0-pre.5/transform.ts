// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { FormModel as OldFormModel } from "../version-37.0.0-pre.4/FormModel.js";

import type { FormModel } from "./FormModel.js";

export default function (model: OldFormModel): FormModel {
	return renameContentAnnotations(model);
}

function renameContentAnnotations(model: OldFormModel): FormModel {
	traverseAndRenameAnnotation(model.content);
	return model as FormModel;
}

function traverseAndRenameAnnotation(obj: unknown): void {
	if (obj === null || typeof obj !== "object") {
		return;
	}

	if (Array.isArray(obj)) {
		for (const item of obj) {
			traverseAndRenameAnnotation(item);
		}
		return;
	}

	const record = obj as Record<string, unknown>;

	// Rename "annotation" to "annotations" while preserving property order
	if ("annotation" in record) {
		// Clear all properties and re-add them in order with renamed key
		const entries = Object.entries(record);
		for (const key of Object.keys(record)) {
			// oxlint-disable-next-line typescript/no-dynamic-delete
			delete record[key];
		}
		for (const [key, value] of entries) {
			record[key === "annotation" ? "annotations" : key] = value;
		}
	}

	// Recurse into all properties
	for (const value of Object.values(record)) {
		traverseAndRenameAnnotation(value);
	}
}
