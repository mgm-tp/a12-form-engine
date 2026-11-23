// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/facade.js";
import { Locale } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";
import { ConsoleLoggingStrategy, Settings } from "@com.mgmtp.a12.utils/utils-logging";
import { LogLevel } from "@com.mgmtp.a12.utils/utils-logging/api.js";

Settings.LogStrategy = new ConsoleLoggingStrategy(console, LogLevel.LOG);

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
