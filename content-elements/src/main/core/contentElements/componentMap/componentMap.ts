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
import { type MessageListProps } from "../modules/messageGroupDisplay/messageList.js";
import { type MessageListItemProps } from "../modules/messageGroupDisplay/messageListItem.js";

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
