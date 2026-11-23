// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { Middleware } from "redux";

import { ActivityActions } from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";
import {
	Commands,
	FormEngineActions,
	FormEngineSelectors
} from "@com.mgmtp.a12.formengine/formengine-core";
import type {
	EntityInstancePath,
	GroupInstance
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import { DocumentServiceFactory } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/facade.js";

const documentService = new DocumentServiceFactory().getDocumentService();

export const writeDirtyStatesInDocumentMiddleware: Middleware = api => next => action => {
	const result = next(action);
	const state = api.getState();

	if (ActivityActions.setDirty.match(action) || FormEngineActions.command.match(action)) {
		const activityId = action.payload.activityId;

		const documentModel = FormEngineSelectors.models(activityId)(state)?.documentModel;
		const document = FormEngineSelectors.dataState(activityId)(state).document as GroupInstance;
		const screenLocation = FormEngineSelectors.uiState(activityId)(state)?.screenLocation;
		const currentScreenLocation = screenLocation
			? screenLocation[screenLocation.length - 1]
			: undefined;

		if (documentModel && currentScreenLocation) {
			if (ActivityActions.setDirty.match(action)) {
				const path = createDocumentPath(["root"], ["states"], ["data_dirty"]);
				const newDocument = documentService.updateEntityInstance(
					document,
					path,
					String(action.payload.dirty),
					documentModel
				);

				api.dispatch(ActivityActions.setData({ activityId, data: { document: newDocument } }));
			} else if (
				FormEngineActions.command.match(action) &&
				Commands.setUIDirty.match(action.payload.engineEvent)
			) {
				const path = createDocumentPath(["root"], ["states"], ["ui_dirty"]);
				const newDocument = documentService.updateEntityInstance(
					document,
					path,
					String(action.payload.engineEvent.payload),
					documentModel
				);

				api.dispatch(ActivityActions.setData({ activityId, data: { document: newDocument } }));
			} else if (
				FormEngineActions.command.match(action) &&
				Commands.changeScreenState.match(action.payload.engineEvent) &&
				action.payload.engineEvent.payload.dirty
			) {
				const nestedPath = [
					...currentScreenLocation.path,
					{ elementName: "states", index: 1 },
					{ elementName: "dirty", index: 1 }
				];

				const newDocument = documentService.updateEntityInstance(
					document,
					nestedPath,
					String(action.payload.engineEvent.payload.dirty),
					documentModel
				);

				api.dispatch(ActivityActions.setData({ activityId, data: { document: newDocument } }));
			}
		}
	}

	return result;
};

function createDocumentPath(...elements: [string, number?][]): EntityInstancePath {
	return elements.map(([elementName, index = 1]) => ({ elementName, index }));
}
