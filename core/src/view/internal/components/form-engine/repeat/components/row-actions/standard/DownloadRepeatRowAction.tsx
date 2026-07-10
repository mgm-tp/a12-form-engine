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

import type { GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import { DataSelectors, ModelSelectors } from "../../../../../../../../back-end/store/index.js";
import { UiId } from "../../../../../../../../back-end/utils/internal/generateUiId.js";
import { getDocumentPath } from "../../../../../../../../back-end/utils/internal/path.js";
import {
	DocumentUtils,
	InternalDocumentPath
} from "../../../../../../../../models/internal/utils/document-utils.js";
import { DefaultRepeatButtonNames } from "../../../../../../configuration/engine-configuration.js";
import type { FormModelMap } from "../../../../../../configuration/engine-configuration.js";
import { isDownloadButtonDisabled } from "../../../../../../utilities/enablements/disabled-row-actions.js";
import { isStandardRowActionHidden } from "../../../../../../utilities/enablements/hidden-row-actions.js";
import { DataContext } from "../../../../data-context.js";
import { MenuContext } from "../../MenuContext.js";
import type { RepeatRow } from "../../tableColumnTypes.js";
import { AttachmentDataSelectors } from "../../../../../../../../back-end/store/internal/selectors/data.js";
import {
	isFormModelEmbeddedRepeat,
	isFormModelInlineRepeat
} from "../../../../../../../../models/index.js";
import type { FormModel } from "../../../../../../../../models/index.js";

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

	const unassignedIds = AttachmentDataSelectors.unassignedIds(renderOptions.state);

	if (
		(isFormModelInlineRepeat(repeat) || isFormModelEmbeddedRepeat(repeat)) &&
		repeat.multiFileUpload &&
		repeat.multiFileUploadOptions
	) {
		const enabledInModel = repeat.multiFileUploadOptions.enableDownload;

		const hidden = isStandardRowActionHidden({
			byRow: renderOptions.config.enablements?.byRow ?? {},
			eventName: DefaultRepeatButtonNames.download,
			rowIndex: InternalDocumentPath.rowIndex(rowPath),
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
			rowIndex: InternalDocumentPath.rowIndex(rowPath),
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
