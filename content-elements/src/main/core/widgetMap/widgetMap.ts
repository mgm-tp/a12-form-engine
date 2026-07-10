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
	AttachedPortalProps,
	AutocompleteProps,
	BulletListProps,
	ButtonProps,
	CheckboxGroupProps,
	CheckboxItemProps,
	CheckboxProps,
	DatePickerDialogProps,
	DatePickerProps,
	DateTimePickerHeaderProps,
	DateTimePickerProps,
	ErrorTooltipProps,
	HintTooltipProps,
	IconProps,
	IndeterminateCheckboxProps,
	ListItemProps,
	ListProps,
	MessageBoxProps,
	ModalOverlayProps,
	MultiselectProps,
	RadioItemProps,
	RadioProps,
	SelectProps,
	SwitchProps,
	TextAffixProps,
	TextAreaStatelessProps,
	TextFieldProps,
	TimePickerProps,
	WarningTooltipProps
} from "@com.mgmtp.a12.widgets/widgets-core";

/**
 * Set of A12 Widgets that can be replaced by custom components.
 *
 * Please, note that the addition of new mandatory properties to this
 * interface is not considered a breaking change.
 * To avoid compile errors when using a custom WidgetMap, always spread
 * the DefaultWidgetMap.
 */
export interface WidgetMap {
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

	// readonly DefaultFileUpload: ComponentType<DefaultFileUploadProps>;

	readonly MessageBox: ComponentType<MessageBoxProps>;
	readonly ErrorTooltip: ComponentType<ErrorTooltipProps>;
	readonly HintTooltip: ComponentType<HintTooltipProps>;
	readonly WarningTooltip: ComponentType<WarningTooltipProps>;

	readonly TextAffix: ComponentType<TextAffixProps>;

	// Helpers
	readonly DateTimePickerHeader: ComponentType<DateTimePickerHeaderProps>;
	readonly Button: ComponentType<ButtonProps>;
	readonly Icon: ComponentType<IconProps>;
	readonly ModalOverlay: ComponentType<ModalOverlayProps>;
	readonly AttachedPortal: ComponentType<AttachedPortalProps>;
	readonly BulletListUnordered: ComponentType<BulletListProps.UnorderedProps>;
	readonly BulletListItem: ComponentType<BulletListProps.ItemProps>;
	readonly List: ComponentType<ListProps>;
	readonly ListItem: ComponentType<ListItemProps>;

	// the following widgets are only relevant for attachments
	// readonly ButtonGroup: ComponentType<ButtonGroupProps>;
	// readonly ModalNotification: ComponentType<ModalNotificationProps>;
	// readonly PopUpMenu: ComponentType<PopUpMenuProps>;
	// readonly ResponsiveImageContainer: ComponentType<ResponsiveImageContainerProps>;
}
