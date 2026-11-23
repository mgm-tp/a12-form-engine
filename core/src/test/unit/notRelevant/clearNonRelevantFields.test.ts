// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { deepStrictEqual } from "node:assert/strict";

import type {
	Document,
	GroupInstance
} from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import { filterDocumentByRelevance } from "../../../back-end/store/index.js";
import { setupModelsFixture } from "../../utils/setupFixture.js";

describe("unit.dependency.clearNonRelevantFields", () => {
	const models = setupModelsFixture("dependencies.relevant");

	it("returns the given document when no fields are flagged as non-relevant", () => {
		const document: GroupInstance = { base: { targets: { singleField: "test data" } } };
		const filteredDocument = filterDocumentByRelevance(document as Document, models);
		deepStrictEqual(filteredDocument, document);
	});

	it("returns the filtered document including all non-modeled content", () => {
		const initial: GroupInstance = {
			base: { disableSingleField: true, targets: { singleField: "test data", notInModel: "abc" } },
			SupportedLanguages: [{ language: "en" }, { language: "de" }],
			NotInModel: { foo: "bar" }
		};
		const expected: GroupInstance = {
			base: { disableSingleField: true, targets: { notInModel: "abc" } },
			SupportedLanguages: [{ language: "en" }, { language: "de" }],
			NotInModel: { foo: "bar" }
		};
		const filteredDocument = filterDocumentByRelevance(initial as Document, models);
		deepStrictEqual(filteredDocument, expected);
	});

	describe("when a dependent field case is matching", () => {
		it("returns the given document without the non-relevant field instance", () => {
			const initial: GroupInstance = {
				base: { disableSingleField: true, targets: { singleField: "test data" } }
			};
			const expected: GroupInstance = {
				base: { disableSingleField: true, targets: {} }
			};
			const filteredDocument = filterDocumentByRelevance(initial as Document, models);
			deepStrictEqual(filteredDocument, expected);
		});

		it("returns the given document without all non-relevant field instances when they are nested in a repeatable group", () => {
			const initial: GroupInstance = {
				base: {
					disableRepeatableFields: true,
					targets: {
						repeatIt: [
							{
								repeatableField: "123",
								anotherField: "another value"
							},
							{
								repeatableField: "123",
								anotherField: "another value"
							},
							{
								repeatableField: "123",
								anotherField: "another value"
							}
						]
					}
				},
				test: {
					repeatableLevel: [
						{
							trigger: "a",
							dependent: "abc"
						},
						{
							trigger: "b",
							dependent: "def"
						}
					]
				}
			};
			const expected: GroupInstance = {
				base: {
					disableRepeatableFields: true,
					targets: {
						repeatIt: [
							{ anotherField: "another value" },
							{ anotherField: "another value" },
							{ anotherField: "another value" }
						]
					}
				},
				test: {
					repeatableLevel: [
						{
							trigger: "a",
							dependent: "abc"
						},
						{
							trigger: "b"
						}
					]
				}
			};
			const filteredDocument = filterDocumentByRelevance(initial as Document, models);
			deepStrictEqual(filteredDocument, expected);
		});
	});

	describe("when a dependent group case is matching", () => {
		it("returns the given document without the non-relevant, non-repeatable group instance", () => {
			const initial: GroupInstance = {
				base: {
					disableSingleGroup: true,
					targets: {
						singleGroup: {
							someField1: "test data",
							someField2: "test data",
							subGroup1: [
								{
									subField: "1234"
								},
								{
									subField: "1234"
								}
							]
						}
					}
				}
			};
			const expected: GroupInstance = {
				base: { disableSingleGroup: true, targets: {} }
			};
			const filteredDocument = filterDocumentByRelevance(initial as Document, models);
			deepStrictEqual(filteredDocument, expected);
		});

		it("returns the given document without all non-relevant group instances when they are nested in a repeatable group", () => {
			const initial: GroupInstance = {
				base: {
					disableRepeatableGroup: true,
					targets: {
						repeatableGroup: [
							{ repeatableField1: "12345" },
							{ repeatableField1: "12345" },
							{ repeatableField1: "12345" },
							{ repeatableField1: "12345" }
						]
					}
				}
			};
			const expected: GroupInstance = {
				base: { disableRepeatableGroup: true, targets: {} }
			};
			const filteredDocument = filterDocumentByRelevance(initial as Document, models);
			deepStrictEqual(filteredDocument, expected);
		});
	});
});
