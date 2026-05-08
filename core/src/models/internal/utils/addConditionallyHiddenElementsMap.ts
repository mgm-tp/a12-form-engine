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
import type {
	DocumentModel,
	DocumentModelSearchService
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { DeepMutable, Mutable } from "../../../back-end/utils/internal/types.js";

import type { FormModel } from "../form-model.js";

import { DocumentModelUtils } from "./document-model-utils.js";
import type { ModelVisitor } from "./form-model-walker.js";
import { ModelWalker, VisitProcess } from "./form-model-walker.js";

type MutableConditionallyHiddenElements = {
	[id: string]: Mutable<FormModel.ConditionallyHiddenElementMaster>;
};

type ValueTransformer = (value: string | null) => string | boolean | null;

type MasterFieldCache = {
	[masterFieldId: string]: { path: ModelPath; transformer: ValueTransformer } | null | undefined;
};

/**
 * @internal
 *
 * Creates a runtime optimized lookup map of conditionally hidden
 * elements including the Document Model paths of the master fields and the
 * parsed master values for which they are hidden.
 */
export function addConditionallyHiddenElementsMap(
	formModel: FormModel,
	documentModel: DocumentModel,
	dmSearchService: DocumentModelSearchService
): void {
	const conditionallyHiddenElements: MutableConditionallyHiddenElements = {};
	const masterFieldCache: MasterFieldCache = {};

	const handler = createHideConditionHandler(
		documentModel,
		dmSearchService,
		conditionallyHiddenElements,
		masterFieldCache
	);
	const visitor = createVisitor(handler);

	new ModelWalker(visitor).acceptModel(formModel);

	const mutableFormModel = formModel as DeepMutable<FormModel>;
	mutableFormModel.content.conditionallyHiddenElements = conditionallyHiddenElements;
}

/**
 * Creates a handler that processes hide conditions and collects results
 */
function createHideConditionHandler(
	documentModel: DocumentModel,
	dmSearchService: DocumentModelSearchService,
	result: MutableConditionallyHiddenElements,
	cache: MasterFieldCache
): (element: FormModel.ConditionallyHidden & { id: string }) => VisitProcess {
	function transformMasterValue(transformer: ValueTransformer) {
		return (caze: FormModel.HideConditionCase): string | boolean | null =>
			transformer(caze.masterValue);
	}

	return function handleHideCondition(
		element: FormModel.ConditionallyHidden & { id: string }
	): VisitProcess {
		if (!element.hideCondition) {
			return VisitProcess.ContinueTraversal;
		}

		const masterFieldInfo = getMasterFieldInfo(
			element.hideCondition.masterField,
			documentModel,
			dmSearchService,
			cache
		);
		if (!masterFieldInfo) {
			return VisitProcess.ContinueTraversal;
		}

		result[element.id] = {
			masterFieldModelPath: masterFieldInfo.path,
			values: element.hideCondition.cases.map(transformMasterValue(masterFieldInfo.transformer))
		};

		return VisitProcess.ContinueTraversal;
	};
}

/**
 * Reusable visitor with a configurable handler
 */
function createVisitor(
	handler: (element: FormModel.ConditionallyHidden & { id: string }) => VisitProcess
): ModelVisitor {
	return {
		visitSection: handler,
		visitMultiColumnSection: handler,
		visitControlGrid: handler,
		visitButtonPanel: handler,
		visitInlineRepeat: handler,
		visitDetachedRepeat: handler,
		visitEmbeddedRepeat: handler,
		visitCustomScreenElement: handler,
		visitRow: handler,
		visitControl: handler,
		visitExpressionCell: handler,
		visitTextCell: handler,
		visitCustomCell: handler,
		visitRepeatOverviewColumn: handler
	};
}

/**
 * Looks up master field path and transformer, using cache to avoid repeated lookups
 */
function getMasterFieldInfo(
	masterFieldId: string,
	documentModel: DocumentModel,
	dmSearchService: DocumentModelSearchService,
	cache: MasterFieldCache
): { path: ModelPath; transformer: ValueTransformer } | null {
	const cached = cache[masterFieldId];
	if (cached !== undefined) {
		return cached;
	}

	const masterFieldModelPath = dmSearchService.getPathById(masterFieldId);
	if (!masterFieldModelPath) {
		cache[masterFieldId] = null;
		return null;
	}

	const masterFieldElement = DocumentModelUtils.findByPath(documentModel, masterFieldModelPath);
	const result = {
		path: masterFieldModelPath,
		transformer: getValueTransformer(masterFieldElement)
	};
	cache[masterFieldId] = result;
	return result;
}

/** Returns the appropriate pre-defined transformer for the given document model element */
function getValueTransformer(masterFieldElement: DocumentModel.Element): ValueTransformer {
	if (masterFieldElement.type !== "Field") {
		return identityTransformer;
	}
	switch (masterFieldElement.fieldType.type) {
		case "BooleanType":
			return booleanTransformer;
		case "ConfirmType":
			return confirmTransformer;
		default:
			return identityTransformer;
	}
}

const booleanTransformer: ValueTransformer = (value: string | null) =>
	value === "true" ? true : value === "false" ? false : null;

const confirmTransformer: ValueTransformer = (value: string | null) =>
	value === "true" ? true : null;

// no transformation needed for enum master values
const identityTransformer: ValueTransformer = (value: string | null) => value;
