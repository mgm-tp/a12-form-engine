// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ReactElement } from "react";
import { useContext } from "react";

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";

import { UiId } from "../../../../../../../../back-end/utils/internal/generateUiId.js";
import type { FormModel } from "../../../../../../../../models/internal/form-model.js";
import { DocumentPath } from "../../../../../../../../models/internal/utils/document-utils.js";
import { DefaultRepeatButtonNames } from "../../../../../../configuration/engine-configuration.js";
import type { FormModelMap } from "../../../../../../configuration/engine-configuration.js";
import { isCopyButtonDisabled } from "../../../../../../utilities/enablements/disabled-row-actions.js";
import { isStandardRowActionHidden } from "../../../../../../utilities/enablements/hidden-row-actions.js";
import { MenuContext } from "../../MenuContext.js";
import type { RepeatRow } from "../../tableColumnTypes.js";

import type { GetTitle } from "./GetTitle.js";
import { RowActionButton } from "./RowActionButton.js";

/** @internal */
export function CopyRepeatRowAction(props: {
	repeat: FormModel.Repeat;
	row: RepeatRow;
	renderOptions: FormModelMap.RenderOptions;
	repeatFormModelPath: ModelPath;
	repeatReadonly?: boolean;
	totalNumberOfRows: number;
	getTitle: GetTitle;
}): ReactElement | null {
	const { repeat, repeatFormModelPath, renderOptions, row, totalNumberOfRows, getTitle } = props;
	const rowPath = row.path;
	const renderAsListItem = useContext(MenuContext).renderAsListItem;

	const hidden = isStandardRowActionHidden({
		byRow: renderOptions.config.enablements?.byRow ?? {},
		eventName: DefaultRepeatButtonNames.copy,
		rowIndex: DocumentPath.rowIndex(rowPath),
		state: renderOptions.state,
		repeat,
		enabledInModel: repeat.enableCopy,
		repeatReadonly: props.repeatReadonly
	});

	if (hidden) {
		return null;
	}
	const onCopyClick = (event: React.MouseEvent<HTMLElement>) => {
		renderOptions.eventHandlers.repeat.onCloneRow(rowPath, repeatFormModelPath);
		event.stopPropagation();
	};
	const id = UiId.generateForRowActionButton({
		uiIdPrefix: props.renderOptions.config.uiIdPrefix,
		repeat,
		rowIndex: rowPath[rowPath.length - 1].index,
		eventType: "copy",
		buttonType: renderAsListItem ? "list-item" : "button"
	});

	const disabled = isCopyButtonDisabled({
		byRow: renderOptions.config.enablements?.byRow ?? {},
		eventName: DefaultRepeatButtonNames.copy,
		rowIndex: DocumentPath.rowIndex(rowPath),
		state: renderOptions.state,
		repeat,
		totalNumberOfRows
	});

	return (
		<RowActionButton
			id={id}
			name="content_copy"
			title={getTitle("COPY")}
			onClick={onCopyClick}
			disabled={disabled}
			repeat={repeat}
			row={row}
			uiIdPrefix={props.renderOptions.config.uiIdPrefix}
		/>
	);
}
