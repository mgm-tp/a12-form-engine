// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Annotation } from "@com.mgmtp.a12.base/base-model-api/lib/main/header/index.js";
import { createReducerBuilder } from "@com.mgmtp.a12.contentengine/contentengine-editor";
import type { SettingsStore } from "@com.mgmtp.a12.contentengine/contentengine-editor";

import { AddAnnotation, ChangeAnnotation, DeleteAnnotation } from "./annotationActions.js";

/** @internal */
export type AnnotationsSettingState = SettingState;

type ModelState = Annotation[] | undefined;
type SettingState = Partial<Annotation>[];
type UIState = SettingState;

/** @internal */
export function createAnnotationController(): SettingsStore.Controller<
	SettingState,
	ModelState,
	UIState
> {
	return {
		converter(modelState) {
			return modelState ?? [];
		},
		formatter(state) {
			return state.length ? state.map(e => ({ ...e, name: e.name ?? "" })) : undefined;
		},
		reducer: createReducerBuilder<SettingState>()
			.addCase(AddAnnotation, state => {
				return [...state, {}];
			})
			.addCase(DeleteAnnotation, (state, action) => {
				return [
					...state.slice(0, action.payload.rowIndex),
					...state.slice(action.payload.rowIndex + 1)
				];
			})
			.addCase(ChangeAnnotation, (state, action) => {
				return [
					...state.slice(0, action.payload.rowIndex),
					action.payload.annotation,
					...state.slice(action.payload.rowIndex + 1)
				];
			})
			.build(),
		selector(state) {
			return state;
		}
	};
}
