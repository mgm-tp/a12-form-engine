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
import { useContext, useRef, useState } from "react";

import type { LocalizableArgs } from "@com.mgmtp.a12.utils/utils-localization";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react";
import type { DefaultFileUploadProps } from "@com.mgmtp.a12.widgets/widgets-core";

import { createResourceLocalizable } from "../../../../../../back-end/localization/internal/factory.js";
import { RESOURCE_KEYS } from "../../../../../../back-end/localization/internal/languages/keys.js";
import {
	getLinkIconForMimeType,
	getPlaceholderIconForMimeType
} from "../../../../../../back-end/services/attachment.js";
import { UiId } from "../../../../../../back-end/utils/internal/generateUiId.js";
import { ComponentMapContext } from "../../../../configuration/componentMap/component-map-context.js";
import { WidgetMapContext } from "../../../../configuration/widget-map-context.js";

import type { AttachmentUploadProps } from "./attachmentUploadProps.js";
import { hasSupportedType, isFilled } from "./attachmentUtils.js";
import { AbortModal } from "./modals/Abort.js";
import { RemoveModal } from "./modals/Remove.js";

const DEFAULT_INPUT_SIZE = 150;

/** @internal */
export function AttachmentUpload(props: AttachmentUploadProps): JSX.Element | null {
	const { dispatchCancel, dispatchDelete } = props;

	const { DefaultFileUpload } = useContext(WidgetMapContext);

	const [showDialog, setShowDialog] = useState<"abort" | "remove" | undefined>(undefined);

	const fileUploadProps = useFileUploadProps(props, setShowDialog);

	return (
		<>
			{showDialog === "abort" ? (
				<AbortModal
					onClose={() => setShowDialog(undefined)}
					onCancel={() => {
						dispatchCancel();
						setShowDialog(undefined);
					}}
				/>
			) : showDialog === "remove" ? (
				<RemoveModal
					onClose={() => setShowDialog(undefined)}
					onRemove={() => {
						dispatchDelete(props.attachment, props.attachmentPath);
						setShowDialog(undefined);
					}}
				/>
			) : null}
			<DefaultFileUpload {...fileUploadProps} />
		</>
	);
}

