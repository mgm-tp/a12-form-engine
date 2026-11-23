// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { deepStrictEqual } from "node:assert/strict";

import type { Activity } from "@com.mgmtp.a12.client/client-core/lib/core/activity/index.js";

import { FormActivity } from "../../../client-extensions/index.js";
import { setupModelsFixture } from "../../utils/setupFixture.js";

describe("unit.dependency.filterDataByRelevance", () => {
	const models = setupModelsFixture("dependencies.relevant");

	it("returns the given document when no fields are flagged as non-relevant", () => {
		const document: Activity.Data.Document = {
			id: "foo",
			modelId: "bar",
			base: { targets: { singleField: "test data" } }
		};
		const filteredDocument = FormActivity.Data.filterDataByRelevance(document, models);
		deepStrictEqual(filteredDocument, document);
	});

	describe("when a dependent field case is matching", () => {
		it("returns the given document without the non-relevant field instance", () => {
			const initial: Activity.Data.Document = {
				id: "foo",
				modelId: "bar",
				base: { disableSingleField: true, targets: { singleField: "test data" } }
			};
			const expected: Activity.Data.Document = {
				id: "foo",
				modelId: "bar",
				base: { disableSingleField: true, targets: {} }
			};
			const filteredDocument = FormActivity.Data.filterDataByRelevance(initial, models);
			deepStrictEqual(filteredDocument, expected);
		});

		it("returns the given document without all non-relevant field instances when they are nested in a repeatable group", () => {
			const initial: Activity.Data.Document = {
				id: "foo",
				modelId: "bar",
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
				}
			};
			const expected: Activity.Data.Document = {
				id: "foo",
				modelId: "bar",
				base: {
					disableRepeatableFields: true,
					targets: {
						repeatIt: [
							{ anotherField: "another value" },
							{ anotherField: "another value" },
							{ anotherField: "another value" }
						]
					}
				}
			};
			const filteredDocument = FormActivity.Data.filterDataByRelevance(initial, models);
			deepStrictEqual(filteredDocument, expected);
		});
	});

	describe("when a dependent group case is matching", () => {
		it("returns the given document without the non-relevant, non-repeatable group instance", () => {
			const initial: Activity.Data.Document = {
				id: "foo",
				modelId: "bar",
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
			const expected: Activity.Data.Document = {
				id: "foo",
				modelId: "bar",
				base: { disableSingleGroup: true, targets: {} }
			};
			const filteredDocument = FormActivity.Data.filterDataByRelevance(initial, models);
			deepStrictEqual(filteredDocument, expected);
		});

		it("returns the given document without all non-relevant group instances when they are nested in a repeatable group", () => {
			const initial: Activity.Data.Document = {
				id: "foo",
				modelId: "bar",
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
			const expected: Activity.Data.Document = {
				id: "foo",
				modelId: "bar",
				base: { disableRepeatableGroup: true, targets: {} }
			};
			const filteredDocument = FormActivity.Data.filterDataByRelevance(initial, models);
			deepStrictEqual(filteredDocument, expected);
		});
	});
});
