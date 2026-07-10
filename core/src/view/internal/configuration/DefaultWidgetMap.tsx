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
	ActionContentbox,
	AttachedPortal,
	Autocomplete,
	Breadcrumb,
	BulletList,
	Button,
	ButtonGroup,
	ButtonGroupContainer,
	Checkbox,
	CheckboxGroup,
	Clearfix,
	ContentBoxElements,
	Counter,
	CssEllipsis,
	DatePicker,
	DatePickerDialog,
	DateTimePicker,
	DateTimePickerHeader,
	DefaultFileUpload,
	ErrorTooltip,
	FlyoutMenu,
	GlobalMessageBox,
	HiddenText,
	HintTooltip,
	Icon,
	LayoutGrid,
	List,
	Message,
	MessageBox,
	MobileValidation,
	ModalNotification,
	ModalOverlay,
	Multiselect,
	Pagination,
	PopUpMenu,
	QuickAccessButton,
	Radio,
	ResponsiveImageContainer,
	Select,
	Switch,
	TextAffix,
	TextAreaStateless,
	TextField,
	TextOutput,
	TimePicker,
	Typography,
	ValidationBar,
	WarningTooltip
} from "@com.mgmtp.a12.widgets/widgets-core";

import type { WidgetMap } from "./widget-map.js";

/**
 * The default map for the A12 Widgets, that are used in the Form Engine
 */
export const DefaultWidgetMap: WidgetMap = {
	// Control Elements
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

	DefaultFileUpload,

	ErrorTooltip,
	HintTooltip,
	WarningTooltip,

	TextAffix,

	// Repeat
	Pagination,

	// Layout Elements
	LayoutGrid: LayoutGrid.Grid,
	LayoutGridRow: LayoutGrid.Row,
	LayoutGridColumn: LayoutGrid.Column,

	// Content-Box
	ActionContentbox: ActionContentbox,
	ContentBoxNotificationArea: ContentBoxElements.NotificationArea,
	ContentBoxTitle: ContentBoxElements.Title,
	ContentBoxSubtitle: ContentBoxElements.Subtitle,
	ContentBoxFooter: ContentBoxElements.Footer,

	// Validation
	Message,
	MessageBox,
	GlobalMessageBox,
	ValidationBar,
	MobileValidationContent: MobileValidation.Content,
	MobileValidationOverview: MobileValidation.Overview,
	MobileValidationGraphic: MobileValidation.Graphic,
	MobileValidationPreviewList: MobileValidation.PreviewList,
	MobileValidationPreviewListItem: MobileValidation.PreviewListItem,
	MobileValidationActions: MobileValidation.Actions,
	MobileValidationActionItem: MobileValidation.ActionsItem,
	MobileValidation,

	//Helpers
	TypographySection: Typography.Section,
	TypographyHeadline: Typography.Headline,
	TypographyBody: Typography.Body,
	DateTimePickerHeader,
	Button,
	QuickAccessButton,
	ButtonGroup,
	ButtonGroupContainer,
	Icon,
	ModalNotification,
	ModalOverlay,
	PopUpMenu,
	AttachedPortal,
	ResponsiveImageContainer,
	List,
	ListSubHeader: List.SubHeader,
	ListItem: List.Item,
	BulletListUnordered: BulletList.Unordered,
	BulletListItem: BulletList.Item,
	FlyoutMenu,
	TextOutput,
	Breadcrumb,
	BreadcrumbItem: Breadcrumb.Item,
	Clearfix,
	HiddenText,
	CssEllipsis,
	Counter
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
