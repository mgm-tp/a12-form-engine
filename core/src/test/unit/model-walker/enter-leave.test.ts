// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { strictEqual } from "node:assert/strict";

import type { ModelVisitor } from "../../../models/internal/utils/form-model-walker.js";
import { ModelWalker } from "../../../models/internal/utils/form-model-walker.js";

import { enterLeaveOrder, expectedVisitingOrder, largeTestModel } from "./test-model.js";

describe("unit.back-end.store.form-model-walker.enter-leave", () => {
	it("calls enter() before and leave() after visiting a form model element", () => {
		const expectedOrder = enterLeaveOrder(expectedVisitingOrder);
		const visitor = new TrackingVisitor(expectedOrder);
		new ModelWalker(visitor).acceptModel(largeTestModel);
	});

	class TrackingVisitor implements ModelVisitor {
		private currentIndex = 0;

		constructor(readonly expectedOrder: ("enter" | "leave")[]) {}

		enter(): void {
			strictEqual(
				"enter",
				this.expectedOrder[this.currentIndex],
				`unexpected enter() at index ${this.currentIndex}`
			);
			this.currentIndex++;
		}

		leave(): void {
			strictEqual(
				"leave",
				this.expectedOrder[this.currentIndex],
				`unexpected leave() at index ${this.currentIndex}`
			);
			this.currentIndex++;
		}
	}
});
