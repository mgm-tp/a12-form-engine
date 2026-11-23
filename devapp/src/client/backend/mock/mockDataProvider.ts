// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { SagaGenerator } from "typed-redux-saga";
import { call, put } from "typed-redux-saga";

import type { DataProvider } from "@com.mgmtp.a12.client/client-core/lib/core/data/index.js";
import { LocaleActions } from "@com.mgmtp.a12.client/client-core/lib/core/locale/index.js";
import { ModelSelectors } from "@com.mgmtp.a12.client/client-core/lib/core/model/index.js";
import { StoreSagas } from "@com.mgmtp.a12.client/client-core/lib/core/store/index.js";
import type { FormModel } from "@com.mgmtp.a12.formengine/formengine-core";
import { Locale } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import type { LoadInstanceConfig } from "../../modules/formEngineModule.js";
import { isInstanceDescriptor } from "../../modules/formEngineModule.js";
import { existingDocumentRequested } from "../../reducer/actions.js";
import { toFormAndDocumentModel } from "../../reducer/toFormAndDocumentModel.js";
import { getLocales } from "../../shared.js";

import { sanityCheck } from "../utils.js";

export const mockSingleDocumentDataProvider: DataProvider = {
	name: "MockSingleDocumentDataProvider",

	canHandle({ dataHolder }) {
		return isInstanceDescriptor(dataHolder.descriptor);
	},
	*provideData(config) {
		sanityCheck("mock");

		switch (config.operation) {
			case "load": {
				return yield* loadData(config as LoadInstanceConfig);
			}
			case "save":
			case "delete":
				throw new Error(`${config.operation} is not possible without a backend`);
		}
	}
};

function* loadData({ activityId, dataHolders }: LoadInstanceConfig): SagaGenerator<void> {
	const [{ descriptor }] = dataHolders;

	const loadedDocument = yield* call(loadLocalDocument, descriptor.instance);

	const models = yield* call(() =>
		StoreSagas.waitFor(ModelSelectors.allLoadedModelsInScene(activityId))
	);
	const { formModel } = toFormAndDocumentModel(models);

	// LocaleActions.set contains side effects, which makes it not possible to move it into the dataReducer
	yield* put(LocaleActions.set(getDefaultLocaleFromModel(formModel)));

	yield* put(
		existingDocumentRequested({
			activityId,
			loadedDocument
		})
	);
}

async function loadLocalDocument(docRef: string): Promise<object> {
	const response = await fetch(`data/${docRef}`);
	return await response.json();
}

function getDefaultLocaleFromModel({ header }: FormModel): Locale {
	const modelLocales = getLocales(header.locales);
	return modelLocales?.[0] ?? Locale.fromString("en_US");
}
