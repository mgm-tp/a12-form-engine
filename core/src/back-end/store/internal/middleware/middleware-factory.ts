// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Middleware } from "redux";

import { createDefaultMiddlewareOptions } from "../Defaults.js";

import type { MiddlewareOptions } from "./middleware-options.js";

import { Middlewares } from "./index.js";

/**
 * Function to setup the middlewares with the given options.
 * @param options of type {@link MiddlewareOptions} to configure the middlewares
 */
export function createEngineMiddlewares(options?: Partial<MiddlewareOptions>): Middleware[] {
	const mwo = createDefaultMiddlewareOptions(options);
	return [
		Middlewares.addButtonRepeatMiddlewareFactory(mwo),
		Middlewares.editButtonRepeatMiddleware,
		Middlewares.leaveDetachedRepeatRowMiddleware(mwo),
		Middlewares.onNavigationButtonClickedMiddleware,
		Middlewares.onEventButtonClickedMiddleware,
		Middlewares.onPageChangeMiddleware,
		Middlewares.onSortingChangeMiddleware,
		Middlewares.onValueChangeMiddlewareFactory(mwo),
		Middlewares.removeRepeatRowMiddleware(mwo),
		Middlewares.onSectionChangeMiddleware,
		Middlewares.filterButtonRepeatTriggeredMiddleware,
		Middlewares.onFilterChangeMiddlewareFactory(),
		Middlewares.moveRepeatRowMiddleware,
		Middlewares.cloneButtonRepeatMiddlewareFactory(mwo),
		Middlewares.onLeaveRowMiddlewareFactory(mwo),
		Middlewares.clearFiltersMiddleware,
		Middlewares.validatePartMiddlewareFactory(mwo),
		Middlewares.validateFullMiddlewareFactory(mwo),
		Middlewares.onExpansionChangeTriggeredMiddleware,
		Middlewares.onMessageChangeTriggeredMiddleware,
		Middlewares.onGotoToElementMiddleware,
		Middlewares.onSetCorrectionScreenStateTriggeredMiddleware,
		Middlewares.onShowDetailsTriggeredMiddleware,
		Middlewares.exitCorrectionModeTriggeredMiddleware,
		Middlewares.onInputTouchedMiddleware,
		Middlewares.onRevalidateMiddleware,
		Middlewares.resetRecentlyAddNewOnNextEventMiddleware,
		Middlewares.closeEmbeddedRepeatRowMiddleware(mwo),
		Middlewares.onLeaveTableMiddlewareFactory(mwo),
		Middlewares.onColumnWidthChangeMiddleware,
		Middlewares.onUserConfirmationResponseMiddleware,
		Middlewares.multiFileUploadMiddlewareFactory(mwo)
	];
}
