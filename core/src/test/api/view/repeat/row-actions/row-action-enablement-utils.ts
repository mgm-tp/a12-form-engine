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

import type { EngineStore } from "../../../../../back-end/store/index.js";
import type { Models } from "../../../../../back-end/store/internal/store.js";
import { notUndefined } from "../../../../../client-extensions/internal/core/utils.js";
import type { EnablementByRow } from "../../../../../view/internal/configuration/engine-configuration.js";
import { DefaultRepeatButtonNames } from "../../../../../view/internal/configuration/engine-configuration.js";
import type { RtlRenderWrapper } from "../../../../rtl-utils/render-wrapper.js";
import { createDocumentPath } from "../../../../utils/createDocumentPath.js";
import { createModelPath } from "../../../../utils/createModelPath.js";
import {
	setupContentBoxRendererWithRtl,
	setupFormEngineRendererWithRtlAsync
} from "../../../../utils/setup.js";
import {
	DR_ROW_ACTIONS,
	IR_ATTACHMENT_COLLECTION,
	IR_ROW_ACTIONS
} from "../../../../utils/test-model-helpers/test-button-enablements.js";

export function setupForDetachedRepeat(options: {
	models: Models;
	document: object;
	readonly?: boolean;
	disabled?: boolean;
	enablementMap?: EnablementByRow;
	screenLocation?: EngineStore.ScreenState;
	screenDirty?: boolean;
	documentDirty?: boolean;
}): RtlRenderWrapper {
	const screenLocation: EngineStore.ScreenState[] = [
		{
			locationPath: createModelPath("rowActionButtons"),
			path: []
		},
		{
			locationPath: createModelPath(
				"rowActionButtons",
				"sec1",
				"detached-repeat",
				"detached-repeat-repeatableGroup1-detail-screen"
			),
			path: createDocumentPath(["root"], ["repeatableGroupDetachedRepeat", 2]),
			dirty: options.screenDirty
		}
	];

	return setupContentBoxRendererWithRtl({
		models: options.models,
		data: { document: options.document, dirty: options.documentDirty },
		ui: {
			readonly: options.readonly,
			disabled: options.disabled,
			screenLocation,
			dirty: options.documentDirty
		},
		config: {
			enablements: { byRow: options.enablementMap }
		}
	});
}

export function setupForEmbeddedRepeat(options: {
	models: Models;
	document: object;
	readonly?: boolean;
	disabled?: boolean;
	enablementMap?: EnablementByRow;
	screenLocation?: EngineStore.ScreenState[];
}): Promise<RtlRenderWrapper> {
	return setupFormEngineRendererWithRtlAsync({
		models: options.models,
		data: { document: options.document },
		ui: {
			readonly: options.readonly,
			disabled: options.disabled,
			screenLocation: options.screenLocation
		},
		config: {
			enablements: { byRow: options.enablementMap }
		}
	});
}

export function createEnablementMap(options: {
	entry: {
		[rowIndex: number]: {
			hidden?: boolean;
			disabled?: boolean;
		};
	};
}): EnablementByRow {
	const { entry } = options;

	return {
		["inline-repeat"]: {
			[IR_ROW_ACTIONS.BUTTONS.NAME_CUSTOM_ALWAYS_SHOWN_AND_ENABLED]: entry,
			[IR_ROW_ACTIONS.BUTTONS.NAME_CUSTOM_HIDDEN_IN_EDIT_MODE]: entry,
			[IR_ROW_ACTIONS.BUTTONS.NAME_CUSTOM_HIDDEN_IN_RO_MODE]: entry,
			[IR_ROW_ACTIONS.BUTTONS.NAME_CUSTOM_DISABLED_IN_EDIT_MODE]: entry,
			[IR_ROW_ACTIONS.BUTTONS.NAME_CUSTOM_DISABLED_IN_RO_MODE]: entry,
			[DefaultRepeatButtonNames.copy]: entry,
			[DefaultRepeatButtonNames.delete]: entry,
			[DefaultRepeatButtonNames.move]: entry
		},
		["detached-repeat"]: {
			[DefaultRepeatButtonNames.cancel_detached_repeat]: entry,
			[DefaultRepeatButtonNames.commit_detached_repeat]: entry,
			[DefaultRepeatButtonNames.edit]: entry
		},
		["embedded-repeat"]: {
			[DefaultRepeatButtonNames.edit]: entry
		},
		["inline-repeat-attachmentCollection"]: {
			[DefaultRepeatButtonNames.download]: entry
		}
	};
}

export type RowActionTestButton = Readonly<{
	repeatId: string;
	buttonId: string;
	listItemId: string;
}>;

export interface RowActionTestButtonEntry {
	description: string;
	button: RowActionTestButton;
}

export interface RowActionTestCell {
	cellId: string;
	buttons: RowActionTestButtonEntry[];
}

export type RowActionIdsOpts = Readonly<
	Partial<{
		edit: boolean;
		view: boolean;
		delete: boolean;
		move: boolean;
		copy: boolean;
		download: boolean;
		customAlwaysShownAndEnabled: boolean;
		customHiddenInEditMode: boolean;
		customHiddenInRoMode: boolean;
		customDisabledInEditMode: boolean;
		customDisabledInRoMode: boolean;
	}>
>;

