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

import { deepStrictEqual, strictEqual } from "node:assert/strict";

import { DocumentPath } from "@com.mgmtp.a12.client/client-data";

import { toEditableElements } from "../../../../../main/core/contentElements/modules/messageGroupContainer/toEditableElements.js";

import {
	createMultiInputNode,
	createProjectInputNode,
	createTextLineNode,
	testLabel
} from "./testContentNodes.js";
import {
	createMultiInputModule,
	createProjectInputModule,
	createTestLibrary
} from "./testElementLibrary.js";
import { createRuntimeNode } from "./testRuntimeNodes.js";

function resolveToPath(_dataContext: string, elementId: string) {
	return DocumentPath.fromString(`/root[1]/${elementId}[1]`);
}

describe("core.contentElements", () => {
	describe("toEditableElements", () => {
		it("reports the runtime node id, so a link addresses the node that rendered", () => {
			const node = createRuntimeNode(createTextLineNode("a"), "/G[2]");

			const elements = toEditableElements(createTestLibrary(), node, resolveToPath);

			strictEqual(elements.length, 1);
			strictEqual(elements[0].nodeId, "textline-a@/G[2]");
		});

		it("reads the label the content model author gave the node", () => {
			const node = createRuntimeNode(createTextLineNode("a", testLabel("Street")), "/");

			const elements = toEditableElements(createTestLibrary(), node, resolveToPath);

			deepStrictEqual(elements[0].label, testLabel("Street"));
		});

		it("leaves the label undefined when the node carries none", () => {
			const node = createRuntimeNode(createTextLineNode("a"), "/");

			const elements = toEditableElements(createTestLibrary(), node, resolveToPath);

			strictEqual(elements[0].label, undefined);
		});

		it("reads the label from a project element through its own module", () => {
			const node = createRuntimeNode(createProjectInputNode("ref", testLabel("Caption")), "/");
			const library = createTestLibrary([createProjectInputModule()]);

			const elements = toEditableElements(library, node, resolveToPath);

			deepStrictEqual(elements[0].label, testLabel("Caption"));
		});

		it("reports one element per reference, in the order the node references them", () => {
			const node = createRuntimeNode(createMultiInputNode(["first", "second"]), "/");
			const library = createTestLibrary([createMultiInputModule()]);

			const elements = toEditableElements(library, node, resolveToPath);

			deepStrictEqual(
				elements.map(element => DocumentPath.toString(element.documentPath)),
				["/root[1]/first[1]", "/root[1]/second[1]"]
			);
		});

		it("drops a reference whose document path cannot be resolved instead of throwing", () => {
			const node = createRuntimeNode(createMultiInputNode(["resolvable", "unreachable"]), "/");
			const library = createTestLibrary([createMultiInputModule()]);

			function resolveOrThrow(dataContext: string, elementId: string) {
				if (elementId === "unreachable") {
					throw new Error("Unable to resolve the document path");
				}
				return resolveToPath(dataContext, elementId);
			}

			const elements = toEditableElements(library, node, resolveOrThrow);

			deepStrictEqual(
				elements.map(element => DocumentPath.toString(element.documentPath)),
				["/root[1]/resolvable[1]"]
			);
		});

		it("reports nothing for a node that edits no data", () => {
			const node = createRuntimeNode(createTextLineNode("a"), "/");
			// a library without the Form Elements controls does not recognise the node
			const emptyLibrary = { id: "empty", modules: [], configuration: {} };

			deepStrictEqual(toEditableElements(emptyLibrary, node, resolveToPath), []);
		});
	});
});
