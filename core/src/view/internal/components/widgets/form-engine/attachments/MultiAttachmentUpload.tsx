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
import { useContext, useState } from "react";

import type { LocalizableArgs } from "@com.mgmtp.a12.utils/utils-localization";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react";
import type { DefaultFileUploadProps } from "@com.mgmtp.a12.widgets/widgets-core";

import type { DuplicateStrategy } from "../../../../../../client-extensions/internal/extensions/form-engine/internal/attachments/attachmentLoader/AttachmentLoader.js";
import { findUploadError } from "../../../../../../client-extensions/internal/extensions/form-engine/internal/attachments/reducer/reduceUiState.js";
import { ComponentMapContext } from "../../../../configuration/componentMap/component-map-context.js";
import { WidgetMapContext } from "../../../../configuration/widget-map-context.js";

import type { MultiAttachmentUploadProps } from "./attachmentUploadProps.js";
import { AbortModal } from "./modals/Abort.js";
import { DuplicatesModal } from "./modals/Duplicates.js";
import { TooManyFilesModal } from "./modals/TooManyFiles.js";

interface Dialog {
	readonly type?: "abort" | "duplicate" | "tooManyFiles";
	readonly args?: LocalizableArgs;
}

/** @internal */
export function MultiAttachmentUpload(props: MultiAttachmentUploadProps): JSX.Element {
	const {
		repeat,
		repeatFormModelPath,
		repeatDocumentPath,
		existingFiles,
		available,
		localizableFactory,
		dispatchUpload,
		dispatchCancel
	} = props;

	const attachmentModelPath = repeat.multiFileUploadOptions.elementPath;

	const { DefaultFileUpload } = useContext(WidgetMapContext);

	const [dialog, setDialog] = useState<Dialog | undefined>(undefined);
	const [filesToUpload, setFilesToUpload] = useState<File[]>([]);

	const fileUploadProps = useFileUploadProps(props, setDialog);

	function uploadFiles(files: File[], duplicateStrategy?: DuplicateStrategy): void {
		const attachmentGroupName = attachmentModelPath.at(-1)!.elementName;
		const repeatGroupName = repeatDocumentPath.at(-1)!.elementName;

		dispatchUpload(
			files.map((file, i) => ({
				file,
				attachmentPath: [
					...repeatDocumentPath.slice(0, -1),
					{ elementName: repeatGroupName, index: existingFiles.length + i + 1 },
					{ elementName: attachmentGroupName, index: 1 }
				]
			})),
			repeatFormModelPath,
			repeatDocumentPath,
			duplicateStrategy,
			existingFiles
		);
	}

	function onDecision(duplicateStrategy: DuplicateStrategy) {
		return () => {
			uploadFiles(filesToUpload, duplicateStrategy);
			setFilesToUpload([]);
			setDialog(undefined);
		};
	}

	return (
		<>
			{dialog?.type === "duplicate" ? (
				<DuplicatesModal
					duplicates={filesToUpload.flatMap(f =>
						existingFiles.flatMap(cf => (cf.fileName === f.name ? cf.fileName : []))
					)}
					onReplace={onDecision("replace")}
					onSkip={onDecision("skip")}
					onUploadAsCopy={onDecision("as_copy")}
					localizableFactory={localizableFactory}
					repeat={repeat}
					repeatFormModelPath={repeatFormModelPath}
				/>
			) : dialog?.type === "tooManyFiles" ? (
				<TooManyFilesModal args={dialog.args} onClose={() => setDialog(undefined)} />
			) : dialog?.type === "abort" ? (
				<AbortModal
					onCancel={() => {
						dispatchCancel();
						setDialog(undefined);
					}}
					onClose={() => setDialog(undefined)}
				/>
			) : undefined}
			<DefaultFileUpload
				{...fileUploadProps}
				onChange={list => {
					const files = [...list];

					if (files.length > available) {
						return setDialog({
							type: "tooManyFiles",
							args: {
								FILE_COUNT: { type: "plain", value: files.length },
								AVAILABLE_SPACE: { type: "plain", value: available }
							}
						});
					}

					if (files.some(f => existingFiles.some(cf => cf.fileName === f.name))) {
						setFilesToUpload(files);

						return setDialog({
							type: "duplicate"
						});
					}

					uploadFiles(files);
				}}
			/>
		</>
	);
}

function useFileUploadProps(
	props: MultiAttachmentUploadProps,
	setDialog: (dialog: Dialog) => void
): DefaultFileUploadProps {
	const {
		repeat,
		repeatFormModelPath,
		id,
		label,
		hideLabel,
		readonly,
		disabled,
		loading,
		errorMessages,
		attachmentConfig,
		localizableFactory
	} = props;

	const { localizer } = useContext(LocalizerContext);
	const { MessageList } = useContext(ComponentMapContext);

	const descriptionText = localizer(
		...localizableFactory.repeatMultiFileUploadDescription(repeat, repeatFormModelPath)
	);
	const buttonText = localizer(
		...localizableFactory.repeatMultiFileUploadButtonText(repeat, repeatFormModelPath)
	);
	const helperText = localizer(
		...localizableFactory.repeatMultiFileUploadHelperText(repeat, repeatFormModelPath)
	);

	const uploadError = findUploadError(errorMessages);

	return {
		multiple: true,
		id,
		label,
		hideLabel,
		descriptionText,
		hideDescriptionText: repeat.multiFileUploadOptions.hideFileUploadDescription,
		buttonText,
		mobileButtonText: buttonText,
		hideButtonText: repeat.multiFileUploadOptions.hideFileUploadButtonText,
		helperText,
		readOnly: readonly,
		disabled,
		loading,
		errorMessage: uploadError ? (
			<MessageList
				messages={uploadError.errorText.map(localizables => [localizables])}
				id={`${id}-error`}
			/>
		) : undefined,
		placeholderIcon: loading ? undefined : "none",
		accept: attachmentConfig?.accept,
		onUploadAreaClick: readonly ? undefined : () => !loading,
		onCancel: loading ? () => setDialog({ type: "abort" }) : undefined
	};
}
