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

import type { TableDragDropOptions } from "@com.mgmtp.a12.widgets/widgets-core";

import { UiStateSelectors } from "../../../../../../back-end/store/internal/selectors/ui-state.js";
import type { FormModel } from "../../../../../../models/internal/form-model.js";
import type { FormModelMap } from "../../../../configuration/engine-configuration.js";
import { DefaultRepeatButtonNames } from "../../../../configuration/engine-configuration.js";
import { isStandardRowActionDisabled } from "../../../../utilities/enablements/disabled-row-actions.js";
import { isStandardRowActionHidden } from "../../../../utilities/enablements/hidden-row-actions.js";
import { InternalDocumentPath } from "../../../../../../models/internal/utils/document-utils.js";

import { showMoveButton } from "./row-actions/standard/showMoveButton.js";
import type { RepeatRow } from "./tableColumnTypes.js";

/**
 * @internal
 */
export function getDndOptions(
	repeat: FormModel.Repeat,
	repeatUid: string,
	config: FormModelMap.RenderConfiguration,
	repeatReadonly: boolean
): TableDragDropOptions<RepeatRow> | undefined {
	const moveHiddenInRepeat = isStandardRowActionHidden({
		eventName: DefaultRepeatButtonNames.move,
		state: config.renderOptions.state,
		repeat,
		enabledInModel: showMoveButton(config, repeat),
		repeatReadonly
	});

	// "disabled" state of FE is intentionally left out here since dnd is not possible anyways
	const inCorrectionMode =
		UiStateSelectors.correctionModeBackup()(config.renderOptions.state) !== undefined;

	return moveHiddenInRepeat || inCorrectionMode
		? undefined
		: createDndOptions(repeat, repeatUid, config);
}

/**
 * NOTE: the uid of the repeat is set to constrain dnd to rows of the same repeat
 *
 * When customizing the options to allow DND in other repeats, this will not work
 * because `acceptType` does not allow setting `string[]`.
 * Instead, `acceptType` would need to be set to undefined and a `canDrop()` implementation
 * would need to be added.
 * @internal
 */
export function createDndOptions(
	repeat: FormModel.Repeat,
	repeatUid: string,
	{ renderOptions, parentPath }: FormModelMap.RenderConfiguration
): TableDragDropOptions<RepeatRow> {
	return {
		acceptType: repeatUid,
		canDrag({ dragItem }) {
			const moveDisabledForRow = isStandardRowActionDisabled({
				eventName: DefaultRepeatButtonNames.move,
				rowIndex: InternalDocumentPath.rowIndex(dragItem.row.path),
				state: renderOptions.state,
				repeat
			});

			return !moveDisabledForRow;
		},
		onDrop({ dragItem, dropResult }) {
			const rowPath = dragItem.row.path;

			const newIdx = dropResult.rowIndex;
			const oldIdx = dragItem.rowIndex;

			const delta = newIdx > oldIdx ? newIdx - oldIdx - 1 : newIdx - oldIdx;
			if (delta !== 0) {
				renderOptions.eventHandlers.repeat.onMoveRow(parentPath, rowPath, delta);
			}
		}
	};
}
