// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Middleware } from "redux";

import { Commands, Events } from "../../actions.js";
import type { EngineState } from "../../store.js";

/**
 * @internal
 *
 * Listens to Events.Repeat.changeColumnWidth
 *
 * Dispatches Commands.changeScreenRepeatState with the new page.
 */
export const onColumnWidthChangeMiddleware: Middleware<{}, EngineState> = api => next => action => {
	const result = next(action);
	if (Events.Repeat.changeColumnWidth.match(action)) {
		api.dispatch(
			Commands.setColumnWidth({
				columnPath: action.payload.columnPath,
				width: action.payload.width
			})
		);
	}
	return result;
};
