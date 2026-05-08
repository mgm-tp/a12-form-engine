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

import { strictEqual } from "node:assert/strict";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import { query } from "@com.mgmtp.a12.devtools/react";

import { DocumentPath } from "../../../../../../models/index.js";
import { getInputMocks } from "../../../../../rtl-utils/getInputMocks.js";
import { DocumentHelpers } from "../../../../../utils/document-helpers.js";
import { setupModelsFixture } from "../../../../../utils/setupFixture.js";
import { CONTROLS_INDEX } from "../../../../../utils/test-model-helpers/controls.index.js";
import {
	CONTROLS,
	createDocumentForControlsModels,
	setupForControlsModel
} from "../../../../../utils/test-model-helpers/controls.js";
import { createModelPath } from "../../../../../utils/test-model-helpers/dependent-enumeration.js";
import {
	DR,
	createDocumentForDetachedRepeat,
	setupForDetachedRepeat
} from "../../../../../utils/test-model-helpers/detached.repeat.js";
import { renderWithInputMocks } from "../../../../../utils/test-model-helpers/render-with-inputmocks.js";

const { createDocumentPath } = DocumentHelpers;

export function executeTestForValue(): void {
	const createDocument = () =>
		createDocumentForControlsModels({
			L0_Number: CONTROLS.L0_NUMBER_VALUE,
			L1_Number: CONTROLS.L1_NUMBER_VALUE
		});
	const createBackupDocument = () =>
		createDocumentForControlsModels({
			L0_Number: CONTROLS.L0_NUMBER_VALUE_BACKUP
		});

	const controls = setupModelsFixture("controls");
	const detachedRepeat = setupModelsFixture("repeat", "detached");
	const indexedControls = setupModelsFixture("controls.index");

	describe("when the control is located in a top-level screen", () => {
		it("reads the value from the document", async () => {
			const { inputMap } = await setupForControlsModel({
				models: controls,
				document: createDocument(),
				backupDocument: createBackupDocument()
			});
			const props = query(inputMap.NumberInput).withProp("uiId", CONTROLS.ID_L0_NUMBER).props();
			strictEqual(props.value.data, CONTROLS.L0_NUMBER_VALUE);
		});

		describe("and has a control index", () => {
			it("reads the value from the document and calculates the correct document path", async () => {
				const { inputMap } = await renderWithInputMocks({
					models: indexedControls,
					data: {
						document: {
							root: {
								contacts: [
									{ applicant: false },
									{ applicant: true, details: { name: "test_name" } }
								]
							}
						}
					}
				});
				const props = query(inputMap.StringInput)
					.withProp("uiId", CONTROLS_INDEX.ID_APPLICANT_NAME_CONTROL)
					.props();
				strictEqual(props.value.data, "test_name");
				strictEqual(
					DocumentPath.toString(props.value.path),
					"/root[1]/contacts[2]/details[1]/name[1]"
				);
			});
		});
	});

	describe("when the control is located in an embedded-repeat detail control-grid", () => {
		describe("and the referenced field is inside the repeatable group", () => {
			it("reads the value correctly from the document", async () => {
				const { inputMap } = await setupForControlsModel({
					models: controls,
					document: createDocument(),
					backupDocument: createBackupDocument(),
					repeatInstanceState: {
						[ModelPath.toString(CONTROLS.er_locationPath)]: {
							expandedRowPath: createDocumentPath([CONTROLS.ROOT], [CONTROLS.repeatableGroup, 1])
						}
					}
				});
				const props = query(inputMap.NumberInput)
					.withProp("uiId", CONTROLS.ID_L1_NUMBER_IN_ER)
					.props();
				strictEqual(props.value.data, CONTROLS.L1_NUMBER_VALUE);
			});
		});

		describe("and the referenced field is outside the repeatable group", () => {
			it("reads the value correctly from the document", async () => {
				const { inputMap } = await setupForControlsModel({
					models: controls,
					document: createDocument(),
					repeatInstanceState: {
						[ModelPath.toString(CONTROLS.er_locationPath)]: {
							expandedRowPath: createDocumentPath([CONTROLS.ROOT], [CONTROLS.repeatableGroup, 1])
						}
					}
				});
				const props = query(inputMap.NumberInput)
					.withProp("uiId", CONTROLS.ID_L0_NUMBER_IN_ER)
					.props();
				strictEqual(props.value.data, CONTROLS.L0_NUMBER_VALUE);
			});
		});
	});

	describe("when the control is located in a detached-repeat detail-screen", () => {
		it("reads the value from the document", () => {
			const repeatPath = createDocumentPath([DR.ROOT], [DR.repeatableGroup, 1]);
			const documentForDetachedRepeat = createDocumentForDetachedRepeat([{ L1_Number: 44 }]);

			const inputMap = getInputMocks();
			setupForDetachedRepeat({
				inputMap,
				models: detachedRepeat,
				document: documentForDetachedRepeat,
				backupDocument: createBackupDocument(),
				locationPaths: [
					[{ elementName: DR.SortingAndFiltering.screenName }],
					DR.SortingAndFiltering.dr_locationPath
				],
				paths: [[], repeatPath]
			});
			const props = query(inputMap.NumberInput)
				.withProp("uiId", DR.SortingAndFiltering.ID_L1_NUMBER)
				.props();
			strictEqual(props.value.data, 44);
		});
	});

	describe("when the control is located in a nested repeat", () => {
		describe("detached-inline", () => {
			describe("and the referenced field is inside the nested repeatable group", () => {
				it("reads the value from the document", async () => {
					const repeatPath = createDocumentPath([DR.ROOT], [DR.repeatableGroup, 1]);
					const documentForDetachedRepeat = createDocumentForDetachedRepeat([
						{ L1_Number: 44, L2_Number: 55 }
					]);

					const inputMap = getInputMocks();
					setupForDetachedRepeat({
						inputMap,
						models: detachedRepeat,
						document: documentForDetachedRepeat,
						backupDocument: createBackupDocument(),
						locationPaths: [
							[{ elementName: DR.NestedRepeat.screenName }],
							DR.NestedRepeat.dr_locationPath
						],
						paths: [[], repeatPath]
					});
					const props = query(inputMap.NumberInput)
						.withProp("uiId", DR.NestedRepeat.ID_L2_NUMBER)
						.props();
					strictEqual(props.value.data, 55);
				});
			});

			describe("and the referenced field is outside the nested repeatable group", () => {
				it("reads the value from the document", async () => {
					const repeatPath = createDocumentPath([DR.ROOT], [DR.repeatableGroup, 2]);
					const documentForDetachedRepeat = createDocumentForDetachedRepeat([
						{ L1_Number: 44, L2_Number: 55 },
						{ L1_Number: 46, L2_Number: 56 }
					]);

					const inputMap = getInputMocks();
					setupForDetachedRepeat({
						inputMap,
						models: detachedRepeat,
						document: documentForDetachedRepeat,
						backupDocument: createBackupDocument(),
						locationPaths: [
							[{ elementName: DR.NestedRepeat.screenName }],
							DR.NestedRepeat.dr_locationPath
						],
						paths: [[], repeatPath]
					});
					const props = query(inputMap.NumberInput)
						.withProp("uiId", DR.NestedRepeat.ID_L1_NUMBER_IN_NESTED_DR_IR)
						.props();
					strictEqual(props.value.data, 46);
				});
			});
		});

		describe("detached-embedded", () => {
			describe("and the referenced field is inside the nested repeatable group", () => {
				it("reads the value from the document", async () => {
					const repeatPath = createDocumentPath([DR.ROOT], [DR.repeatableGroup, 1]);
					const nestedRepeatPath = [...repeatPath, ...createDocumentPath(["Nested_L2"])];
					const documentForDetachedRepeat = createDocumentForDetachedRepeat([
						{ L1_Number: 44, L2_Number: 55 }
					]);
					const inputMap = getInputMocks();
					setupForDetachedRepeat({
						inputMap,
						models: detachedRepeat,
						document: documentForDetachedRepeat,
						backupDocument: documentForDetachedRepeat,
						locationPaths: [
							[{ elementName: DR.NestedRepeat.screenName }],
							createModelPath(
								"NestedRepeat",
								"sec3",
								"inline-repeat-Nested_L1",
								"inline-repeat-Nested_L1-detail-screen"
							)
						],
						paths: [[], repeatPath],
						repeatInstanceStates: [
							{},
							{
								[ModelPath.toString(DR.NestedRepeat.nested_dr_er_locationPath)]: {
									expandedRowPath: nestedRepeatPath
								}
							}
						]
					});

					const props = query(inputMap.NumberInput)
						.withProp("uiId", DR.NestedRepeat.ID_NESTED_DR_ER_L2_NUMBER)
						.props();
					strictEqual(props.value.data, 55);
				});
			});

			describe("and the referenced field is outside the nested repeatable group", () => {
				it("reads the value from the document", async () => {
					const repeatPath = createDocumentPath([DR.ROOT], [DR.repeatableGroup, 2]);
					const nestedRepeatPath = [...repeatPath, ...createDocumentPath(["Nested_L2"])];
					const documentForDetachedRepeat = createDocumentForDetachedRepeat([
						{ L1_Number: 44, L2_Number: 55 },
						{ L1_Number: 46, L2_Number: 56 }
					]);
					const inputMap = getInputMocks();
					setupForDetachedRepeat({
						inputMap,
						models: detachedRepeat,
						document: documentForDetachedRepeat,
						backupDocument: documentForDetachedRepeat,
						locationPaths: [
							[{ elementName: DR.NestedRepeat.screenName }],
							createModelPath(
								"NestedRepeat",
								"sec3",
								"inline-repeat-Nested_L1",
								"inline-repeat-Nested_L1-detail-screen"
							)
						],
						paths: [[], repeatPath],
						repeatInstanceStates: [
							{},
							{
								[ModelPath.toString(DR.NestedRepeat.nested_dr_er_locationPath)]: {
									expandedRowPath: nestedRepeatPath
								}
							}
						]
					});

					const props = query(inputMap.NumberInput)
						.withProp("uiId", DR.NestedRepeat.ID_L1_NUMBER_IN_NESTED_DR_ER)
						.props();
					strictEqual(props.value.data, 46);
				});
			});
		});

		describe("detached-detached", () => {
			describe("and the referenced field is inside the nested repeatable group", () => {
				it("reads the value from the document", () => {
					const repeatPath = createDocumentPath([DR.ROOT], [DR.repeatableGroup, 1]);
					const nestedRepeatPath = [...repeatPath, ...createDocumentPath(["Nested_L2"])];
					const documentForDetachedRepeat = createDocumentForDetachedRepeat([
						{ L1_Number: 44, L2_Number: 55 }
					]);

					const inputMap = getInputMocks();
					setupForDetachedRepeat({
						inputMap,
						models: detachedRepeat,
						document: documentForDetachedRepeat,
						backupDocument: createBackupDocument(),
						locationPaths: [
							[{ elementName: DR.NestedRepeat.screenName }],
							DR.NestedRepeat.dr_locationPath,
							DR.NestedRepeat.nested_dr_dr_locationPath
						],
						paths: [[], repeatPath, nestedRepeatPath]
					});

					const props = query(inputMap.NumberInput)
						.withProp("uiId", DR.NestedRepeat.ID_NESTED_DR_DR_L2_NUMBER)
						.props();
					strictEqual(props.value.data, 55);
				});
			});

			describe("and the referenced field is outside the nested repeatable group", () => {
				it("reads the value from the document", () => {
					const repeatPath = createDocumentPath([DR.ROOT], [DR.repeatableGroup, 2]);
					const nestedRepeatPath = [...repeatPath, ...createDocumentPath(["Nested_L2"])];
					const documentForDetachedRepeat = createDocumentForDetachedRepeat([
						{ L1_Number: 44, L2_Number: 55 },
						{ L1_Number: 46, L2_Number: 56 }
					]);

					const inputMap = getInputMocks();
					setupForDetachedRepeat({
						inputMap,
						models: detachedRepeat,
						document: documentForDetachedRepeat,
						backupDocument: createBackupDocument(),
						locationPaths: [
							[{ elementName: DR.NestedRepeat.screenName }],
							DR.NestedRepeat.dr_locationPath,
							DR.NestedRepeat.nested_dr_dr_locationPath
						],
						paths: [[], repeatPath, nestedRepeatPath]
					});

					const props = query(inputMap.NumberInput)
						.withProp("uiId", DR.NestedRepeat.ID_L1_NUMBER_IN_NESTED_DR_DR)
						.props();
					strictEqual(props.value.data, 46);
				});
			});
		});
	});
}
