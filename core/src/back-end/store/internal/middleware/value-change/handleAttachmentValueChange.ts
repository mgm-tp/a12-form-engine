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
import type { Attachment } from "@com.mgmtp.a12.dataservices/dataservices-access";
import type { EntityInstancePath, GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import {
	DocumentUtils,
	IndexedControl
} from "../../../../../models/internal/utils/document-utils.js";
import { ReadonlyObjectMap } from "../../../../../models/internal/utils/json.js";
import { isObjectEmpty } from "../../../../utils/internal/guards.js";
import { Commands } from "../../actions.js";
import { validateChangesAndUpdateMessages } from "../../change-validation.js";
import { collectRelevantFields } from "../../collectRelevantFields.js";
import type { Change } from "../../documentChange.js";
import { ChangeMapCreators } from "../../documentChange.js";
import { messageStateIsEqual } from "../../messageStateIsEqual.js";
import { DataSelectors } from "../../selectors/data.js";
import { ModelSelectors } from "../../selectors/models.js";
import { UiStateSelectors } from "../../selectors/ui-state.js";
import type { EngineState } from "../../store.js";

import type { MiddlewareOptions } from "../middleware-options.js";

import { updateDependencies } from "./updateDependencies.js";
import { updateDocument } from "./updateDocument.js";

/**
 * @internal
 */
export function handleAttachmentValueChange(
	path: EntityInstancePath,
	value: Attachment,
	state: EngineState,
	dispatch: Dispatch<Action>,
	middlewareOptions: MiddlewareOptions,
	formModelElementPath?: ModelPath
): void {
	const document = DataSelectors.document()(state) as GroupInstance;
	const documentModel = ModelSelectors.documentModel()(state);
	const validationCode = ModelSelectors.validationCode()(state);
	const formModel = ModelSelectors.formModel()(state);
	const messages = UiStateSelectors.messages()(state);

	let newDocument = formModelElementPath
		? IndexedControl.initializeRowOfControlWithIndex(
				formModel,
				formModelElementPath,
				documentModel,
				document,
				path
			)
		: document;

	newDocument = DocumentUtils.setValue(newDocument, path, value, documentModel);

	if (newDocument !== document) {
		const oldValue = DocumentUtils.getValue({ document, path }) as Attachment;

		const initialChanges = isObjectEmpty(value)
			? createChangesForAttachment(path, oldValue) // The attachment was removed
			: createChangesForAttachment(path, value);

		const result = updateDependencies({
			state,
			document: newDocument,
			kernelOptions: middlewareOptions.kernelOptionsProvider?.(state),
			changes: initialChanges
		});

		newDocument = result.document;

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

		const newMessages = validateChangesAndUpdateMessages({
			changes: result.changes,
			document: newDocument,
			initialMessages: messages,
			kernelOptions: middlewareOptions.kernelOptionsProvider?.(state),
			models: { documentModel, formModel, validatorProvider: validationCode },
			parsingErrorsAfterComputation: result.parseErrors,
			relevantFieldPaths
		});

		updateDocument(dispatch, state, newDocument, [...ReadonlyObjectMap.values(result.changes)]);

		if (!messageStateIsEqual(messages, newMessages)) {
			dispatch(Commands.setMessageState({ messages: newMessages }));
		}
	}
}

/** @internal */
export function createChangesForAttachment(
	documentPath: EntityInstancePath,
	value: Attachment
): ReadonlyObjectMap<Change> {
	return Object.assign(
		{},
		...Object.keys(value).map(field =>
			ChangeMapCreators.createValueChanged([...documentPath, { elementName: field, index: 1 }])
		)
	);
}
