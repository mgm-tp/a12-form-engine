// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import { Attachment } from "@com.mgmtp.a12.dataservices/dataservices-access/lib/Attachment/attachment.js";
import type {
	Document,
	EntityInstancePath,
	GroupInstance
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { ExistingFile } from "../../../../client-extensions/internal/extensions/form-engine/internal/attachments/utils.js";
import { DocumentUtils } from "../../../../models/internal/utils/document-utils.js";
import { getDocumentPath } from "../../../utils/internal/path.js";

import { filterDocumentByRelevance } from "../filterDocumentByRelevance.js";
import type { EngineState, EngineStore } from "../store.js";

import { engineState } from "./engineState.js";
import { ModelSelectors } from "./models.js";
import type { Selector } from "./selectors.js";
import { UiStateSelectors } from "./ui-state.js";

/**
 * All data state related selector creators.
 */
export namespace DataSelectors {
	/**
	 * @returns a selector that selects the current document dirty state from the state
	 */
	export function dirty(): Selector<boolean> {
		return state => {
			return engineState(state).data.dirty;
		};
	}

	/**
	 * @returns a selector that selects the current document from the state
	 */
	export function document(): Selector<object> {
		return state => {
			return engineState(state).data.document;
		};
	}

	/**
	 * @returns a selector that selects the current document with relevancy from dependencies applied from the state
	 */
	export function relevantDocument(): Selector<object> {
		const documentModelSelector = ModelSelectors.documentModel();
		const formModelSelector = ModelSelectors.formModel();
		return state => {
			return filterDocumentByRelevance(engineState(state).data.document as Document, {
				documentModel: documentModelSelector(state),
				formModel: formModelSelector(state)
			});
		};
	}

	/**
	 * @param documentModelPath The document model path of the field for which the
	 * document path should be selected
	 *
	 * @returns a selector that selects the document path for a given model path
	 * taking the current data context into account
	 */
	export function documentPath(documentModelPath: ModelPath): Selector<EntityInstancePath> {
		const currentScreenLocationSelector = UiStateSelectors.currentScreenLocation();
		const documentModelSelector = ModelSelectors.documentModel();
		return state => {
			const currentContext = currentScreenLocationSelector(state).path;
			return getDocumentPath(documentModelSelector(state), documentModelPath, currentContext);
		};
	}

	/**@internal */
	export namespace Attachments {
		/**@internal */
		export function currentFiles(
			engineState: EngineState,
			repeatDocumentPath: EntityInstancePath,
			attachmentGroupPath: ModelPath
		): ExistingFile[] {
			const documentModel = ModelSelectors.documentModel()(engineState);

			const document = DataSelectors.document()(engineState) as GroupInstance;
			const rows = DocumentUtils.getRows(document, repeatDocumentPath);

			return rows.flatMap((_, rowIndex) => {
				const rowPath = [
					...repeatDocumentPath.slice(0, -1),
					{
						elementName: repeatDocumentPath[repeatDocumentPath.length - 1].elementName,
						index: rowIndex + 1
					}
				];
				const attachmentDocumentPath = getDocumentPath(documentModel, attachmentGroupPath, rowPath);

				const value = DocumentUtils.getValue({ document, path: attachmentDocumentPath });

				return Attachment.isInstance(value) && value.original_filename
					? { fileName: value.original_filename, documentPath: attachmentDocumentPath }
					: [];
			});
		}

		/**@internal */
		export function attachmentState(
			engineState: EngineState
		): EngineStore.AttachmentState | undefined {
			return engineState.data.attachmentState;
		}

		/**@internal */
		export function thumbnail(attachment: Attachment): Selector<string | undefined> {
			return engineState =>
				attachmentState(engineState)?.thumbnails?.[attachment.attachment_id ?? ""];
		}

		/**@internal */
		export function unassignedIds(engineState: EngineState): string[] | undefined {
			return attachmentState(engineState)?.unassigned;
		}

		/**@internal */
		export function isUnassigned(engineState: EngineState, attachment: Attachment): boolean {
			if (!attachment.attachment_id) {
				return false;
			}

			return attachmentState(engineState)?.unassigned?.includes(attachment.attachment_id) ?? false;
		}

		/**@internal */
		export function isLoading(engineState: EngineState, attachmentModelPath: ModelPath): boolean {
			const { loading } = attachmentState(engineState) ?? {};

			return loading !== undefined && ModelPath.equal(loading, attachmentModelPath);
		}
	}
}
