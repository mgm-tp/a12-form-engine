// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ReactElement } from "react";
import { useContext } from "react";

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";

import { UiId } from "../../../../../../../../back-end/utils/internal/generateUiId.js";
import type { FormModel } from "../../../../../../../../models/internal/form-model.js";
import { DocumentPath } from "../../../../../../../../models/internal/utils/document-utils.js";
import type { FormModelMap } from "../../../../../../configuration/engine-configuration.js";
import { DefaultRepeatButtonNames } from "../../../../../../configuration/engine-configuration.js";
import { isStandardRowActionDisabled } from "../../../../../../utilities/enablements/disabled-row-actions.js";
import { isStandardRowActionHidden } from "../../../../../../utilities/enablements/hidden-row-actions.js";
import { MenuContext } from "../../MenuContext.js";
import type { RepeatRow } from "../../tableColumnTypes.js";

import type { GetTitle } from "./GetTitle.js";
import { RowActionButton } from "./RowActionButton.js";

/** @internal */
export function ViewRepeatRowAction(props: {
	repeat: FormModel.Repeat;
	row: RepeatRow;
	renderOptions: FormModelMap.RenderOptions;
	repeatFormModelPath: ModelPath;
	repeatReadonly?: boolean;
	getRef?(ref: HTMLElement): void;
	getTitle: GetTitle;
}): ReactElement | null {
	const { repeat, row, repeatFormModelPath, renderOptions, getRef, getTitle } = props;
	const renderAsListItem = useContext(MenuContext).renderAsListItem;

	const hidden = isStandardRowActionHidden({
		byRow: renderOptions.config.enablements?.byRow ?? {},
		eventName: DefaultRepeatButtonNames.edit,
		rowIndex: DocumentPath.rowIndex(row.path),
		state: renderOptions.state,
		repeat,
		enabledInModel: true,
		repeatReadonly: props.repeatReadonly
	});

	if (hidden) {
		return null;
	}

	const onViewClick = (event: React.MouseEvent<HTMLElement>) => {
		renderOptions.eventHandlers.repeat.enterRow(row.path, repeatFormModelPath);
		event.stopPropagation();
	};
	const id = UiId.generateForRowActionButton({
		uiIdPrefix: props.renderOptions.config.uiIdPrefix,
		repeat,
		rowIndex: row.path[row.path.length - 1].index,
		eventType: "view",
		buttonType: renderAsListItem ? "list-item" : "button"
	});

	return (
		<RowActionButton
			id={id}
			name="launch"
			title={getTitle("VIEW")}
			onClick={onViewClick}
			disabled={isStandardRowActionDisabled({
				byRow: renderOptions.config.enablements?.byRow ?? {},
				eventName: DefaultRepeatButtonNames.edit,
				rowIndex: DocumentPath.rowIndex(row.path),
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