export function createRowActionIds(options: RowActionIdsOpts): RowActionTestCell[] {
	return [
		{
			cellId: IR_ATTACHMENT_COLLECTION.COLUMNS.ID_DOWNLOAD,
			buttons: mkarray(
				options.download && {
					description: "download",
					button: {
						repeatId: IR_ATTACHMENT_COLLECTION.ID_REPEAT,
						buttonId: IR_ATTACHMENT_COLLECTION.BUTTONS.ID_DOWNLOAD,
						listItemId: IR_ATTACHMENT_COLLECTION.LIST_ITEMS.ID_DOWNLOAD
					}
				}
			)
		},
		{
			cellId: DR_ROW_ACTIONS.COLUMNS.ID,
			buttons: mkarray(
				options.edit && {
					description: "edit",
					button: {
						repeatId: DR_ROW_ACTIONS.ID_REPEAT,
						buttonId: DR_ROW_ACTIONS.BUTTONS.ID_EDIT,
						listItemId: DR_ROW_ACTIONS.LIST_ITEMS.ID_EDIT,
						cellId: DR_ROW_ACTIONS.COLUMNS.ID
					}
				},
				options.view && {
					description: "view",
					button: {
						repeatId: DR_ROW_ACTIONS.ID_REPEAT,
						buttonId: DR_ROW_ACTIONS.BUTTONS.ID_VIEW,
						listItemId: DR_ROW_ACTIONS.LIST_ITEMS.ID_VIEW,
						cellId: DR_ROW_ACTIONS.COLUMNS.ID
					}
				}
			)
		},
		{
			cellId: IR_ROW_ACTIONS.COLUMNS.ID,
			buttons: mkarray(
				options.delete && {
					description: "delete",
					button: {
						repeatId: IR_ROW_ACTIONS.ID_REPEAT,
						buttonId: IR_ROW_ACTIONS.BUTTONS.ID_REMOVE,
						listItemId: IR_ROW_ACTIONS.LIST_ITEMS.ID_REMOVE
					}
				},
				options.copy && {
					description: "copy",
					button: {
						repeatId: IR_ROW_ACTIONS.ID_REPEAT,
						buttonId: IR_ROW_ACTIONS.BUTTONS.ID_CLONE,
						listItemId: IR_ROW_ACTIONS.LIST_ITEMS.ID_CLONE
					}
				},
				options.move && {
					description: "move down",
					button: {
						repeatId: IR_ROW_ACTIONS.ID_REPEAT,
						buttonId: IR_ROW_ACTIONS.BUTTONS.ID_MOVE_DOWN,
						listItemId: IR_ROW_ACTIONS.LIST_ITEMS.ID_MOVE_DOWN
					}
				},
				options.move && {
					description: "move up",
					button: {
						repeatId: IR_ROW_ACTIONS.ID_REPEAT,
						buttonId: IR_ROW_ACTIONS.BUTTONS.ID_MOVE_UP,
						listItemId: IR_ROW_ACTIONS.LIST_ITEMS.ID_MOVE_UP
					}
				},
				options.customAlwaysShownAndEnabled && {
					description: "custom row action with scope === 'ALWAYS'",
					button: {
						repeatId: IR_ROW_ACTIONS.ID_REPEAT,
						buttonId: IR_ROW_ACTIONS.BUTTONS.ID_CUSTOM_ALWAYS_SHOWN_AND_ENABLED,
						listItemId: IR_ROW_ACTIONS.LIST_ITEMS.ID_CUSTOM_ALWAYS_SHOWN_AND_ENABLED
					}
				},
				options.customHiddenInRoMode && {
					description: "custom row action with scope === 'HIDDEN_IN_READONLY_MODE'",
					button: {
						repeatId: IR_ROW_ACTIONS.ID_REPEAT,
						buttonId: IR_ROW_ACTIONS.BUTTONS.ID_CUSTOM_HIDDEN_IN_RO_MODE,
						listItemId: IR_ROW_ACTIONS.LIST_ITEMS.ID_CUSTOM_HIDDEN_IN_RO_MODE
					}
				},
				options.customHiddenInEditMode && {
					description: "custom row action with scope === 'HIDDEN_IN_EDIT_MODE'",
					button: {
						repeatId: IR_ROW_ACTIONS.ID_REPEAT,
						buttonId: IR_ROW_ACTIONS.BUTTONS.ID_CUSTOM_HIDDEN_IN_EDIT_MODE,
						listItemId: IR_ROW_ACTIONS.LIST_ITEMS.ID_CUSTOM_HIDDEN_IN_EDIT_MODE
					}
				},
				options.customDisabledInEditMode && {
					description: "custom row action with scope === 'DISABLED_IN_EDIT_MODE'",
					button: {
						repeatId: IR_ROW_ACTIONS.ID_REPEAT,
						buttonId: IR_ROW_ACTIONS.BUTTONS.ID_CUSTOM_DISABLED_IN_EDIT_MODE,
						listItemId: IR_ROW_ACTIONS.LIST_ITEMS.ID_CUSTOM_DISABLED_IN_EDIT_MODE
					}
				},
				options.customDisabledInRoMode && {
					description: "custom row action with scope.readonly === 'DISABLED_IN_READONLY_MODE'",
					button: {
						repeatId: IR_ROW_ACTIONS.ID_REPEAT,
						buttonId: IR_ROW_ACTIONS.BUTTONS.ID_CUSTOM_DISABLED_IN_RO_MODE,
						listItemId: IR_ROW_ACTIONS.LIST_ITEMS.ID_CUSTOM_DISABLED_IN_RO_MODE
					}
				}
			)
		}
	];
}

function mkarray<T>(...e: (T | false | undefined)[]): T[] {
	return e.filter(notFalse).filter(notUndefined);
}

function notFalse<T>(a: T | false): a is T {
	return a !== false;
}
