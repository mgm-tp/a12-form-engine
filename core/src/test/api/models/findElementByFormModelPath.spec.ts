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

import { deepStrictEqual, notDeepStrictEqual } from "node:assert/strict";

import type { FormModel } from "../../../models/index.js";
import { findElementByFormModelPath } from "../../../models/index.js";
import { largeTestModel } from "../../unit/model-walker/test-model.js";
import { setupFixture } from "../../utils/setupFixture.js";
import { createModelPath } from "../../utils/test-model-helpers/dependent-enumeration.js";

describe("api.models.findElementByFormModelPath", () => {
	const TEST_MODEL = setupFixture(() => largeTestModel);

	describe("starting from the model root", () => {
		it("returns the model root if given a path without path elements", () => {
			deepStrictEqual(findElementByFormModelPath(TEST_MODEL, []), TEST_MODEL);
		});

		describe("given a path to a header/footer button", () => {
			it("returns the button if it exists", () => {
				const targetPath = createModelPath("header", "button");
				const element = findElementByFormModelPath(TEST_MODEL, targetPath);
				notDeepStrictEqual(element, undefined);
				deepStrictEqual((element as FormModel.ButtonType).name, "button");
			});

			it("returns undefined if the button does not exist", () => {
				const targetPath = createModelPath("header", "abc");
				const element = findElementByFormModelPath(TEST_MODEL, targetPath);
				deepStrictEqual(element, undefined);
			});
		});

		describe("given a path to an element inside a screen", () => {
			it("returns the element if it exists", () => {
				const targetPath = createModelPath(
					"screen-screen-1",
					"section-s1-sec-1",
					"cg",
					"row-1",
					"control-1"
				);
				const element = findElementByFormModelPath(TEST_MODEL, targetPath);
				notDeepStrictEqual(element, undefined);
				deepStrictEqual((element as FormModel.Control).id, "control-1");
			});

			it("returns undefined if the element does not exist", () => {
				const targetPath = createModelPath(
					"screen-screen-1",
					"section-s1-sec-1",
					"cg",
					"row-1",
					"abc"
				);
				const element = findElementByFormModelPath(TEST_MODEL, targetPath);
				deepStrictEqual(element, undefined);
			});
		});

		describe("given a path to an element nested inside a detached repeat", () => {
			it("returns the element if it exists", () => {
				const targetPath = createModelPath(
					"screen-screen-1",
					"section-s1-sec-1",
					"dr-dr-1",
					"screen-dr-1-ds",
					"cg",
					"ds-row-1",
					"ds-control-1"
				);
				const element = findElementByFormModelPath(TEST_MODEL, targetPath);
				notDeepStrictEqual(element, undefined);
				deepStrictEqual((element as FormModel.Control).id, "ds-control-1");
			});

			it("returns undefined if the element does not exist", () => {
				const targetPath = createModelPath(
					"screen-screen-1",
					"section-s1-sec-1",
					"dr-dr-1",
					"screen-dr-1-ds",
					"cg",
					"ds-row-1",
					"abc"
				);
				const element = findElementByFormModelPath(TEST_MODEL, targetPath);
				deepStrictEqual(element, undefined);
			});
		});
	});
});
