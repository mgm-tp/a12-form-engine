// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type {
	DocumentModel,
	EntityInstancePath,
	GroupInstance
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import { DocumentUtils } from "../../../models/internal/utils/document-utils.js";
import type { ReadonlyObjectMap } from "../../../models/internal/utils/json.js";
import type { DetailedUpdateResult } from "../../store/internal/DetailedUpdateResult.js";
import type { Change } from "../../store/internal/documentChange.js";
import { ChangeMapCreators } from "../../store/internal/documentChange.js";
import { EngineStore } from "../../store/internal/store.js";

/** @internal */
export interface UpdateResult {
	readonly document: GroupInstance;
	readonly messages: ReadonlyObjectMap<EngineStore.Validation.Entry>;
	readonly changed: boolean;
}

/**
 * @internal
 * @ignore
 */
export namespace DataUtils {
	/**
	 * @internal
	 *
	 * Function to move a row in a repeatable group.
	 * The row instance has to be moved in the document and
	 * the errors-messages have to be updated.
	 */
	export function moveRow(
		json: GroupInstance,
		rowPath: EntityInstancePath,
		delta: number,
		messages: ReadonlyObjectMap<EngineStore.Validation.Entry>,
		documentModel: DocumentModel
	): UpdateResult {
		const newDocument = DocumentUtils.moveRow(json, rowPath, delta, documentModel);
		const newMessages: ReadonlyObjectMap<EngineStore.Validation.Entry> =
			EngineStore.Validation.Message.updateMessagesPaths(messages, rowPath, documentModel, delta);
		return { document: newDocument, messages: newMessages, changed: true };
	}

	/**
	 * @internal
	 *
	 * Removes a row.
	 * The row has to be removed from the document and
	 * the error message references have to be updated.
	 */
	export function removeRow(
		documentPath: EntityInstancePath,
		initialDocument: GroupInstance,
		modelElement: DocumentModel
	): DetailedUpdateResult {
		const document = DocumentUtils.removeRow(initialDocument, documentPath, modelElement);
		const changes: ReadonlyObjectMap<Change> =
			document !== initialDocument ? ChangeMapCreators.createGroupRemoved(documentPath) : {};
		return { document, changes };
	}
}
