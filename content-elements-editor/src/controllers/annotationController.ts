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

import type { Annotation } from "@com.mgmtp.a12.base/base-model-api";
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
