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

import type { Attachment } from "@com.mgmtp.a12.dataservices/dataservices-access/lib/Attachment/attachment.js";
import type {
	EntityInstancePath,
	GroupInstance
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import { DataSelectors } from "../../../../back-end/store/internal/selectors/data.js";
import { UiStateSelectors } from "../../../../back-end/store/internal/selectors/ui-state.js";
import type { EngineState } from "../../../../back-end/store/internal/store.js";
import type { FormModel } from "../../../../models/index.js";
import { DocumentUtils } from "../../../../models/internal/utils/document-utils.js";
import { RepeatUtils } from "../../components/form-engine/repeat/components/repeat-utils.js";
import type { EnablementByRow } from "../../configuration/engine-configuration.js";

import { checkScope } from "./enablement-utilities.js";

interface RowActionDisabled {
	readonly eventName: string;
	readonly rowIndex?: number;
	readonly state: EngineState;
	readonly byRow?: EnablementByRow;
	readonly repeat: FormModel.Repeat;
	readonly scope?: FormModel.ScopeEnum;
	readonly repeatReadonly?: boolean;
}

/** @internal */
export function isCustomRowActionDisabled(options: RowActionDisabled): boolean {
	const disabledByMap = isRowActionDisabledByEnablementMap(options);

	if (disabledByMap !== undefined) {
		return disabledByMap;
	}

	const isRepeatReadonly = options.repeatReadonly;

	const disabledByScope = checkScope(!!isRepeatReadonly, "DISABLED", options.scope);

	return disabledByScope || UiStateSelectors.disabled()(options.state);
}

/** @internal */
export function isStandardRowActionDisabled(options: RowActionDisabled): boolean {
	const disabledByMap = isRowActionDisabledByEnablementMap(options);

	if (disabledByMap !== undefined) {
		return disabledByMap;
	}

	return isFormDisabled(options);
}

/** @internal */
export function isCopyButtonDisabled(
	options: RowActionDisabled & { totalNumberOfRows: number }
): boolean {
	const { state, totalNumberOfRows, repeat } = options;

	const disabledByMap = isRowActionDisabledByEnablementMap(options);

	if (disabledByMap !== undefined) {
		return disabledByMap;
	}

	const enableAdd = RepeatUtils.mayAdd(repeat, totalNumberOfRows, state);

	return !enableAdd || isFormDisabled(options);
}

/**
 * Disable the download button when (in order of importance):
 * - attachment is unassigned
 * 	- (as this is a security restriction, it has to overwrite any enablement that is configured)
 * - configured via enablementMap
 * - relevant attachment values are missing
 * - form is disabled
 * @internal
 * */
export function isDownloadButtonDisabled(
	options: RowActionDisabled & {
		attachmentDocumentPath?: EntityInstancePath;
		unassignedIds?: string[];
	}
): boolean {
	const { state, attachmentDocumentPath } = options;

	const document = DataSelectors.document()(state) as GroupInstance;
	const value = (
		attachmentDocumentPath
			? DocumentUtils.getValue({ document, path: attachmentDocumentPath })
			: undefined
	) as Attachment | undefined;
	if (value?.attachment_id && options.unassignedIds?.includes(value.attachment_id)) {
		return true;
	}

	const disabledByMap = isRowActionDisabledByEnablementMap(options);

	if (disabledByMap !== undefined) {
		return disabledByMap;
	}

	return (
		!DocumentUtils.isGroupInstance(value) || !value.original_filename || isFormDisabled(options)
	);
}

/** @internal */
export function isCommitButtonDisabled(
	options: RowActionDisabled & { buttonEnablement?: FormModel.ButtonEnablementEnum }
): boolean {
	const disabledByMap = isRowActionDisabledByEnablementMap(options);
	if (disabledByMap !== undefined) {
		return disabledByMap;
	}

	const screenDirty = UiStateSelectors.currentScreenLocation()(options.state).dirty;
	const disabledByDirtyState = options.buttonEnablement === "DISABLED" && !screenDirty;

	return disabledByDirtyState || isFormDisabled(options);
}

function isFormDisabled(options: RowActionDisabled): boolean {
	return (
		UiStateSelectors.disabled()(options.state) ||
		UiStateSelectors.correctionModeBackup()(options.state) !== undefined
	);
}

function isRowActionDisabledByEnablementMap(options: RowActionDisabled): boolean | undefined {
	const repeatEntry = options.byRow?.[options.repeat.name] ?? {};
	const buttonEntry = repeatEntry[options.eventName];
	if (buttonEntry === undefined) {
		return;
	}

	if (options.rowIndex !== undefined) {
		const rowKey = Object.keys(buttonEntry).find(key => key === String(options.rowIndex));
		if (rowKey !== undefined) {
			const rowEntry = buttonEntry[rowKey];
			if (rowEntry?.disabled !== undefined) {
				return rowEntry.disabled;
			}
		}
	}

	const rowEntryZero = buttonEntry["0"];
	if (rowEntryZero?.disabled !== undefined) {
		return rowEntryZero.disabled;
	}

	return undefined;
}
