// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { AnyAction, Dispatch } from "redux";

import type {
	EntityInstancePath,
	GroupInstance
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import {
	DocumentPath,
	DocumentUtils
} from "../../../../../models/internal/utils/document-utils.js";
import { Commands } from "../../actions.js";
import { KernelComputation } from "../../computation.js";
import { isPartOfComputation } from "../../kernel-adapter.js";
import { DataSelectors } from "../../selectors/data.js";
import { ModelSelectors } from "../../selectors/models.js";
import { UiStateSelectors } from "../../selectors/ui-state.js";
import type { EngineState, EngineStore } from "../../store.js";

import type { MiddlewareOptions } from "../middleware-options.js";
import { updateUiDirtyState } from "../updateDirtyState.js";

import { updateDocument } from "./updateDocument.js";

/**
 * @internal
 *
 * Handles field value changes that were already found to be invalid by the basic type check
 */
export function handleTypeIncompatibleFieldValueChange({
	path,
	state,
	dispatch,
	middlewareOptions,
	validationParseError
}: {
	path: EntityInstancePath;
	state: EngineState;
	dispatch: Dispatch<AnyAction>;
	middlewareOptions: MiddlewareOptions;
	validationParseError: EngineStore.Validation.ParseError;
}): void {
	const originalDocument = DataSelectors.document()(state) as GroupInstance;
	const documentModel = ModelSelectors.documentModel()(state);
	const validationCode = ModelSelectors.validationCode()(state);

	let newMessages = UiStateSelectors.messages()(state);

	let newDocument = DocumentUtils.setValue(originalDocument, path, null, documentModel);
	if (validationCode && isPartOfComputation(validationCode, path)) {
		({ document: newDocument, messages: newMessages } =
			KernelComputation.internalComputeThenValidate({
				document: newDocument,
				messages: newMessages,
				middlewareOptions,
				state
			}));
	}
	if (newDocument !== originalDocument) {
		updateDocument(dispatch, state, newDocument, [{ type: "ValueChanged", path }]);
	}
	updateUiDirtyState(dispatch, state);
	// update all messages, because it can be that after the computation other fields
	// do not have an error message anymore (for example if their computed value was deleted)
	newMessages = {
		...newMessages,
		[DocumentPath.toString(path)]: { parseError: validationParseError, validationMessages: [] }
	};
	dispatch(Commands.setMessageState({ messages: newMessages }));
}
