// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
import type {
	ElementLibrary,
	NodeValidationContext,
	ValidationMessage
} from "@com.mgmtp.a12.contentengine/contentengine-core";

import { FORM_ELEMENTS_NAMESPACE } from "../namespace.js";

import { AutoCompleteModule } from "./modules/autoComplete/autocompleteModule.js";
import { autocompleteValidator } from "./modules/autoComplete/autocompleteValidator.js";
import { CheckboxModule } from "./modules/checkbox/checkboxModule.js";
import { checkboxValidator } from "./modules/checkbox/checkboxValidator.js";
import { CheckboxGroupModule } from "./modules/checkboxGroup/checkboxGroupModule.js";
import { checkboxGroupValidator } from "./modules/checkboxGroup/checkboxGroupValidator.js";
import { DatePickerModule } from "./modules/datePicker/datePickerModule.js";
import { datePickerValidator } from "./modules/datePicker/datePickerValidator.js";
import { MessageGroupContainerModule } from "./modules/messageGroupContainer/messageGroupContainerModule.js";
import { messageGroupContainerValidator } from "./modules/messageGroupContainer/messageGroupContainerValidator.js";
import { MessageGroupDisplayModule } from "./modules/messageGroupDisplay/messageGroupDisplayModule.js";
import { messageGroupDisplayValidator } from "./modules/messageGroupDisplay/messageGroupDisplayValidator.js";
import { MultiSelectModule } from "./modules/multiSelect/multiSelectModule.js";
import { multiSelectValidator } from "./modules/multiSelect/multiSelectValidator.js";
import { RadioModule } from "./modules/radio/radioModule.js";
import { radioValidator } from "./modules/radio/radioValidator.js";
import { SelectModule } from "./modules/select/selectModule.js";
import { selectValidator } from "./modules/select/selectValidator.js";
import { SwitchModule } from "./modules/switch/switchModule.js";
import { switchValidator } from "./modules/switch/switchValidator.js";
import { TextAreaModule } from "./modules/textArea/textAreaModule.js";
import { textAreaValidator } from "./modules/textArea/textAreaValidator.js";
import { TextLineModule } from "./modules/textLine/textLineModule.js";
import { textLineValidator } from "./modules/textLine/textLineValidator.js";

export * from "./focus.js";

export * from "./modules/autoComplete/autocompleteNode.js";
export * from "./modules/checkbox/checkboxNode.js";
export * from "./modules/checkboxGroup/checkboxGroupNode.js";
export * from "./modules/datePicker/datePickerNode.js";
export * from "./modules/messageGroupContainer/messageGroupContainerNode.js";
export * from "./modules/messageGroupDisplay/messageGroupDisplayNode.js";
export * from "./modules/multiSelect/multiSelectNode.js";
export * from "./modules/radio/radioNode.js";
export * from "./modules/select/selectNode.js";
export * from "./modules/switch/switchNode.js";
export * from "./modules/textArea/textAreaNode.js";
export * from "./modules/textLine/textLineNode.js";

export * from "./modules/messageGroupContainer/editableElementsContext.js";
export * from "./modules/messageGroupContainer/messageGroupContext.js";
export * from "./modules/messageGroupContainer/useCollectDocumentElementIds.js";
export * from "./modules/messageGroupContainer/useCollectEditableElements.js";

export * from "./elementConfiguration/useCommonControlSettings.js";
export * from "./elementConfiguration/useCommonWidgetSettings.js";
export * from "./elementConfiguration/useLocalizedEnumerationValues.js";

export const FormElementsModules = {
	AutoComplete: AutoCompleteModule,
	Checkbox: CheckboxModule,
	CheckboxGroup: CheckboxGroupModule,
	DatePicker: DatePickerModule,
	MessageGroupContainer: MessageGroupContainerModule,
	MessageGroupDisplay: MessageGroupDisplayModule,
	MultiSelect: MultiSelectModule,
	Radio: RadioModule,
	Select: SelectModule,
	Switch: SwitchModule,
	TextArea: TextAreaModule,
	TextLine: TextLineModule
};

export const FormElementsValidators: Record<
	string,
	(context: NodeValidationContext) => ValidationMessage[]
> = {
	AutoComplete: autocompleteValidator,
	Checkbox: checkboxValidator,
	CheckboxGroup: checkboxGroupValidator,
	DatePicker: datePickerValidator,
	MessageGroupContainer: messageGroupContainerValidator,
	MessageGroupDisplay: messageGroupDisplayValidator,
	MultiSelect: multiSelectValidator,
	Radio: radioValidator,
	Select: selectValidator,
	Switch: switchValidator,
	TextArea: textAreaValidator,
	TextLine: textLineValidator
};

export const FormElementsLibrary: ElementLibrary = {
	id: FORM_ELEMENTS_NAMESPACE,
	modules: [
		AutoCompleteModule,
		CheckboxModule,
		CheckboxGroupModule,
		DatePickerModule,
		MessageGroupContainerModule,
		MessageGroupDisplayModule,
		MultiSelectModule,
		RadioModule,
		SelectModule,
		SwitchModule,
		TextAreaModule,
		TextLineModule
	],
	configuration: {
		orderingConfigurations: []
	}
};
