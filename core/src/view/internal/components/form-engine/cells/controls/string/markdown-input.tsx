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
import { useContext, useMemo, useRef } from "react";

import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import type { MarkdownEditorHandle } from "@com.mgmtp.a12.widgets/widgets-core/experimental";

import { assertExists } from "../../../../../../../back-end/utils/internal/assertions.js";
import { ComponentMapContext } from "../../../../../configuration/componentMap/component-map-context.js";
import type { Inputs } from "../../../../../configuration/engine-configuration.js";
import { EngineStoreContext } from "../../../../../configuration/engine-store-context.js";
import { flushEditorAfterImageUpload } from "../../../../widgets/form-engine/attachments/flush-editor-after-image-upload.js";
import { createMarkdownAttachmentImageUpload } from "../../../../widgets/form-engine/attachments/markdown-attachment-image-upload.js";

import { inputTouched } from "../input-touched.js";
import { useBasePropsForTextInputs } from "../use-input-props.js";

/**
 * @internal
 * Renders the markdown editor for a string field with `isMarkdownEditor: true`, via the
 * internal `ComponentMap.MarkdownEditorField`, which composes the plain
 * `WidgetMap.MarkdownEditor`/`WidgetMap.ImageUploadPlugin` widgets with form-engine's own
 * attachment plugin. The field's `markdownAttachmentRepeatPath`, if the modeler set one, is used here
 * to build a ready-to-use `onImageUpload` handler for it (not in the widget itself, which has no
 * store access of its own).
 */
export function MarkdownInput(
	props: Inputs.InputProps<DocumentModel.StringType>
): ReactElement | null {
	const { MarkdownEditorField } = useContext(ComponentMapContext);

	const options = props.renderConfiguration.renderOptions;
	const { inputRef } = props;
	const value = props.value;
	const { addonAfter, ariaDescribedby, suffixes, truncateSuffix, htmlInputProps, ...inputProps } =
		useBasePropsForTextInputs(props);

	const markdownAttachmentRepeatPath = props.modelElement.markdownAttachmentRepeatPath;
	const engineStore = useContext(EngineStoreContext);
	const { onAttachmentUpload, onAttachmentDelete, onAttachmentValueChange } = options.eventHandlers;
	const editorHandleRef = useRef<MarkdownEditorHandle | null>(null);

	const onImageUpload = useMemo(() => {
		if (!markdownAttachmentRepeatPath) {
			return undefined;
		}
		assertExists(engineStore, "Expected an EngineStoreContext to be provided.");
		const upload = createMarkdownAttachmentImageUpload({
			eventHandlers: {
				onAttachmentUpload,
				onAttachmentDelete,
				onAttachmentValueChange
			},
			getState: engineStore.getState,
			subscribe: engineStore.subscribe,
			markdownAttachmentRepeatPath
		});
		return flushEditorAfterImageUpload(upload, () => editorHandleRef.current);
	}, [
		onAttachmentUpload,
		onAttachmentDelete,
		onAttachmentValueChange,
		engineStore,
		markdownAttachmentRepeatPath
	]);

	/**
	 * Not memoized: `options` (via `renderConfiguration.renderOptions`) is rebuilt on every
	 * form render, so a `useCallback` here would be recreated just as often anyway. The
	 * underlying `MarkdownEditorField`/`MarkdownEditor` reads `onChange` through its own
	 * ref internally, so a fresh function identity on every render costs nothing there either.
	 *
	 * Also note that no conversion is done, because a markdown input can only
	 * hold strings - which don't need conversion.
	 */
	const onChange = (newValue: string): void => {
		inputTouched(options);
		const result = newValue.trim();
		const change = result === "" ? null : result;
		options.eventHandlers.onValueChange(value.path, change, props.formModelPath);
	};

	return (
		<MarkdownEditorField
			{...inputProps}
			tooltips={inputProps.tooltips ?? addonAfter}
			onChange={onChange}
			onImageUpload={onImageUpload}
			editorRef={(handle: MarkdownEditorHandle | null) => {
				editorHandleRef.current = handle;
				// `inputRef` only ever has `.focus()` called on it (initial-focus handling), so a
				// handle-backed stand-in satisfies every real caller despite not being a true HTMLElement.
				if (inputRef) {
					inputRef.current = handle
						? ({ focus: () => handle.focus() } as unknown as HTMLElement)
						: null;
				}
			}}
		/>
	);
}
