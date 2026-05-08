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
 * 1. Open-Source License – EUPL v1.2
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
