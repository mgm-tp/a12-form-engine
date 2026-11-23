// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { createReducerBuilder } from "@com.mgmtp.a12.contentengine/contentengine-editor";
import type { SettingsStore } from "@com.mgmtp.a12.contentengine/contentengine-editor";
import type {
	LocalizedModelText,
	LocalizedText
} from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import {
	AddLocalizedText,
	ChangeLocalizedText,
	DeleteLocalizedText
} from "./localizedTextActions.js";

/** @internal */
export type LocalizedTextSettingState = SettingState;

type ModelState = LocalizedModelText | undefined;
type SettingState = Partial<LocalizedText>[];
type UIState = SettingState;

/** @internal */
export function createLocalizedTextController(): SettingsStore.Controller<
	SettingState,
	ModelState,
	UIState
> {
	return {
		converter(modelState) {
			return (modelState as SettingState) ?? [];
		},
		formatter(state) {
			return state.length
				? state.map(e => ({ ...e, locale: e.locale ?? "", text: e.text ?? "" }))
				: undefined;
		},
		reducer: createReducerBuilder<SettingState>()
			.addCase(AddLocalizedText, state => {
				return [...state, {}];
			})
			.addCase(DeleteLocalizedText, (state, action) => {
				return [
					...state.slice(0, action.payload.rowIndex),
					...state.slice(action.payload.rowIndex + 1)
				];
			})
			.addCase(ChangeLocalizedText, (state, action) => {
				return [
					...state.slice(0, action.payload.rowIndex),
					action.payload.localizedText,
					...state.slice(action.payload.rowIndex + 1)
				];
			})
			.build(),
		selector(state) {
			return state;
		}
	};
}
