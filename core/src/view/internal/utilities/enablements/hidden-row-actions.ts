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

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api";

import { ModelSelectors } from "../../../../back-end/store/internal/selectors/models.js";
import { UiStateSelectors } from "../../../../back-end/store/internal/selectors/ui-state.js";
import type { EngineState } from "../../../../back-end/store/internal/store.js";
import type { FormModel } from "../../../../models/index.js";
import {
	isFormModelDetachedRepeat,
	isFormModelEmbeddedRepeat
} from "../../../../models/internal/FormModelGuards.js";
import type { EnablementByRow } from "../../configuration/engine-configuration.js";
import { DefaultRepeatButtonNames } from "../../configuration/engine-configuration.js";

import { checkScope } from "./enablement-utilities.js";

/** @internal */
export interface RowActionHidden {
	readonly eventName: string;
	readonly rowIndex?: number;
	readonly state: EngineState;
	readonly byRow?: EnablementByRow;
	readonly repeat: FormModel.Repeat;
	readonly enabledInModel?: boolean;
	readonly repeatReadonly?: boolean;
}

/** @internal */
export function isStandardRowActionHidden(options: RowActionHidden): boolean {
	const hiddenByMap = isRowActionHiddenByEnablementMap(options);
	if (hiddenByMap !== undefined) {
		return hiddenByMap;
	}

	if (!options.enabledInModel) {
		return true;
	}

	if (options.eventName === DefaultRepeatButtonNames.commit_detached_repeat) {
		return isCommitButtonHidden(options);
	}

	if (
		options.eventName !== DefaultRepeatButtonNames.edit &&
		options.eventName !== DefaultRepeatButtonNames.cancel_detached_repeat &&
		options.eventName !== DefaultRepeatButtonNames.download
	) {
		return options.repeatReadonly || UiStateSelectors.readonly()(options.state);
	}

	return isRowActionHiddenByDefaultRowActionFlag({
		eventName: options.eventName,
		repeat: options.repeat
	});
}

/** @internal */
export function isCommitButtonHidden(options: RowActionHidden): boolean {
	const formModel = ModelSelectors.formModel()(options.state);

	const screenDirty = UiStateSelectors.currentScreenLocation()(options.state).dirty;
	const hiddenByDirtyState =
		formModel.content.detachedRepeatCommitButtonEnablement === "HIDDEN" && !screenDirty;

	return hiddenByDirtyState;
}

/** @internal */
export function isCustomRowActionHidden(
	options: RowActionHidden & {
		repeatFormModelPath: ModelPath;
		scope?: FormModel.ScopeEnum;
	}
): boolean {
	const hiddenByMap = isRowActionHiddenByEnablementMap(options);

	if (hiddenByMap !== undefined) {
		return hiddenByMap;
	}

	const isRepeatReadonly = options.repeatReadonly;

	const hiddenByScope = checkScope(!!isRepeatReadonly, "HIDDEN", options.scope);

	return (
		hiddenByScope ||
		isRowActionHiddenByDefaultRowActionFlag({
			eventName: options.eventName,
			custom: true,
			repeat: options.repeat
		})
	);
}

/** @internal */
export function isRowActionHiddenByEnablementMap(options: RowActionHidden): boolean | undefined {
	const repeatEntry = options.byRow?.[options.repeat.name] ?? {};
	const buttonEntry = repeatEntry[options.eventName];
	if (buttonEntry !== undefined) {
		if (options.rowIndex !== undefined) {
			const rowKey = Object.keys(buttonEntry).find(key => key === String(options.rowIndex));
			if (rowKey !== undefined) {
				const rowEntry = buttonEntry[rowKey];
				if (rowEntry?.hidden !== undefined) {
					return rowEntry.hidden;
				}
			}
		}

		const rowEntryZero = buttonEntry["0"];
		if (rowEntryZero?.hidden !== undefined) {
			return rowEntryZero.hidden;
		}
	}

	return undefined;
}

function isRowActionHiddenByDefaultRowActionFlag(options: {
	eventName: string;
	custom?: boolean;
	repeat: FormModel.Repeat;
}): boolean {
	const { eventName, custom, repeat } = options;

	if (isFormModelDetachedRepeat(repeat) || isFormModelEmbeddedRepeat(repeat)) {
		const defaultRowAction = repeat.defaultRowAction;

		if (defaultRowAction && areEventsEqual({ eventName, custom, defaultRowAction })) {
			return !!defaultRowAction.hideButton;
		}
	}

	return false;
}

function areEventsEqual(options: {
	eventName: string;
	custom?: boolean;
	defaultRowAction: FormModel.DefaultRowAction;
}): boolean {
	const { eventName, custom, defaultRowAction } = options;

	if (custom) {
		return eventName === defaultRowAction.event;
	}

	// FIXME: Refactor DefaultRowAction to use the DefaultRepeatButtonNames ???
	return (
		(eventName === DefaultRepeatButtonNames.edit && defaultRowAction.event === "edit") ||
		(eventName === DefaultRepeatButtonNames.download && defaultRowAction.event === "download")
	);
}
