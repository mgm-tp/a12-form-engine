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

import { useContext, useMemo } from "react";
import { useSelector } from "react-redux";

import { DocumentPath, KernelMessage } from "@com.mgmtp.a12.client/client-data";
import type { DocumentContext } from "@com.mgmtp.a12.contentengine/contentengine-core";
import { useDocumentContext } from "@com.mgmtp.a12.contentengine/contentengine-core";
import type {
	DocumentModel,
	EntityInstancePath,
	Message
} from "@com.mgmtp.a12.kernel/kernel-md-facade";
import type { Localizer } from "@com.mgmtp.a12.utils/utils-localization";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react";

import { FormElementContext } from "../../../configuration/formElementContext.js";
import { getPlainLocalizabledLabel } from "../../elementConfiguration/getLocalizedModelTexts.js";
import type { FunctionMap } from "../../functionMap/functionMap.js";
import { FunctionMapContext } from "../../functionMap/functionMapContext.js";
import { UiId } from "../../generateUiId.js";

import { EditableElementsContext } from "../messageGroupContainer/editableElementsContext.js";
import type { EditableElementList } from "../messageGroupContainer/useCollectEditableElements.js";

/** @internal */
export interface LinkDataItem {
	readonly nodeId: string;
	readonly label: string | undefined;
}

/** @internal */
export function useLinkData(message: Message): LinkDataItem[] {
	const { contentModelName, config } = useContext(FormElementContext);
	const editableElements = useContext(EditableElementsContext);
	const { localizer } = useContext(LocalizerContext);
	const { computeVirtualNodeId } = useContext(FunctionMapContext);
	const { getElementByPath, getDocumentModelName } = useDocumentContext(c => c.model);

	const errorFields = KernelMessage.effectiveFieldReferences(message);

	const selectLinkData = useMemo(
		() =>
			createLinkDataSelector({
				editableElements,
				errorFields,
				uiIdPrefix: config.uiIdPrefix,
				contentModelName,
				localizer,
				getDocumentModelName,
				getElementByPath,
				computeVirtualNodeId
			}),
		[
			editableElements,
			errorFields,
			config.uiIdPrefix,
			contentModelName,
			localizer,
			getDocumentModelName,
			getElementByPath,
			computeVirtualNodeId
		]
	);

	return useSelector(selectLinkData);
}

/** @internal */
export interface LinkDataSelectorOptions {
	readonly editableElements: EditableElementList;
	readonly errorFields: EntityInstancePath[];
	readonly uiIdPrefix?: string;
	readonly contentModelName: string;
	readonly localizer: Localizer;
	readonly getDocumentModelName: DocumentContext["model"]["getDocumentModelName"];
	readonly getElementByPath: DocumentContext["model"]["getElementByPath"];
	readonly computeVirtualNodeId: FunctionMap["computeVirtualNodeId"];
}

function createLinkDataSelector(
	options: LinkDataSelectorOptions
): (state: object) => LinkDataItem[] {
	const {
		editableElements,
		errorFields,
		uiIdPrefix,
		contentModelName,
		localizer,
		getDocumentModelName,
		getElementByPath,
		computeVirtualNodeId
	} = options;

	return (state: object): LinkDataItem[] => {
		return editableElements.flatMap(editableElement => {
			const documentModelName = getDocumentModelName(state) ?? "";

			return errorFields.flatMap(ef => {
				// Note: contains instead of equals for multi-selects
				if (!DocumentPath.contains(ef, editableElement.documentPath)) {
					return [];
				}

				const dmElement = getElementByPath(state, ef);
				const dataContext = findDataContext(state, ef, getElementByPath);

				const virtualNodeId = computeVirtualNodeId(
					DocumentPath.toString(dataContext),
					editableElement.nodeId
				);
				const uiId = UiId.generateForControl({
					controlId: virtualNodeId,
					elementPath: editableElement.documentPath,
					uiIdPrefix
				});

				const localizedLabel = getPlainLocalizabledLabel({
					contentModelName,
					nodeId: editableElement.nodeId,
					label: editableElement.label,
					documentModelName,
					dmElement,
					documentPath: ef,
					localizer
				});

				return { nodeId: uiId, label: localizedLabel };
			});
		});
	};
}

function findDataContext(
	state: object,
	docPath: EntityInstancePath,
	getElementByPath: (state: object, path: EntityInstancePath) => DocumentModel.Element
): EntityInstancePath {
	for (let i = docPath.length; i >= 1; i--) {
		const prefix = docPath.slice(0, i);
		const element = getElementByPath(state, prefix);
		if (element.type === "Group" && element.repeatability > 1) {
			return prefix;
		}
	}
	return [];
}
