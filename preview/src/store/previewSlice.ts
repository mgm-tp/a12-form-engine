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

import type { ActivityActions, ActivityReducers } from "@com.mgmtp.a12.client/client-core";
import { Activity, ActivitySelectors } from "@com.mgmtp.a12.client/client-core";
import type { Action } from "@com.mgmtp.a12.client/typescript-fsa-redux-5-compat";
import { actionCreatorFactory } from "@com.mgmtp.a12.client/typescript-fsa-redux-5-compat";
import type { DefaultThemeType } from "@com.mgmtp.a12.widgets/widgets-core";

export interface PreviewSlice {
	readonly now?: Date;
	readonly activeConditions?: readonly string[];
	readonly documentNames?: readonly string[];
	readonly customThemeNames?: readonly string[];
	readonly customTheme?: DefaultThemeType;
}

// Actions

const actionCreator = actionCreatorFactory("preview-application");

/**
 * Action to set the NOW value used in kernel computation/validation
 * @internal
 */
export const setNow = actionCreator<SetNowPayload>("SET_NOW");

/** @internal */
export interface SetNowPayload extends ActivityActions.ActivityActionPayload {
	readonly now: Date | undefined;
}

/**
 * Action to set the current active custom condition names
 * @internal
 */
export const setActiveConditions = actionCreator<SetActiveConditionsPayload>("SET_CONDITIONS");

/** @internal */
export interface SetActiveConditionsPayload extends ActivityActions.ActivityActionPayload {
	readonly conditions: readonly string[] | undefined;
}

export interface SetDocumentNamesPayload extends ActivityActions.ActivityActionPayload {
	readonly documentNames: readonly string[] | undefined;
}

export const setDocumentNames = actionCreator<SetDocumentNamesPayload>("SET_DOCUMENT_NAMES");

/** @internal */
export interface SetCustomThemeNamesPayload extends ActivityActions.ActivityActionPayload {
	readonly customThemeNames: readonly string[] | undefined;
}

/** @internal */
export const setCustomThemeNames =
	actionCreator<SetCustomThemeNamesPayload>("SET_CUSTOM_THEME_NAMES");

export interface CustomThemeSelectedPayload extends ActivityActions.ActivityActionPayload {
	readonly selectedTheme: string;
}

/**
 * Action that is dispatched by the PreviewApplication if one of the custom themes was selected
 */
export const customThemeSelected =
	actionCreator<CustomThemeSelectedPayload>("CUSTOM_THEME_SELECTED");

export interface SetCustomThemePayload extends ActivityActions.ActivityActionPayload {
	readonly customTheme: DefaultThemeType;
}

export const setCustomTheme = actionCreator<SetCustomThemePayload>("SET_CUSTOM_THEME");

/** Payload for the {@link triggerComputeAndValidate} action */
export interface TriggerComputeAndValidatePayload extends ActivityActions.ActivityActionPayload {
	/**
	 * The loaded document
	 */
	readonly document: object;
}

/**
 * An action to trigger the computation for a loaded document.
 */
export const triggerComputeAndValidate =
	actionCreator<TriggerComputeAndValidatePayload>("INITIAL_COMPUTE");

/** @internal */
export interface ReplaceActivityPayload extends ActivityActions.ActivityActionPayload {
	readonly newInstance: string;
}

/** @internal */
export const replaceActivity = actionCreator<ReplaceActivityPayload>("REPLACE_ACTIVITY");

// Reducers

function createPreviewSliceReducer<P extends ActivityActions.ActivityActionPayload>(
	actionCreator: { match(action: unknown): action is Action<P> },
	updateSlice: (slice: PreviewSlice | undefined, payload: P) => PreviewSlice
): ActivityReducers.DataReducer {
	return {
		reduce(dataHolders, action, defaultDataHolder) {
			return actionCreator.match(action)
				? dataHolders.map(updateDefaultDataHolder(action, defaultDataHolder, updateSlice))
				: dataHolders;
		}
	};
}

function updateDefaultDataHolder<P>(
	action: Action<P>,
	defaultDataHolder: Activity.DataHolder | undefined,
	updateSlice: (slice: PreviewSlice | undefined, payload: P) => PreviewSlice
): (dh: Activity.DataHolder) => Activity.DataHolder {
	return dh =>
		dh === defaultDataHolder
			? {
					...dh,
					slices: {
						...dh.slices,
						preview: updateSlice(dh.slices.preview as PreviewSlice | undefined, action.payload)
					}
				}
			: dh;
}

/** @internal */
export const setNowReducer: ActivityReducers.DataReducer = createPreviewSliceReducer(
	setNow,
	(slice, { now }) => ({ ...slice, now })
);

/** @internal */
export const setActiveConditionsReducer: ActivityReducers.DataReducer = createPreviewSliceReducer(
	setActiveConditions,
	(slice, { conditions }) => ({ ...slice, activeConditions: conditions })
);

/** @internal */
export const setDocumentNamesReducer: ActivityReducers.DataReducer = createPreviewSliceReducer(
	setDocumentNames,
	(slice, { documentNames }) => ({ ...slice, documentNames })
);

/** @internal */
export const setCustomThemeNamesReducer: ActivityReducers.DataReducer = createPreviewSliceReducer(
	setCustomThemeNames,
	(slice, { customThemeNames }) => ({ ...slice, customThemeNames })
);

/** @internal */
export const setCustomThemeReducer: ActivityReducers.DataReducer = createPreviewSliceReducer(
	setCustomTheme,
	(slice, { customTheme }) => ({ ...slice, customTheme })
);

export const previewReducers = [
	setNowReducer,
	setActiveConditionsReducer,
	setDocumentNamesReducer,
	setCustomThemeNamesReducer,
	setCustomThemeReducer
];

// Selectors

export function selectPreviewSlice(state: object, activityId: string): PreviewSlice | undefined {
	const activity = ActivitySelectors.activityById(activityId)(state);
	const defaultDataHolder = Activity.findDefaultDataHolder(activity);
	return defaultDataHolder?.slices.preview;
}

/**
 * Selects the configured `now` value from the state
 * @internal
 */
export function selectNow(state: object, activityId: string): Date | undefined {
	const previewSlice = selectPreviewSlice(state, activityId);
	return previewSlice?.now;
}

/**
 * Selects the currently active custom condition names from the state
 * @internal
 */
export function selectActiveConditions(state: object, activityId: string): readonly string[] {
	const previewSlice = selectPreviewSlice(state, activityId);
	return previewSlice?.activeConditions ?? [];
}

/** @internal */
export function selectDocumentNames(state: object, activityId: string): readonly string[] {
	const previewSlice = selectPreviewSlice(state, activityId);
	return previewSlice?.documentNames ?? [];
}

/** @internal */
export function selectCustomThemeNames(state: object, activityId: string): readonly string[] {
	const previewSlice = selectPreviewSlice(state, activityId);
	return previewSlice?.customThemeNames ?? [];
}

/** @internal */
export function selectCustomTheme(state: object, activityId: string): DefaultThemeType | undefined {
	const previewSlice = selectPreviewSlice(state, activityId);
	return previewSlice?.customTheme;
}
