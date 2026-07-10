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

import type { Middleware } from "redux";

import { ActivityActions } from "@com.mgmtp.a12.client/client-core";
import {
	Commands,
	FormEngineActions,
	FormEngineSelectors
} from "@com.mgmtp.a12.formengine/formengine-core";
import type { EntityInstancePath, GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import { DocumentServiceFactory } from "@com.mgmtp.a12.kernel/kernel-md-facade";

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
