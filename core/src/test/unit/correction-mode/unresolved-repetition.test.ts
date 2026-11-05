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

import { deepStrictEqual, strictEqual } from "node:assert/strict";

import type { DocumentValidationError } from "@com.mgmtp.a12.dataservices/dataservices-access";

import { createValidationMessagesFromServerResults } from "../../../client-extensions/internal/extensions/platform-server-connectors/internal/providers/handleServerValidation.js";
import { setupModelsFixture } from "../../utils/setupFixture.js";

import {
	assertNumberOfLinks,
	baseDocument,
	DocumentUtils,
	f1R1Dr1,
	f1R1Er1,
	f1R1Ir1,
	g1RPath,
	getLinks,
	getValidationBarItem,
	setupTest
} from "./correction-mode-test-utils.js";

describe("unit.view.validation.correctionMode.unresolvedRepetition", () => {
	const models = setupModelsFixture("computation-validation.correctionmode");

	const serverResult = (errorFieldPointer: string): DocumentValidationError => ({
		errorText: "Value of field F1R1 is not allowed",
		errorCode: "Error rule_f1r1",
		messageType: "VALUE_ERROR",
		rulePath: "/root/G1R/F1R1",
		referencedFieldsPointers: [errorFieldPointer],
		severityType: "ERROR",
		errorFieldPointer
	});

	function setupWithTwoRows(): ReturnType<typeof setupTest> {
		const document = DocumentUtils.setValue(
			baseDocument,
			g1RPath,
			[
				{ G1R2: {}, F1R1: 42 },
				{ G1R2: {}, F1R1: 12 }
			],
			models.documentModel
		);

		return setupTest({ document, models });
	}

	describe("Given a server validation message pointing at an existing repetition", () => {
		it("returns one link per control rendering the field, not one per message", () => {
			const { state } = setupWithTwoRows();
			const [message] = createValidationMessagesFromServerResults(
				[serverResult("/root[1]/G1R[2]/F1R1[1]")],
				"en"
			);

			const links = getLinks(state, message);

			// the fixture renders G1R as an inline, an embedded and a detached repeat
			assertNumberOfLinks(links.length, 3);
			deepStrictEqual(
				links.map(link => link.formModelPath),
				[f1R1Ir1, f1R1Er1, f1R1Dr1]
			);
			strictEqual(getValidationBarItem(state, message).locations.length, 3);
		});
	});

	describe("Given a server validation message whose repetition index could not be determined", () => {
		it("parses the negative index rather than rejecting the pointer", () => {
			const [message] = createValidationMessagesFromServerResults(
				[serverResult("/root[1]/G1R[-5]/F1R1[1]")],
				"en"
			);

			deepStrictEqual(message.element, [
				{ elementName: "root", index: 1 },
				{ elementName: "G1R", index: -5 },
				{ elementName: "F1R1", index: 1 }
			]);
		});

		it("does not return a link, because no such row exists in the document", () => {
			const { state } = setupWithTwoRows();
			const [message] = createValidationMessagesFromServerResults(
				[serverResult("/root[1]/G1R[-5]/F1R1[1]")],
				"en"
			);

			assertNumberOfLinks(getLinks(state, message).length, 0);
		});

		it("still shows the message in the validation bar, reporting it as fixable without a link", () => {
			const { state } = setupWithTwoRows();
			const [message] = createValidationMessagesFromServerResults(
				[serverResult("/root[1]/G1R[-5]/F1R1[1]")],
				"en"
			);

			const item = getValidationBarItem(state, message);

			strictEqual(item.type, "error");
			deepStrictEqual(item.text, message.errorText);
			strictEqual(item.locations.length, 0);
			strictEqual(item.isFixable, true);
		});
	});
});
