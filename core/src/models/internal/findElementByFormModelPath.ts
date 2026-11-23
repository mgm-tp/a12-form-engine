// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";

import type { FormModel } from "./form-model.js";
import { FormModelUtils } from "./utils/form-model-utils.js";

/**
 * Finds the form model element to the given `ModelPath` in the formModel.
 *
 * @param formModel
 * @param targetPath the ModelPath of the element to find
 *
 * @returns the form model element or undefined if the element could not be found.
 */
export function findElementByFormModelPath(
	formModel: FormModel,
	targetPath: ModelPath
): object | undefined {
	let formModelElement: object | undefined = formModel;

	for (let i = 0; formModelElement !== undefined && i < targetPath.length; i++) {
		formModelElement = FormModelUtils.getChild(formModelElement, targetPath[i].elementName);
	}

	return formModelElement;
}
