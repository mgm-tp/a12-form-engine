// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
