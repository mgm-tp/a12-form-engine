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

/**
 * Extension for integrating the Form-Engine into
 * the Client.
 * @packageDocumentation
 */
import type { FunctionComponent } from "react";
import type { Middleware } from "redux";

import type { MiddlewareOptions } from "../../../../back-end/store/index.js";
import { createEngineMiddlewares } from "../../../../back-end/store/index.js";

import { FormEngineActions } from "./internal/actions.js";
import { attachmentReducer } from "./internal/attachments/reducer/attachmentReducer.js";
import { deleteSaga } from "./internal/attachments/sagas/deleteSaga.js";
import { downloadSaga } from "./internal/attachments/sagas/downloadSaga.js";
import { uploadSaga } from "./internal/attachments/sagas/uploadSaga.js";
import { engineMiddlewareAdapterFactory } from "./internal/engineMiddlewareAdapterFactory.js";
import { resetUiDirtyStateOnSave } from "./internal/formEngineSaga.js";
import type { FormEngineSagaOptions } from "./internal/sagaOptions.js";
import type { FormEngineScrollHandlerProps as FormEngineScrollHandlerPropsInternal } from "./internal/scrollHandler.js";
import { FormEngineScrollHandler } from "./internal/scrollHandler.js";
import { FormEngineSelectors } from "./internal/selectors.js";
import { FormEngineStateAdapter } from "./internal/state.js";
import { uiStateReducer } from "./internal/uiStateReducer.js";
import type {
	FormEngineProps as FormEnginePropsInternal,
	FormEngineTplProps as FormEngineTplPropsInternal
} from "./internal/view.js";
import { FormEngineView, FormEngineViewTpl } from "./internal/view.js";

export type { FormEngineSagaOptions } from "./internal/sagaOptions.js";

export { platformAttachmentLoader } from "./internal/attachments/attachmentLoader/platformAttachmentLoader.js";

export type {
	AttachmentFile,
	AttachmentLoader,
	AttachmentWithThumbnail,
	DuplicateStrategy
} from "./internal/attachments/attachmentLoader/AttachmentLoader.js";

export type { DocumentDescriptor } from "./internal/attachments/documentDescriptor/DocumentDescriptor.js";

export { FormEngineActions } from "./internal/actions.js";
export { computeDocument } from "./internal/computeDocument.js";
export { createEmptyDocumentDataProvider } from "./internal/createEmptyDocumentDataProvider.js";
export type { EmptyDocumentDataProviderOptions } from "./internal/createEmptyDocumentDataProvider.js";
export { FormEngineSelectors } from "./internal/selectors.js";
export { FormEngineStateAdapter } from "./internal/state.js";

export type { ExistingFile } from "./internal/attachments/utils.js";

export { preProcessDocument } from "./internal/preProcessDocument.js";
export type {
	PreProcessDocumentParams,
	PreProcessDocumentResult
} from "./internal/preProcessDocument.js";

/**
 * Client middlewares for the Form-Engine. Add the returned middlewares to your
 * Redux setup.
 *
 * Note: When passing any configuration or doing any customization, make sure to
 * keep it consistent with the views.
 *
 * @param middlewareOptions Options to customize the middlewares
 */
export function createFormEngineMiddlewares(
	middlewareOptions?: Partial<MiddlewareOptions>
): Middleware[] {
	return [engineMiddlewareAdapterFactory(createEngineMiddlewares(middlewareOptions))];
}

/**
 * Client sagas for the Form-Engine. Add these to your Redux setup.
 * Can be configured, see {@link FormEngineSagaOptions}.
 */
export function formEngineSagas(options?: FormEngineSagaOptions) {
	return [resetUiDirtyStateOnSave, ...createAttachmentSagas(options)];
}

function createAttachmentSagas(options?: FormEngineSagaOptions) {
	return [() => uploadSaga(options), () => deleteSaga(options), () => downloadSaga(options)];
}

/**
 * Client reducers for the Form-Engine. Add these to your Redux setup.
 */
export const formEngineDataReducers = [uiStateReducer, attachmentReducer];

/**
 * # Form-Engine related views.
 *
 * React components for usage as a Client View.
 *
 * Note: When passing any configuration or doing any customization, make sure
 * to keep it consistent with the middlewares.
 *
 * ## Configuration
 *
 * You can set Form-Engine config and ScrollHandler props. For this, compose the
 * `FormEngineViews.FormEngine` component to create your own View
 * component.
 *
 * ## Custom behavior (high level)
 *
 * If you want to change other props like data or models, please use
 * `FormEngineViews.FormEngineTpl` or the components of the formengine
 * package and connect them to the store yourself. Most likely you want to
 * compose your connect functions from {@link FormEngineStateAdapter.mapStateToProps}
 * and {@link FormEngineActions.mapDispatchToProps}.
 *
 * ## Custom behavior (low level)
 *
 * For more fine-grained control over state->props mapping, you can reuse the
 * individual selectors in {@link FormEngineSelectors}.
 */
export namespace FormEngineViews {
	export type FormEngineProps = FormEnginePropsInternal;
	export type FormEngineTplProps = FormEngineTplPropsInternal;
	export type FormEngineScrollHandlerProps = FormEngineScrollHandlerPropsInternal;

	/**
	 * The default view component for the Form-Engine, connected to the Client
	 * store. You can use it directly as a View component in application models.
	 *
	 * This component consists of a ScrollHandler, ContentBox and the actual
	 * FormEngine.
	 */
	export const FormEngine: FunctionComponent<FormEngineProps> = FormEngineView;

	/**
	 * Wrap the Form-Engine with this component to activate the default
	 * scrolling behavior. You only need this component if you don't use the
	 * {@link FormEngine} component.
	 */
	export const ScrollHandler: FunctionComponent<FormEngineScrollHandlerProps> =
		FormEngineScrollHandler;

	/**
	 * An alternative to {@link FormEngine} with the same
	 * configuration, except it is not connected to the store.
	 */
	export const FormEngineTpl: FunctionComponent<FormEngineTplProps> = FormEngineViewTpl;
}
