// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

/**
 * This module contains all Redux functionality of the Form-Engine.
 *
 * @packageDocumentation
 */
export { Commands, Events, getAllCommandActions, getAllEventActions } from "./internal/actions.js";
export { createEngineMiddlewares } from "./internal/middleware/middleware-factory.js";
export type { MiddlewareOptions } from "./internal/middleware/middleware-options.js";
export * from "./internal/reducers/reducer-factory.js";

export { EngineStore } from "./internal/store.js";
export type {
	BooleanRepeatFilter,
	ConfirmRepeatFilter,
	DateRangeRepeatFilter,
	DateRepeatFilter,
	EngineState,
	EnumerationRepeatFilter,
	FilterParseError,
	FilterValue,
	Models,
	MultiSelectRepeatFilter,
	NumberRepeatFilter,
	RangeFilterParseError,
	RepeatFilter,
	StringRepeatFilter
} from "./internal/store.js";
export { createEngineStore, createUIState } from "./internal/storeFactory.js";

export type { CorrectionModeItem } from "./internal/CorrectionModeItem.js";

export { Change } from "./internal/documentChange.js";
export type {
	BaseChange,
	GroupAdded,
	GroupMoved,
	GroupRemoved,
	Revert,
	ValueChanged
} from "./internal/documentChange.js";
export { DataSelectors } from "./internal/selectors/data.js";
export {
	dataSlice,
	engineState,
	isDataState,
	isEngineState,
	isModels,
	isUiState,
	localeSlice,
	modelsSlice,
	uiSlice
} from "./internal/selectors/engineState.js";
export { ModelSelectors } from "./internal/selectors/models.js";
export { UiStateSelectors } from "./internal/selectors/ui-state.js";
export { FormModelSelectors } from "./internal/suffix.js";

export type * from "./internal/middleware/middleware-options.js";

export { createDefaultMiddlewareOptions, defaultDataFormatsProvider } from "./internal/Defaults.js";
export type { DataFormatsProvider } from "./internal/Defaults.js";

export type { Selector } from "./internal/selectors/selectors.js";

export { filterDocumentByRelevance } from "./internal/filterDocumentByRelevance.js";
export { findNotRelevantPaths } from "./internal/findNotRelevantPaths.js";
