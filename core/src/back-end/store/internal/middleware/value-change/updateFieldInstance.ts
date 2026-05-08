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

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type { Attachment } from "@com.mgmtp.a12.dataservices/dataservices-access/lib/Attachment/attachment.js";
import type {
	EntityInstancePath,
	FieldInstanceValue,
	GroupInstance,
	IGeneratedCodeAccessor
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { MultiSelectData } from "../../../../../models/index.js";
import {
	DocumentPath,
	DocumentUtils,
	IndexedControl
} from "../../../../../models/internal/utils/document-utils.js";
import type { ReadonlyObjectMap } from "../../../../../models/internal/utils/json.js";
import type { UpdateResult } from "../../../../utils/internal/edit-document-utils.js";
import { validateChangesAndUpdateMessages } from "../../change-validation.js";
import type { Change } from "../../documentChange.js";
import { ChangeMapCreators } from "../../documentChange.js";
import { ModelSelectors } from "../../selectors/models.js";
import type { EngineState, EngineStore } from "../../store.js";

import type { MiddlewareOptions } from "../middleware-options.js";

/**
 * @internal
 */
export function updateFieldInstance({
	document: initialDocument,
	messages: initialMessages,
	documentPath,
	options,
	state,
	value,
	formModelElementPath
}: UpdateFieldInstanceArgs): UpdateResult & { changes?: ReadonlyObjectMap<Change> } {
	let document = initialDocument;
	let messages = initialMessages;
	const documentModel = ModelSelectors.documentModel()(state);
	const validationCode = ModelSelectors.validationCode()(state);
	const formModel = ModelSelectors.formModel()(state);

	const oldValue = DocumentUtils.getAssignedObject(document, documentPath);
	const valueEqual = DocumentUtils.isValueEqual(value, oldValue);
	if (valueEqual) {
		/**
		 * Happens when an empty value is set after a formal error
		 */
		const change = ChangeMapCreators.createValueChanged(documentPath);
		messages = validateChangesAndUpdateMessages({
			changes: change,
			document,
			initialMessages: messages,
			kernelConfiguration: {
				now: options.nowProvider?.(state)
			},
			models: { documentModel, formModel, validatorProvider: validationCode }
		});
		return { changed: hasSyntaxError(messages, documentPath), messages, document };
	}

	document = formModelElementPath
		? IndexedControl.initializeRowOfControlWithIndex(
				formModel,
				formModelElementPath,
				documentModel,
				document,
				documentPath
			)
		: document;

	document = DocumentUtils.setValue(document, documentPath, value, documentModel);

	return {
		changed: true,
		document,
		messages,
		changes: ChangeMapCreators.createValueChanged(documentPath)
	};
}

function hasSyntaxError(
	messages: ReadonlyObjectMap<EngineStore.Validation.Entry>,
	path: EntityInstancePath
): boolean {
	const error = messages[DocumentPath.toString(path)];
	return error !== undefined && error.parseError !== undefined;
}

interface UpdateFieldInstanceArgs {
	readonly state: EngineState;
	readonly documentPath: EntityInstancePath;
	readonly value: FieldInstanceValue | Attachment | MultiSelectData;
	readonly document: GroupInstance;
	readonly messages: ReadonlyObjectMap<EngineStore.Validation.Entry>;
	readonly validationCode: IGeneratedCodeAccessor | undefined;
	readonly options: MiddlewareOptions;
	readonly formModelElementPath?: ModelPath;
}
