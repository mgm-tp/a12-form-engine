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

import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import type { DeepMutable, Mutable } from "../../../back-end/utils/internal/types.js";

import type { FormModel } from "../form-model.js";
import { findByPath } from "../utils/document-model-utils.js";
import { ModelWalker } from "../utils/form-model-walker.js";
import type { ModelVisitor, VisitProcess } from "../utils/form-model-walker.js";

export function getDependentScreenElementMap(
	formModel: FormModel,
	documentModel: DocumentModel
): void {
	const dependentScreenElements: {
		[key: string]: Mutable<{
			controls: {
				[key: string]: Mutable<FormModel.DependentControlMaster>;
			};
		}>;
	} = {};

	const visitor: ModelVisitor = {
		visitControl(control: FormModel.Control): VisitProcess {
			if (control.dependentControls === undefined) {
				return "ContinueTraversal";
			}

			const element = findByPath(documentModel, control.elementPath);

			for (const screenElement of control.dependentControls.screenElement) {
				dependentScreenElements[screenElement.idref] ??= { controls: {} };

				const dependentScreenElement = dependentScreenElements[screenElement.idref];

				if (dependentScreenElement.controls[control.id] === undefined) {
					dependentScreenElements[screenElement.idref].controls[control.id] = {
						elementPath: control.elementPath,
						controlIndex: control.index,
						values: []
					};
				}

				const value =
					element.type === "Field" && element.fieldType.type === "BooleanType"
						? screenElement.masterValue === "true"
							? true
							: screenElement.masterValue === "false"
								? false
								: null
						: element.type === "Field" && element.fieldType.type === "ConfirmType"
							? screenElement.masterValue === "true" || null
							: screenElement.masterValue || null;

				dependentScreenElement.controls[control.id]?.values.push(value);
			}

			return "ContinueTraversal";
		}
	};
	new ModelWalker(visitor).acceptModel(formModel);

	const mutableFormModel = formModel as DeepMutable<FormModel>;
	mutableFormModel.content.dependentScreenElements = dependentScreenElements;
}
