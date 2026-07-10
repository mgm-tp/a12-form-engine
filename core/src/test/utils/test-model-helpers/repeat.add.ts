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

import { createDocumentPath } from "../createDocumentPath.js";
import { createModelPath } from "../createModelPath.js";

const withNestedRepeatsDetailScreen = createModelPath(
	"DetachedRepeat",
	"detached-repeat-rep",
	"detached-repeat-rep-detail-screen"
);

export const FORM_MODEL = {
	IR: {
		locationPath: createModelPath("InlineRepeat"),
		withInitialValues: createModelPath("InlineRepeat", "inline-repeat-repInitialValues"),
		withInitialValuesAddButton: "a12-add-button-inlinerepeat-473df",
		withInitialValuesAndError: createModelPath(
			"InlineRepeat",
			"inline-repeat-repInitialValuesAndError"
		),
		withPageSize: createModelPath("InlineRepeat", "inline-repeat-repPageSize"),
		withInfiniteScrolling: createModelPath("InlineRepeat", "inline-repeat-repInfiniteScrolling"),
		readonly: createModelPath("InlineRepeat", "inline-repeat-rep"),
		readonlyByDependency: createModelPath(
			"InlineRepeat",
			"sec1",
			"inline-repeat-repeatReadonlyByDependency"
		),
		readonlyByDependencyAddButton: "a12-add-button-inlinerepeat-fd279",
		readonlyRepeatTableId: "inlinerepeat-0faf5",
		enableAddFalseTableId: "inlinerepeat_7a2a9",
		enableAddUndefinedTableId: "inlinerepeat_116af"
	},
	DR: {
		locationPath: createModelPath("DetachedRepeat"),
		withInitialValues: createModelPath("DetachedRepeat", "detached-repeat-repInitialValues"),
		withInitialValuesAddButton: "a12-add-button-detachedrepeat-79cf7",
		nestedAddButton: "a12-add-button-inlinerepeat-67966",
		withNestedRepeats: createModelPath("DetachedRepeat", "detached-repeat-rep"),
		withNestedRepeatsDetailScreen,
		irInNestedDetachedRepeat: [
			...withNestedRepeatsDetailScreen,
			{ elementName: "inline-repeat-nestedRepInitialRows" }
		],
		drInNestedDetachedRepeat: [
			...withNestedRepeatsDetailScreen,
			{ elementName: "detached-repeat-nestedRep" }
		],
		erInNestedDetachedRepeat: [
			...withNestedRepeatsDetailScreen,
			{ elementName: "embedded-repeat-nestedRep" }
		],
		withInitialValuesAndError: createModelPath(
			"DetachedRepeat",
			"detached-repeat-repInitialValuesAndError"
		),
		withPageSize: createModelPath("DetachedRepeat", "detached-repeat-repPageSize"),
		withInfiniteScrolling: createModelPath(
			"DetachedRepeat",
			"detached-repeat-repInfiniteScrolling"
		),
		readonly: createModelPath("DetachedRepeat", "detached-repeat-rep"),
		readonlyByDependency: createModelPath(
			"DetachedRepeat",
			"sec1",
			"detached-repeat-repeatReadonlyByDependency"
		),
		readonlyByDependencyAddButton: "a12-add-button-detachedrepeat-f4481",
		readonlyRepeatTableId: "detachedrepeat-62714",
		enableAddFalseTableId: "detachedrepeat_2cfbf",
		enableAddUndefinedTableId: "detachedrepeat_2d60d"
	},
	ER: {
		locationPath: createModelPath("EmbeddedRepeat"),
		withInitialValues: createModelPath("EmbeddedRepeat", "embedded-repeat-repInitialValues"),
		withInitialValuesAddButton: "a12-add-button-embeddedrepeat-4cc4a",
		withPageSize: createModelPath("EmbeddedRepeat", "embedded-repeat-repPageSize"),
		readonly: createModelPath("EmbeddedRepeat", "embedded-repeat-rep"),
		readonlyByDependency: createModelPath(
			"EmbeddedRepeat",
			"sec1",
			"embedded-repeat-repeatReadonlyByDependency"
		),
		readonlyByDependencyAddButton: "a12-add-button-embeddedrepeat-b905e",
		readonlyRepeatTableId: "embeddedrepeat-86d91",
		enableAddFalseTableId: "embeddedrepeat_0cc9e",
		enableAddUndefinedTableId: "embeddedrepeat_78801"
	}
};

export const DOCUMENT_MODEL = {
	repInitialValues: createDocumentPath(["repInitialValues", 0]),
	repInitialValuesAndError: createDocumentPath(["repInitialValuesAndError", 0]),
	repInfiniteScrolling: createDocumentPath(["repInfiniteScrolling", 0]),
	rep: createDocumentPath(["rep", 0]),
	repPageSize: createDocumentPath(["repPageSize", 0])
} as const;
