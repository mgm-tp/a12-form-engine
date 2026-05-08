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

import { DocumentHelpers } from "../document-helpers.js";
import { ModelHelpers } from "../model-helpers.js";

export namespace FORM_MODEL {
	export namespace IR {
		export const locationPath = ModelHelpers.createModelPath("InlineRepeat");
		export const withInitialValues = ModelHelpers.createModelPath(
			"InlineRepeat",
			"inline-repeat-repInitialValues"
		);
		export const withInitialValuesAddButton = "a12-add-button-inlinerepeat-473df";

		export const withInitialValuesAndError = ModelHelpers.createModelPath(
			"InlineRepeat",
			"inline-repeat-repInitialValuesAndError"
		);
		export const withPageSize = ModelHelpers.createModelPath(
			"InlineRepeat",
			"inline-repeat-repPageSize"
		);
		export const withInfiniteScrolling = ModelHelpers.createModelPath(
			"InlineRepeat",
			"inline-repeat-repInfiniteScrolling"
		);

		export const readonly = ModelHelpers.createModelPath("InlineRepeat", "inline-repeat-rep");

		export const readonlyByDependency = ModelHelpers.createModelPath(
			"InlineRepeat",
			"sec1",
			"inline-repeat-repeatReadonlyByDependency"
		);
		export const readonlyByDependencyAddButton = "a12-add-button-inlinerepeat-fd279";
		export const readonlyRepeatTableId = "inlinerepeat-0faf5";
		export const enableAddFalseTableId = "inlinerepeat_7a2a9";
		export const enableAddUndefinedTableId = "inlinerepeat_116af";
	}

	export namespace DR {
		export const locationPath = ModelHelpers.createModelPath("DetachedRepeat");
		export const withInitialValues = ModelHelpers.createModelPath(
			"DetachedRepeat",
			"detached-repeat-repInitialValues"
		);
		export const withInitialValuesAddButton = "a12-add-button-detachedrepeat-79cf7";
		export const nestedAddButton = "a12-add-button-inlinerepeat-67966";

		export const withNestedRepeats = ModelHelpers.createModelPath(
			"DetachedRepeat",
			"detached-repeat-rep"
		);

		export const withNestedRepeatsDetailScreen = ModelHelpers.createModelPath(
			"DetachedRepeat",
			"detached-repeat-rep",
			"detached-repeat-rep-detail-screen"
		);

		export const irInNestedDetachedRepeat = [
			...withNestedRepeatsDetailScreen,
			{ elementName: "inline-repeat-nestedRepInitialRows" }
		];

		export const drInNestedDetachedRepeat = [
			...withNestedRepeatsDetailScreen,
			{ elementName: "detached-repeat-nestedRep" }
		];

		export const erInNestedDetachedRepeat = [
			...withNestedRepeatsDetailScreen,
			{ elementName: "embedded-repeat-nestedRep" }
		];

		export const withInitialValuesAndError = ModelHelpers.createModelPath(
			"DetachedRepeat",
			"detached-repeat-repInitialValuesAndError"
		);
		export const withPageSize = ModelHelpers.createModelPath(
			"DetachedRepeat",
			"detached-repeat-repPageSize"
		);
		export const withInfiniteScrolling = ModelHelpers.createModelPath(
			"DetachedRepeat",
			"detached-repeat-repInfiniteScrolling"
		);

		export const readonly = ModelHelpers.createModelPath("DetachedRepeat", "detached-repeat-rep");

		export const readonlyByDependency = ModelHelpers.createModelPath(
			"DetachedRepeat",
			"sec1",
			"detached-repeat-repeatReadonlyByDependency"
		);
		export const readonlyByDependencyAddButton = "a12-add-button-detachedrepeat-f4481";
		export const readonlyRepeatTableId = "detachedrepeat-62714";

		export const enableAddFalseTableId = "detachedrepeat_2cfbf";
		export const enableAddUndefinedTableId = "detachedrepeat_2d60d";
	}

	export namespace ER {
		export const locationPath = ModelHelpers.createModelPath("EmbeddedRepeat");
		export const withInitialValues = ModelHelpers.createModelPath(
			"EmbeddedRepeat",
			"embedded-repeat-repInitialValues"
		);
		export const withInitialValuesAddButton = "a12-add-button-embeddedrepeat-4cc4a";

		export const withPageSize = ModelHelpers.createModelPath(
			"EmbeddedRepeat",
			"embedded-repeat-repPageSize"
		);

		export const readonly = ModelHelpers.createModelPath("EmbeddedRepeat", "embedded-repeat-rep");

		export const readonlyByDependency = ModelHelpers.createModelPath(
			"EmbeddedRepeat",
			"sec1",
			"embedded-repeat-repeatReadonlyByDependency"
		);
		export const readonlyByDependencyAddButton = "a12-add-button-embeddedrepeat-b905e";
		export const readonlyRepeatTableId = "embeddedrepeat-86d91";

		export const enableAddFalseTableId = "embeddedrepeat_0cc9e";
		export const enableAddUndefinedTableId = "embeddedrepeat_78801";
	}
}

export namespace DOCUMENT_MODEL {
	export const repInitialValues = DocumentHelpers.createDocumentPath(["repInitialValues", 0]);

	export const repInitialValuesAndError = DocumentHelpers.createDocumentPath([
		"repInitialValuesAndError",
		0
	]);
	export const repInfiniteScrolling = DocumentHelpers.createDocumentPath([
		"repInfiniteScrolling",
		0
	]);
	export const rep = DocumentHelpers.createDocumentPath(["rep", 0]);
	export const repPageSize = DocumentHelpers.createDocumentPath(["repPageSize", 0]);
}
