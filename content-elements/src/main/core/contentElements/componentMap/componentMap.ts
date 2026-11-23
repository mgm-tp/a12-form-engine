// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ComponentType } from "react";

import type {
	ContentModel,
	NodeRendererProps
} from "@com.mgmtp.a12.contentengine/contentengine-core";

import type { BaseControlProps } from "../../types/controlProps.js";

import type { BufferedTextAreaProps } from "../elementFragments/bufferedTextArea.js";
import type { BufferedTextLineProps } from "../elementFragments/bufferedTextLine.js";
import type { PickerWrapperProps } from "../elementFragments/pickerWrapper.js";
import type { SuffixProps } from "../elementFragments/suffix.js";
import type { TooltipsProps } from "../elementFragments/tooltips.js";
import type { ValidationMessagesProps } from "../elementFragments/validationMessages.js";
import type { MessageListProps } from "../modules/messageGroupDisplay/messageList.js";
import type { MessageListItemProps } from "../modules/messageGroupDisplay/messageListItem.js";

/** @internal */
export interface ComponentMap {
	// input components
	DateInput: ComponentType<NodeRendererProps<ContentModel.Node<BaseControlProps>>>;
	DateTimeInput: ComponentType<NodeRendererProps<ContentModel.Node<BaseControlProps>>>;
	TimeInput: ComponentType<NodeRendererProps<ContentModel.Node<BaseControlProps>>>;
	DateRangeInput: ComponentType<NodeRendererProps<ContentModel.Node<BaseControlProps>>>;
	DateFragmentInput: ComponentType<NodeRendererProps<ContentModel.Node<BaseControlProps>>>;

	// buffered wrappers
	BufferedTextLine: ComponentType<BufferedTextLineProps>;
	BufferedTextArea: ComponentType<BufferedTextAreaProps>;

	// utility components
	PickerWrapper: ComponentType<PickerWrapperProps>;
	Suffix: ComponentType<SuffixProps>;
	Tooltips: ComponentType<TooltipsProps>;
	ValidationMessages: ComponentType<ValidationMessagesProps>;
	MessageList: ComponentType<MessageListProps>;
	MessageListItem: ComponentType<MessageListItemProps>;
}
