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

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import {
	isFormModel,
	isFormModelButtonPanel,
	isFormModelControlGrid,
	isFormModelDetachedRepeat,
	isFormModelEmbeddedRepeat,
	isFormModelHeaderFooterType,
	isFormModelInlineRepeat,
	isFormModelMultiColumnSection,
	isFormModelRow,
	isFormModelScreen,
	isFormModelSection
} from "../../../models/internal/FormModelGuards.js";

import type { FormModel } from "../form-model.js";

import { findEditableElements } from "./EditableElement.js";
import { getModelPathElementName } from "./form-model-path.js";

type MatchGuard = <T extends object>(element: T | undefined) => T | undefined;

/** Returns the element if it matches the path segment or undefined otherwise. */
function createMatchGuard(name: string): MatchGuard {
	return function matchGuard(element) {
		if (element === undefined) {
			return undefined;
		}

		// Using modelPathRepresentation is slow in comparison to use `element.name || element.id`
		const elementName = getModelPathElementName(element);
		return elementName === name ? element : undefined;
	};
}

/**
 * @internal
 * @ignore
 */
export const FormModelUtils = {
	/** @internal */
	getChild(formModelElement: object, name: string): object | undefined {
		const matchGuard = createMatchGuard(name);

		if (isFormModel(formModelElement)) {
			return (
				formModelElement.content.screens.find(matchGuard) ||
				matchGuard(formModelElement.content.subHeaderBox) ||
				matchGuard(formModelElement.content.footerBox)
			);
		} else if (isFormModelScreen(formModelElement)) {
			return (
				formModelElement.screenElements.find(matchGuard) ||
				matchGuard(formModelElement.subHeaderBox) ||
				matchGuard(formModelElement.footerBox)
			);
		} else if (isFormModelHeaderFooterType(formModelElement)) {
			return (
				formModelElement.majorButtons?.button?.find(matchGuard) ||
				formModelElement.minorButtons?.button?.find(matchGuard)
			);
		} else if (isFormModelButtonPanel(formModelElement)) {
			return formModelElement.button?.find(matchGuard);
		} else if (isFormModelSection(formModelElement)) {
			return formModelElement.screenElements?.find(matchGuard);
		} else if (isFormModelMultiColumnSection(formModelElement)) {
			return formModelElement.screenElements?.find(matchGuard);
		} else if (isFormModelControlGrid(formModelElement)) {
			return formModelElement.row?.find(matchGuard);
		} else if (isFormModelRow(formModelElement)) {
			return formModelElement.cell?.find(matchGuard);
		} else if (isFormModelInlineRepeat(formModelElement)) {
			return formModelElement.repeatOverviewColumn?.find(matchGuard);
		} else if (isFormModelDetachedRepeat(formModelElement)) {
			return (
				formModelElement.repeatOverviewColumn?.find(matchGuard) ||
				matchGuard(formModelElement.detailScreen)
			);
		} else if (isFormModelEmbeddedRepeat(formModelElement)) {
			return (
				formModelElement.repeatOverviewColumn?.find(matchGuard) ||
				matchGuard(formModelElement.controlGrid)
			);
		} else {
			return undefined;
		}
	},

	/** @internal */
	findPathElementsByFormModelPath(currentElement: object, targetPath: ModelPath): object[] {
		const result = [currentElement];

		for (let i = 0; i < targetPath.length; i++) {
			const element = FormModelUtils.getChild(result[i], targetPath[i].elementName);
			if (element === undefined) {
				throw new Error(`Invalid Form Model Path: ${ModelPath.toString(targetPath)}`);
			}

			result.push(element);
		}

		return result;
	},

	/** @internal */
	findFirstOccurrenceOfControlByDocumentPath(
		currentElement: object,
		documentModelPath: ModelPath
	): { formModelPath: ModelPath; element: FormModel.FieldBasedInputType } | undefined {
		const matches = (elementPath: ModelPath) => {
			return ModelPath.contains(documentModelPath, elementPath);
		};
		const elements = findEditableElements(currentElement, matches, true);
		if (elements.length > 0) {
			const firstElement = elements[0];
			return {
				formModelPath: firstElement.relativeFormModelPath,
				element: firstElement.formModelElement
			};
		}

		return undefined;
	},

	/** @internal */
	isExternalEnum(
		dataType: DocumentModel.FieldType,
		fce?: FormModel.FieldConfigurationEntry
	): boolean {
		return (
			dataType.type === "StringType" && fce !== undefined && fce.externalEnumeration !== undefined
		);
	},

	/** @internal */
	isEnumerable(
		dataType: DocumentModel.FieldType,
		fce?: FormModel.FieldConfigurationEntry
	): boolean {
		return dataType.type === "EnumerationType" || FormModelUtils.isExternalEnum(dataType, fce);
	}
};
