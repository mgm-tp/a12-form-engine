// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
