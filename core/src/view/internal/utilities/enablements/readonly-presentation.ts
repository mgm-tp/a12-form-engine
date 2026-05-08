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

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";

import { ModelSelectors } from "../../../../back-end/store/internal/selectors/models.js";
import type { EngineState } from "../../../../back-end/store/internal/store.js";
import { FormModel } from "../../../../models/index.js";
import { FormModelUtils } from "../../../../models/internal/utils/form-model-utils.js";

/**
 * @internal
 * Evaluates the readonly presentation of a form-model element.
 * Note: Attachments are not excluded here, it need to be checked outside
 * if the element is an attachment or not.
 * @param formModelPath Form-Model path of the element for
 * which the readonly presentation is evaluated
 * @param state
 */
export function evaluateReadonlyPresentation(
	formModelPath: ModelPath,
	state: EngineState
): FormModel.ReadonlyPresentation | undefined {
	const formModel = ModelSelectors.formModel()(state);
	const elements = FormModelUtils.findPathElementsByFormModelPath(formModel, formModelPath);
	const isFieldOverviewColumn = FormModel.FieldOverviewColumn.isInstance(
		elements[elements.length - 1]
	);

	// Check the element and all its parents for a readonly presentation
	for (let i = elements.length - 1; i > 0; i--) {
		const element = elements[i];
		if (
			FormModel.ControlGrid.isInstance(element) ||
			FormModel.Control.isInstance(element) ||
			(isFieldOverviewColumn &&
				(FormModel.InlineRepeat.isInstance(element) ||
					FormModel.FieldOverviewColumn.isInstance(element)))
		) {
			if (element.readonlyPresentation === "INPUT") {
				return "INPUT";
			} else if (element.readonlyPresentation === "TEXT") {
				return "TEXT";
			}
		}
	}

	// If neither the element nor any parent has a readonly presentation defined check the model
	return isFieldOverviewColumn
		? formModel.content.inlineRepeatReadonlyPresentation
		: formModel.content.readonlyPresentation;
}
