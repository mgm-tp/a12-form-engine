// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ReactElement } from "react";
import { useContext } from "react";

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";

import { UiId } from "../../../../../../../../back-end/utils/internal/generateUiId.js";
import { DocumentPath } from "../../../../../../../../models/index.js";
import type { FormModel } from "../../../../../../../../models/index.js";
import type { FormModelMap } from "../../../../../../configuration/engine-configuration.js";
import { DefaultRepeatButtonNames } from "../../../../../../configuration/engine-configuration.js";
import { isStandardRowActionDisabled } from "../../../../../../utilities/enablements/disabled-row-actions.js";
import { isStandardRowActionHidden } from "../../../../../../utilities/enablements/hidden-row-actions.js";
import { MenuContext } from "../../MenuContext.js";
import type { RepeatRow } from "../../tableColumnTypes.js";

import type { GetTitle } from "./GetTitle.js";
import { RowActionButton } from "./RowActionButton.js";

/** @internal */
export function EditRepeatRowAction(props: {
	repeat: FormModel.Repeat;
	row: RepeatRow;
	renderOptions: FormModelMap.RenderOptions;
	repeatFormModelPath: ModelPath;
	repeatReadonly?: boolean;
	getRef?(ref: HTMLElement): void;
	getTitle: GetTitle;
}): ReactElement | null {
	const { repeat, row, repeatFormModelPath, renderOptions, getTitle, getRef } = props;
	const rowPath = row.path;

	const renderAsListItem = useContext(MenuContext).renderAsListItem;

	const hidden = isStandardRowActionHidden({
		byRow: renderOptions.config.enablements?.byRow ?? {},
		eventName: DefaultRepeatButtonNames.edit,
		rowIndex: DocumentPath.rowIndex(rowPath),
		state: renderOptions.state,
		repeat,
		enabledInModel: true,
		repeatReadonly: props.repeatReadonly
	});

	if (hidden) {
		return null;
	}

	const onEditClick = (event: React.MouseEvent<HTMLElement>) => {
		renderOptions.eventHandlers.repeat.enterRow(rowPath, repeatFormModelPath, "edit-button");
		event.stopPropagation();
	};
	const id = UiId.generateForRowActionButton({
		uiIdPrefix: props.renderOptions.config.uiIdPrefix,
		repeat,
		rowIndex: rowPath[rowPath.length - 1].index,
		eventType: "edit",
		buttonType: renderAsListItem ? "list-item" : "button"
	});

	return (
		<RowActionButton
			id={id}
			key={id}
			name="edit"
			title={getTitle("EDIT")}
			onClick={onEditClick}
			disabled={isStandardRowActionDisabled({
				byRow: renderOptions.config.enablements?.byRow ?? {},
				eventName: DefaultRepeatButtonNames.edit,
				rowIndex: DocumentPath.rowIndex(rowPath),
				state: renderOptions.state,
				repeat
			})}
			getRef={getRef}
			repeat={repeat}
			row={row}
			uiIdPrefix={props.renderOptions.config.uiIdPrefix}
		/>
	);
}
