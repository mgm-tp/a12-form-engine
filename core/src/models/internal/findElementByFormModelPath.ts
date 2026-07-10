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

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api";

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
