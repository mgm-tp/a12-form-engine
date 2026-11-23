// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { FormModel } from "../form-model.js";

/**
 * @internal
 * @ignore
 */
export namespace ModelUtils {
	function createFieldInstance(
		formModel: FormModel,
		element: DocumentModel.Element,
		documentModelPath: ModelPath
	): number | string | Date | Date[] | boolean | null {
		const fce =
			formModel.content.fieldConfiguration.fieldMap[
				ModelPath.toString([...documentModelPath, { elementName: element.name }])
			];

		const initialValue = fce && fce.initialValueTyped !== undefined ? fce.initialValueTyped : null;
		return initialValue;
	}

	/** @internal */
	export function createGroupInstance(
		group: DocumentModel.Element,
		formModel: FormModel,
		documentModelPath: ModelPath
	): {} {
		const groupInstance: { [key: string]: number | string | Date | boolean | null | object } = {};
		if (group.type === "Group") {
			for (const childElement of group.elements) {
				if (childElement.type === "Group" && childElement.repeatability === 1) {
					const child = createGroupInstance(childElement, formModel, [
						...documentModelPath,
						{ elementName: childElement.name }
					]);

					groupInstance[childElement.name] = child;
				} else if (childElement.type === "Field") {
					const child = createFieldInstance(formModel, childElement, documentModelPath);

					if (child !== undefined && child !== null) {
						groupInstance[childElement.name] = child;
					}
				}
			}
		}

		return groupInstance;
	}
}
