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

import { collectReferencedElementIds } from "../../../../../main/core/contentElements/modules/messageGroupContainer/useCollectDocumentElementIds.js";

import {
	createCheckboxNode,
	createGenericContainerNode,
	createMessageGroupContainerNode,
	createProjectInputNode,
	createTextLineNode
} from "./testContentNodes.js";
import { createProjectInputModule, createTestLibrary } from "./testElementLibrary.js";

describe("core.contentElements", () => {
	describe("collectReferencedElementIds", () => {
		it("should return empty results when no node is given", () => {
			deepStrictEqual(collectReferencedElementIds(createTestLibrary()), []);
		});

		it("should return empty results when the node is not a MessageGroupContainer", () => {
			const node = createGenericContainerNode("container", [createTextLineNode("field1")]);

			deepStrictEqual(collectReferencedElementIds(createTestLibrary(), node), []);
		});

		it("should return empty results when the MessageGroupContainer has no children", () => {
			const node = createMessageGroupContainerNode();

			deepStrictEqual(collectReferencedElementIds(createTestLibrary(), node), []);
		});

		it("should collect the ids referenced by the controls of the container", () => {
			const node = createMessageGroupContainerNode([
				createTextLineNode("field1"),
				createCheckboxNode("group1")
			]);

			deepStrictEqual(collectReferencedElementIds(createTestLibrary(), node), ["field1", "group1"]);
		});

		it("should skip elements nested in another MessageGroupContainer", () => {
			const nestedContainer = createMessageGroupContainerNode(
				[createTextLineNode("nested-field")],
				"nested-message-group-container"
			);

			const node = createMessageGroupContainerNode([
				createTextLineNode("included-field"),
				nestedContainer
			]);

			deepStrictEqual(collectReferencedElementIds(createTestLibrary(), node), ["included-field"]);
		});

		it("should skip nodes of elements that are not installed", () => {
			const node = createMessageGroupContainerNode([
				createTextLineNode("form-field"),
				createProjectInputNode("uninstalled-field")
			]);

			deepStrictEqual(collectReferencedElementIds(createTestLibrary(), node), ["form-field"]);
		});

		it("should skip controls without a configured data element", () => {
			const node = createMessageGroupContainerNode([
				createTextLineNode("form-field"),
				createTextLineNode("")
			]);

			deepStrictEqual(collectReferencedElementIds(createTestLibrary(), node), ["form-field"]);
		});

		it("should collect project-specific elements that declare themselves as inputs", () => {
			const node = createMessageGroupContainerNode([
				createTextLineNode("form-field"),
				createProjectInputNode("project-field")
			]);

			const library = createTestLibrary([createProjectInputModule()]);

			deepStrictEqual(collectReferencedElementIds(library, node), ["form-field", "project-field"]);
		});

		it("should collect ids from deeply nested containers in document order", () => {
			const deepContainer = createGenericContainerNode("deep-container", [
				createCheckboxNode("deep-field")
			]);
			const middleContainer = createGenericContainerNode("middle-container", [
				createTextLineNode("middle-field"),
				deepContainer
			]);

			const node = createMessageGroupContainerNode([
				createTextLineNode("root-field"),
				middleContainer,
				createCheckboxNode("another-root-field")
			]);

			deepStrictEqual(collectReferencedElementIds(createTestLibrary(), node), [
				"root-field",
				"middle-field",
				"deep-field",
				"another-root-field"
			]);
		});
	});
});
