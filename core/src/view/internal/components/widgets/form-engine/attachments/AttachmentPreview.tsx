// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX } from "react";
import { useContext } from "react";

import type { Attachment } from "@com.mgmtp.a12.dataservices/dataservices-access/lib/Attachment/attachment.js";

import { getPlaceholderIconForMimeType } from "../../../../../../back-end/services/attachment.js";
import { WidgetMapContext } from "../../../../configuration/widget-map-context.js";

import {
	getFileExtension,
	hasSupportedType,
	isFilled,
	useThumbnailStyle
} from "./attachmentUtils.js";

/** @internal */
export interface AttachmentPreviewProps {
	readonly id: string;
	readonly attachment: Attachment;
	readonly repeatRowHeight?: number;
	readonly thumbnail?: string;
}

/**@internal */
export function AttachmentPreview(props: AttachmentPreviewProps): JSX.Element | null {
	const { attachment, repeatRowHeight, thumbnail } = props;

	const { ResponsiveImageContainer, Icon } = useContext(WidgetMapContext);

	const thumbnailStyle = useThumbnailStyle(repeatRowHeight);

	const fileExtension = isFilled(attachment) ? getFileExtension(attachment) : undefined;

	const iconForUploadedFile = isFilled(attachment)
		? `datatype_${getPlaceholderIconForMimeType(attachment.mime_type)}`
		: undefined;

	return hasSupportedType(attachment) && thumbnail ? (
		<div style={thumbnailStyle}>
			<ResponsiveImageContainer
				src={thumbnail}
				title={attachment.original_filename ?? undefined}
				alt={attachment.original_filename ?? undefined}
				data-testid={`${props.id}-ResponsiveImageContainer`}
			/>
		</div>
	) : iconForUploadedFile ? (
		<Icon iconTheme="custom" size="big" title={fileExtension} data-testid={`${props.id}-Icon`}>
			{iconForUploadedFile}
		</Icon>
	) : null;
}
