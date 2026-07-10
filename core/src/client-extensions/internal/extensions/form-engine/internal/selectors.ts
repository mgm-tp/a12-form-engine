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

import {
	Activity,
	ActivitySelectors,
	LocaleSelectors,
	Model,
	ModelSelectors
} from "@com.mgmtp.a12.client/client-core";
import type { Selector } from "@com.mgmtp.a12.client/client-core";
import { THUMBNAIL_SLICE } from "@com.mgmtp.a12.client/client-core/a12internal";

import type { EngineState, EngineStore, Models } from "../../../../../back-end/store/index.js";
import { createEngineStore, dataSlice } from "../../../../../back-end/store/index.js";
import type { ReadonlyObjectMap } from "../../../../../models/index.js";
import { isFormModel } from "../../../../../models/index.js";
import { InternalModelSelectors } from "../../../core/view/internal/components/selectors.js";

import { ATTACHMENT_STATE_SLICE } from "./attachments/attachmentState.js";
import { resolveUiState } from "./resolveUiState.js";

/** @internal */
export const EMPTY_DATA: EngineStore.DataState = { dirty: false, document: {} };

/**
 * All Form-Engine state related selector creators.
 */
export namespace FormEngineSelectors {
	export type EngineStateSelector = typeof engineState;

	/**
	 * Creates a selector to select the engine state form a given activity.
	 *
	 * If some parts of the engine state are not available in the client store,
	 * the selector will return undefined.
	 */
	export function engineState(activityId: string): Selector<EngineState | undefined> {
		const uiStateSelector = uiState(activityId);
		const modelsSelector = models(activityId);
		const dataStateSelector = dataState(activityId);
		const localeSelector = LocaleSelectors.locale();

		return function engineStateSelector(state) {
			const models = modelsSelector(state);
			if (models === undefined) {
				return undefined;
			}

			const ui = uiStateSelector(state);
			if (ui === undefined) {
				return undefined;
			}

			const data = dataStateSelector(state);
			const locale = localeSelector(state);

			return createEngineStore({ ui, models, data, locale });
		};
	}

	/**
	 * Creates a selector to select the ui slice of engine state from the
	 * uiState slice of a given activity.
	 *
	 * If the uiState slice is empty, but a form model exists in the scene,
	 * the selector will return the default UiState object.
	 */
	export function uiState(activityId: string): Selector<EngineStore.UIState | undefined> {
		const activitySelector = ActivitySelectors.activityById(activityId);
		const activityBusySelector = ActivitySelectors.busy(activityId);

		return clientState => {
			const activity = activitySelector(clientState);
			if (activity === undefined) {
				return undefined;
			}

			const dataHolder = Activity.findDefaultDataHolder(activity);

			const formModel = ModelSelectors.modelInScene(
				{ activityId, modelType: "form", documentModel: activity.descriptor.model },
				isFormModel
			)(clientState);

			const uiState = resolveUiState(dataHolder?.slices.uiState, formModel);

			const disabled = activity.lock !== undefined || activityBusySelector(clientState);
			return uiState ? { ...uiState, disabled: disabled || uiState.disabled } : undefined;
		};
	}

	/**
	 * Creates a selector to select the data slice of engine state form the
	 * default data holder of a given activity.
	 *
	 * If the data holder is missing or not loaded, the selector will return
	 * a data state with an empty document.
	 */
	export function dataState(activityId: string): Selector<EngineStore.DataState> {
		const activitySelector = ActivitySelectors.activityById(activityId);
		const dirtySelector = ActivitySelectors.dirty(activityId);

		return clientState => {
			const activity = activitySelector(clientState);
			if (activity === undefined) {
				return EMPTY_DATA;
			}

			const dataHolder = Activity.findDefaultDataHolder(activity);
			if (dataHolder?.loadingState !== "loaded") {
				return EMPTY_DATA;
			}

			const dirty = dirtySelector(clientState);
			return dataSlice({
				...dataHolder.data,
				dirty,
				attachmentState: {
					...dataHolder?.slices[ATTACHMENT_STATE_SLICE],
					thumbnails: dataHolder?.slices[THUMBNAIL_SLICE]
				}
			});
		};
	}

	/**
	 * Creates a selector to select the models slice of engine state form a given
	 * activity.
	 *
	 * If all models are available in the client store, the selector will return
	 * a Models object. Otherwise the selector will return undefined.
	 */
	export function models(activityId: string): Selector<Models | undefined> {
		return state => {
			const activity = ActivitySelectors.activityById(activityId)(state);
			if (activity === undefined) {
				return undefined;
			}

			const formModel = ModelSelectors.modelInScene(
				{ activityId, modelType: "form", documentModel: activity.descriptor.model },
				isFormModel
			)(state);

			if (formModel === undefined) {
				return undefined;
			}

			// Select the referenced document model
			const documentAndValidationModel = ModelSelectors.modelByName(
				InternalModelSelectors.getDocumentModelReference(formModel),
				Model.isDocumentAndValidationModel
			)(state);

			if (documentAndValidationModel === undefined) {
				return undefined;
			}

			const { generatedCodeAccessor: validatorProvider } = documentAndValidationModel;
			return {
				documentModel: documentAndValidationModel,
				validatorProvider,
				formModel
			};
		};
	}

	/**@internal */
	export function messages(
		activityId: string
	): Selector<ReadonlyObjectMap<EngineStore.Validation.Entry> | undefined> {
		return s => uiState(activityId)(s)?.messages;
	}
}
