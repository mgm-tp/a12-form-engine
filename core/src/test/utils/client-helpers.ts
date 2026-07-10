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

import type { Reducer, Store } from "redux";

import type { Activity, ActivityMap } from "@com.mgmtp.a12.client/client-core";
import {
	APPLICATION_MODEL_PLACEHOLDER,
	ApplicationFactories,
	ModuleTestExtensions
} from "@com.mgmtp.a12.client/client-core";
import type { DataHandler, DataProvider, ModelMap } from "@com.mgmtp.a12.client/client-core";
import { actionCreatorFactory } from "@com.mgmtp.a12.client/typescript-fsa-redux-5-compat";
import type { ModelGraph } from "@com.mgmtp.a12.dataservices/dataservices-access";
import type { Locale } from "@com.mgmtp.a12.utils/utils-localization";

import { US_LOCALE } from "./localization.js";

export const TEST_ACTIVITY_ID = "0";

export function createActivity(options?: {
	id?: string;
	descriptor?: Activity.Descriptor;
	dataHolders?: Activity.DataHolder[];
	initiatingActivityId?: string;
	loadingState?: Activity.DataHolder["loadingState"];
	savingState?: Activity.DataHolder["savingState"];
	error?: Activity.Error<any>;
}): Activity {
	return {
		id: options?.id ?? TEST_ACTIVITY_ID,
		descriptor: options?.descriptor ?? createDescriptor({ properties: { test: "test" } }),
		initiatingActivityId: options?.initiatingActivityId,
		activationTimestamp: 0,
		dataHolders: options?.dataHolders ?? [
			createDataHolder({
				descriptor: options?.descriptor,
				loadingState: options?.loadingState,
				error: options?.error
			})
		]
	};
}

export function createDescriptor(options?: {
	instance?: string;
	properties?: Record<string, string>;
}): Activity.Descriptor {
	return {
		...(options?.instance ? { instance: options.instance } : {}),
		...options?.properties
	};
}

export function createDataHolder(options?: {
	descriptor?: Activity.DataHolderDescriptor;
	data?: Record<string, unknown>;
	datasourceActivityId?: string;
	loadingState?: Activity.DataHolder["loadingState"];
	error?: Activity.Error;
}): Activity.DataHolder {
	return {
		descriptor: options?.descriptor ?? createDescriptor({ properties: { test: "test" } }),
		dirty: false,
		loadingState: options?.loadingState ?? "missing",
		savingState: options?.error ? "error" : "not_saved",
		slices: {},
		error: options?.error,
		data: options?.data,
		datasourceActivityId: options?.datasourceActivityId
	};
}

export function createModelGraph(modelGraph?: Partial<ModelGraph>): ModelGraph {
	return {
		documentModels: [],
		relationshipModels: [],
		composeDocumentModels: [],
		...modelGraph
	};
}

export function setupActivityMap(activities: Activity[]): ActivityMap {
	return activities.reduce(
		(activityMap, activity) => ({ ...activityMap, [activity.id]: activity }),
		{}
	);
}

export function createTestConfig<
	Op extends DataProvider.Operation,
	R = Extract<DataProvider.ProvideDataConfig, { operation: Op }>,
	D = Extract<DataProvider.ProvideDataConfig, { operation: Op }>["details"]
>(options: { operation: Op; dataHolders?: Activity.DataHolder[]; details?: D }): R {
	const { operation, dataHolders, details } = options;

	const commonConfig = {
		activityId: TEST_ACTIVITY_ID,
		dataHolders: dataHolders ?? [createDataHolder()]
	};

	switch (operation) {
		case "load":
			return {
				operation: "load",
				...commonConfig,
				details: details ?? {}
			} as R;
		case "delete":
			return {
				...commonConfig,
				operation: operation,
				details: { instanceId: "instance", ...details }
			} as R;
		case "save":
			return {
				...commonConfig,
				operation: operation,
				details: {
					updateActivityData: false,
					saving: {
						done: () => ({ type: "" }),
						failed: () => ({ type: "" })
					},
					...details
				}
			} as R;
	}
}

const factory = actionCreatorFactory("Test");
const setInitialState = factory<object>("SET_INITIAL_STATE");

export function createStore({
	locale,
	activities,
	modelGraph,
	modelMap,
	dataHandlers
}: {
	locale?: Locale;
	activities?: Activity[];
	modelGraph?: Partial<ModelGraph>;
	modelMap?: ModelMap;
	dataHandlers?: DataHandler[];
} = {}): {
	readonly store: Store;
} {
	const initialState = {
		locale: locale ?? US_LOCALE,
		models: {
			models: modelMap ?? {},
			modelGraph: createModelGraph(modelGraph),
			applicationModel: APPLICATION_MODEL_PLACEHOLDER
		},
		activities: setupActivityMap(activities ?? [createActivity()])
	};

	ModuleTestExtensions.reset();

	const customRootReducer: (defaultReducer: Reducer<object>) => Reducer<object> =
		defaultReducer => (state, action) => {
			return setInitialState.match(action)
				? { ...state, ...action.payload }
				: defaultReducer(state, action);
		};

	const { store } = ApplicationFactories.createApplicationSetup({
		model: APPLICATION_MODEL_PLACEHOLDER,
		modelLoader: { name: "unused", load: () => Promise.resolve({}) },
		dataHandlers: dataHandlers ?? [],
		rootReducer: customRootReducer,
		locale,
		setupActions: [setInitialState(initialState)]
	});

	return {
		store
	};
}
