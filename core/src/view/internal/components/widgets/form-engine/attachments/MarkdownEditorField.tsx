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

import type { ReactElement } from "react";
import { useContext } from "react";

import { ImageUploadExtension } from "@com.mgmtp.a12.widgets/widgets-core/experimental";
import type {
	ImageUploadContext,
	MarkdownEditorMode,
	MarkdownEditorProps,
	UploadedImage
} from "@com.mgmtp.a12.widgets/widgets-core/experimental";

import { WidgetMapContext } from "../../../../configuration/widget-map-context.js";

/**
 * Props for {@link MarkdownEditorField}: the widget's own props, plus a ready-to-use
 * `onImageUpload` handler - built by form-engine's own `MarkdownInput`, which has the store
 * access this component doesn't.
 */
export interface MarkdownEditorFieldProps extends MarkdownEditorProps {
	readonly onImageUpload?: (file: File, context: ImageUploadContext) => Promise<UploadedImage>;
}

/** The image node/mdast round-trip is always registered; without a handler it stays URL-only. */
const MARKDOWN_IMAGE_EXTENSIONS = [ImageUploadExtension];

/** Same protocols the editor's own default image URL policy allows, plus `data:`. */
const ALLOWED_IMAGE_PROTOCOLS = new Set(["http:", "https:", "data:"]);

/** All modes the widget offers, so the mode menu (edit/source/view) shows up by default. */
const ALLOWED_MODES: MarkdownEditorMode[] = ["edit", "source", "view"];

/**
 * `emitMode="blur"` matches the flush-on-blur timing every other input gets from
 * `BufferedTextLine`/`BufferedTextArea` (dirty state, `onValueChange`) - the widget's own
 * default, a trailing debounce, would otherwise mark the field dirty mid-typing instead, and it
 * and `"value-change"` would flood the store with actions while typing.
 * A finished image upload is the one exception: it is not typing and can land after the blur,
 * so `MarkdownInput` flushes it explicitly (see `flushEditorAfterImageUpload`) until the widget
 * reports changes made while it is not focused on its own (A12W-11738).
 */
const EMIT_MODE = "blur";

/**
 * The editor's built-in image URL policy rejects `data:` sources outright - reasonable for a
 * URL a user pastes into the document, but not for `src` this plugin's own upload flow just
 * produced itself: an `AttachmentLoader` that embeds the image directly (see
 * `createMarkdownAttachmentImageUpload`) resolves with exactly that kind of URL, which would
 * otherwise be shown as a failed upload despite having succeeded.
 *
 * Exported for testing.
 */
export function isAllowedImageUploadSrc(src: string): boolean {
	const stripped = Array.from(src)
		.filter(char => char.charCodeAt(0) > 0x20)
		.join("");
	const match = /^([a-zA-Z][a-zA-Z0-9+.-]*):/.exec(stripped);
	const protocol = match ? `${match[1].toLowerCase()}:` : null;

	return protocol === null || ALLOWED_IMAGE_PROTOCOLS.has(protocol);
}

/**
 * @internal
 * Composes the plain `WidgetMap.MarkdownEditor`/`WidgetMap.ImageUploadPlugin` widgets with
 * form-engine's first-party attachment image plugin and all three editing modes
 * (edit/source/view) - the same way `AttachmentUpload` composes `WidgetMap.DefaultFileUpload`.
 * Inert when there's no `onImageUpload` handler - renders the plain editor, exactly like before
 * this plugin existed.
 */
export function MarkdownEditorField({
	onImageUpload,
	...props
}: MarkdownEditorFieldProps): ReactElement {
	const { MarkdownEditor, ImageUploadPlugin } = useContext(WidgetMapContext);

	if (!onImageUpload) {
		return <MarkdownEditor allowedModes={ALLOWED_MODES} emitMode={EMIT_MODE} {...props} />;
	}

	return (
		<MarkdownEditor
			allowedModes={ALLOWED_MODES}
			emitMode={EMIT_MODE}
			{...props}
			extensions={MARKDOWN_IMAGE_EXTENSIONS}
			plugins={
				<ImageUploadPlugin onImageUpload={onImageUpload} isAllowedUrl={isAllowedImageUploadSrc} />
			}
		/>
	);
}
