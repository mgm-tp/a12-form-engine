// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { strictEqual } from "node:assert/strict";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import { DocumentModelUtils } from "../../../models/internal/utils/document-model-utils.js";
import { DocumentModelHelpers } from "../../utils/model-helpers.js";

describe("unit.models.document-model-utils", () => {
	describe("computeGranularity", () => {
		describe("Given a path to a group", () => {
			describe("which is non-repeatable", () => {
				describe("and nested in a repeatable group", () => {
					it("returns the path to next repeatable ancestor group", () => {
						const granularity = DocumentModelUtils.computeGranularity(
							dm(),
							ModelPath.fromString("/Root/G1_nonRep/G2_rep/G3_nonRep/G4_nonRep")
						);

						strictEqual(ModelPath.toString(granularity), "/Root/G1_nonRep/G2_rep");
					});
				});

				describe("and not nested in a repeatable group", () => {
					it("returns the empty path", () => {
						const granularity = DocumentModelUtils.computeGranularity(
							dm(),
							ModelPath.fromString("/Root/G1_nonRep")
						);

						strictEqual(ModelPath.toString(granularity), "/");
					});
				});
			});

			describe("which is repeatable", () => {
				it("returns the path to the group itself", () => {
					const granularity = DocumentModelUtils.computeGranularity(
						dm(),
						ModelPath.fromString("/Root/G1_nonRep/G2_rep")
					);

					strictEqual(ModelPath.toString(granularity), "/Root/G1_nonRep/G2_rep");
				});
			});

			describe("which is a multi-select", () => {
				it("returns the path to next repeatable ancestor group", () => {
					const granularity = DocumentModelUtils.computeGranularity(
						dm(),
						ModelPath.fromString("/Root/G1_nonRep/G2_rep/G3_nonRep/G3_multiSelect")
					);

					strictEqual(ModelPath.toString(granularity), "/Root/G1_nonRep/G2_rep");
				});
			});
		});

		describe("Given a path to a field", () => {
			describe("which is nested in a repeatable group", () => {
				it("returns the path to next repeatable ancestor group", () => {
					const granularity = DocumentModelUtils.computeGranularity(
						dm(),
						ModelPath.fromString("/Root/G1_nonRep/G2_rep/G3_nonRep/G3_Field")
					);

					strictEqual(ModelPath.toString(granularity), "/Root/G1_nonRep/G2_rep");
				});
			});

			describe("which is not nested in a repeatable group", () => {
				it("returns the empty path", () => {
					const granularity = DocumentModelUtils.computeGranularity(
						dm(),
						ModelPath.fromString("/Root/Root_Field")
					);

					strictEqual(ModelPath.toString(granularity), "/");
				});
			});

			describe("which is a multi-select value field", () => {
				it("returns the path to next repeatable ancestor group", () => {
					const granularity = DocumentModelUtils.computeGranularity(
						dm(),
						ModelPath.fromString("/Root/G1_nonRep/G2_rep/G3_nonRep/G3_multiSelect/multiSelectValue")
					);

					strictEqual(ModelPath.toString(granularity), "/Root/G1_nonRep/G2_rep");
				});
			});
		});
	});
});

function dm(): DocumentModel {
	const { createDocumentModel, Field, Group } = DocumentModelHelpers;

	return createDocumentModel(
		Group({
			name: "Root",
			elements: [
				Group({
					name: "G1_nonRep",
					elements: [
						Group({
							name: "G2_rep",
							repeatability: 5,
							elements: [
								Group({
									name: "G3_nonRep",
									elements: [
										Group({ name: "G4_nonRep" }),
										Field({ name: "G3_Field" }),
										Group({
											name: "G3_multiSelect",
											repeatability: 999,
											usageType: "multi-select",
											elements: [Field({ name: "multiSelectValue" })]
										})
									]
								})
							]
						})
					]
				}),
				Field({ name: "Root_Field" })
			]
		})
	);
}
