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

import type { SagaGenerator } from "typed-redux-saga";
import { call, put } from "typed-redux-saga";

import type { DataProvider } from "@com.mgmtp.a12.client/client-core";
import { LocaleActions, ModelSelectors, StoreSagas } from "@com.mgmtp.a12.client/client-core";
import { getLocales } from "@com.mgmtp.a12.formengine/formengine-a12internal-preview";
import type { FormModel } from "@com.mgmtp.a12.formengine/formengine-core";
import { Locale } from "@com.mgmtp.a12.utils/utils-localization";

import type { LoadInstanceConfig } from "../../modules/formEngineModule.js";
import { isInstanceDescriptor } from "../../modules/formEngineModule.js";
import { existingDocumentRequested } from "../../reducer/actions.js";
import { toFormAndDocumentModel } from "../../reducer/toFormAndDocumentModel.js";

import { assertDevappMode } from "../utils.js";

export const mockSingleDocumentDataProvider: DataProvider = {
	name: "MockSingleDocumentDataProvider",

	canHandle({ dataHolder }) {
		return isInstanceDescriptor(dataHolder.descriptor);
	},
	*provideData(config) {
		assertDevappMode("mock");

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
	return modelLocales.at(0) ?? (Locale.fromString("en_US") as Locale);
}
