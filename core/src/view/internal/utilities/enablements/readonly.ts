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
import type { EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import { DataSelectors } from "../../../../back-end/store/index.js";
import { ModelSelectors } from "../../../../back-end/store/internal/selectors/models.js";
import { UiStateSelectors } from "../../../../back-end/store/internal/selectors/ui-state.js";
import type { EngineState } from "../../../../back-end/store/internal/store.js";
import {
	isFormModelFieldBasedInputType,
	isFormModelRepeat
} from "../../../../models/internal/FormModelGuards.js";
import { FormModelUtils } from "../../../../models/internal/utils/form-model-utils.js";

import { ElementStateUtil } from "../elementState.js";

/**
 * Evaluate if the form model element at the given path is supposed to be read-only.
 * A form model element is read-only, if either the element itself is read-only
 * or if any parent element is read-only.
 *
 * @param options.formModelPath The form model path of the element to be checked
 * @param options.state The current state
 * @param options.dataContext The current data context
 * @returns Whether the form model element at the given path is read-only
 */
export function isReadonly(options: {
	readonly formModelPath: ModelPath;
	readonly state: EngineState;
	readonly dataContext: EntityInstancePath;
}): boolean {
	const { formModelPath, state, dataContext } = options;

	if (UiStateSelectors.readonly()(state)) {
		return true;
	}

	const formModel = ModelSelectors.formModel()(state);
	const elements = FormModelUtils.findPathElementsByFormModelPath(formModel, formModelPath);

	return elements.some(element => {
		const formModelElement: { readonly readonly?: boolean } = element;

		if (formModelElement.readonly) {
			return true;
		} else if (isFormModelFieldBasedInputType(formModelElement)) {
			return ElementStateUtil.evaluateFieldReadOnly(
				DataSelectors.document()(state),
				state.models,
				formModelElement.elementPath,
				dataContext
			);
		} else if (isFormModelRepeat(formModelElement)) {
			return ElementStateUtil.evaluateGroupReadOnly(
				DataSelectors.document()(state),
				state.models,
				formModelElement.groupPath,
				dataContext
			);
		}

		return false;
	});
}
