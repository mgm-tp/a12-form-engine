// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";

export namespace FormModelPath {
	/**
	 * Extends the given form model path of the parent element with the respective representation of the given form model
	 * elements.
	 */
	export function extend(
		parentFormModelPath: ModelPath,
		...formModelElement: readonly object[]
	): ModelPath {
		const formModelElementPaths = formModelElement.map(e => ({
			elementName: getModelPathElementName(e)
		}));
		return [...parentFormModelPath, ...formModelElementPaths];
	}
}

/** @internal */
export function getModelPathElementName(formModelElement: {
	readonly name?: string;
	readonly id?: string;
}): string {
	const elementName = formModelElement.name ?? formModelElement.id;

	if (elementName === undefined) {
		throw new Error(
			`unexpected form model element without id and name encountered.
			${formModelElement}`
		);
	}

	return elementName;
}
