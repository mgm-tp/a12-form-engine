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

import type { JSX } from "react";
import { useContext, useRef } from "react";

import type {
	ContentModel,
	NodeRendererProps
} from "@com.mgmtp.a12.contentengine/contentengine-core";
import { useDocumentContext } from "@com.mgmtp.a12.contentengine/contentengine-core";
import type {
	MarkdownEditorHandle,
	MarkdownEditorMode
} from "@com.mgmtp.a12.widgets/widgets-core/experimental";

import type { BaseControlProps } from "../../../types/controlProps.js";
import { WidgetMapContext } from "../../../widgetMap/widgetMap-context.js";
import { createElementModule } from "../../createElementModule.js";
import { USE_COMMON_CONTROL_SETTINGS_WRAPPER } from "../../elementConfiguration/useCommonControlSettings.js";
import { USE_COMMON_WIDGET_SETTINGS_WRAPPER } from "../../elementConfiguration/useCommonWidgetSettings.js";
import { useFocus } from "../../focus.js";

import type { MarkdownNode } from "./markdownNode.js";
import { MARKDOWN_TYPE } from "./markdownNode.js";
import { markdownValidator } from "./markdownValidator.js";

/** All modes the widget offers, so the mode menu (edit/source/view) shows up by default. */
const ALLOWED_MODES: MarkdownEditorMode[] = ["edit", "source", "view"];

/**
 * `emitMode="blur"` matches the flush-on-blur timing other inputs get from their own buffered
 * widgets (dirty state, value change) - the widget's own default, a trailing debounce, would
 * otherwise mark the field dirty mid-typing instead.
 */
const EMIT_MODE = "blur";

/**
 * @internal
 * No upload-based image attachment support here - unlike form-engine's own markdown control, a
 * content element has no document/repeat to store uploaded images as attachments in, so the
 * editor is mounted without an `onImageUpload` handler at all. The base editor's own toolbar
 * still lets users insert images by URL (`MarkdownEditor`'s built-in image dialog), independent
 * of that upload extension.
 */
export const MarkdownModule = createElementModule<MarkdownNode>({
	type: MARKDOWN_TYPE,
	renderer: MarkdownRenderer,
	validator: markdownValidator
});

function MarkdownRenderer(
	props: NodeRendererProps<ContentModel.Node<BaseControlProps>>
): JSX.Element | null {
	const { MarkdownEditor } = useContext(WidgetMapContext);
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const { onValueChanged } = useDocumentContext(c => c.event);

	const { node } = props;

	const commonControlSettings = USE_COMMON_CONTROL_SETTINGS_WRAPPER.useCommonControlSettings(node);
	const { uiId, placeholder, dataReference, notRelevant, ungroupedValidationMessages } =
		commonControlSettings;

	useFocus({
		uiId,
		dataReference,
		ref: inputRef,
		messages: ungroupedValidationMessages
	});

	const {
		formattedValue,
		label,
		hideLabel,
		helperText,
		readonly,
		error,
		warning,
		info,
		errors,
		warnings,
		infos,
		tooltips
	} = USE_COMMON_WIDGET_SETTINGS_WRAPPER.useCommonWidgetSettings(commonControlSettings);

	if (notRelevant) {
		return null;
	}

	const handleValueChange = (value: string) => {
		const trimmedValue = value.trim();
		const valueToSet = trimmedValue || null;

		onValueChanged({ path: dataReference, value: valueToSet, userValue: trimmedValue });
	};

	return (
		<MarkdownEditor
			id={uiId}
			label={label}
			placeholder={placeholder}
			readonly={readonly}
			hideLabel={hideLabel}
			tooltips={tooltips}
			helperText={helperText}
			value={formattedValue ?? ""}
			allowedModes={ALLOWED_MODES}
			emitMode={EMIT_MODE}
			error={error}
			errorMessage={errors}
			warning={warning}
			warningMessage={warnings}
			info={info}
			infoMessage={infos}
			onChange={handleValueChange}
			editorRef={(handle: MarkdownEditorHandle | null) => {
				// `useFocus` only ever calls `.focus()` on the ref, so a handle-backed
				// stand-in satisfies it despite not being a true `HTMLTextAreaElement`.
				inputRef.current = handle
					? ({ focus: () => handle.focus() } as unknown as HTMLTextAreaElement)
					: null;
			}}
		/>
	);
}
