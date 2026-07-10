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

import { memo } from "react";

import {
	AttachedPortal,
	Autocomplete,
	BulletList,
	Button,
	Checkbox,
	CheckboxGroup,
	DatePicker,
	DatePickerDialog,
	DateTimePicker,
	DateTimePickerHeader,
	ErrorTooltip,
	HintTooltip,
	Icon,
	List,
	MessageBox,
	ModalOverlay,
	Multiselect,
	Radio,
	Select,
	Switch,
	TextAffix,
	TextAreaStateless,
	TextField,
	TimePicker,
	WarningTooltip
} from "@com.mgmtp.a12.widgets/widgets-core";

import type { WidgetMap } from "../core/index.js";

export const DefaultWidgetMap: WidgetMap = {
	// Memoize to work around slow size calculation in Widgets - Ignore onChange
	// and onBlur because they are recreated every time in Widgets
	// buffered.view.tsx
	TextAreaStateless: memo(TextAreaStateless, propsAreEqualWithBlacklist(["onChange", "onBlur"])),
	TextField,
	Autocomplete,
	Select,
	Multiselect,
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

	MessageBox,
	ErrorTooltip,
	HintTooltip,
	WarningTooltip,

	TextAffix,

	//Helpers
	DateTimePickerHeader,
	Button,
	Icon,
	ModalOverlay,
	AttachedPortal,
	BulletListUnordered: BulletList.Unordered,
	BulletListItem: BulletList.Item,
	List,
	ListItem: List.Item
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
