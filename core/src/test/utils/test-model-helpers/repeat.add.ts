// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
