// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

/* oxlint-disable typescript/no-non-null-assertion */

import { deepStrictEqual } from "node:assert/strict";

import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import { DocumentServiceFactory } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/facade.js";

import { DocumentModelUtils } from "../../../models/internal/utils/document-model-utils.js";
import { ModelUtils } from "../../../models/internal/utils/model-utils.js";
import { setupFixture, setupModelsFixture } from "../../utils/setupFixture.js";
import * as IDS from "../../utils/test-model-helpers/util-test.ids.js";

describe("unit.models.model-utils", () => {
	describe("createGroupInstance", () => {
		const models = setupModelsFixture("test.util");
		const fixture = setupFixture(() => {
			return {
				documentModelSearchService: new DocumentServiceFactory().getDocumentModelSearchService(
					models.documentModel
				)
			};
		});

		describe("given a group without children", () => {
			it("returns an empty group instance", () => {
				const emptyGroup: DocumentModel.Group = {
					id: "emptyGroupId",
					name: "emptyGroup",
					annotations: [],
					type: "Group",
					repeatability: 1,
					elements: []
				};

				const expectedGroupInstance = {};
				const groupInstance = ModelUtils.createGroupInstance(emptyGroup, models.formModel, []);

				deepStrictEqual(groupInstance, expectedGroupInstance);
			});
		});

		describe("given a group with just fields with initial values as children", () => {
			it("returns the group instance with the field instances with initialValues", () => {
				const groupPath = fixture.documentModelSearchService.getPathById(
					IDS.GROUP_WITH_FIELD_INIT
				)!;
				const group = DocumentModelUtils.findByPath(models.documentModel, groupPath);

				const expectedGroupInstance = { stringField: "abc" };
				const groupInstance = ModelUtils.createGroupInstance(group, models.formModel, groupPath);

				deepStrictEqual(groupInstance, expectedGroupInstance);
			});
		});

		describe("given a group with just fields without initial values as children", () => {
			it("returns an empty group instance", () => {
				const groupPath = fixture.documentModelSearchService.getPathById(
					IDS.GROUP_WITH_FIELD_NOT_INIT
				)!;
				const group = DocumentModelUtils.findByPath(models.documentModel, groupPath);

				const expectedGroupInstance = {};
				const groupInstance = ModelUtils.createGroupInstance(group, models.formModel, groupPath);

				deepStrictEqual(groupInstance, expectedGroupInstance);
			});
		});

		describe("given a group with a non-repeatable subgroup as child", () => {
			it("returns the group instance with its child group instance as object", () => {
				const groupPath = fixture.documentModelSearchService.getPathById(
					IDS.GROUP_WITH_NON_REP_SUB_GROUP
				)!;
				const group = DocumentModelUtils.findByPath(models.documentModel, groupPath);

				const expectedGroupInstance = {
					nonRepeatableSubgroup: { stringFromNonRepeatableSubgroup: "abc" }
				};
				const groupInstance = ModelUtils.createGroupInstance(group, models.formModel, groupPath);

				deepStrictEqual(groupInstance, expectedGroupInstance);
			});
		});

		describe("given a repeatable group with a non-repeatable subgroup", () => {
			it("returns the group instance with its child group instance as object", () => {
				const groupPath = fixture.documentModelSearchService.getPathById(
					IDS.REP_GROUP_WITH_NON_REP_SUB_GROUP
				)!;
				const group = DocumentModelUtils.findByPath(models.documentModel, groupPath);

				const expectedGroupInstance = {
					nonRepeatableSubgroup: { stringFromNonRepeatableSubgroup: "abc" }
				};
				const groupInstance = ModelUtils.createGroupInstance(group, models.formModel, groupPath);

				deepStrictEqual(groupInstance, expectedGroupInstance);
			});
		});
	});
});
