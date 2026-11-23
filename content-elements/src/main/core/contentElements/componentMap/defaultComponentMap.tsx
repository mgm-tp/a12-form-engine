// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { BufferedTextArea } from "../elementFragments/bufferedTextArea.js";
import { BufferedTextLine } from "../elementFragments/bufferedTextLine.js";
import { PickerWrapper } from "../elementFragments/pickerWrapper.js";
import { Suffix } from "../elementFragments/suffix.js";
import { Tooltips } from "../elementFragments/tooltips.js";
import { ValidationMessages } from "../elementFragments/validationMessages.js";
import { DateFragmentInput } from "../modules/datePicker/inputTypes/dateFragmentInput.js";
import { DateInput } from "../modules/datePicker/inputTypes/dateInput.js";
import { DateRangeInput } from "../modules/datePicker/inputTypes/dateRangeInput.js";
import { DateTimeInput } from "../modules/datePicker/inputTypes/dateTimeInput.js";
import { TimeInput } from "../modules/datePicker/inputTypes/timeInput.js";
import { MessageList } from "../modules/messageGroupDisplay/messageList.js";
import { MessageListItem } from "../modules/messageGroupDisplay/messageListItem.js";

import type { ComponentMap } from "./componentMap.js";

/** @internal */
export const DefaultComponentMap: ComponentMap = {
	DateInput,
	DateTimeInput,
	TimeInput,
	DateFragmentInput,
	DateRangeInput,
	BufferedTextLine,
	BufferedTextArea,
	PickerWrapper,
	Suffix,
	Tooltips,
	ValidationMessages,
	MessageList,
	MessageListItem
};
