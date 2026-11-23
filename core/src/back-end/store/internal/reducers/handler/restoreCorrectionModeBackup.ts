// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Action } from "typescript-fsa";

import type { Commands } from "../../actions.js";
import type { EngineStore } from "../../store.js";

/** @internal */
export function handleRestoreCorrectionModeBackup(
	state: EngineStore.UIState,
	action: Action<Commands.CorrectionMode.RestoreCorrectionModeBackupPayload>
): EngineStore.UIState {
	const sections = action.payload.backup.sections;
	const locations = action.payload.backup.location;
	const repeatStaticState = action.payload.backup.repeatStaticState;

	return {
		...state,
		sectionState: sections,
		screenLocation: locations,
		repeatStaticState,
		correctionModeBackup: undefined,
		backup: action.payload.backup.backups ? action.payload.backup.backups : [],
		validationBar: { visible: false, expanded: false, currentMessageKey: undefined }
	};
}
