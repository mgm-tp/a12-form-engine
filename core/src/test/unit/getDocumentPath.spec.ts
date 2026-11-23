// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { deepStrictEqual } from "node:assert/strict";

import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import { getDocumentPath } from "../../back-end/utils/internal/path.js";

import { DocumentHelpers } from "../utils/document-helpers.js";
import { DocumentModelHelpers, ModelHelpers } from "../utils/model-helpers.js";
import { setupFixture } from "../utils/setupFixture.js";

const { createModelPath } = ModelHelpers;
const { createDocumentPath } = DocumentHelpers;

describe("unit.back-end.utils", () => {
	describe("getDocumentPath", () => {
		const documentModel = setupFixture(() => {
			const rootGroup: DocumentModel.Group = {
				...DocumentModelHelpers.Group({ name: "Root" }),
				elements: [
					DocumentModelHelpers.Group({
						name: "Group1",
						elements: [
							DocumentModelHelpers.Group({
								name: "NestedGroup1",
								elements: [DocumentModelHelpers.Field({ name: "Field1" })]
							})
						]
					}),
					DocumentModelHelpers.Group({
						name: "RepGroup1",
						repeatability: 10,
						elements: [
							DocumentModelHelpers.Group({
								name: "NestedRepGroup1",
								repeatability: 10,
								elements: [DocumentModelHelpers.Field({ name: "Field1" })]
							}),
							DocumentModelHelpers.Group({
								name: "NestedRepGroup2"
							}),
							DocumentModelHelpers.Group({
								name: "NestedRepGroup3",
								repeatability: 10,
								elements: [
									DocumentModelHelpers.Group({
										name: "NestedNestedGroup1",
										elements: [DocumentModelHelpers.Field({ name: "Field1" })]
									}),
									DocumentModelHelpers.Group({
										name: "NestedNestedRepGroup1",
										repeatability: 10,
										elements: [DocumentModelHelpers.Field({ name: "Field1" })]
									})
								]
							})
						]
					}),
					DocumentModelHelpers.Group({
						name: "RepGroup2",
						repeatability: 10,
						elements: [
							DocumentModelHelpers.Group({
								name: "NestedGroup2",
								elements: [DocumentModelHelpers.Field({ name: "Field1" })]
							})
						]
					})
				]
			};
			return DocumentModelHelpers.createDocumentModel(rootGroup);
		});

		describe("given path is a ModelPath", () => {
			it("calculates correctly the shared context and fills non-repeatable groups with index=1", () => {
				const path = createModelPath("Root", "Group1", "NestedGroup1", "Field1");
				const context = createDocumentPath(["Root"], ["RepGroup1", 2], ["NestedRepGroup2", 3]);

				const mergedPath = getDocumentPath(documentModel, path, context);
				const expectedPath = createDocumentPath(
					["Root", 1],
					["Group1", 1],
					["NestedGroup1", 1],
					["Field1", 1]
				);
				deepStrictEqual(mergedPath, expectedPath);
			});

			it("calculates correctly the document path", () => {
				const path = createModelPath("Root", "RepGroup1", "NestedRepGroup1", "Field1");
				const context = createDocumentPath(["Root"], ["RepGroup1", 2], ["NestedRepGroup1", 3]);

				const mergedPath = getDocumentPath(documentModel, path, context);
				const expectedPath = createDocumentPath(
					["Root", 1],
					["RepGroup1", 2],
					["NestedRepGroup1", 3],
					["Field1", 1]
				);
				deepStrictEqual(mergedPath, expectedPath);
			});

			it("calculates correctly the shared context and fills repeteable groups with index=0", () => {
				const path = createModelPath(
					"Root",
					"RepGroup1",
					"NestedRepGroup3",
					"NestedNestedGroup1",
					"Field1"
				);
				const context = createDocumentPath(["Root"], ["RepGroup1", 2], ["NestedRepGroup2", 3]);

				const mergedPath = getDocumentPath(documentModel, path, context);
				const expectedPath = createDocumentPath(
					["Root", 1],
					["RepGroup1", 2],
					["NestedRepGroup3", 0],
					["NestedNestedGroup1", 1],
					["Field1", 1]
				);
				deepStrictEqual(mergedPath, expectedPath);
			});
		});

		describe("given path is a EntityInstancePath", () => {
			it("calculates correctly the shared context and fills the path with the given indexes", () => {
				const path = createDocumentPath(["Root"], ["Group1", 6], ["NestedGroup1", 7], ["Field1"]);
				const context = createDocumentPath(["Root"], ["RepGroup1", 2], ["NestedRepGroup2", 3]);

				const mergedPath = getDocumentPath(documentModel, path, context);
				const expectedPath = createDocumentPath(
					["Root", 1],
					["Group1", 6],
					["NestedGroup1", 7],
					["Field1", 1]
				);
				deepStrictEqual(mergedPath, expectedPath);
			});

			it("calculates correctly the document path and uses the indexes from the context", () => {
				const path = createDocumentPath(
					["Root"],
					["RepGroup1", 3],
					["NestedRepGroup1", 4],
					["Field1"]
				);
				const context = createDocumentPath(["Root"], ["RepGroup1", 2], ["NestedRepGroup1", 3]);

				const mergedPath = getDocumentPath(documentModel, path, context);
				const expectedPath = createDocumentPath(
					["Root", 1],
					["RepGroup1", 2],
					["NestedRepGroup1", 3],
					["Field1", 1]
				);
				deepStrictEqual(mergedPath, expectedPath);
			});
		});
	});
});
