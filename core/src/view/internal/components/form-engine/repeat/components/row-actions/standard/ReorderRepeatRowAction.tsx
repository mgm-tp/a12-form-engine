// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ReactElement } from "react";
import { useContext } from "react";

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";

import { UiId } from "../../../../../../../../back-end/utils/internal/generateUiId.js";
import type { FormModel } from "../../../../../../../../models/internal/form-model.js";
import { DocumentPath } from "../../../../../../../../models/internal/utils/document-utils.js";
import { ComponentMapContext } from "../../../../../../configuration/componentMap/component-map-context.js";
import { DefaultRepeatButtonNames } from "../../../../../../configuration/engine-configuration.js";
import type { FormModelMap } from "../../../../../../configuration/engine-configuration.js";
import { isStandardRowActionDisabled } from "../../../../../../utilities/enablements/disabled-row-actions.js";
import { isStandardRowActionHidden } from "../../../../../../utilities/enablements/hidden-row-actions.js";
import { MenuContext } from "../../MenuContext.js";
import type { RepeatRow } from "../../tableColumnTypes.js";

import type { GetTitle } from "./GetTitle.js";
import { showMoveButton } from "./showMoveButton.js";

/** @internal */
export function ReorderRepeatRowAction(props: {
	config: FormModelMap.RenderConfiguration;
	repeat: FormModel.Repeat;
	row: RepeatRow;
	repeatFormModelPath: ModelPath;
	repeatReadonly?: boolean;
	renderOptions: FormModelMap.RenderOptions;
	upDisabled: boolean;
	downDisabled: boolean;
	getTitle: GetTitle;
}): ReactElement | null {
	const { config, repeat, row, renderOptions, upDisabled, downDisabled, getTitle } = props;
	const rowPath = row.path;
	const renderAsListItem = useContext(MenuContext).renderAsListItem;
	const { ReorderButton } = useContext(ComponentMapContext);

	const hidden = isStandardRowActionHidden({
		byRow: renderOptions.config.enablements?.byRow ?? {},
		eventName: DefaultRepeatButtonNames.move,
		rowIndex: DocumentPath.rowIndex(rowPath),
		state: renderOptions.state,
		repeat,
		enabledInModel: showMoveButton(config, repeat),
		repeatReadonly: props.repeatReadonly
	});

	if (hidden) {
		return null;
	}

	const disabled = isStandardRowActionDisabled({
		byRow: renderOptions.config.enablements?.byRow ?? {},
		eventName: DefaultRepeatButtonNames.move,
		rowIndex: DocumentPath.rowIndex(rowPath),
		state: renderOptions.state,
		repeat
	});

	const p = {
		onUp: () => {
			renderOptions.eventHandlers.repeat.onMoveRow(props.repeatFormModelPath, rowPath, -1);
		},

		onDown: () => {
			renderOptions.eventHandlers.repeat.onMoveRow(props.repeatFormModelPath, rowPath, 1);
		},
		upDisabled: upDisabled || disabled,
		downDisabled: downDisabled || disabled
	};
	const uiIdUpButton = UiId.generateForRowActionButton({
		uiIdPrefix: props.renderOptions.config.uiIdPrefix,
		repeat,
		rowIndex: rowPath[rowPath.length - 1].index,
		eventType: "up",
		buttonType: renderAsListItem ? "list-item" : "button"
	});

	const uiIdDownButton = UiId.generateForRowActionButton({
		uiIdPrefix: props.renderOptions.config.uiIdPrefix,
		repeat,
		rowIndex: rowPath[rowPath.length - 1].index,
		eventType: "down",
		buttonType: renderAsListItem ? "list-item" : "button"
	});

	return (
		<ReorderButton
			key="move"
			uiIdDownButton={uiIdDownButton}
			uiIdUpButton={uiIdUpButton}
			upButtonTitle={getTitle("UP")}
			downButtonTitle={getTitle("DOWN")}
			repeat={repeat}
			row={row}
			uiIdPrefix={props.renderOptions.config.uiIdPrefix}
			{...p}
		/>
	);
}
