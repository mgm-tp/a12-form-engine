// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { call, put, select, takeEvery } from "typed-redux-saga";
import type { SagaGenerator } from "typed-redux-saga";
import type { Action, AnyAction } from "typescript-fsa";

import { ActivityActions } from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";
import { LocaleSelectors } from "@com.mgmtp.a12.client/client-core/lib/core/locale/index.js";
import { Model, ModelSagas } from "@com.mgmtp.a12.client/client-core/lib/core/model/index.js";

import { loadInstances } from "../backend/handleInstances.js";
import { setDocumentNames } from "../shared.js";

/**
 * Load the list of document names when the Form Engine view for a specific model is opened.
 * We do not want to extend the default data provider, because the data should not reload for a new document
 * of the same model. We also listen for ActivityActions.push instead of a more specific action, because
 * data loading has to work when a deep link is applied.
 */
export function* instancesLoadingSaga(): SagaGenerator<void> {
	yield* takeEvery(
		(action: AnyAction) =>
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
