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

// tag::content[]
// tag::marker0[]
import type { ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { connect, Provider } from "react-redux";
import { applyMiddleware, legacy_createStore as createStore } from "redux";

import type {
	DefaultDispatchProps,
	DefaultOwnProps,
	DefaultStateProps,
	EngineState,
	FormModel,
	ScrollHandlerProps
} from "@com.mgmtp.a12.formengine/formengine-core";
import {
	createCombinedReducer,
	createEmptyDocument,
	createEngineMiddlewares,
	createEngineStore,
	defaultMapDispatchToProps,
	defaultMapStateToProps,
	defaultValueParser,
	FormEngineRenderer,
	ScrollHandler,
	unmarshallFormModel
} from "@com.mgmtp.a12.formengine/formengine-core";
import {
	DocumentServiceFactory,
	GeneratedCodeAccessorFactory
} from "@com.mgmtp.a12.kernel/kernel-md-facade";
import { Locale } from "@com.mgmtp.a12.utils/utils-localization";
import { ConsoleLoggingStrategy, Settings } from "@com.mgmtp.a12.utils/utils-logging";

Settings.LogStrategy = new ConsoleLoggingStrategy(console, "log");

const mountPoint = window.document.createElement("div");
window.document.body.appendChild(mountPoint);

loadModels().then(({ formModelAsJson, documentModelAsString, validationCode }) => {
	// end::marker0[]
	// tag::unmarshallModel[]
	// unmarshall models
	const documentModel = new DocumentServiceFactory()
		.getDocumentModelSerializer()
		.deserialize(documentModelAsString);

	const validatorProvider = new GeneratedCodeAccessorFactory().createScriptAccessor(validationCode);
	// end::unmarshallModel[]

	// tag::unmarshallModel2[]
	const formModel = unmarshallFormModel(
		formModelAsJson,
		documentModel,
		defaultValueParser(documentModel)
	);
	// end::unmarshallModel2[]

	// tag::createStore[]
	// create and initialize store
	const document = createEmptyDocument(documentModel, formModel);
	const initialState = createEngineStore({
		data: { document },
		locale: Locale.fromString("en_US") as Locale,
		models: {
			formModel,
			documentModel,
			validatorProvider
		}
	});

	const storeEnhancer = applyMiddleware(...createEngineMiddlewares());
	const EngineReducer = createCombinedReducer(initialState);
	const store = createStore(EngineReducer, initialState, storeEnhancer);
	// end::createStore[]

	// tag::render[]
	const root = createRoot(mountPoint);

	// render
	root.render(
		<Provider store={store}>
			<ScrollHandlerConnected>
				<EngineConnected />
			</ScrollHandlerConnected>
		</Provider>
	);
	// end::render[]
	// tag::marker1[]
});
// end::marker1[]
// tag::connect[]
const EngineConnected = connect<
	DefaultStateProps,
	DefaultDispatchProps,
	DefaultOwnProps,
	EngineState
>(
	defaultMapStateToProps,
	defaultMapDispatchToProps
)(FormEngineRenderer);

const ScrollHandlerConnected = connect<
	ScrollHandlerProps,
	{},
	{ children?: ReactNode },
	EngineState
>(function mapStateToProps(state) {
	return {
		uiState: state.ui,
		models: state.models
	};
})(ScrollHandler);
// end::connect[]

// tag::loadModels[]
// Example of loading models
function loadModels(): Promise<{
	formModelAsJson: FormModel;
	documentModelAsString: string;
	validationCode: string;
}> {
	const formModelPromise = fetch(`models/formModel.json`).then(
		response => response.json() as Promise<FormModel>
	);

	const documentModelPromise = fetch(`models/documentModel.json`).then(response => response.text());

	const validatorProviderPromise = fetch(`models/validation.js`).then(response => response.text());

	return Promise.all([formModelPromise, documentModelPromise, validatorProviderPromise]).then(
		([formModelAsJson, documentModelAsString, validationCode]) => ({
			formModelAsJson,
			documentModelAsString,
			validationCode
		})
	);
}
// end::loadModels[]
// end::content[]
