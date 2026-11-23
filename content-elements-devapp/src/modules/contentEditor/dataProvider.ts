// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { call, put } from "typed-redux-saga";

import type { DataProvider } from "@com.mgmtp.a12.client/client-core/lib/core/data/index.js";
import { Model, ModelSelectors } from "@com.mgmtp.a12.client/client-core/lib/core/model/index.js";
import { StoreSagas } from "@com.mgmtp.a12.client/client-core/lib/core/store/index.js";
import { isContentModel } from "@com.mgmtp.a12.contentengine/contentengine-core";

import { initContentEditorSlices } from "./actions.js";
import { isEditorDescriptor } from "./descriptor.js";

export const MockContentEditorDataProvider: DataProvider = {
	name: "MockContentEditorDataProvider",
	canHandle({ dataHolder }) {
		return isEditorDescriptor(dataHolder.descriptor);
	},
	*provideData({ activityId }) {
		const models = yield* call(() =>
			StoreSagas.waitFor(ModelSelectors.allLoadedModelsInScene(activityId))
		);

		const documentModel = models.find(Model.isDocumentAndValidationModel);
		const contentModel = models.find(isContentModel);

		if (documentModel && contentModel) {
			yield* put(
				initContentEditorSlices({
					activityId,
					contentModel: contentModel,
					documentModel: documentModel
				})
			);
		}
	}
};
