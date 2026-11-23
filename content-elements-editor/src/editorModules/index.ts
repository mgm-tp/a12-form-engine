// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { EditorElementLibrary } from "@com.mgmtp.a12.contentengine/contentengine-editor";
import { FORM_ELEMENTS_NAMESPACE } from "@com.mgmtp.a12.formengine/formengine-content-elements";

import { AutoCompleteEditorModule } from "./autocomplete.js";
import { CheckboxEditorModule } from "./checkbox.js";
import { CheckboxGroupEditorModule } from "./checkboxGroup.js";
import { DatePickerEditorModule } from "./datePicker.js";
import { MessageGroupContainerModule } from "./messageGroupContainer.js";
import { MessageGroupDisplayModule } from "./messageGroupDisplay.js";
import { MultiSelectEditorModule } from "./multiSelect.js";
import { RadioEditorModule } from "./radio.js";
import { SelectEditorModule } from "./select.js";
import { SwitchEditorModule } from "./switch.js";
import { TextAreaEditorModule } from "./textArea.js";
import { TextLineEditorModule } from "./textLine.js";

export const FormElementsEditorLibrary: EditorElementLibrary = {
	id: FORM_ELEMENTS_NAMESPACE,
	modules: [
		TextLineEditorModule,
		TextAreaEditorModule,
		CheckboxEditorModule,
		SwitchEditorModule,
		DatePickerEditorModule,
		SelectEditorModule,
		AutoCompleteEditorModule,
		RadioEditorModule,
		MultiSelectEditorModule,
		CheckboxGroupEditorModule,
		MessageGroupContainerModule,
		MessageGroupDisplayModule
	],
	configuration: {
		orderingConfigurations: []
	}
};
