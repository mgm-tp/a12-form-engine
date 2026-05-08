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
 * 1. Open-Source License – EUPL v1.2
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

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";

import { UiStateSelectors } from "../../../../../../back-end/store/internal/selectors/ui-state.js";
import type { EngineState, EngineStore } from "../../../../../../back-end/store/internal/store.js";
import { FormModel } from "../../../../../../models/internal/form-model.js";
import { FormModelPath } from "../../../../../../models/internal/utils/form-model-path.js";
import { evaluateReadonlyPresentation } from "../../../../utilities/enablements/readonly-presentation.js";

/** @internal */
export function filterErrorMessagesForNonVisibleFields(
	repeat: FormModel.InlineRepeat,
	repeatFormModelPath: ModelPath,
	state: EngineState,
	errorMessages: EngineStore.Validation.Message[]
): EngineStore.Validation.Message[] {
	return errorMessages.filter(e =>
		repeat.repeatOverviewColumn?.every(col => {
			if (FormModel.FieldOverviewColumn.isInstance(col)) {
				const formModelPath = FormModelPath.extend(repeatFormModelPath, col);
				const readonlyPresentation = evaluateReadonlyPresentation(formModelPath, state);

				return (
					!ModelPath.equal(e.element, col.elementPath) ||
					((repeat.readonly || UiStateSelectors.readonly()(state)) &&
						readonlyPresentation === "TEXT")
				);
			}

			return true;
		})
	);
}
