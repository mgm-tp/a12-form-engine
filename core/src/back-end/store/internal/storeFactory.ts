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

import type { Locale } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import { EmptyDocument } from "../../../models/internal/utils/document-utils.js";

import type { EngineState, EngineStore, Models } from "./store.js";

/**
 * Function to create an engine store.
 * @param state
 * 		* data: a partial {@link EngineStore.DataState}.
 * 				If no document is given, it will be created.
 * 		* models: the {@link Models}
 * 		* ui: a partial {@link EngineStore.UIState}.
 * 			 A default value will be set for all parts which are not given
 * 			 and which are not optional.
 * 		* locale: the `Locale`
 */
export function createEngineStore(state: {
	readonly data: Partial<EngineStore.DataState>;
	readonly models: Models;
	readonly ui?: Partial<EngineStore.UIState>;
	readonly locale: Locale;
}): EngineState {
	const engineState: EngineState = {
		locale: state.locale,
		models: state.models,
		data: {
			dirty: state.data.dirty || false,
			document:
				state.data && state.data.document
					? state.data.document
					: EmptyDocument.createEmptyDocument(state.models.documentModel, state.models.formModel),
			attachmentState: state.data.attachmentState
		},
		ui: createUIState({
			...state.ui,
			screenLocation: state.ui?.screenLocation || [
				{
					locationPath: [{ elementName: state.models.formModel.content.screens[0].name }],
					path: [],
					focusedComponent: undefined
				}
			]
		})
	};

	return engineState;
}

/**
 * Enhances the provided partial uiState with default values.
 *
 * NOTE: You need to provide a non-empty screenLocation. Otherwise, an error will be thrown by the form engine.
 */
export function createUIState(
	uiState: Pick<EngineStore.UIState, "screenLocation"> & Partial<EngineStore.UIState>
): EngineStore.UIState {
	return {
		...uiState,
		dirty: uiState.dirty || false,
		backup: uiState.backup || [],
		screenLocation: uiState.screenLocation,
		sectionState: uiState.sectionState || {},
		messages: uiState.messages || {},
		disabled: uiState.disabled === true,
		readonly: uiState.readonly === true,
		correctionScreen: uiState.correctionScreen || { visible: false, showDetailsState: {} },
		validationBar: uiState.validationBar || {
			visible: false,
			expanded: false,
			currentMessageKey: undefined
		}
	};
}
