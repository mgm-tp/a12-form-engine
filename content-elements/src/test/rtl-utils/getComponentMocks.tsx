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
