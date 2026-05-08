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

import { deepStrictEqual, strictEqual } from "node:assert/strict";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type { GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import {
	defaultDataFormats,
	defaultLocalizerFactory,
	defaultValueConversion
} from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import {
	createDefaultMiddlewareOptions,
	createEngineStore
} from "../../../back-end/store/index.js";
import type { CorrectionModeItem } from "../../../back-end/store/internal/CorrectionModeItem.js";
import type { EngineState, EngineStore, Models } from "../../../back-end/store/internal/store.js";
import { fullValidation } from "../../../back-end/store/internal/validation.js";
import { DocumentUtils } from "../../../models/internal/utils/document-utils.js";
import type { Config, FormModelMap } from "../../../view/index.js";
import type { UIIssueReport } from "../../../view/internal/components/form-engine/correction-mode/utils.js";
import { CorrectionModeUtil } from "../../../view/internal/components/form-engine/correction-mode/utils.js";
import { DocumentHelpers } from "../../utils/document-helpers.js";
import { US_LOCALE } from "../../utils/localization.js";
import { ModelHelpers } from "../../utils/model-helpers.js";

const { createModelPath } = ModelHelpers;
const { createDocumentPath } = DocumentHelpers;

// Re-export for convenience
export { createDocumentPath, createModelPath, DocumentUtils, ModelPath, US_LOCALE };
export type { CorrectionModeItem, EngineState, EngineStore, GroupInstance, Models, UIIssueReport };

// ============================================================================
// Base Document
// ============================================================================

export const baseDocument = {
	CustomTypes: {
		MultiSelect2: [{ value: "key1" }]
	}
};

export const ROOT_GROUP = "root";

// ============================================================================
// Screen Paths
// ============================================================================

export const screen1 = createModelPath("Screen1");
export const screen2 = createModelPath("Screen2");
export const detailScreenDr1 = [...screen1, ...createModelPath("dr1", "Details")];
export const detailScreenDr1Dr11 = [...detailScreenDr1, ...createModelPath("dr11", "Details")];
export const detailScreenDr1Er11 = [...detailScreenDr1, ...createModelPath("er11")];

// ============================================================================
// Form Model Paths - Top Level Screens
// ============================================================================

export const f2MScreen1 = [...screen1, ...createModelPath("cg1", "row-5118f", "control-772b7")];
export const f21Screen1 = [...screen1, ...createModelPath("cg1", "row-360c9", "control-02df5")];
export const f2MScreen2 = [
	...screen2,
	...createModelPath("cgs2", "row-5118fs2", "control-772b7s2")
];

// ============================================================================
// Form Model Paths - Inline Repeat (ir1)
// ============================================================================

export const screen1Ir1 = [...screen1, ...createModelPath("ir1")];
export const f2MIr1 = [...screen1Ir1, ...createModelPath("fieldbasedrepeatoverviewcolumn-67f07")];
export const f1R1Ir1 = [...screen1Ir1, ...createModelPath("fieldbasedrepeatoverviewcolumn-23a7f")];
export const f1R21Ir1 = [...screen1Ir1, ...createModelPath("fieldbasedrepeatoverviewcolumn-a9de4")];

// ============================================================================
// Form Model Paths - Embedded Repeat (er1)
// ============================================================================

export const screen1Er1 = [...screen1, ...createModelPath("er1")];
export const f2MEr1 = [
	...screen1Er1,
	{ elementName: "cg" },
	...createModelPath("row-1eb1f", "control-11420")
];
export const f1R1Er1 = [
	...screen1Er1,
	{ elementName: "cg" },
	...createModelPath("row-1eb1e", "control-1141f")
];
export const f1R21Er1 = [
	...screen1Er1,
	{ elementName: "cg" },
	...createModelPath("row-1eb1e", "control-7e5cc")
];

// ============================================================================
// Form Model Paths - Detached Repeat (dr1)
// ============================================================================

export const screen1Dr1 = [...screen1, ...createModelPath("dr1", "Details")];

export const f2MDr1 = [...screen1Dr1, ...createModelPath("cg11", "row-c92fd", "control-9de24")];
export const f1R1Dr1 = [...screen1Dr1, ...createModelPath("cg11", "row-2b6db", "control-4c710")];
export const f1r1r1Ir11 = [
	...screen1Dr1,
	...createModelPath("ir11", "fieldbasedrepeatoverviewcolumn-d84c4")
];
export const f1R21IDr1 = [...screen1Dr1, ...createModelPath("cg11", "row-e5b59", "control-66cf4")];
export const f2MDr1Ir11 = [
	...screen1Dr1,
	...createModelPath("ir11", "fieldbasedrepeatoverviewcolumn-3e377")
];
export const f2MDr1Er11 = [
	...screen1Dr1,
	...createModelPath("er11", "cg", "row-e73ab", "control-b7fc9")
];

// ============================================================================
// Form Model Paths - Nested Detached Repeat (dr1 > dr11)
// ============================================================================

export const screen1Dr1Dr11 = [...screen1Dr1, ...createModelPath("dr11", "Details")];

export const f1r1r1Dr11 = [
	...screen1Dr1Dr11,
	...createModelPath("cs111", "cgcs111", "row-2dcda", "control-60108")
];
export const f2MDr1Dr11 = [
	...screen1Dr1Dr11,
	...createModelPath("cg111", "row-f12d7", "control-cf7a6")
];
export const sectionDr11 = [...screen1Dr1Dr11, ...createModelPath("cs111")];

// ============================================================================
// Form Model Paths - Embedded Repeat in Detached Repeat (dr1 > er11)
// ============================================================================

export const screen1Dr1Er11 = [...screen1Dr1, ...createModelPath("er11")];
export const f1r1r1Er11 = [
	...screen1Dr1Er11,
	{ elementName: "cg" },
	...createModelPath("row-a1c0f", "control-bf613")
];

// ============================================================================
// Document Paths
// ============================================================================

export const f2MPath = createDocumentPath([ROOT_GROUP], ["F2M"]);
export const f21Path = createDocumentPath([ROOT_GROUP], ["G2"], ["F21"]);
export const g1RPath = createDocumentPath([ROOT_GROUP], ["G1R"]);

export const g4RPath = createDocumentPath([ROOT_GROUP], ["G4R"]);
export const f4Path = createDocumentPath([ROOT_GROUP], ["F4"]);
export const f5Path = createDocumentPath([ROOT_GROUP], ["F5"]);

// ============================================================================
// Helper Functions
// ============================================================================

export function setupTest(props: {
	document?: object;
	models: Models;
	ui?: Partial<EngineStore.UIState>;
}): {
	state: EngineState;
	messages: EngineStore.Validation.Message[];
} {
	const initialState = createEngineStore({
		models: props.models,
		locale: US_LOCALE,
		data: { document: props.document ? props.document : {} }
	});
	const newMessages = fullValidation(initialState, createDefaultMiddlewareOptions());
	return { state: initialState, messages: newMessages };
}

export function getUIIssueReport(
	state: EngineState,
	message: EngineStore.Validation.Message
): UIIssueReport {
	const dataFormats = defaultDataFormats(US_LOCALE);
	const converter = defaultValueConversion(dataFormats);
	const localizer = defaultLocalizerFactory({
		locale: US_LOCALE,
		conversion: converter,
		dataFormats
	});

	const config = {} as Config;
	const renderOptions = { state, config } as FormModelMap.RenderOptions;

	return CorrectionModeUtil.getUIIssueReport(message, renderOptions, localizer, converter);
}

export function getLinks(
	state: EngineState,
	message: EngineStore.Validation.Message
): ReadonlyArray<CorrectionModeItem> {
	const uiIssueReport = getUIIssueReport(state, message);
	return uiIssueReport.fixable ? uiIssueReport.items : [];
}

export function getFixable(state: EngineState, message: EngineStore.Validation.Message): boolean {
	const dataFormats = defaultDataFormats(US_LOCALE);
	const converter = defaultValueConversion(dataFormats);
	const localizer = defaultLocalizerFactory({
		locale: US_LOCALE,
		conversion: converter,
		dataFormats
	});

	const renderOptions = { state } as FormModelMap.RenderOptions;

	return CorrectionModeUtil.getUIIssueReport(message, renderOptions, localizer, converter).fixable;
}

// ============================================================================
// Assertion Helpers
// ============================================================================

export function assertNumberOfLinks(lengthOfLinks: number, expectedNumber: number): void {
	strictEqual(lengthOfLinks, expectedNumber, `Expected that ${expectedNumber} links are returned`);
}

export function assertFormModelPath(options: {
	link: CorrectionModeItem;
	expectedFormModelPath: ModelPath;
}): void {
	deepStrictEqual(
		options.link.formModelPath,
		options.expectedFormModelPath,
		"Wrong form model path"
	);
}

export function assertLink(options: {
	link: CorrectionModeItem;
	expectedFormModelPath: ModelPath;
	expectedLocationStack: EngineStore.ScreenState[];
	expectedSectionsCollapse?: ReadonlyArray<{ path: ModelPath; collapse: boolean }>;
}): void {
	assertFormModelPath(options);
	deepStrictEqual(
		options.link.locationStack,
		options.expectedLocationStack,
		"Wrong location stack"
	);

	if (options.expectedSectionsCollapse) {
		deepStrictEqual(
			options.link.sectionsCollapse,
			options.expectedSectionsCollapse,
			"Wrong section state"
		);
	}
}
