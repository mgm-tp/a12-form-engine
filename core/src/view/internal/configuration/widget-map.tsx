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

import type { ComponentType } from "react";

import type { AttachedPortalProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/attached-portal/main/attached-portal.api.js";
import type { BreadcrumbProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/breadcrumb/main/breadcrumb.api.js";
import type { BulletListProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/bullet-list/main/bullet-list.api.js";
import type { ButtonGroupProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/button-group/main/button-group.api.js";
import type { ButtonProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/button/main/button.api.js";
import type { ClearfixProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/clearfix/main/clearfix.api.js";
import type { HiddenTextProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/hidden-text/hidden-text.api.js";
import type { ActionContentboxProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/contentbox/main/action-contentbox/action-contentbox.api.js";
import type { ContentBoxProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/contentbox/main/template/contentbox.tpl.api.js";
import type { CounterProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/counter/main/counter.api.js";
import type { CssEllipsisProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/css-ellipsis/main/css-ellipsis.api.js";
import type { DateTimePickerProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/date-time-picker/main/date-time-picker.api.js";
import type { HeaderProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/date-time-picker/main/date-time-picker.internal.js";
import type { DatePickerProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/datepicker/main/date-picker.api.js";
import type { DatePickerDialogProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/datepicker/main/date-picker.mobile.api.js";
import type { DefaultFileUploadProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/file-upload/main/default/default-file-upload.api.js";
import type { GlobalMessageBoxProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/global-message-box/main/global-message-box.api.js";
import type { IconProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/icon/main/icon.api.js";
import type { AutocompleteProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/autocomplete/main/autocomplete.api.js";
import type {
	CheckboxGroupProps,
	CheckboxItemProps
} from "@com.mgmtp.a12.widgets/widgets-core/lib/input/checkbox-group/main/checkbox-group.api.js";
import type {
	CheckboxProps,
	IndeterminateCheckboxProps
} from "@com.mgmtp.a12.widgets/widgets-core/lib/input/checkbox/main/checkbox.api.js";
import type {
	RadioItemProps,
	RadioProps
} from "@com.mgmtp.a12.widgets/widgets-core/lib/input/radio/main/radio.api.js";
import type { SelectProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/select/main/select.api.js";
import type { SwitchProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/switch/main/switch.api.js";
import type { TextAreaStatelessProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/text-area/main/template/text-area.tpl.api.js";
import type {
	TextAffixProps,
	TextLineStatelessProps
} from "@com.mgmtp.a12.widgets/widgets-core/lib/input/text-line/main/template/text-line.tpl.api.js";
import type { ButtonGroupContainerProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/layout/button-group-container/main/button-group-container.api.js";
import type { LayoutGridProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/layout/layout-grid/main/layout-grid.api.js";
import type {
	ListItemProps,
	ListProps,
	ListSubHeaderProps
} from "@com.mgmtp.a12.widgets/widgets-core/lib/list/main/list.api.js";
import type { FlyoutMenuProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/menu/main/flyout-menu.api.js";
import type { MessageBoxProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/message-box/main/message-box.api.js";
import type { MessageProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/message/main/message.api.js";
import type { ModalNotificationProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/modal-notification/main/modal-notification.api.js";
import type { ModalOverlayProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/modal-overlay/main/modal-overlay.api.js";
import type { MultiselectProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/multiselect/main/multiselect.api.js";
import type { PaginationProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/pagination/main/pagination.api.js";
import type { PopUpMenuProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/pop-up-menu/main/pop-up-menu.api.js";
import type { QuickAccessButtonProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/quick-access-button/main/quick-access-button.api.js";
import type { ResponsiveImageContainerProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/responsive-image-container/main/responsive-image-container.api.js";
import type { TextOutputProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/text-output/main/text-output.api.js";
import type { TimePickerProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/time-picker/main/time-picker.api.js";
import type { ErrorTooltipProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/tooltip/error/main/error.api.js";
import type { HintTooltipProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/tooltip/hint/main/hint.api.js";
import type { WarningTooltipProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/tooltip/warning/main/warning.api.js";
import type {
	BodyProps,
	HeadlineProps,
	SectionProps
} from "@com.mgmtp.a12.widgets/widgets-core/lib/typography/main/typography.api.js";
import type { ValidationBarProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/validation-bar/main/validation-bar.api.js";
import type { MobileValidationProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/validation-bar/main/validation-bar.mobile.api.js";

/**
 * Set of A12 Widgets that can be replaced by custom components.
 *
 * Note that this map will only be expanded as needed
 */
export interface WidgetMap {
	/*
	When you are making changes to the widget map, please check if the table in
	Online Forms > Structure and Layout > Styles in the FMM documentation needs to be
	adapted.
	*/

	// Control Elements
	readonly TextAreaStateless: ComponentType<TextAreaStatelessProps>;
	readonly TextLineStateless: ComponentType<TextLineStatelessProps>;
	readonly Autocomplete: ComponentType<AutocompleteProps>;
	readonly Select: ComponentType<SelectProps>;
	readonly MultiSelect: ComponentType<MultiselectProps>;
	readonly Switch: ComponentType<SwitchProps>;
	readonly Checkbox: ComponentType<CheckboxProps>;
	readonly CheckboxIndeterminate: ComponentType<IndeterminateCheckboxProps>;
	readonly CheckboxGroup: ComponentType<CheckboxGroupProps>;
	readonly CheckboxGroupItem: ComponentType<CheckboxItemProps>;
	readonly Radio: ComponentType<RadioProps>;
	readonly RadioItem: ComponentType<RadioItemProps>;

	readonly DatePicker: ComponentType<DatePickerProps>;
	readonly DatePickerDialog: ComponentType<DatePickerDialogProps>;
	readonly DateTimePicker: ComponentType<DateTimePickerProps>;
	readonly TimePicker: ComponentType<TimePickerProps>;

	readonly DefaultFileUpload: ComponentType<DefaultFileUploadProps>;

	readonly ErrorTooltip: ComponentType<ErrorTooltipProps>;
	readonly HintTooltip: ComponentType<HintTooltipProps>;
	readonly WarningTooltip: ComponentType<WarningTooltipProps>;

	readonly TextAffix: ComponentType<TextAffixProps>;

	// Repeat
	readonly Pagination: ComponentType<PaginationProps>;

	// Layout Elements
	readonly SizeContainer: ComponentType<LayoutGridProps.LayoutGridProps>;
	readonly SizeContainerRow: ComponentType<LayoutGridProps.RowProps>;
	readonly SizeContainerColumn: ComponentType<LayoutGridProps.ColumnProps>;
	readonly TypographySection: ComponentType<SectionProps>;
	readonly TypographyHeadline: ComponentType<HeadlineProps>;
	readonly TypographyBody: ComponentType<BodyProps>;

	// Content-Box
	readonly ActionContentbox: ComponentType<ActionContentboxProps>;
	readonly NotificationArea: ComponentType<ContentBoxProps.FooterProps>;
	readonly ContentBoxTitle: ComponentType<ContentBoxProps.TitleProps>;
	readonly ContentBoxSubtitle: ComponentType<ContentBoxProps.TitleProps>;
	readonly ContentBoxFooter: ComponentType<ContentBoxProps.FooterProps>;

	// Validation
	readonly Message: ComponentType<MessageProps>;
	readonly MessageBox: ComponentType<MessageBoxProps>;
	readonly GlobalMessageBox: ComponentType<GlobalMessageBoxProps>;
	readonly ValidationBar: ComponentType<ValidationBarProps>;
	readonly MobileValidationContent: ComponentType<MobileValidationProps.ContentProps>;
	readonly MobileValidationBarOverview: ComponentType<MobileValidationProps.OverviewProps>;
	readonly MobileValidationBarGraphic: ComponentType<MobileValidationProps.GraphicProps>;
	readonly MobilePreviewList: ComponentType<MobileValidationProps.PreviewListProps>;
	readonly MobilePreviewListIem: ComponentType<MobileValidationProps.PreviewListItemProps>;
	readonly MobileAction: ComponentType<MobileValidationProps.ActionsProps>;
	readonly MobileActionItem: ComponentType<MobileValidationProps.ActionsItemProps>;
	readonly MobileValidationBar: ComponentType<MobileValidationProps>;

	// Helpers
	readonly Header: ComponentType<HeaderProps>;
	readonly Button: ComponentType<ButtonProps>;
	readonly QuickAccessButton: ComponentType<QuickAccessButtonProps>;
	readonly ButtonGroup: ComponentType<ButtonGroupProps>;
	readonly ButtonGroupContainer: ComponentType<ButtonGroupContainerProps>;
	readonly Icon: ComponentType<IconProps>;
	readonly ModalNotification: ComponentType<ModalNotificationProps>;
	readonly ModalOverlay: ComponentType<ModalOverlayProps>;
	readonly PopUpMenu: ComponentType<PopUpMenuProps>;
	readonly AttachedPortal: ComponentType<AttachedPortalProps>;
	readonly ResponsiveImageContainer: ComponentType<ResponsiveImageContainerProps>;
	readonly List: ComponentType<ListProps>;
	readonly ListSubHeader: ComponentType<ListSubHeaderProps>;
	readonly ListItem: ComponentType<ListItemProps>;
	readonly BulletListUnordered: ComponentType<BulletListProps.UnorderedProps>;
	readonly BulletListItem: ComponentType<BulletListProps.ItemProps>;
	readonly FlyoutMenu: ComponentType<FlyoutMenuProps>;
	readonly TextOutput: ComponentType<TextOutputProps>;
	readonly Breadcrumb: ComponentType<BreadcrumbProps>;
	readonly BreadcrumbItem: ComponentType<BreadcrumbProps.ItemProps>;
	readonly Clearfix: ComponentType<ClearfixProps>;
	readonly HiddenText: ComponentType<HiddenTextProps>;
	readonly CssEllipsis: ComponentType<CssEllipsisProps>;
	readonly Counter: ComponentType<CounterProps>;
}
