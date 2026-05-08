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

/* eslint-disable @typescript-eslint/no-non-null-assertion */

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
