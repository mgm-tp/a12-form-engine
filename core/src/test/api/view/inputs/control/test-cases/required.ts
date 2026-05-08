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

import { strictEqual } from "node:assert/strict";

import type { ComponentType } from "react";

import { query } from "@com.mgmtp.a12.devtools/react";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { FormModel } from "../../../../../../models/index.js";
import type { InputMap } from "../../../../../../view/internal/configuration/componentMap/input/input-map.js";
import type { Inputs } from "../../../../../../view/internal/configuration/engine-configuration.js";
import { getInputMocks } from "../../../../../rtl-utils/getInputMocks.js";
import { SetupHelpers } from "../../../../../utils/setup.js";
import { setupModelsFixture } from "../../../../../utils/setupFixture.js";
import { IDS } from "../../../../../utils/test-model-helpers/validation.required.js";

import { setMarkingOfRequiredFieldsInFormModel } from "./labels/setMarkingOfRequiredFieldsInFormModel.js";

export function executeTestRequired(): void {
	const models = setupModelsFixture("computation-validation.required");

	describe("given a control referencing a field which is not required", () => {
		executeRequiredTest(IDS.STRING_INPUT_NOT_REQUIRED, "StringInput", false, undefined);
		executeRequiredTest(IDS.STRING_INPUT_NOT_REQUIRED, "StringInput", false, "REQUIRED");
		executeRequiredTest(IDS.STRING_INPUT_NOT_REQUIRED, "StringInput", false, "NONE");
		executeRequiredTest(IDS.STRING_INPUT_NOT_REQUIRED, "StringInput", true, "ALWAYS");
	});

	describe("given a control referencing a field which is required", () => {
		executeRequiredTest(IDS.BOOLEAN_INPUT_REQUIRED, "BooleanSelectInput", true, undefined);
		executeRequiredTest(IDS.BOOLEAN_INPUT_REQUIRED, "BooleanSelectInput", true, "REQUIRED");
		executeRequiredTest(IDS.BOOLEAN_INPUT_REQUIRED, "BooleanSelectInput", false, "NONE");
		executeRequiredTest(IDS.BOOLEAN_INPUT_REQUIRED, "BooleanSelectInput", true, "ALWAYS");
	});

	function executeRequiredTest(
		id: string,
		type: keyof InputMap,
		expected: boolean,
		marking?: FormModel.MarkingOfRequiredFields
	) {
		describe(`and 'markingOfRequiredFields' is set to ${marking}`, () => {
			it(`renders a component with prop 'required' set to ${expected}`, () => {
				const modelsWithRequiredSetting = setMarkingOfRequiredFieldsInFormModel(models, marking);
				const inputMap = getInputMocks();
				SetupHelpers.setupFormEngineRendererWithRtl({
					models: modelsWithRequiredSetting,
					inputMap
				});
				const component = inputMap[type] as ComponentType<
					Inputs.InputProps<DocumentModel.FieldType>
				>;
				const props = query(component).withProp("uiId", id).props();
				strictEqual(props.modelElement.required, expected);
			});
		});
	}
}
