// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { mock } from "node:test";

import type {
	ContentModel,
	NodeRendererProps
} from "@com.mgmtp.a12.contentengine/contentengine-core";

import type { BaseControlProps } from "../../index.js";
import type { ComponentMap } from "../../main/core/contentElements/componentMap/componentMap.js";
import { DefaultComponentMap } from "../../main/core/contentElements/componentMap/defaultComponentMap.js";
import type { BufferedTextAreaProps } from "../../main/core/contentElements/elementFragments/bufferedTextArea.js";
import type { BufferedTextLineProps } from "../../main/core/contentElements/elementFragments/bufferedTextLine.js";
import type { PickerWrapperProps } from "../../main/core/contentElements/elementFragments/pickerWrapper.js";
import type { SuffixProps } from "../../main/core/contentElements/elementFragments/suffix.js";
import type { TooltipsProps } from "../../main/core/contentElements/elementFragments/tooltips.js";
import type { ValidationMessagesProps } from "../../main/core/contentElements/elementFragments/validationMessages.js";
import type { MessageListProps } from "../../main/core/contentElements/modules/messageGroupDisplay/messageList.js";
import type { MessageListItemProps } from "../../main/core/contentElements/modules/messageGroupDisplay/messageListItem.js";

import {
	BUFFERED_TEXT_AREA,
	BUFFERED_TEXT_LINE,
	DATE_FRAGMENT_INPUT,
	DATE_INPUT,
	DATE_RANGE_INPUT,
	DATE_TIME_INPUT,
	MESSAGE_LIST,
	MESSAGE_LIST_ITEM,
	PICKER_WRAPPER,
	SUFFIX,
	TIME_INPUT,
	TOOLTIPS,
	VALIDATION_MESSAGES
} from "./data-roles.js";
import { MockComponent } from "./mock-component.js";

export function getComponentMocks(): ComponentMap {
	return {
		...DefaultComponentMap,
		DateInput: mock.fn(DateInputMock),
		DateTimeInput: mock.fn(DateTimeInputMock),
		TimeInput: mock.fn(TimeInputMock),
		DateRangeInput: mock.fn(DateRangeInputMock),
		DateFragmentInput: mock.fn(DateFragmentInputMock),
		BufferedTextLine: mock.fn(BufferedTextLineMock),
		BufferedTextArea: mock.fn(BufferedTextAreaMock),
		PickerWrapper: mock.fn(PickerWrapperMock),
		Suffix: mock.fn(SuffixMock),
		Tooltips: mock.fn(TooltipsMock),
		ValidationMessages: mock.fn(ValidationMessagesMock),
		MessageList: mock.fn(MessageListMock),
		MessageListItem: mock.fn(MessageListItemMock)
	};
}

function DateInputMock(props: NodeRendererProps<ContentModel.Node<BaseControlProps>>) {
	return <MockComponent dataRole={DATE_INPUT} {...props} />;
}

function DateTimeInputMock(props: NodeRendererProps<ContentModel.Node<BaseControlProps>>) {
	return <MockComponent dataRole={DATE_TIME_INPUT} {...props} />;
}

function TimeInputMock(props: NodeRendererProps<ContentModel.Node<BaseControlProps>>) {
	return <MockComponent dataRole={TIME_INPUT} {...props} />;
}

function DateRangeInputMock(props: NodeRendererProps<ContentModel.Node<BaseControlProps>>) {
	return <MockComponent dataRole={DATE_RANGE_INPUT} {...props} />;
}

function DateFragmentInputMock(props: NodeRendererProps<ContentModel.Node<BaseControlProps>>) {
	return <MockComponent dataRole={DATE_FRAGMENT_INPUT} {...props} />;
}

function BufferedTextLineMock(props: BufferedTextLineProps) {
	return (
		<MockComponent id={props.id} dataRole={BUFFERED_TEXT_LINE}>
			{props.prefixes}
		</MockComponent>
	);
}

function BufferedTextAreaMock(props: BufferedTextAreaProps) {
	return <MockComponent id={props.id} dataRole={BUFFERED_TEXT_AREA} />;
}

function PickerWrapperMock(props: PickerWrapperProps) {
	return <MockComponent dataRole={PICKER_WRAPPER}>{props.children}</MockComponent>;
}

function SuffixMock(props: SuffixProps) {
	return <MockComponent id={props.id} dataRole={SUFFIX} />;
}

function TooltipsMock(props: TooltipsProps) {
	return (
		<MockComponent dataRole={TOOLTIPS}>
			{props.hintTooltip?.content}
			{props.errorTooltip?.content}
			{props.warningTooltip?.content}
			{props.infoTooltip?.content}
		</MockComponent>
	);
}

function ValidationMessagesMock(props: ValidationMessagesProps) {
	return <MockComponent id={props.id} dataRole={VALIDATION_MESSAGES} />;
}

function MessageListMock(_props: MessageListProps) {
	return <MockComponent dataRole={MESSAGE_LIST} />;
}

function MessageListItemMock(_props: MessageListItemProps) {
	return <MockComponent dataRole={MESSAGE_LIST_ITEM} />;
}
