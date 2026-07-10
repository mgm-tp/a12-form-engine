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

import type { ComponentType } from "react";

import type {
	ActionContentboxProps,
	AttachedPortalProps,
	AutocompleteProps,
	BodyProps,
	BreadcrumbProps,
	BulletListProps,
	ButtonGroupContainerProps,
	ButtonGroupProps,
	ButtonProps,
	CheckboxGroupProps,
	CheckboxItemProps,
	CheckboxProps,
	ClearfixProps,
	ContentBoxProps,
	CounterProps,
	CssEllipsisProps,
	DatePickerDialogProps,
	DatePickerProps,
	DateTimePickerHeaderProps,
	DateTimePickerProps,
	DefaultFileUploadProps,
	ErrorTooltipProps,
	FlyoutMenuProps,
	GlobalMessageBoxProps,
	HeadlineProps,
	HiddenTextProps,
	HintTooltipProps,
	IconProps,
	IndeterminateCheckboxProps,
	LayoutGridProps,
	ListItemProps,
	ListProps,
	ListSubHeaderProps,
	MessageBoxProps,
	MessageProps,
	MobileValidationProps,
	ModalNotificationProps,
	ModalOverlayProps,
	MultiselectProps,
	PaginationProps,
	PopUpMenuProps,
	QuickAccessButtonProps,
	RadioItemProps,
	RadioProps,
	ResponsiveImageContainerProps,
	SectionProps,
	SelectProps,
	SwitchProps,
	TextAffixProps,
	TextAreaStatelessProps,
	TextFieldProps,
	TextOutputProps,
	TimePickerProps,
	ValidationBarProps,
	WarningTooltipProps
} from "@com.mgmtp.a12.widgets/widgets-core";

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
	readonly TextField: ComponentType<TextFieldProps>;
	readonly Autocomplete: ComponentType<AutocompleteProps>;
	readonly Select: ComponentType<SelectProps>;
	readonly Multiselect: ComponentType<MultiselectProps>;
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
	readonly LayoutGrid: ComponentType<LayoutGridProps.LayoutGridProps>;
	readonly LayoutGridRow: ComponentType<LayoutGridProps.RowProps>;
	readonly LayoutGridColumn: ComponentType<LayoutGridProps.ColumnProps>;
	readonly TypographySection: ComponentType<SectionProps>;
	readonly TypographyHeadline: ComponentType<HeadlineProps>;
	readonly TypographyBody: ComponentType<BodyProps>;

	// Content-Box
	readonly ActionContentbox: ComponentType<ActionContentboxProps>;
	readonly ContentBoxNotificationArea: ComponentType<ContentBoxProps.FooterProps>;
	readonly ContentBoxTitle: ComponentType<ContentBoxProps.TitleProps>;
	readonly ContentBoxSubtitle: ComponentType<ContentBoxProps.TitleProps>;
	readonly ContentBoxFooter: ComponentType<ContentBoxProps.FooterProps>;

	// Validation
	readonly Message: ComponentType<MessageProps>;
	readonly MessageBox: ComponentType<MessageBoxProps>;
	readonly GlobalMessageBox: ComponentType<GlobalMessageBoxProps>;
	readonly ValidationBar: ComponentType<ValidationBarProps>;
	readonly MobileValidationContent: ComponentType<MobileValidationProps.ContentProps>;
	readonly MobileValidationOverview: ComponentType<MobileValidationProps.OverviewProps>;
	readonly MobileValidationGraphic: ComponentType<MobileValidationProps.GraphicProps>;
	readonly MobileValidationPreviewList: ComponentType<MobileValidationProps.PreviewListProps>;
	readonly MobileValidationPreviewListItem: ComponentType<MobileValidationProps.PreviewListItemProps>;
	readonly MobileValidationActions: ComponentType<MobileValidationProps.ActionsProps>;
	readonly MobileValidationActionItem: ComponentType<MobileValidationProps.ActionsItemProps>;
	readonly MobileValidation: ComponentType<MobileValidationProps>;

	// Helpers
	readonly DateTimePickerHeader: ComponentType<DateTimePickerHeaderProps>;
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
