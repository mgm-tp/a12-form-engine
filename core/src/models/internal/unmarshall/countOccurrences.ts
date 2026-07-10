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

import type { Mutable } from "../../../back-end/utils/internal/types.js";

import type { FormModel } from "../form-model.js";
import { ModelWalker } from "../utils/form-model-walker.js";
import type { ModelVisitor } from "../utils/form-model-walker.js";

export function countOccurrences(formModel: FormModel): void {
	const occurrences: { [elementRef: string]: number | undefined } = {};

	const visitor: ModelVisitor = {
		visitControl(control) {
			const mutableCtrl = control as Mutable<FormModel.Control>;
			const currentOccurrence = occurrences[control.elementRef] || 0;
			const newOccurrence = currentOccurrence + 1;
			occurrences[control.elementRef] = newOccurrence;
			mutableCtrl.occurrence = newOccurrence;
			return "ContinueTraversal";
		}
	};
	new ModelWalker(visitor).acceptModel(formModel);
}
