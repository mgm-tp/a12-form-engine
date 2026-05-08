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

import type { Action, Dispatch, Middleware, MiddlewareAPI } from "redux";

import {
	ActivityActions,
	ActivitySelectors
} from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";
import type { Selector } from "@com.mgmtp.a12.client/client-core/lib/core/store/index.js";

import type { EngineState } from "../../../../../back-end/store/index.js";
import {
	Commands,
	getAllCommandActions,
	getAllEventActions
} from "../../../../../back-end/store/index.js";

import { FormEngineActions } from "./actions.js";
import { FormEngineSelectors } from "./selectors.js";
import type { uiStateReducer } from "./uiStateReducer.js";

/**
 * @internal
 *
 * Adapter for the Form-Engine middlewares, which extracts the Form-Engine
 * actions from every Client {@link FormEngineActions} and dispatches it with
 * all Form-Engine middlewares.
 *
 * This is necessary because the FE state looks like
 * - data
 * - models
 * - ui state
 *
 * But the FE state in Client looks like
 * - activity (n)
 *   - dataHolder[0]
 *     - slices[uiState]
 *     - data
 * - models
 *
 * The middlewares of the Form-Engine will process the event-actions and
 * dispatch command-actions to trigger a store change.
 *
 * The adapter creates a new dispatch function, which received the activity id
 * from the original incoming {@link FormEngineActions} and listens to the
 * incoming command-actions from the Form-Engine middlewares.
 *
 * If the command-action signals that the data changed, an activity action will
 * be called.
 *
 * If the command-action signals that the UI state changed, a
 * {@link FormEngineActions.command} action will be dispatched, which contains
 * the activity id and the incoming command-action.
 *
 * This action is processed by the {@link uiStateReducer}.
 */
export function engineMiddlewareAdapterFactory(
	engineMiddlewares: Middleware<unknown, EngineState>[],
	engineStateSelector: FormEngineSelectors.EngineStateSelector = FormEngineSelectors.engineState
): Middleware<unknown, object> {
	return api => next => action => {
		const result = next(action);
		if (!FormEngineActions.event.match(action) && !FormEngineActions.command.match(action)) {
			return result;
		}

		const { activityId, engineEvent } = action.payload;

		const activity = ActivitySelectors.activityById(activityId)(api.getState());
		if (activity === undefined) {
			return result;
		}

		createDispatcher(
			createMiddlewareAPIWrapper(api, activityId, engineStateSelector(activityId)),
			engineMiddlewares
		)(engineEvent);

		return result;
	};
}

/**
 * Creates a wrapper for a separated redux store structure.
 */
function createMiddlewareAPIWrapper(
	api: MiddlewareAPI,
	activityId: string,
	engineStateSelector: Selector<EngineState | undefined>
): MiddlewareAPI {
	function getStateWrapper(): EngineState {
		const state = engineStateSelector(api.getState());
		if (state === undefined) {
			throw new Error(`EngineState cannot be assembled for the activity ${activityId}.`);
		}
		return state;
	}

	/**
	 * This is a little hack to prevent type issues with typescript 3.0.1.
	 */
	function dispatchWrapper<T extends Action>(action: Action): T {
		return api.dispatch(action as T);
	}

	return {
		getState: getStateWrapper,
		dispatch(engineEvent) {
			if (Commands.setDocument.match(engineEvent)) {
				return dispatchWrapper(
					ActivityActions.setData({
						activityId,
						data: { document: engineEvent.payload.document }
					})
				);
			} else if (Commands.setDataDirty.match(engineEvent)) {
				return dispatchWrapper(
					ActivityActions.setDirty({ activityId, dirty: engineEvent.payload })
				);
			} else if (allEngineCommandTypes.some(type => type === engineEvent.type)) {
				if (
					Commands.changeScreenState.match(engineEvent) &&
					engineEvent.payload.dirty !== undefined
				) {
					dispatchWrapper(
						ActivityActions.setDirty({ activityId, dirty: engineEvent.payload.dirty })
					);
				}

				return dispatchWrapper(FormEngineActions.command({ engineEvent, activityId }));
			} else if (allEngineEventTypes.some(type => type === engineEvent.type)) {
				return dispatchWrapper(FormEngineActions.event({ engineEvent, activityId }));
			} else {
				return engineEvent;
			}
		}
	};
}

/**
 * This function combines a chain of middlewares to a single dispatch function.
 */
function createDispatcher(api: MiddlewareAPI, middlewares: Middleware[]): Dispatch {
	return middlewares.reduceRight<Dispatch>(
		(dispatcher, middleware) => middleware(api)(dispatcher),
		action => action
	);
}

const allEngineEventTypes = getAllEventActions().map(a => a().type);
const allEngineCommandTypes = getAllCommandActions().map(a => a().type);