function useFileUploadProps(
	props: AttachmentUploadProps,
	setShowDialog: (show?: "abort" | "remove") => void
): DefaultFileUploadProps {
	const {
		attachment,
		attachmentPath,
		formModelPath,
		id,
		warningMessages,
		errorMessages,
		error,
		info,
		warning,
		infoMessages,
		modelElement,
		readonly,
		disabled,
		inputRef,
		label,
		hideLabel,
		isMultiFileUploadColumn,
		readonlyPresentation,
		noDataString,
		dispatchUpload,
		dispatchDownload,
		loading,
		isUnassigned,
		thumbnail
	} = props;

	const fileInputElement = useRef<HTMLInputElement>(null);

	const { PopUpMenu, List, ListItem, Button, Icon, ResponsiveImageContainer } =
		useContext(WidgetMapContext);
	const { MessageList, Tooltips } = useContext(ComponentMapContext);
	const { localizer } = useContext(LocalizerContext);

	const errorMessage =
		errorMessages && errorMessages.length > 0
			? {
					id: UiId.generateForErrorTooltip({ inputId: id }),
					content: <MessageList messages={errorMessages} id={`${id}-error`} />
				}
			: undefined;

	const warningMessage =
		warningMessages && warningMessages.length > 0
			? {
					id: UiId.generateForWarningTooltip({ inputId: id }),
					content: <MessageList messages={warningMessages} id={`${id}-warning`} />
				}
			: undefined;

	const infoMessage =
		infoMessages && infoMessages.length > 0
			? {
					id: UiId.generateForInfoTooltip({ inputId: id }),
					content: <MessageList messages={infoMessages} id={`${id}-info`} />
				}
			: undefined;

	const hintTooltip = modelElement.hintText
		? {
				id: UiId.generateForHintTooltip({ inputId: id }),
				content: modelElement.hintText
			}
		: undefined;

	const showValidationMessagesAsTooltips = modelElement.messageExposition === "TOOLTIP";

	const tooltips = (
		<Tooltips
			disabled={modelElement.disabled}
			{...(showValidationMessagesAsTooltips
				? {
						errorTooltip: errorMessage,
						warningTooltip: warningMessage,
						infoTooltip: infoMessage
					}
				: undefined)}
			hintTooltip={hintTooltip}
		/>
	);

	const actionAfterUpload = isFilled(attachment)
		? readonly || modelElement.attachmentConfig?.defaultAction === "download"
			? "download"
			: "replace"
		: undefined;

	const fileName = attachment.original_filename;
	const fileNamePlaceholder: LocalizableArgs = {
		FILE_NAME: { type: "plain", value: fileName ?? "" }
	};

	const title =
		actionAfterUpload === "download"
			? localizer(
					createResourceLocalizable(RESOURCE_KEYS.attachment.title.download, fileNamePlaceholder)
				)
			: actionAfterUpload === "replace"
				? localizer(
						createResourceLocalizable(RESOURCE_KEYS.attachment.title.replace, fileNamePlaceholder)
					)
				: undefined;

	const baseFileUploadProps: DefaultFileUploadProps = {
		id,
		label,
		hideLabel,
		title: modelElement.exposition === "COMPACT" ? "" : title,
		errorMessage: !showValidationMessagesAsTooltips ? errorMessage?.content : error,
		warningMessage: !showValidationMessagesAsTooltips ? warningMessage?.content : warning,
		infoMessage: !showValidationMessagesAsTooltips ? infoMessage?.content : info,
		tooltips,
		breakTooltipsToNewLine: modelElement.tooltipsOnTop,
		readOnly: readonly,
		disabled,
		loading,
		actionItem:
			isFilled(attachment) && !readonly ? (
				<PopUpMenu
					triggerElement={
						<Button
							secondary
							icon={<Icon>more_vert</Icon>}
							data-testid={`${id}-popup-menu-button`}
						/>
					}
					key="menu"
					disabled={disabled}
					onTriggerElementClick={ev => ev.stopPropagation()}
					data-testid={`${id}-popup-menu`}
				>
					<List>
						<ListItem
							text={localizer(createResourceLocalizable(RESOURCE_KEYS.attachment.button.replace))}
							key="replace"
							graphic={<Icon>file_upload</Icon>}
							onClick={() => fileInputElement.current?.click()}
							disabled={disabled || readonly}
							data-testid={`${id}-popup-menu-replace`}
						/>
						<ListItem
							text={localizer(createResourceLocalizable(RESOURCE_KEYS.attachment.button.download))}
							key="download"
							graphic={<Icon>file_download</Icon>}
							onClick={() => dispatchDownload(attachment, attachmentPath)}
							disabled={disabled || isUnassigned}
							title={
								isUnassigned
									? localizer(
											createResourceLocalizable(RESOURCE_KEYS.attachment.button.downloadDisabled)
										)
									: undefined
							}
							data-testid={`${id}-popup-menu-download`}
						/>
						{isMultiFileUploadColumn ? undefined : (
							<ListItem
								text={localizer(createResourceLocalizable(RESOURCE_KEYS.attachment.button.remove))}
								key="remove"
								graphic={<Icon>delete</Icon>}
								onClick={() => setShowDialog("remove")}
								disabled={disabled || readonly}
								data-testid={`${id}-popup-menu-remove`}
							/>
						)}
					</List>
				</PopUpMenu>
			) : undefined,
		accept: modelElement.attachmentConfig?.accept,
		onChange: list => {
			const newFile = list.item(0);

			if (newFile) {
				dispatchUpload([{ file: newFile, attachmentPath }], formModelPath);
			}
		},
		/*
		 * Do not provide an onUploadAreaClick callback if the input is readonly and empty.
		 * This is necessary to get a "non-interactive" cursor.
		 */
		onUploadAreaClick:
			readonly && !isFilled(attachment)
				? undefined
				: () => {
						if (actionAfterUpload === "download") {
							if (!isUnassigned) {
								dispatchDownload(attachment, attachmentPath);
							}

							return false;
						}

						return !loading;
					},
		// This is necessary so that the cancel option is not shown while loading
		onCancel: loading ? () => setShowDialog("abort") : undefined,
		fileInputRef: element => {
			fileInputElement.current = element;
		},
		uploadAreaRef: element => {
			if (inputRef) {
				inputRef.current = element;
			}
		}
	};

	/**
	 * Empty alt tag to prevent screen readers from reading unexpected
	 * information for the image. The file name is already part of the file
	 * upload's title property and will be read from there.
	 */
	const previewImage =
		!loading && hasSupportedType(attachment) && thumbnail && thumbnail.length > 0 ? (
			<ResponsiveImageContainer
				src={thumbnail}
				alt={""}
				data-testid={`${id}-responsive-image-container`}
			/>
		) : undefined;

	const placeholderIcon =
		isFilled(attachment) && !loading
			? getPlaceholderIconForMimeType(attachment.mime_type)
			: modelElement.attachmentConfig?.placeholderIcon;

	return modelElement.exposition === "COMPACT"
		? {
				...baseFileUploadProps,
				compact: true,
				fileOptions: isFilled(attachment)
					? {
							name: fileName,
							icon: <Icon iconTheme="custom">{getLinkIconForMimeType(attachment.mime_type)}</Icon>,
							textOnlyDisplay: readonly && readonlyPresentation === "TEXT",
							linkProps: { title }
						}
					: readonly && readonlyPresentation === "TEXT"
						? {
								name: noDataString,
								textOnlyDisplay: true,
								showAsLink: false
							}
						: undefined
			}
		: {
				...baseFileUploadProps,
				uploadAreaSize: loading
					? { height: DEFAULT_INPUT_SIZE, width: DEFAULT_INPUT_SIZE }
					: { maxHeight: DEFAULT_INPUT_SIZE, maxWidth: DEFAULT_INPUT_SIZE },
				image: previewImage,
				placeholderIcon,
				showPlaceholderIconAsPreview: isFilled(attachment) && previewImage === undefined
			};
}
