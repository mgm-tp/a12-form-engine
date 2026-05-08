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
