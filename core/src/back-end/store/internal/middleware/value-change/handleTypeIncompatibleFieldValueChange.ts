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

import type { Action, Dispatch } from "redux";

import type { EntityInstancePath, GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import {
	DocumentPath,
	DocumentUtils
} from "../../../../../models/internal/utils/document-utils.js";
import { ReadonlyObjectMap } from "../../../../../models/internal/utils/json.js";
import { Commands } from "../../actions.js";
import { KernelComputation } from "../../computation.js";
import { ChangeMapCreators } from "../../documentChange.js";
import { isComputedField, isPartOfComputation } from "../../kernel-adapter.js";
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
	dispatch: Dispatch<Action>;
	middlewareOptions: MiddlewareOptions;
	validationParseError: EngineStore.Validation.ParseError;
}): void {
	const originalDocument = DataSelectors.document()(state) as GroupInstance;
	const documentModel = ModelSelectors.documentModel()(state);
	const validationCode = ModelSelectors.validationCode()(state);

	let newMessages = UiStateSelectors.messages()(state);
	let newDocument = DocumentUtils.setValue(originalDocument, path, null, documentModel);
	const changesToDispatch = ChangeMapCreators.createValueChanged(path);

	if (validationCode && isPartOfComputation(validationCode, path)) {
		({ document: newDocument, messages: newMessages } =
			KernelComputation.internalComputeThenValidate({
				document: newDocument,
				messages: newMessages,
				middlewareOptions,
				state
			}));

		newMessages = ReadonlyObjectMap.filter(newMessages, (key, entry) => {
			if (
				entry?.parseError !== undefined &&
				isComputedField(validationCode, DocumentPath.fromString(key))
			) {
				return DocumentUtils.getAssignedObject(newDocument, DocumentPath.fromString(key)) != null;
			}
			return true;
		});
	}

	if (newDocument !== originalDocument) {
		updateDocument(dispatch, state, newDocument, [...ReadonlyObjectMap.values(changesToDispatch)]);
	}
	updateUiDirtyState(dispatch, state);
	newMessages = {
		...newMessages,
		[DocumentPath.toString(path)]: { parseError: validationParseError, validationMessages: [] }
	};
	dispatch(Commands.setMessageState({ messages: newMessages }));
}
