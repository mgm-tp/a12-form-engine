// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
