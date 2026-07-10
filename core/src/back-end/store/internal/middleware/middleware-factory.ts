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
