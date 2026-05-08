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
import type { ButtonProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/button/main/button.api.js";
import type { DateTimePickerProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/date-time-picker/main/date-time-picker.api.js";
import type { HeaderProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/date-time-picker/main/date-time-picker.internal.js";
import type { DatePickerProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/datepicker/main/date-picker.api.js";
import type { DatePickerDialogProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/datepicker/main/date-picker.mobile.api.js";
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
import type {
	ListItemProps,
	ListProps
} from "@com.mgmtp.a12.widgets/widgets-core/lib/list/main/list.api.js";
import type { MessageBoxProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/message-box/main/message-box.api.js";
import type { ModalOverlayProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/modal-overlay/main/modal-overlay.api.js";
import type { MultiselectProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/multiselect/main/multiselect.api.js";
import type { TimePickerProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/time-picker/main/time-picker.api.js";
import type { ErrorTooltipProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/tooltip/error/main/error.api.js";
import type { HintTooltipProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/tooltip/hint/main/hint.api.js";
import type { WarningTooltipProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/tooltip/warning/main/warning.api.js";

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

	// readonly DefaultFileUpload: ComponentType<DefaultFileUploadProps>;

	readonly ErrorTooltip: ComponentType<ErrorTooltipProps>;
	readonly HintTooltip: ComponentType<HintTooltipProps>;
	readonly WarningTooltip: ComponentType<WarningTooltipProps>;

	readonly TextAffix: ComponentType<TextAffixProps>;

	// Helpers
	readonly Header: ComponentType<HeaderProps>;
	readonly Button: ComponentType<ButtonProps>;
	readonly Icon: ComponentType<IconProps>;
	readonly ModalOverlay: ComponentType<ModalOverlayProps>;
	readonly AttachedPortal: ComponentType<AttachedPortalProps>;
	readonly List: ComponentType<ListProps>;
	readonly ListItem: ComponentType<ListItemProps>;
	readonly MessageBox: ComponentType<MessageBoxProps>;

	// the following widgets are only relevant for attachments
	// readonly ButtonGroup: ComponentType<ButtonGroupProps>;
	// readonly ModalNotification: ComponentType<ModalNotificationProps>;
	// readonly PopUpMenu: ComponentType<PopUpMenuProps>;
	// readonly ResponsiveImageContainer: ComponentType<ResponsiveImageContainerProps>;
}
