// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
