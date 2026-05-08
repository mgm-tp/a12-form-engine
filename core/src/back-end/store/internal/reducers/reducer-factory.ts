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

import type { Reducer } from "redux";
import type { AnyAction } from "typescript-fsa";

import type { Locale } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import { Commands } from "../actions.js";
import { engineState } from "../selectors/engineState.js";
import type { EngineState, EngineStore } from "../store.js";

import { handleChangeRepeatInstanceStateEntry } from "./handler/changeRepeatInstanceStateEntry.js";
import { handleChangeRepeatStaticStateEntry } from "./handler/changeRepeatStaticStateEntry.js";
import { handleChangeScreen } from "./handler/changeScreen.js";
import { handleChangeScreenState } from "./handler/changeScreenState.js";
import { handleSetValidationBarState } from "./handler/changeValidationBarState.js";
import { handleClearUserConfirmation } from "./handler/clearUserConfirmation.js";
import { handleDropBackup } from "./handler/dropBackup.js";
import { handleDropScreen } from "./handler/dropScreen.js";
import { handlePushBackup } from "./handler/pushBackup.js";
import { handlePushScreen } from "./handler/pushScreen.js";
import { handleRestoreCorrectionModeBackup } from "./handler/restoreCorrectionModeBackup.js";
import { handleSetColumnWidth } from "./handler/setColumnWidth.js";
import { handleSetCorrectionModeBackup } from "./handler/setCorrectionModeBackup.js";
import { handleSetCorrectionScreen } from "./handler/setCorrectionScreen.js";
import { handleSetDataDirty } from "./handler/setDataDirty.js";
import { handleSetDisabled } from "./handler/setDisabled.js";
import { handleSetDocument } from "./handler/setDocument.js";
import { handleSetLocale } from "./handler/setLocale.js";
import { handleSetLocationStack } from "./handler/setLocationStack.js";
import { handleSetMessageState } from "./handler/setMessageState.js";
import { handleSetMessageStateEntry } from "./handler/setMessageStateEntry.js";
import { handleSetModels } from "./handler/setModels.js";
import { handleSetReadonly } from "./handler/setReadonly.js";
import { handleSetRepeatStaticState } from "./handler/setRepeatStaticState.js";
import { handleSetSectionState } from "./handler/setSectionState.js";
import { handleSetUIDirty } from "./handler/setUIDirty.js";
import { handleUserConfirmationRequested } from "./handler/setUserConfirmationRequested.js";

/**
 * Combined reducer for all state slices.
 * Before the reducers are applied the structure of the given state is checked.
 * @throws if the structure of the given state is not valid
 */
export function createCombinedReducer(initialState: EngineState): Reducer<EngineState> {
	engineState(initialState); // check that structure is OK

	return (state = initialState, action) => ({
		locale: localeReducer(state.locale, action),
		ui: uiReducer(state.ui, action, state.models),
		data: dataReducer(state.data, action),
		models: modelsReducer(state.models, action)
	});
}

/**
 * Reducer for the locale
 */
export function localeReducer(localeState: Locale, action: AnyAction): Locale {
	if (Commands.setLocale.match(action)) {
		return handleSetLocale(localeState, action);
	} else {
		return localeState;
	}
}

/**
 * Reducer for the UI state.
 */
export function uiReducer(
	uiState: EngineStore.UIState,
	action: AnyAction,
	models: EngineState["models"]
): EngineStore.UIState {
	if (Commands.setMessageStateEntry.match(action)) {
		return handleSetMessageStateEntry(uiState, action);
	} else if (Commands.pushBackup.match(action)) {
		return handlePushBackup(uiState, action);
	} else if (Commands.pushScreen.match(action)) {
		return handlePushScreen(uiState, action);
	} else if (Commands.changeRepeatStaticStateEntry.match(action)) {
		return handleChangeRepeatStaticStateEntry(uiState, action);
	} else if (Commands.changeRepeatInstanceStateEntry.match(action)) {
		return handleChangeRepeatInstanceStateEntry(uiState, action);
	} else if (Commands.setRepeatStaticState.match(action)) {
		return handleSetRepeatStaticState(uiState, action);
	} else if (Commands.setMessageState.match(action)) {
		return handleSetMessageState(uiState, action, models);
	} else if (Commands.dropBackup.match(action)) {
		return handleDropBackup(uiState);
	} else if (Commands.dropScreen.match(action)) {
		return handleDropScreen(uiState);
	} else if (Commands.setSectionsCollapsed.match(action)) {
		return handleSetSectionState(uiState, action);
	} else if (Commands.changeScreen.match(action)) {
		return handleChangeScreen(uiState, action);
	} else if (Commands.setDisabled.match(action)) {
		return handleSetDisabled(uiState, action);
	} else if (Commands.setReadonly.match(action)) {
		return handleSetReadonly(uiState, action);
	} else if (Commands.CorrectionMode.setValidationBarState.match(action)) {
		return handleSetValidationBarState(uiState, action);
	} else if (Commands.CorrectionMode.setCorrectionModeBackup.match(action)) {
		return handleSetCorrectionModeBackup(uiState, action);
	} else if (Commands.setLocationStack.match(action)) {
		return handleSetLocationStack(uiState, action);
	} else if (Commands.CorrectionMode.setCorrectionScreenState.match(action)) {
		return handleSetCorrectionScreen(uiState, action);
	} else if (Commands.CorrectionMode.restoreCorrectionModeBackup.match(action)) {
		return handleRestoreCorrectionModeBackup(uiState, action);
	} else if (Commands.changeScreenState.match(action)) {
		return handleChangeScreenState(uiState, action);
	} else if (Commands.setUIDirty.match(action)) {
		return handleSetUIDirty(uiState, action);
	} else if (Commands.userConfirmationRequested.match(action)) {
		return handleUserConfirmationRequested(uiState, action);
	} else if (Commands.clearUserConfirmation.match(action)) {
		return handleClearUserConfirmation(uiState);
	} else if (Commands.setColumnWidth.match(action)) {
		return handleSetColumnWidth(uiState, action);
	} else {
		return uiState;
	}
}

/**
 * Reducer for the data state.
 */
export function dataReducer(
	dataState: EngineStore.DataState,
	action: AnyAction
): EngineStore.DataState {
	if (Commands.setDocument.match(action)) {
		return handleSetDocument(dataState, action);
	} else if (Commands.setDataDirty.match(action)) {
		return handleSetDataDirty(dataState, action);
	} else {
		return dataState;
	}
}

/**
 * Reducer to replace the models
 */
export function modelsReducer(
	modelsState: EngineState["models"],
	action: AnyAction
): EngineState["models"] {
	if (Commands.setModels.match(action)) {
		return handleSetModels(modelsState, action);
	} else {
		return modelsState;
	}
}
