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

import type { Action as ReduxAction } from "redux";
import { call, put, select, takeEvery } from "typed-redux-saga";
import type { SagaGenerator } from "typed-redux-saga";

import {
	ActivityActions,
	LocaleSelectors,
	Model,
	ModelSagas
} from "@com.mgmtp.a12.client/client-core";
import type { Action } from "@com.mgmtp.a12.client/typescript-fsa-redux-5-compat";
import { setDocumentNames } from "@com.mgmtp.a12.formengine/formengine-a12internal-preview";

import { loadInstances } from "../backend/handleInstances.js";

/**
 * Load the list of document names when the Form Engine view for a specific model is opened.
 * We do not want to extend the default data provider, because the data should not reload for a new document
 * of the same model. We also listen for ActivityActions.push instead of a more specific action, because
 * data loading has to work when a deep link is applied.
 */
export function* instancesLoadingSaga(): SagaGenerator<void> {
	yield* takeEvery(
		(action: ReduxAction) =>
			ActivityActions.push.match(action) && !!action.payload.activity.descriptor.instance,
		handleInstancesLoading
	);
}

function* handleInstancesLoading(action: Action<ActivityActions.PushPayload>): SagaGenerator<void> {
	const activityId = action.payload.activity.id;
	const models = yield* call(() => ModelSagas.waitForModelsLoaded(activityId));
	const documentModel = models.find(Model.isDocumentModel);
	if (!documentModel) {
		throw new Error("Expected document model to exist!");
	}

	const locale = yield* select(LocaleSelectors.locale());

	const documentNames = yield* call(loadInstances, documentModel.header.id, locale);
	yield* put(setDocumentNames({ documentNames, activityId }));
}
