// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Middleware } from "redux";

import { Commands, Events } from "../actions.js";
import type { EngineState } from "../store.js";

/**
 * @internal
 *
 * Listens to Events.onSectionChangeTriggered
 *
 * Dispatches Commands.setSectionStateEntry with the new state of the section.
 */
export const onSectionChangeMiddleware: Middleware<{}, EngineState> = api => next => action => {
	const result = next(action);

	if (Events.collapseSection.match(action)) {
		const { path, collapse } = action.payload;
		api.dispatch(
			Commands.setSectionsCollapsed({
				sections: [{ path, collapse }]
			})
		);
	}
	return result;
};
