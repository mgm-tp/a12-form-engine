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
