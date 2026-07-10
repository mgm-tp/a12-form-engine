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

import { strictEqual } from "node:assert/strict";

import { last } from "fp-ts/lib/NonEmptyArray.js";
import type { NonEmptyArray } from "fp-ts/lib/NonEmptyArray.js";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";

import { FormModelPath } from "../../../models/internal/utils/form-model-path.js";
import type { ModelVisitor } from "../../../models/internal/utils/form-model-walker.js";
import { ModelWalker } from "../../../models/internal/utils/form-model-walker.js";

import { expectedVisitingOrder, largeTestModel } from "./test-model.js";

describe("unit.back-end.store.form-model-walker.traversal-order", () => {
	it("visits the form model elements in correct order", () => {
		const visitor = new TrackingVisitor();
		new ModelWalker(visitor).acceptModel(largeTestModel);
		strictEqual(visitor.visitedElements.length, 42); // :D
		expectedVisitingOrder.forEach((value, index) => {
			strictEqual(ModelPath.toString(visitor.visitedElements[index]), value);
		});
	});

	class TrackingVisitor implements ModelVisitor {
		public visitedElements: ModelPath[] = [];
		private formModelPathStack: ModelPath[] = [];

		enter(elementStack: NonEmptyArray<object>): void {
			const currentElementPath = FormModelPath.extend(
				this.formModelPathStack.at(-1) ?? [],
				last(elementStack)
			);
			this.formModelPathStack.push(currentElementPath);
			this.visitedElements.push(currentElementPath);
		}

		leave(): void {
			this.formModelPathStack.pop();
		}
	}
});
