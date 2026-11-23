// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { WidgetMap } from "../../../../../view/index.js";

export const Input_Widgets: (keyof WidgetMap)[] = [
	"TextAreaStateless",
	"TextLineStateless",
	"Autocomplete",
	"Select",
	"MultiSelect",
	"Switch",
	"Checkbox",
	"CheckboxIndeterminate",
	"CheckboxGroup",
	"CheckboxGroupItem",
	"Radio",
	"RadioItem",

	"DatePicker",
	"DatePickerDialog",
	"DateTimePicker",
	"TimePicker",

	"DefaultFileUpload"
];
