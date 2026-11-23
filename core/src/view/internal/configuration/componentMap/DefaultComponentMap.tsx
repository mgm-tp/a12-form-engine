// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { ActionButtons } from "../../components/content-box/sub-items/action-buttons.js";
import { HeadingElement } from "../../components/content-box/sub-items/header.js";
import { NavigationBar } from "../../components/content-box/sub-items/navigation-bar.js";
import { ScreenFooter } from "../../components/content-box/sub-items/screen-footer.js";
import { ContentBoxFooter } from "../../components/widgets/content-box/footer.js";
import { ContentBoxHeader } from "../../components/widgets/content-box/header.js";
import { ContentBoxNavigationBar } from "../../components/widgets/content-box/navigation-bar.js";
import { AttachmentPreview } from "../../components/widgets/form-engine/attachments/AttachmentPreview.js";
import { AttachmentUpload } from "../../components/widgets/form-engine/attachments/AttachmentUpload.js";
import { MultiAttachmentUpload } from "../../components/widgets/form-engine/attachments/MultiAttachmentUpload.js";
import { BufferedTextArea } from "../../components/widgets/form-engine/buffered-text-area.js";
import { BufferedTextLine } from "../../components/widgets/form-engine/buffered-text-line.js";
import { ConfirmationButton } from "../../components/widgets/form-engine/confirmationButton.js";
import { DateRangeTextLine } from "../../components/widgets/form-engine/dateRangeTextLine.js";
import { DateTextLine } from "../../components/widgets/form-engine/dateTextLine.js";
import { DateTimeTextLine } from "../../components/widgets/form-engine/dateTimeTextLine.js";
import { PickerWrapper } from "../../components/widgets/form-engine/pickerWrapper.js";
import { ReorderButton } from "../../components/widgets/form-engine/reorderButton.js";
import { Suffix } from "../../components/widgets/form-engine/suffix.js";
import { HtmlTextDiv, HtmlTextSpan } from "../../components/widgets/form-engine/text.js";
import { Title } from "../../components/widgets/form-engine/title.js";
import { Tooltips } from "../../components/widgets/tooltips.js";
import { ValidationMessages } from "../../components/widgets/validationMessages.js";
import { ContentWithNewLines } from "../../utilities/contentWithNewLines.js";

import type { ComponentMap } from "./component-map.js";

/**
 * @internal
 *
 * The default map, which is used to decide how an entry in a render model based
 * on its widget type should be rendered.
 *
 * When you make changes to the map, please check if the table in Online Forms >
 * Structure and Layout > Styles in the FMM documentation needs to be adapted.
 */
export const DefaultComponentMap: ComponentMap = {
	// Inputs
	DateTextLine,
	DateRangeTextLine,
	DateTimeTextLine,
	AttachmentUpload,
	MultiAttachmentUpload,

	// Control Elements
	BufferedTextLine,
	BufferedTextArea,
	HtmlTextDiv,
	HtmlTextSpan,
	AttachmentPreview,
	MessageList: ValidationMessages,

	// Content-Box
	ActionButtons,
	ScreenFooter,
	HeadingElement,
	NavigationBar,
	ContentBoxHeader,
	ContentBoxNavigationBar,
	ContentBoxFooter,

	// Helpers
	Title,
	ReorderButton,
	ConfirmationButton,
	PickerWrapper,
	Suffix,
	Tooltips,
	ContentWithNewLines
};
