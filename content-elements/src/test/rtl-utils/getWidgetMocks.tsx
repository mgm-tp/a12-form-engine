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

import { mock } from "node:test";

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

import type { WidgetMap } from "../../main/core/index.js";
import { DefaultWidgetMap } from "../../main/defaultRender/defaultWidgetMap.js";

import {
	ATTACHED_PORTAL,
	AUTO_COMPLETE,
	BULLET_LIST_ITEM,
	BULLET_LIST_UNORDERED,
	BUTTON,
	CHECKBOX,
	CHECKBOX_GROUP,
	CHECKBOX_GROUP_ITEM,
	CHECKBOX_INDETERMINATE,
	DATE_PICKER,
	DATE_PICKER_DIALOG,
	DATE_TIME_PICKER,
	ERROR_TOOLTIP,
	HEADER,
	HINT_TOOLTIP,
	ICON,
	LIST,
	LIST_ITEM,
	MESSAGE_BOX,
	MODAL_OVERLAY,
	MULTI_SELECT,
	RADIO,
	RADIO_ITEM,
	SELECT,
	SWITCH,
	TEXT_AFFIX,
	TEXT_AREA,
	TEXT_LINE,
	TIME_PICKER,
	WARNING_TOOLTIP
} from "./data-roles.js";
import { MockComponent } from "./mock-component.js";

export function getWidgetMocks(): WidgetMap {
	return {
		...DefaultWidgetMap,
		Button: mock.fn(ButtonMock),
		Icon: mock.fn(IconMock),
		TextAreaStateless: mock.fn(TextAreaStatelessMock),
		TextField: mock.fn(TextFieldMock),
		Autocomplete: mock.fn(AutocompleteMock),
		Select: mock.fn(SelectMock),
		Multiselect: mock.fn(MultiSelectMock),
		Switch: mock.fn(SwitchMock),
		Checkbox: mock.fn(CheckboxMock),
		CheckboxIndeterminate: mock.fn(CheckboxIndeterminateMock),
		CheckboxGroup: mock.fn(CheckboxGroupMock),
		CheckboxGroupItem: mock.fn(CheckboxGroupItemMock),
		Radio: mock.fn(RadioMock),
		RadioItem: mock.fn(RadioItemMock),
		DatePicker: mock.fn(DatePickerMock),
		DatePickerDialog: mock.fn(DatePickerDialogMock),
		DateTimePicker: mock.fn(DateTimePickerMock),
		TimePicker: mock.fn(TimePickerMock),
		MessageBox: mock.fn(MessageBoxMock),
		ErrorTooltip: mock.fn(ErrorTooltipMock),
		WarningTooltip: mock.fn(WarningTooltipMock),
		HintTooltip: mock.fn(HintTooltipMock),
		TextAffix: mock.fn(TextAffixMock),
		DateTimePickerHeader: mock.fn(HeaderMock),
		ModalOverlay: mock.fn(ModalOverlayMock),
		AttachedPortal: mock.fn(AttachedPortalMock),
		BulletListUnordered: mock.fn(BulletListUnorderedMock),
		BulletListItem: mock.fn(BulletListItemMock),
		List: mock.fn(ListMock),
		ListItem: mock.fn(ListItemMock)
	};
}

function ButtonMock(props: ButtonProps) {
	props.buttonRef?.({} as HTMLButtonElement);

	return (
		<MockComponent id={props.id} dataRole={BUTTON}>
			{props.icon}
		</MockComponent>
	);
}

function IconMock(props: IconProps) {
	return <MockComponent id={props.id} dataRole={ICON} />;
}

function TextAreaStatelessMock(props: TextAreaStatelessProps) {
	return <MockComponent id={props.id} dataRole={TEXT_AREA} />;
}

function TextFieldMock(props: TextFieldProps) {
	return <MockComponent id={props.id} dataRole={TEXT_LINE} />;
}

function AutocompleteMock(props: AutocompleteProps) {
	return <MockComponent id={props.id} dataRole={AUTO_COMPLETE} />;
}

function SelectMock(props: SelectProps) {
	return <MockComponent id={props.id} dataRole={SELECT} />;
}

function MultiSelectMock(props: MultiselectProps) {
	return <MockComponent id={props.id} dataRole={MULTI_SELECT} />;
}

