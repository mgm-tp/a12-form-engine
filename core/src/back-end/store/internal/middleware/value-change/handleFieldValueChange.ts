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

import type { Dispatch } from "redux";
import type { AnyAction } from "typescript-fsa";

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type {
	EntityInstancePath,
	FieldInstanceValue,
	GroupInstance
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import { ReadonlyObjectMap } from "../../../../../models/internal/utils/json.js";
import { Commands } from "../../actions.js";
import { validateChangesAndUpdateMessages } from "../../change-validation.js";
import { collectRelevantFields } from "../../collectRelevantFields.js";
import type { Change } from "../../documentChange.js";
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
	dispatch: Dispatch<AnyAction>;
	middlewareOptions: MiddlewareOptions;
	value: FieldInstanceValue;
	formModelElementPath?: ModelPath;
}): void {
	const document = DataSelectors.document()(state) as GroupInstance;
	let newDocument = document;
	const documentModel = ModelSelectors.documentModel()(state);
	const validationCode = ModelSelectors.validationCode()(state);
	const formModel = ModelSelectors.formModel()(state);

	const initialMessages = UiStateSelectors.messages()(state);
	let newMessages = initialMessages;

	let changes: ReadonlyObjectMap<Change> | undefined;
	({
		document: newDocument,
		messages: newMessages,
		changes
	} = updateFieldInstance({
		state,
		documentPath: path,
		value,
		document: newDocument,
		messages: newMessages,
		options: middlewareOptions,
		validationCode,
		formModelElementPath
	}));

	if (changes !== undefined) {
		const result = updateDependencies({
			state,
			document: newDocument,
			options: middlewareOptions,
			changes
		});

		newDocument = result.document;
		changes = result.changes;

		/**
		 * FIXME: This is only necessary to collect the set of relevant fields
		 * on the updated document.
		 * It should be removed again with A12E-3365
		 */
		const intermediateState: EngineState = {
			...state,
			data: {
				...state.data,
				document: newDocument
			}
		};

		const relevantFieldPaths = collectRelevantFields(intermediateState).map(
			field => field.documentPath
		);

		newMessages = validateChangesAndUpdateMessages({
			changes: changes,
			document: newDocument,
			initialMessages,
			kernelConfiguration: {
				now: middlewareOptions.nowProvider?.(state)
			},
			models: { documentModel, formModel, validatorProvider: validationCode },
			parsingErrorsAfterComputation: result.parseErrors,
			relevantFieldPaths
		});

		updateDocument(dispatch, state, newDocument, [...ReadonlyObjectMap.values(changes)]);
	}

	if (!messageStateIsEqual(initialMessages, newMessages)) {
		dispatch(Commands.setMessageState({ messages: newMessages }));
	}
}
