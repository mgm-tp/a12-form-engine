// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { AnyAction, Dispatch } from "redux";

import type { GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import { Commands } from "../../actions.js";
import type { Change } from "../../documentChange.js";
import type { EngineState } from "../../store.js";

import { updateDataDirtyState } from "../updateDirtyState.js";

/**
 * @internal
 *
 * Updates the document in the redux state and sets the data dirty flag accordingly
 */
export function updateDocument(
	dispatch: Dispatch<AnyAction>,
	state: EngineState,
	document: GroupInstance,
	changes: Change[]
): void {
	dispatch(Commands.setDocument({ document, changes }));
	updateDataDirtyState(dispatch, state);
}
