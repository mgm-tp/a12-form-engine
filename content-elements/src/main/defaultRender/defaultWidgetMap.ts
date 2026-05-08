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

import { memo } from "react";

import { AttachedPortal } from "@com.mgmtp.a12.widgets/widgets-core/lib/attached-portal/main/attached-portal.view.js";
import { Button } from "@com.mgmtp.a12.widgets/widgets-core/lib/button/main/button.view.js";
import { Header } from "@com.mgmtp.a12.widgets/widgets-core/lib/date-time-picker/main/date-time-picker.internal.js";
import { DateTimePicker } from "@com.mgmtp.a12.widgets/widgets-core/lib/date-time-picker/main/date-time-picker.view.js";
import { DatePickerDialog } from "@com.mgmtp.a12.widgets/widgets-core/lib/datepicker/main/date-picker.mobile.view.js";
import { DatePicker } from "@com.mgmtp.a12.widgets/widgets-core/lib/datepicker/main/date-picker.view.js";
import { Icon } from "@com.mgmtp.a12.widgets/widgets-core/lib/icon/main/icon.view.js";
import { Autocomplete } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/autocomplete/main/autocomplete.view.js";
import { CheckboxGroup } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/checkbox-group/main/checkbox-group.view.js";
import { Checkbox } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/checkbox/main/checkbox.view.js";
import { Radio } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/radio/main/radio.view.js";
import { Select } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/select/main/select.view.js";
import { Switch } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/switch/main/switch.view.js";
import { TextAreaStateless } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/text-area/main/template/text-area.tpl.view.js";
import {
	TextAffix,
	TextLineStateless
} from "@com.mgmtp.a12.widgets/widgets-core/lib/input/text-line/main/template/text-line.tpl.view.js";
import { List } from "@com.mgmtp.a12.widgets/widgets-core/lib/list/main/list.view.js";
import { MessageBox } from "@com.mgmtp.a12.widgets/widgets-core/lib/message-box/main/message-box.view.js";
import { ModalOverlay } from "@com.mgmtp.a12.widgets/widgets-core/lib/modal-overlay/main/modal-overlay.view.js";
import { Multiselect } from "@com.mgmtp.a12.widgets/widgets-core/lib/multiselect/main/multiselect.view.js";
import { TimePicker } from "@com.mgmtp.a12.widgets/widgets-core/lib/time-picker/main/time-picker.view.js";
import { ErrorTooltip } from "@com.mgmtp.a12.widgets/widgets-core/lib/tooltip/error/main/error.view.js";
import { HintTooltip } from "@com.mgmtp.a12.widgets/widgets-core/lib/tooltip/hint/main/hint.view.js";
import { WarningTooltip } from "@com.mgmtp.a12.widgets/widgets-core/lib/tooltip/warning/main/warning.view.js";

import type { WidgetMap } from "../core/index.js";

export const DefaultWidgetMap: WidgetMap = {
	// Memoize to work around slow size calculation in Widgets - Ignore onChange
	// and onBlur because they are recreated every time in Widgets
	// buffered.view.tsx
	TextAreaStateless: memo(TextAreaStateless, propsAreEqualWithBlacklist(["onChange", "onBlur"])),
	TextLineStateless,
	Autocomplete,
	Select,
	MultiSelect: Multiselect,
	Switch,
	Checkbox,
	CheckboxIndeterminate: Checkbox.Indeterminate,
	CheckboxGroup,
	CheckboxGroupItem: CheckboxGroup.Item,
	Radio,
	RadioItem: Radio.Item,

	DatePicker,
	DatePickerDialog,
	DateTimePicker,
	TimePicker,

	ErrorTooltip,
	HintTooltip,
	WarningTooltip,

	TextAffix,

	//Helpers
	Header,
	Button,
	Icon,
	ModalOverlay,
	AttachedPortal,
	List,
	ListItem: List.Item,
	MessageBox
};

/**
 * A12-13609 Exclude onChange and onBlur - these are recreated by widgets:
 * input/buffered/main/buffered.view.tsx
 */
function propsAreEqualWithBlacklist(blacklistedProps: string[]) {
	return function propsAreEqual(
		p1: Record<string, unknown> = {},
		p2: Record<string, unknown> = {}
	) {
		const allKeys = [...new Set([...Object.keys(p1), ...Object.keys(p2)])];
		const relevantKeys = allKeys.filter(key => false === blacklistedProps.includes(key));
		return relevantKeys.every(key => p1[key] === p2[key]);
	};
}
