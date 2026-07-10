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

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import type { FormModel } from "../form-model.js";

/**
 * @internal
 * @ignore
 */

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
