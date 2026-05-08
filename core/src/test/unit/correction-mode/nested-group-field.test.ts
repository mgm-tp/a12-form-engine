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

import { setupModelsFixture } from "../../utils/setupFixture.js";

import {
	assertLink,
	assertNumberOfLinks,
	baseDocument,
	DocumentUtils,
	f21Path,
	f21Screen1,
	f5Path,
	getFixable,
	getLinks,
	screen1,
	setupTest
} from "./correction-mode-test-utils.js";

describe("unit.view.validation.correctionMode.nestedGroupField", () => {
	const models = setupModelsFixture("computation-validation.correctionmode");

	// F21
	describe("Given a field with an invalid value in a nested group", () => {
		describe("and a top level screens containing a control referencing the field", () => {
			it("returns a link to each control", () => {
				const document = DocumentUtils.setValue(baseDocument, f21Path, 12, models.documentModel);
				const { messages, state } = setupTest({ document, models });
				const links = getLinks(state, messages[0]);

				assertLink({
					link: links[0],
					expectedFormModelPath: f21Screen1,
					expectedLocationStack: [
						{
							locationPath: screen1,
							focusedComponent: { formModelPath: f21Screen1 },
							focusedComponentRequestCount: 1,
							path: [],
							repeatInstanceState: undefined
						}
					],
					expectedSectionsCollapse: []
				});
			});
		});

		describe("and no element in the form referencing the field", () => {
			it("returns no link and isFixable === false", () => {
				// set field to trigger the rule
				const document = DocumentUtils.setValue(baseDocument, f5Path, 12, models.documentModel);
				const { messages, state } = setupTest({ document, models });
				strictEqual(messages.length, 1, "Expected that there is one validation message");

				const message = messages[0];
				const links = getLinks(state, message);
				assertNumberOfLinks(links.length, 0);

				const isFixable = getFixable(state, message);
				strictEqual(isFixable, false);
			});
		});
	});
});
