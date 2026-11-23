// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { createReducerBuilder } from "@com.mgmtp.a12.contentengine/contentengine-editor";
import type { SettingsStore } from "@com.mgmtp.a12.contentengine/contentengine-editor";

import { AddEntry, ChangeEntry, DeleteEntry } from "./stringListActions.js";

/** @internal */
export type StringListSettingState = SettingState;

type ModelState = string[];
type SettingState = ModelState;
type UIState = SettingState;

/** @internal */
export function createStringListController(): SettingsStore.Controller<
	SettingState,
	ModelState,
	UIState
> {
	return {
		converter(modelState) {
			return modelState;
		},
		formatter(state) {
			return state;
		},
		reducer: createReducerBuilder<SettingState>()
			.addCase(AddEntry, state => {
				return [...state, ""];
			})
			.addCase(DeleteEntry, (state, action) => {
				return [
					...state.slice(0, action.payload.rowIndex),
					...state.slice(action.payload.rowIndex + 1)
				];
			})
			.addCase(ChangeEntry, (state, action) => {
				return [
					...state.slice(0, action.payload.rowIndex),
					action.payload.value,
					...state.slice(action.payload.rowIndex + 1)
				];
			})
			.build(),
		selector(state) {
			return state;
		}
	};
}
