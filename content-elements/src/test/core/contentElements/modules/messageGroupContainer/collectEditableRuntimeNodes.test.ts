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

import { collectEditableRuntimeNodes } from "../../../../../main/core/contentElements/modules/messageGroupContainer/collectEditableRuntimeNodes.js";

import {
	createCheckboxNode,
	createGenericContainerNode,
	createMessageGroupContainerNode,
	createProjectInputNode,
	createTextLineNode
} from "./testContentNodes.js";
import { createProjectInputModule, createTestLibrary } from "./testElementLibrary.js";
import { createRepeatedInstances, createRuntimeNode } from "./testRuntimeNodes.js";

describe("core.contentElements", () => {
	describe("collectEditableRuntimeNodes", () => {
		it("returns the inputs of a repeatable group row by row, not input by input", () => {
			const inputA = createTextLineNode("a");
			const inputB = createCheckboxNode("b");
			const group = createGenericContainerNode("group");

			const runtimeNodes = createRepeatedInstances(group, ["/G[1]", "/G[2]"], dataContext => [
				createRuntimeNode(inputA, dataContext),
				createRuntimeNode(inputB, dataContext)
			]);

			const collected = collectEditableRuntimeNodes(createTestLibrary(), runtimeNodes);

			deepStrictEqual(
				collected.map(node => node.nodeId),
				["textline-a@/G[1]", "checkbox-b@/G[1]", "textline-a@/G[2]", "checkbox-b@/G[2]"]
			);
		});

		it("orders nested repeatable groups outer row first", () => {
			const input = createTextLineNode("a");
			const outer = createGenericContainerNode("outer");
			const inner = createGenericContainerNode("inner");

			const runtimeNodes = createRepeatedInstances(outer, ["/G[1]", "/G[2]"], outerContext =>
				createRepeatedInstances(
					inner,
					[`${outerContext}/H[1]`, `${outerContext}/H[2]`],
					innerContext => [createRuntimeNode(input, innerContext)]
				)
			);

			const collected = collectEditableRuntimeNodes(createTestLibrary(), runtimeNodes);

			deepStrictEqual(
				collected.map(node => node.nodeId),
				[
					"textline-a@/G[1]/H[1]",
					"textline-a@/G[1]/H[2]",
					"textline-a@/G[2]/H[1]",
					"textline-a@/G[2]/H[2]"
				]
			);
		});

		it("collects inputs nested in another MessageGroupContainer", () => {
			const outerInput = createTextLineNode("outer");
			const innerInput = createTextLineNode("inner");

			const runtimeNodes = [
				createRuntimeNode(createMessageGroupContainerNode(), "/", [
					createRuntimeNode(outerInput, "/"),
					createRuntimeNode(createMessageGroupContainerNode(undefined, "nested-container"), "/", [
						createRuntimeNode(innerInput, "/")
					])
				])
			];

			const collected = collectEditableRuntimeNodes(createTestLibrary(), runtimeNodes);

			deepStrictEqual(
				collected.map(node => node.nodeId),
				["textline-outer", "textline-inner"]
			);
		});

		it("skips nodes that do not edit the data they reference", () => {
			const input = createTextLineNode("a");
			const container = createGenericContainerNode("container");

			const runtimeNodes = [
				createRuntimeNode(container, "/", [
					createRuntimeNode(createMessageGroupContainerNode(), "/"),
					createRuntimeNode(input, "/")
				])
			];

			const collected = collectEditableRuntimeNodes(createTestLibrary(), runtimeNodes);

			deepStrictEqual(
				collected.map(node => node.nodeId),
				["textline-a"]
			);
		});

		it("collects a project input declared outside the Form Elements library", () => {
			const projectInput = createProjectInputNode("project-ref");
			const library = createTestLibrary([createProjectInputModule()]);

			const runtimeNodes = [createRuntimeNode(projectInput, "/G[1]")];

			const collected = collectEditableRuntimeNodes(library, runtimeNodes);

			deepStrictEqual(
				collected.map(node => node.nodeId),
				["project-input-project-ref@/G[1]"]
			);
		});
	});
});
