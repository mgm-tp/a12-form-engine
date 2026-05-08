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

import type { GroupInstance } from "./correction-mode-test-utils.js";
import {
	assertNumberOfLinks,
	baseDocument,
	DocumentUtils,
	f4Path,
	g4RPath,
	getFixable,
	getLinks,
	setupTest
} from "./correction-mode-test-utils.js";

describe("unit.view.validation.correctionMode.groupCardinality", () => {
	const models = setupModelsFixture("computation-validation.correctionmode");

	// G4R
	describe("Given a repeatable group, which has to be filled at least once, with an error field", () => {
		// ir4, er4, dr4
		describe("and repeats containing a control referencing the error field", () => {
			describe("and the group doesn't exist in the document", () => {
				let document: GroupInstance;

				before(() => {
					// set only the field to trigger the group rule
					document = DocumentUtils.setValue(baseDocument, f4Path, 12, models.documentModel);
				});

				it("does not return a link", () => {
					const { messages, state } = setupTest({ document, models });
					strictEqual(messages.length, 1, "Expected that there is one validation message");
					const message = messages[0];

					const links = getLinks(state, message);
					assertNumberOfLinks(links.length, 0);
				});

				it("returns isFixable === true", () => {
					const { messages, state } = setupTest({ document, models });
					const message = messages[0];
					const isFixable = getFixable(state, message);
					strictEqual(isFixable, true);
				});
			});

			describe("and no instance for the group exists in the document", () => {
				let document: GroupInstance;

				before(() => {
					// set empty repeat
					document = DocumentUtils.setValue(baseDocument, g4RPath, [], models.documentModel);
					// set field to trigger the group rule
					document = DocumentUtils.setValue(document, f4Path, 12, models.documentModel);
				});

				it("does not return a link", () => {
					const { messages, state } = setupTest({ document, models });
					strictEqual(messages.length, 1, "Expected that there is one validation message");
					const message = messages[0];

					const links = getLinks(state, message);
					assertNumberOfLinks(links.length, 0);
				});

				it("returns isFixable === true", () => {
					const { messages, state } = setupTest({ document, models });
					const message = messages[0];
					const isFixable = getFixable(state, message);
					strictEqual(isFixable, true);
				});
			});
		});
	});
});
