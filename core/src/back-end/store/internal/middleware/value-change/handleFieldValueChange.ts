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

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import type {
	EntityInstancePath,
	FieldInstanceValue,
	GroupInstance
} from "@com.mgmtp.a12.kernel/kernel-md-facade";

import { ReadonlyObjectMap } from "../../../../../models/internal/utils/json.js";
import { Commands } from "../../actions.js";
import { validateChangesAndUpdateMessages } from "../../change-validation.js";
import { collectRelevantFields } from "../../collectRelevantFields.js";
import { isComputedField } from "../../kernel-adapter.js";
import { messageStateIsEqual } from "../../messageStateIsEqual.js";
import { DataSelectors } from "../../selectors/data.js";
import { ModelSelectors } from "../../selectors/models.js";
import { UiStateSelectors } from "../../selectors/ui-state.js";
import type { EngineState } from "../../store.js";

import type { MiddlewareOptions } from "../middleware-options.js";

import { updateDependencies } from "./updateDependencies.js";
import { updateDocument } from "./updateDocument.js";
import { updateFieldInstance } from "./updateFieldInstance.js";

/**
 * @internal
 */
export function handleFieldValueChange({
	path,
	state,
	dispatch,
	middlewareOptions,
	value,
	formModelElementPath
}: {
	path: EntityInstancePath;
	state: EngineState;
	dispatch: Dispatch<Action>;
	middlewareOptions: MiddlewareOptions;
	value: FieldInstanceValue;
	formModelElementPath?: ModelPath;
}): void {
	const document = DataSelectors.document()(state) as GroupInstance;
	const documentModel = ModelSelectors.documentModel()(state);
	const validationCode = ModelSelectors.validationCode()(state);
	const formModel = ModelSelectors.formModel()(state);
	const initialMessages = UiStateSelectors.messages()(state);

	const {
		document: documentAfterField,
		messages: messagesAfterField,
		changes: fieldChanges
	} = updateFieldInstance({
		state,
		documentPath: path,
		value,
		document,
		messages: initialMessages,
		middlewareOptions,
		validationCode,
		formModelElementPath
	});

	if (fieldChanges === undefined) {
		if (!messageStateIsEqual(initialMessages, messagesAfterField)) {
			dispatch(Commands.setMessageState({ messages: messagesAfterField }));
		}
		return;
	}

	const {
		changes: computationResultChanges,
		document: computationResultDocument,
		parseErrors
	} = updateDependencies({
		state,
		document: documentAfterField,
		kernelOptions: middlewareOptions.kernelOptionsProvider?.(state),
		changes: fieldChanges
	});

	const intermediateState: EngineState = {
		...state,
		data: { ...state.data, document: computationResultDocument }
	};
	const relevantFieldPaths = collectRelevantFields(intermediateState).map(
		field => field.documentPath
	);

	const computedFieldPredicate =
		validationCode !== undefined
			? (path: EntityInstancePath) => isComputedField(validationCode, path)
			: undefined;

	const finalMessages = validateChangesAndUpdateMessages({
		changes: computationResultChanges,
		document: computationResultDocument,
		initialMessages,
		kernelOptions: middlewareOptions.kernelOptionsProvider?.(state),
		models: { documentModel, formModel, validatorProvider: validationCode },
		parsingErrorsAfterComputation: parseErrors,
		relevantFieldPaths,
		isComputedField: computedFieldPredicate
	});

	updateDocument(dispatch, state, computationResultDocument, [
		...ReadonlyObjectMap.values(computationResultChanges)
	]);

	if (!messageStateIsEqual(initialMessages, finalMessages)) {
		dispatch(Commands.setMessageState({ messages: finalMessages }));
	}
}
