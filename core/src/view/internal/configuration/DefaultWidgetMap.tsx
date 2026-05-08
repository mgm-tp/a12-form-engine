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
import { Breadcrumb } from "@com.mgmtp.a12.widgets/widgets-core/lib/breadcrumb/main/breadcrumb.view.js";
import { BulletList } from "@com.mgmtp.a12.widgets/widgets-core/lib/bullet-list/main/bullet-list.view.js";
import { ButtonGroup } from "@com.mgmtp.a12.widgets/widgets-core/lib/button-group/main/button-group.view.js";
import { Button } from "@com.mgmtp.a12.widgets/widgets-core/lib/button/main/button.view.js";
import { Clearfix } from "@com.mgmtp.a12.widgets/widgets-core/lib/clearfix/main/clearfix.view.js";
import { HiddenText } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/hidden-text/hidden-text.view.js";
import { ActionContentbox } from "@com.mgmtp.a12.widgets/widgets-core/lib/contentbox/main/action-contentbox/action-contentbox.view.js";
import { ContentBoxElements } from "@com.mgmtp.a12.widgets/widgets-core/lib/contentbox/main/template/contentbox.tpl.view.js";
import { Counter } from "@com.mgmtp.a12.widgets/widgets-core/lib/counter/main/counter.view.js";
import { CssEllipsis } from "@com.mgmtp.a12.widgets/widgets-core/lib/css-ellipsis/main/css-ellipsis.view.js";
import { Header } from "@com.mgmtp.a12.widgets/widgets-core/lib/date-time-picker/main/date-time-picker.internal.js";
import { DateTimePicker } from "@com.mgmtp.a12.widgets/widgets-core/lib/date-time-picker/main/date-time-picker.view.js";
import { DatePickerDialog } from "@com.mgmtp.a12.widgets/widgets-core/lib/datepicker/main/date-picker.mobile.view.js";
import { DatePicker } from "@com.mgmtp.a12.widgets/widgets-core/lib/datepicker/main/date-picker.view.js";
import { DefaultFileUpload } from "@com.mgmtp.a12.widgets/widgets-core/lib/file-upload/main/default/default-file-upload.view.js";
import { GlobalMessageBox } from "@com.mgmtp.a12.widgets/widgets-core/lib/global-message-box/main/global-message-box.view.js";
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
import { ButtonGroupContainer } from "@com.mgmtp.a12.widgets/widgets-core/lib/layout/button-group-container/main/button-group-container.view.js";
import { LayoutGrid } from "@com.mgmtp.a12.widgets/widgets-core/lib/layout/layout-grid/main/layout-grid.view.js";
import { List } from "@com.mgmtp.a12.widgets/widgets-core/lib/list/main/list.view.js";
import { FlyoutMenu } from "@com.mgmtp.a12.widgets/widgets-core/lib/menu/main/flyout-menu.view.js";
import { MessageBox } from "@com.mgmtp.a12.widgets/widgets-core/lib/message-box/main/message-box.view.js";
import { Message } from "@com.mgmtp.a12.widgets/widgets-core/lib/message/main/message.view.js";
import { ModalNotification } from "@com.mgmtp.a12.widgets/widgets-core/lib/modal-notification/main/modal-notification.view.js";
import { ModalOverlay } from "@com.mgmtp.a12.widgets/widgets-core/lib/modal-overlay/main/modal-overlay.view.js";
import { Multiselect } from "@com.mgmtp.a12.widgets/widgets-core/lib/multiselect/main/multiselect.view.js";
import { Pagination } from "@com.mgmtp.a12.widgets/widgets-core/lib/pagination/main/pagination.view.js";
import { PopUpMenu } from "@com.mgmtp.a12.widgets/widgets-core/lib/pop-up-menu/main/pop-up-menu.view.js";
import { QuickAccessButton } from "@com.mgmtp.a12.widgets/widgets-core/lib/quick-access-button/main/quick-access-button.view.js";
import { ResponsiveImageContainer } from "@com.mgmtp.a12.widgets/widgets-core/lib/responsive-image-container/main/responsive-image-container.view.js";
import { TextOutput } from "@com.mgmtp.a12.widgets/widgets-core/lib/text-output/main/text-output.view.js";
import { TimePicker } from "@com.mgmtp.a12.widgets/widgets-core/lib/time-picker/main/time-picker.view.js";
import { ErrorTooltip } from "@com.mgmtp.a12.widgets/widgets-core/lib/tooltip/error/main/error.view.js";
import { HintTooltip } from "@com.mgmtp.a12.widgets/widgets-core/lib/tooltip/hint/main/hint.view.js";
import { WarningTooltip } from "@com.mgmtp.a12.widgets/widgets-core/lib/tooltip/warning/main/warning.view.js";
import { Typography } from "@com.mgmtp.a12.widgets/widgets-core/lib/typography/main/typography.view.js";
import { MobileValidation } from "@com.mgmtp.a12.widgets/widgets-core/lib/validation-bar/main/validation-bar.mobile.view.js";
import { ValidationBar } from "@com.mgmtp.a12.widgets/widgets-core/lib/validation-bar/main/validation-bar.view.js";

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

	DefaultFileUpload,

	ErrorTooltip,
	HintTooltip,
	WarningTooltip,

	TextAffix,

	// Repeat
	Pagination,

	// Layout Elements
	SizeContainer: LayoutGrid.Grid,
	SizeContainerRow: LayoutGrid.Row,
	SizeContainerColumn: LayoutGrid.Column,

	// Content-Box
	ActionContentbox: ActionContentbox,
	NotificationArea: ContentBoxElements.NotificationArea,
	ContentBoxTitle: ContentBoxElements.Title,
	ContentBoxSubtitle: ContentBoxElements.Subtitle,
	ContentBoxFooter: ContentBoxElements.Footer,

	// Validation
	Message,
	MessageBox,
	GlobalMessageBox,
	ValidationBar,
	MobileValidationContent: MobileValidation.Content,
	MobileValidationBarOverview: MobileValidation.Overview,
	MobileValidationBarGraphic: MobileValidation.Graphic,
	MobilePreviewList: MobileValidation.PreviewList,
	MobilePreviewListIem: MobileValidation.PreviewListItem,
	MobileAction: MobileValidation.Actions,
	MobileActionItem: MobileValidation.ActionsItem,
	MobileValidationBar: MobileValidation,

	//Helpers
	TypographySection: Typography.Section,
	TypographyHeadline: Typography.Headline,
	TypographyBody: Typography.Body,
	Header,
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
