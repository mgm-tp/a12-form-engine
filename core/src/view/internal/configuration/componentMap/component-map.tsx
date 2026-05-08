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

import type { ActionButtonsProps } from "../../components/content-box/sub-items/action-buttons.js";
import type { HeadingElementProps } from "../../components/content-box/sub-items/header.js";
import type { NavigationBarProps } from "../../components/content-box/sub-items/navigation-bar.js";
import type { ScreenFooterProps } from "../../components/content-box/sub-items/screen-footer-props.js";
import type { ContentBoxFooterProps } from "../../components/widgets/content-box/footer.js";
import type { ContentBoxHeaderProps } from "../../components/widgets/content-box/header.js";
import type { ContentBoxNavigationBarProps } from "../../components/widgets/content-box/navigation-bar.js";
import type { AttachmentPreviewProps } from "../../components/widgets/form-engine/attachments/AttachmentPreview.js";
import type {
	AttachmentUploadProps,
	MultiAttachmentUploadProps
} from "../../components/widgets/form-engine/attachments/attachmentUploadProps.js";
import type { BufferedTextArea } from "../../components/widgets/form-engine/buffered-text-area.js";
import type { BufferedTextLine } from "../../components/widgets/form-engine/buffered-text-line.js";
import type { ConfirmationButtonProps } from "../../components/widgets/form-engine/confirmationButton.js";
import type {
	DateRangeTextLineProps,
	DateTextLineProps,
	DateTimeTextLineProps
} from "../../components/widgets/form-engine/date-props.js";
import type { PickerWrapperProps } from "../../components/widgets/form-engine/pickerWrapper.js";
import type { ReorderButtonProps } from "../../components/widgets/form-engine/reorderButton.js";
import type { SuffixProps } from "../../components/widgets/form-engine/suffix.js";
import type { HtmlTextProps } from "../../components/widgets/form-engine/text.js";
import type { TitleProps } from "../../components/widgets/form-engine/title.js";
import type { TooltipsProps } from "../../components/widgets/tooltips.js";
import type { ValidationMessagesProps } from "../../components/widgets/validationMessages.js";
import type { ContentWithNewLinesProps } from "../../utilities/contentWithNewLines.js";

/** @internal */
export interface ComponentMap {
	// Inputs
	readonly DateTextLine: ComponentType<DateTextLineProps>;
	readonly DateRangeTextLine: ComponentType<DateRangeTextLineProps>;
	readonly DateTimeTextLine: ComponentType<DateTimeTextLineProps>;
	readonly AttachmentUpload: ComponentType<AttachmentUploadProps>;
	readonly MultiAttachmentUpload: ComponentType<MultiAttachmentUploadProps>;

	// Control Elements
	readonly BufferedTextLine: ComponentType<BufferedTextLine.PropsType>;
	readonly BufferedTextArea: ComponentType<BufferedTextArea.PropsType>;
	readonly HtmlTextDiv: ComponentType<HtmlTextProps>;
	readonly HtmlTextSpan: ComponentType<HtmlTextProps>;
	readonly AttachmentPreview: ComponentType<AttachmentPreviewProps>;
	readonly MessageList: ComponentType<ValidationMessagesProps>;

	// Content-Box
	readonly ActionButtons: ComponentType<ActionButtonsProps>;
	readonly ScreenFooter: ComponentType<ScreenFooterProps>;
	readonly HeadingElement: ComponentType<HeadingElementProps>;
	readonly NavigationBar: ComponentType<NavigationBarProps>;
	readonly ContentBoxHeader: ComponentType<ContentBoxHeaderProps>;
	readonly ContentBoxNavigationBar: ComponentType<ContentBoxNavigationBarProps>;
	readonly ContentBoxFooter: ComponentType<ContentBoxFooterProps>;

	// Helpers
	readonly Title: ComponentType<TitleProps>;
	readonly ReorderButton: ComponentType<ReorderButtonProps>;
	readonly ConfirmationButton: ComponentType<ConfirmationButtonProps>;
	readonly PickerWrapper: ComponentType<PickerWrapperProps>;
	readonly Suffix: ComponentType<SuffixProps>;
	readonly Tooltips: ComponentType<TooltipsProps>;
	readonly ContentWithNewLines: ComponentType<ContentWithNewLinesProps>;
}
