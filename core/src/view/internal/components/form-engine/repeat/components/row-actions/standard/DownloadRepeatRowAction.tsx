// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ReactElement } from "react";
import { useContext } from "react";

import type { GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import { DataSelectors, ModelSelectors } from "../../../../../../../../back-end/store/index.js";
import { UiId } from "../../../../../../../../back-end/utils/internal/generateUiId.js";
import { getDocumentPath } from "../../../../../../../../back-end/utils/internal/path.js";
import { FormModel } from "../../../../../../../../models/internal/form-model.js";
import {
	DocumentPath,
	DocumentUtils
} from "../../../../../../../../models/internal/utils/document-utils.js";
import { DefaultRepeatButtonNames } from "../../../../../../configuration/engine-configuration.js";
import type { FormModelMap } from "../../../../../../configuration/engine-configuration.js";
import { isDownloadButtonDisabled } from "../../../../../../utilities/enablements/disabled-row-actions.js";
import { isStandardRowActionHidden } from "../../../../../../utilities/enablements/hidden-row-actions.js";
import { DataContext } from "../../../../data-context.js";
import { MenuContext } from "../../MenuContext.js";
import type { RepeatRow } from "../../tableColumnTypes.js";

import type { GetTitle } from "./GetTitle.js";
import { RowActionButton } from "./RowActionButton.js";

/** @internal */
export function DownloadRepeatRowAction(props: {
	repeat: FormModel.Repeat;
	row: RepeatRow;
	renderOptions: FormModelMap.RenderOptions;
	repeatReadonly?: boolean;
	getTitle: GetTitle;
}): ReactElement | null {
	const { repeat, renderOptions, row, getTitle } = props;
	const rowPath = row.path;

	const renderAsListItem = useContext(MenuContext).renderAsListItem;
	const dataContext = useContext(DataContext);

	const unassignedIds = DataSelectors.Attachments.unassignedIds(renderOptions.state);

	if (
		(FormModel.InlineRepeat.isInstance(repeat) || FormModel.EmbeddedRepeat.isInstance(repeat)) &&
		repeat.multiFileUpload &&
		repeat.multiFileUploadOptions
	) {
		const enabledInModel = repeat.multiFileUploadOptions.enableDownload;

		const hidden = isStandardRowActionHidden({
			byRow: renderOptions.config.enablements?.byRow ?? {},
			eventName: DefaultRepeatButtonNames.download,
			rowIndex: DocumentPath.rowIndex(rowPath),
			state: renderOptions.state,
			repeat,
			enabledInModel,
			repeatReadonly: props.repeatReadonly
		});

		if (hidden) {
			return null;
		}

		const documentModel = ModelSelectors.documentModel()(renderOptions.state);
		const document = DataSelectors.document()(renderOptions.state) as GroupInstance;
		const attachmentDocumentPath = getDocumentPath(
			documentModel,
			repeat.multiFileUploadOptions.elementPath,
			dataContext
		);
		const attachment = DocumentUtils.getValue({ document, path: attachmentDocumentPath });

		const onDownloadClick = DocumentUtils.isGroupInstance(attachment)
			? (event: React.MouseEvent<HTMLElement>) => {
					renderOptions.eventHandlers.onAttachmentDownload(attachment, attachmentDocumentPath);
					event.stopPropagation();
				}
			: () => {};

		const id = UiId.generateForRowActionButton({
			uiIdPrefix: props.renderOptions.config.uiIdPrefix,
			repeat,
			rowIndex: rowPath[rowPath.length - 1].index,
			eventType: "download",
			buttonType: renderAsListItem ? "list-item" : "button"
		});

		const disabled = isDownloadButtonDisabled({
			byRow: renderOptions.config.enablements?.byRow ?? {},
			eventName: DefaultRepeatButtonNames.download,
			rowIndex: DocumentPath.rowIndex(rowPath),
			state: renderOptions.state,
			repeat,
			attachmentDocumentPath,
			unassignedIds
		});

		return (
			<RowActionButton
				id={id}
				name="file_download"
				title={getTitle("DOWNLOAD")}
				onClick={onDownloadClick}
				disabled={disabled}
				repeat={repeat}
				row={row}
				uiIdPrefix={props.renderOptions.config.uiIdPrefix}
			/>
		);
	}

	return null;
}
