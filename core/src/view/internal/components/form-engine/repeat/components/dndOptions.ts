// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { TableDragDropOptions } from "@com.mgmtp.a12.widgets/widgets-core/lib/table/new-api/table.api.js";

import { UiStateSelectors } from "../../../../../../back-end/store/internal/selectors/ui-state.js";
import type { FormModel } from "../../../../../../models/internal/form-model.js";
import { DocumentPath } from "../../../../../../models/internal/utils/document-utils.js";
import type { FormModelMap } from "../../../../configuration/engine-configuration.js";
import { DefaultRepeatButtonNames } from "../../../../configuration/engine-configuration.js";
import { isStandardRowActionDisabled } from "../../../../utilities/enablements/disabled-row-actions.js";
import { isStandardRowActionHidden } from "../../../../utilities/enablements/hidden-row-actions.js";

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
				rowIndex: DocumentPath.rowIndex(dragItem.row.path),
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
