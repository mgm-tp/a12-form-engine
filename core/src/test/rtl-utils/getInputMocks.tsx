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

import { mock } from "node:test";

import type { InputMap } from "../../view/internal/configuration/componentMap/input/input-map.js";
import type { InputPropsType } from "../../view/internal/configuration/componentMap/input/input.js";
import { Input } from "../../view/internal/configuration/componentMap/input/input.js";

import { MockComponent } from "./mockComponent.js";

export function getInputMocks(): InputMap {
	return {
		Input,
		AttachmentInput: mock.fn(createControlInputMock("AttachmentInput")),
		BooleanSelectInput: mock.fn(createControlInputMock("BooleanSelectInput")),
		CheckboxInput: mock.fn(createControlInputMock("CheckboxInput")),
		SwitchInput: mock.fn(createControlInputMock("SwitchInput")),
		BooleanRadioInput: mock.fn(createControlInputMock("BooleanRadioInput")),
		DateFragmentInput: mock.fn(createControlInputMock("DateFragmentInput")),
		DateInput: mock.fn(createControlInputMock("DateInput")),
		DateRangeInput: mock.fn(createControlInputMock("DateRangeInput")),
		DateTimeInput: mock.fn(createControlInputMock("DateTimeInput")),
		TimeInput: mock.fn(createControlInputMock("TimeInput")),
		AutoCompleteInput: mock.fn(createControlInputMock("AutoCompleteInput")),
		RadioInput: mock.fn(createControlInputMock("RadioInput")),
		DropDownInput: mock.fn(createControlInputMock("DropDownInput")),
		CheckboxGroupInput: mock.fn(createControlInputMock("CheckboxGroupInput")),
		MultiSelectInput: mock.fn(createControlInputMock("MultiSelectInput")),
		NumberInput: mock.fn(createControlInputMock("NumberInput")),
		MultilineInput: mock.fn(createControlInputMock("MultilineInput")),
		StringWithHintListInput: mock.fn(createControlInputMock("StringWithHintListInput")),
		StringInput: mock.fn(createControlInputMock("StringInput"))
	};
}

export const ControlInputMock = createControlInputMock();

function createControlInputMock(dataRole?: keyof InputMap) {
	return function (props: InputPropsType) {
		return <MockComponent id={props.uiId} dataRole={dataRole ?? "Control"} />;
	};
}
