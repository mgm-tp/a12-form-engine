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

import type { WithDataTestId } from "../../back-end/utils/internal/types.js";
import type { ActionButtonsProps } from "../../view/internal/components/content-box/sub-items/action-buttons.js";
import type {
	AttachmentUploadProps,
	MultiAttachmentUploadProps
} from "../../view/internal/components/widgets/form-engine/attachments/attachmentUploadProps.js";
import type { BufferedTextAreaProps } from "../../view/internal/components/widgets/form-engine/buffered-text-area.js";
import type {
	DateRangeTextLineProps,
	DateTextLineProps,
	DateTimeTextLineProps
} from "../../view/internal/components/widgets/form-engine/date-props.js";
import type { PickerWrapperProps } from "../../view/internal/components/widgets/form-engine/pickerWrapper.js";
import type { SuffixProps } from "../../view/internal/components/widgets/form-engine/suffix.js";
import type { HtmlTextProps } from "../../view/internal/components/widgets/form-engine/text.js";
import type { TooltipsProps } from "../../view/internal/components/widgets/tooltips.js";
import type { ValidationMessagesProps } from "../../view/internal/components/widgets/validationMessages.js";
import type { ComponentMap } from "../../view/internal/configuration/componentMap/component-map.js";
import { DefaultComponentMap } from "../../view/internal/configuration/componentMap/DefaultComponentMap.js";
import type { ContentWithNewLinesProps } from "../../view/internal/utilities/contentWithNewLines.js";
import type { BufferedTextLineProps } from "../../view/internal/components/widgets/form-engine/buffered-text-line.js";

import {
	ACTION_BUTTONS,
	ATTACHMENT_UPLOAD,
	BUFFERED_TEXT_AREA,
	BUFFERED_TEXT_LINE,
	CONTENT_WITH_NEW_LINES,
	DATE_CONTROL,
	DATE_RANGE_CONTROL,
	DATE_TIME_TEXT_LINE,
	HTML_TEXT_DIV,
	HTML_TEXT_SPAN,
	MULTI_ATTACHMENT_UPLOAD,
	PICKER_WRAPPER,
	SUFFIX,
	TOOLTIPS,
	VALIDATION_MESSAGES
} from "./data-roles.js";
import { MockComponent } from "./mockComponent.js";

/**
 * Mocks an arbitrary set of components, that are not necessary in a lot of
 * tests. This can be changed if necessary.
 */
export function getComponentMocks(): ComponentMap {
	return {
		...DefaultComponentMap,

		DateTextLine: mock.fn(DateTextLineMock),
		DateRangeTextLine: mock.fn(DateRangeTextLineMock),
		DateTimeTextLine: mock.fn(DateTimeTextLineMock),
		AttachmentUpload: mock.fn(AttachmentUploadMock),
		AttachmentPreview: mock.fn(),
		MultiAttachmentUpload: mock.fn(MultiAttachmentUploadMock),

		BufferedTextLine: mock.fn(BufferedTextLineMock),
		BufferedTextArea: mock.fn(BufferedTextAreaMock),
		HtmlTextDiv: mock.fn(HtmlTextDivMock),
		HtmlTextSpan: mock.fn(HtmlTextSpanMock),
		MessageList: mock.fn(MessageListMock),

		PickerWrapper: mock.fn(PickerWrapperMock),
		Suffix: mock.fn(SuffixMock),
		Tooltips: mock.fn(TooltipsMock),
		ContentWithNewLines: mock.fn(ContentWithNewLinesMock)
	};
}

export function DateTextLineMock(props: WithDataTestId<DateTextLineProps>) {
	return <MockComponent id={props.id} dataRole={DATE_CONTROL} dataTestId={props["data-testid"]} />;
}

export function DateRangeTextLineMock(props: WithDataTestId<DateRangeTextLineProps>) {
	return (
		<MockComponent id={props.id} dataRole={DATE_RANGE_CONTROL} dataTestId={props["data-testid"]} />
	);
}

export function DateTimeTextLineMock(props: WithDataTestId<DateTimeTextLineProps>) {
	return (
		<MockComponent id={props.id} dataRole={DATE_TIME_TEXT_LINE} dataTestId={props["data-testid"]} />
	);
}

export function AttachmentUploadMock(props: WithDataTestId<AttachmentUploadProps>) {
	return (
		<MockComponent id={props.id} dataRole={ATTACHMENT_UPLOAD} dataTestId={props["data-testid"]} />
	);
}

export function MultiAttachmentUploadMock(props: WithDataTestId<MultiAttachmentUploadProps>) {
	return (
		<MockComponent
			id={props.id}
			dataRole={MULTI_ATTACHMENT_UPLOAD}
			dataTestId={props["data-testid"]}
		/>
	);
}

export function BufferedTextLineMock(props: WithDataTestId<BufferedTextLineProps>) {
	return (
		<MockComponent id={props.id} dataRole={BUFFERED_TEXT_LINE} dataTestId={props["data-testid"]}>
			{props.prefixes}
		</MockComponent>
	);
}

export function BufferedTextAreaMock(props: WithDataTestId<BufferedTextAreaProps>) {
	return (
		<MockComponent id={props.id} dataRole={BUFFERED_TEXT_AREA} dataTestId={props["data-testid"]} />
	);
}

export function HtmlTextDivMock(props: WithDataTestId<HtmlTextProps>) {
	return (
		<MockComponent dataRole={HTML_TEXT_DIV} dataTestId={props["data-testid"]}>
			{props.content}
		</MockComponent>
	);
}

export function HtmlTextSpanMock(props: WithDataTestId<HtmlTextProps>) {
	return (
		<MockComponent dataRole={HTML_TEXT_SPAN} dataTestId={props["data-testid"]}>
			{props.content}
		</MockComponent>
	);
}

export function MessageListMock(props: WithDataTestId<ValidationMessagesProps>) {
	return (
		<MockComponent id={props.id} dataRole={VALIDATION_MESSAGES} dataTestId={props["data-testid"]} />
	);
}

export function ActionButtonsMock(props: WithDataTestId<ActionButtonsProps>) {
	return <MockComponent dataRole={ACTION_BUTTONS} dataTestId={props["data-testid"]} />;
}

export function PickerWrapperMock(props: WithDataTestId<PickerWrapperProps>) {
	return (
		<MockComponent dataRole={PICKER_WRAPPER} dataTestId={props["data-testid"]}>
			{props.children}
		</MockComponent>
	);
}

export function SuffixMock(props: WithDataTestId<SuffixProps>) {
	return <MockComponent id={props.id} dataRole={SUFFIX} dataTestId={props["data-testid"]} />;
}

export function TooltipsMock(props: WithDataTestId<TooltipsProps>) {
	return (
		<MockComponent dataRole={TOOLTIPS} dataTestId={props["data-testid"]}>
			{props.errorTooltip?.content}
			{props.warningTooltip?.content}
			{props.infoTooltip?.content}
			{props.hintTooltip?.content}
		</MockComponent>
	);
}

export function ContentWithNewLinesMock(props: WithDataTestId<ContentWithNewLinesProps>) {
	return (
		<MockComponent dataRole={CONTENT_WITH_NEW_LINES} dataTestId={props["data-testid"]}>
			{props.content}
		</MockComponent>
	);
}
