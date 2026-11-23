// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