function SwitchMock(props: SwitchProps) {
	return <MockComponent id={props.id} dataRole={SWITCH} />;
}

function CheckboxMock(props: CheckboxProps) {
	return <MockComponent id={props.id} dataRole={CHECKBOX} />;
}

function CheckboxIndeterminateMock(props: IndeterminateCheckboxProps) {
	return <MockComponent id={props.id} dataRole={CHECKBOX_INDETERMINATE} />;
}

function CheckboxGroupMock(props: CheckboxGroupProps) {
	return (
		<MockComponent id={props.id} dataRole={CHECKBOX_GROUP}>
			{props.children}
		</MockComponent>
	);
}

function CheckboxGroupItemMock(props: CheckboxItemProps) {
	return <MockComponent id={props.id} dataRole={CHECKBOX_GROUP_ITEM} />;
}

function RadioMock(props: RadioProps) {
	return (
		<MockComponent id={props.id} dataRole={RADIO}>
			{props.children}
		</MockComponent>
	);
}

function RadioItemMock(props: RadioItemProps) {
	return <MockComponent id={props.id} dataRole={RADIO_ITEM} />;
}

function DatePickerMock(props: DatePickerProps) {
	return <MockComponent id={props.id} dataRole={DATE_PICKER} />;
}

function DatePickerDialogMock(props: DatePickerDialogProps) {
	return (
		<MockComponent id={props.id} dataRole={DATE_PICKER_DIALOG}>
			{props.submitButton}
			{props.clearButton}
		</MockComponent>
	);
}

function DateTimePickerMock(props: DateTimePickerProps) {
	return (
		<MockComponent id={props.id} dataRole={DATE_TIME_PICKER}>
			{!(props.customHeaderElement instanceof Function) && props.customHeaderElement}
		</MockComponent>
	);
}

function TimePickerMock(props: TimePickerProps) {
	return <MockComponent id={props.id} dataRole={TIME_PICKER} />;
}

function MessageBoxMock(props: MessageBoxProps) {
	return (
		<MockComponent id={props.id} dataRole={MESSAGE_BOX}>
			{props.label}
			{props.children}
		</MockComponent>
	);
}

function ErrorTooltipMock(props: ErrorTooltipProps) {
	return <MockComponent id={props.id} dataRole={ERROR_TOOLTIP} />;
}

function WarningTooltipMock(props: WarningTooltipProps) {
	return <MockComponent id={props.id} dataRole={WARNING_TOOLTIP} />;
}

function HintTooltipMock(props: HintTooltipProps) {
	return <MockComponent id={props.id} dataRole={HINT_TOOLTIP} />;
}

function TextAffixMock(props: TextAffixProps) {
	return <MockComponent id={props.id} dataRole={TEXT_AFFIX} />;
}

function HeaderMock(props: DateTimePickerHeaderProps) {
	return (
		<MockComponent id={props.id} dataRole={HEADER}>
			{props.actionButtons}
			{props.children}
		</MockComponent>
	);
}

function ModalOverlayMock(props: ModalOverlayProps) {
	return (
		<MockComponent id={props.id} dataRole={MODAL_OVERLAY}>
			{props.children}
		</MockComponent>
	);
}

function AttachedPortalMock(props: AttachedPortalProps) {
	return (
		<MockComponent id={props.id} dataRole={ATTACHED_PORTAL}>
			{props.children}
		</MockComponent>
	);
}

function BulletListUnorderedMock(props: BulletListProps.UnorderedProps) {
	return (
		<MockComponent id={props.id} dataRole={BULLET_LIST_UNORDERED}>
			{props.children}
		</MockComponent>
	);
}

function BulletListItemMock(props: BulletListProps.ItemProps) {
	return (
		<MockComponent id={props.id} dataRole={BULLET_LIST_ITEM}>
			{props.children}
		</MockComponent>
	);
}

function ListMock(props: ListProps) {
	return (
		<MockComponent id={props.id} dataRole={LIST}>
			{props.children}
		</MockComponent>
	);
}

function ListItemMock(props: ListItemProps) {
	return (
		<MockComponent id={props.id} dataRole={LIST_ITEM}>
			{props.text}
		</MockComponent>
	);
}
