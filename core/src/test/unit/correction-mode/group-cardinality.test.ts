// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
