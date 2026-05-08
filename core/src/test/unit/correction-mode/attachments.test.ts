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

import { generateAttachment } from "../../api/view/inputs/input-element/generic-tests/input-utils.js";
import { setupModelsFixture } from "../../utils/setupFixture.js";

import type { CorrectionModeItem, GroupInstance } from "./correction-mode-test-utils.js";
import {
	assertFormModelPath,
	assertLink,
	assertNumberOfLinks,
	baseDocument,
	createDocumentPath,
	createModelPath,
	DocumentUtils,
	getLinks,
	screen1,
	setupTest
} from "./correction-mode-test-utils.js";

describe("unit.view.validation.correctionMode.attachment", () => {
	const models = setupModelsFixture("computation-validation.correctionmode");

	describe("Given an attachment group, with an error", () => {
		describe("where the rule references exactly one field from the attachment group", () => {
			it("returns a link to the attachment", () => {
				const attachmentPath = createDocumentPath(["CustomTypes"], ["Attachment"]);
				const document = DocumentUtils.setValue(
					baseDocument,
					attachmentPath,
					generateAttachment({ original_filename: "invalidName.jpg" }) as GroupInstance,
					models.documentModel
				);

				const { messages, state } = setupTest({ document, models });
				const links = getLinks(state, messages[0]);

				assertNumberOfLinks(links.length, 1);

				const expectedFormModelPath = createModelPath(
					"Screen1",
					"cg2",
					"attachment",
					"control-4e894"
				);
				assertLink({
					link: links[0],
					expectedFormModelPath: expectedFormModelPath,
					expectedLocationStack: [
						{
							locationPath: screen1,
							path: [],
							focusedComponent: {
								formModelPath: expectedFormModelPath
							},
							focusedComponentRequestCount: 1,
							repeatInstanceState: undefined
						}
					],
					expectedSectionsCollapse: []
				});
			});
		});

		describe("where the rule references multiple fields from the attachment group", () => {
			it("returns exactly one link to the attachment", () => {
				const attachmentPath = createDocumentPath(["CustomTypes"], ["Attachment2"]);
				const document = DocumentUtils.setValue(
					baseDocument,
					attachmentPath,
					generateAttachment({ mime_type: "image/jpeg", size: 2048 }) as GroupInstance,
					models.documentModel
				);

				const { messages, state } = setupTest({ document, models });
				const links = getLinks(state, messages[0]);

				assertNumberOfLinks(links.length, 1);

				const expectedFormModelPath = createModelPath(
					"Screen1",
					"cg2",
					"attachment",
					"control-4e895"
				);
				assertLink({
					link: links[0],
					expectedFormModelPath: expectedFormModelPath,
					expectedLocationStack: [
						{
							locationPath: screen1,
							path: [],
							focusedComponent: {
								formModelPath: expectedFormModelPath
							},
							focusedComponentRequestCount: 1,
							repeatInstanceState: undefined
						}
					],
					expectedSectionsCollapse: []
				});
			});
		});

		describe("where the attachment is referenced by an indexed control", () => {
			function setup(): readonly CorrectionModeItem[] {
				// Add two rows to repeatable group, second one is invalid and targeted by indices
				const document = DocumentUtils.setValue(
					baseDocument,
					createDocumentPath(["IndexedControls"], ["Group3", 0]),
					[
						{ IndexField: false, Attachment: {} },
						{
							IndexField: true,
							Attachment: {
								internal_filename: "test.txt",
								original_filename: "test.txt",
								content: "test_content",
								size: 1,
								mime_type: "text/plain"
							}
						}
					],
					models.documentModel
				);
				const { messages, state } = setupTest({ document, models });
				strictEqual(messages.length, 1, "Expected that there is one validation message");
				return getLinks(state, messages[0]);
			}

			it("returns links to the indexed controls and the non-indexed input", () => {
				const links = setup();

				assertNumberOfLinks(links.length, 3);

				const rowpath = createModelPath(
					"ScreenIndexedControls",
					"secCustomTypes",
					"cg",
					"row_8c4e8"
				);
				const columnPath = createModelPath(
					"ScreenIndexedControls",
					"secCustomTypes",
					"Group3_Repeat",
					"fieldbasedrepeatoverviewcolumn_b96d1"
				);

				// numeric index
				assertFormModelPath({
					link: links[0],
					expectedFormModelPath: rowpath.concat(createModelPath("control_dbe3f"))
				});
				// semantic index
				assertFormModelPath({
					link: links[1],
					expectedFormModelPath: rowpath.concat(createModelPath("control_8e43c"))
				});
				// inline repeat column
				assertLink({
					link: links[2],
					expectedFormModelPath: columnPath,
					expectedLocationStack: [
						{
							locationPath: [{ elementName: "ScreenIndexedControls" }],
							path: [],
							focusedComponent: { formModelPath: columnPath, index: 1 },
							focusedComponentRequestCount: 1,
							repeatInstanceState: {
								["/ScreenIndexedControls/secCustomTypes/Group3_Repeat"]: {
									expandedRowPath: undefined,
									page: undefined
								}
							}
						}
					]
				});
			});
		});
	});
});
