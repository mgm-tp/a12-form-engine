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
