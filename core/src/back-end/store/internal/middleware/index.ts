// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
