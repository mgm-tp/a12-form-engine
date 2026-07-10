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

import { deepStrictEqual } from "node:assert/strict";

import type {
	Document,
	DocumentModel,
	EntityInstancePath
} from "@com.mgmtp.a12.kernel/kernel-md-facade";
import { DocumentServiceFactory } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import { findNotRelevantPaths } from "../../../back-end/store/internal/findNotRelevantPaths.js";
import { DocumentPath } from "../../../models/index.js";
import { loadModels } from "../../utils/setup.js";

import testDocument from "./findNotRelevantPaths.data.json" with { type: "json" };

describe("unit.dependency.findNotRelevantPaths", () => {
	describe("findNotRelevantPaths", () => {
		const testModels = loadModels("test.findNotRelevantPaths");

		const documentService = new DocumentServiceFactory().getDocumentService();

		interface TestSpec {
			readonly description: string;
			readonly triggerPathString: string;
			readonly expected: EntityInstancePath[];
		}

		const testSpecs: TestSpec[] = [
			{
				description:
					"given a root level field is set to notRelevant, returns the path of the field instance",
				triggerPathString: "/root[1]/trigField[1]",
				expected: [DocumentPath.fromString("/root[1]/field[1]")]
			},
			{
				description:
					"given a non-repeatable nested field is set to notRelevant, returns the path of the field instance",
				triggerPathString: "/root[1]/group[1]/trigFieldInGroup[1]",
				expected: [DocumentPath.fromString("/root[1]/group[1]/fieldInGroup[1]")]
			},
			{
				description:
					"given a field in a repeatable group is set to notRelevant, returns the path of the field instance",
				triggerPathString: "/root[1]/repGroup[1]/trigFieldInRepGroup[1]",
				expected: [DocumentPath.fromString("/root[1]/repGroup[1]/fieldInRepGroup[1]")]
			},
			{
				description:
					"given a field in a group within a repeatable group is set to notRelevant, returns the path of the field instance",
				triggerPathString: "/root[1]/repGroup[1]/groupInRepGroup[1]/trigFieldInGroupInRepGroup[1]",
				expected: [
					DocumentPath.fromString(
						"/root[1]/repGroup[1]/groupInRepGroup[1]/fieldInGroupInRepGroup[1]"
					)
				]
			},
			{
				description:
					"given a field in a repeatable group within a repeatable group is set to notRelevant, returns the path of the field instance",
				triggerPathString:
					"/root[1]/repGroup[1]/repGroupInRepGroup[1]/trigFieldInRepGroupInRepGroup[1]",
				expected: [
					DocumentPath.fromString(
						"/root[1]/repGroup[1]/repGroupInRepGroup[1]/fieldInRepGroupInRepGroup[1]"
					)
				]
			},
			{
				description:
					"given a root level group is set to notRelevant, returns the path of the group instance",
				triggerPathString: "/root[1]/trigGroup[1]",
				expected: [DocumentPath.fromString("/root[1]/group[1]")]
			},
			{
				description:
					"given a root level repeatable group is set to notRelevant, returns all paths of its repeatable group instances",
				triggerPathString: "/root[1]/trigRepGroup[1]",
				expected: [
					DocumentPath.fromString("/root[1]/repGroup[1]"),
					DocumentPath.fromString("/root[1]/repGroup[2]")
				]
			},
			{
				description:
					"given a group nested in a repeatable group is set to notRelevant, returns path to the group instance in the triggered repetition",
				triggerPathString: "/root[1]/repGroup[1]/trigGroupInRepGroup[1]",
				expected: [DocumentPath.fromString("/root[1]/repGroup[1]/groupInRepGroup[1]")]
			},
			{
				description:
					"given a repeatable group nested in a repeatable group is set to notRelevant, returns paths to the group instances in the triggered repetition",
				triggerPathString: "/root[1]/repGroup[1]/trigRepGroupInRepGroup[1]",
				expected: [
					DocumentPath.fromString("/root[1]/repGroup[1]/repGroupInRepGroup[1]"),
					DocumentPath.fromString("/root[1]/repGroup[1]/repGroupInRepGroup[2]")
				]
			}
		];

		for (const spec of testSpecs) {
			createTest(spec);
		}

		function createTest(testSpec: TestSpec): void {
			it(testSpec.description, () => {
				const documentWithTrigger = createDocumentWithTrigger(
					testSpec.triggerPathString,
					testModels.documentModel
				);

				const result = findNotRelevantPaths(documentWithTrigger, testModels);

				deepStrictEqual(result, testSpec.expected);
			});
		}

		function createDocumentWithTrigger(
			triggerPathString: string,
			documentModel: DocumentModel
		): Document {
			const triggerPath = DocumentPath.fromString(triggerPathString);
			return documentService.updateEntityInstance(
				testDocument,
				triggerPath,
				true,
				documentModel
			) as Document;
		}
	});
});
