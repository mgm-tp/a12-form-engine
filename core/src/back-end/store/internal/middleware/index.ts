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

import { exitCorrectionModeTriggeredMiddleware } from "./correction-mode/exitCorrectionModeMiddleware.js";
import { onExpansionChangeTriggeredMiddleware } from "./correction-mode/onExpansionStateChangeMiddleware.js";
import { onGotoToElementMiddleware } from "./correction-mode/onGotoMessageMiddleware.js";
import { onMessageChangeTriggeredMiddleware } from "./correction-mode/onMessageChangeMiddleware.js";
import { onRevalidateMiddleware } from "./correction-mode/onRevalidateMiddleware.js";
import { onSetCorrectionScreenStateTriggeredMiddleware } from "./correction-mode/onSetCorrectionScreenMiddleware.js";
import { onShowDetailsTriggeredMiddleware } from "./correction-mode/onShowDetailsMiddleware.js";
import { onEventButtonClickedMiddleware } from "./onEventButtonClickedMiddleware.js";
import { onInputTouchedMiddleware } from "./onInputTouchedMiddleware.js";
import { onNavigationButtonClickedMiddleware } from "./onNavigationButtonClickedMiddleware.js";
import { onSectionChangeMiddleware } from "./onSectionChangeMiddleware.js";
import { onUserConfirmationResponseMiddleware } from "./onUserConfirmationResponseMiddleware.js";
import { onValueChangeMiddlewareFactory } from "./onValueChangeMiddleware.js";
import { addButtonRepeatMiddlewareFactory } from "./repeat/addButtonRepeatMiddleware.js";
import { clearFiltersMiddleware } from "./repeat/clearFiltersMiddleware.js";
import { cloneButtonRepeatMiddlewareFactory } from "./repeat/cloneButtonRepeatMiddleware.js";
import { closeEmbeddedRepeatRowMiddleware } from "./repeat/closeButtonEmbeddedRepeatMiddleware.js";
import { editButtonRepeatMiddleware } from "./repeat/editButtonRepeatMiddleware.js";
import { filterButtonRepeatTriggeredMiddleware } from "./repeat/filterButtonRepeatMiddleware.js";
import { leaveDetachedRepeatRowMiddleware } from "./repeat/leaveDetachedRepeatRowMiddleware.js";
import { moveRepeatRowMiddleware } from "./repeat/moveRepeatRowMiddleware.js";
import { multiFileUploadMiddlewareFactory } from "./repeat/multiFileUploadMiddleware.js";
import { onColumnWidthChangeMiddleware } from "./repeat/onColumnWidthChangeMiddleware.js";
import { onFilterChangeMiddlewareFactory } from "./repeat/onFilterChangeMiddleware.js";
import { onLeaveRowMiddlewareFactory } from "./repeat/onLeaveRowMiddleware.js";
import { onLeaveTableMiddlewareFactory } from "./repeat/onLeaveTableMiddleware.js";
import { onPageChangeMiddleware } from "./repeat/onPageChangeMiddleware.js";
import { onSortingChangeMiddleware } from "./repeat/onSortingChangeMiddleware.js";
import { removeRepeatRowMiddleware } from "./repeat/removeRepeatRowMiddleware.js";
import { resetRecentlyAddNewOnNextEventMiddleware } from "./repeat/resetRecentlyAddNewOnNextEventMiddleware.js";
import { validateFullMiddlewareFactory } from "./validateFullMiddleware.js";
import { validatePartMiddlewareFactory } from "./validatePartMiddleware.js";

/** @internal */
export const Middlewares = {
	exitCorrectionModeTriggeredMiddleware,
	onExpansionChangeTriggeredMiddleware,
	onGotoToElementMiddleware,
	onMessageChangeTriggeredMiddleware,
	onRevalidateMiddleware,
	onSetCorrectionScreenStateTriggeredMiddleware,
	onShowDetailsTriggeredMiddleware,
	onEventButtonClickedMiddleware,
	onInputTouchedMiddleware,
	onNavigationButtonClickedMiddleware,
	onSectionChangeMiddleware,
	onUserConfirmationResponseMiddleware,
	onValueChangeMiddlewareFactory,
	addButtonRepeatMiddlewareFactory,
	clearFiltersMiddleware,
	cloneButtonRepeatMiddlewareFactory,
	closeEmbeddedRepeatRowMiddleware,
	editButtonRepeatMiddleware,
	filterButtonRepeatTriggeredMiddleware,
	leaveDetachedRepeatRowMiddleware,
	moveRepeatRowMiddleware,
	multiFileUploadMiddlewareFactory,
	onColumnWidthChangeMiddleware,
	onFilterChangeMiddlewareFactory,
	onLeaveRowMiddlewareFactory,
	onLeaveTableMiddlewareFactory,
	onPageChangeMiddleware,
	onSortingChangeMiddleware,
	removeRepeatRowMiddleware,
	resetRecentlyAddNewOnNextEventMiddleware,
	validateFullMiddlewareFactory,
	validatePartMiddlewareFactory
};
