// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { strictEqual } from "node:assert/strict";

import { EngineStore } from "../../../back-end/store/index.js";

describe("unit.back-end.store.calculateNewIndex", () => {
	describe("delta = undefined", () => {
		const changedRowIndex = 5;
		describe(`changedRowIndex = ${changedRowIndex}`, () => {
			describe("set of referencedRowIndex", () => {
				it(`returns a by one decremented index for all indicies which are > ${changedRowIndex}`, () => {
					for (let i = changedRowIndex + 1; i <= 10; i++) {
						const newIndex = EngineStore.Validation.Message.calculateNewIndex(changedRowIndex, i);
						strictEqual(newIndex, i - 1);
					}
				});

				it(`returns the old index for all indicies which are <= ${changedRowIndex}`, () => {
					for (let i = 1; i <= changedRowIndex; i++) {
						const newIndex = EngineStore.Validation.Message.calculateNewIndex(changedRowIndex, i);
						strictEqual(newIndex, i);
					}
				});
			});
		});
	});

	describe("delta = 1", () => {
		const changedRowIndex = 5;
		const delta = 1;

		describe(`changedRowIndex = ${changedRowIndex}`, () => {
			describe("set of referencedRowIndex", () => {
				it(`returns a by one incremente index if the index is ${changedRowIndex}`, () => {
					const oldIndex = changedRowIndex;
					const newIndex = EngineStore.Validation.Message.calculateNewIndex(
						changedRowIndex,
						oldIndex,
						delta
					);
					strictEqual(newIndex, oldIndex + 1);
				});

				it(`returns a by one decremented index if the index is ${changedRowIndex} + 1`, () => {
					const oldIndex = changedRowIndex + 1;
					const newIndex = EngineStore.Validation.Message.calculateNewIndex(
						changedRowIndex,
						oldIndex,
						delta
					);
					strictEqual(newIndex, oldIndex - 1);
				});

				it(`returns the old index for all other indicies`, () => {
					for (let i = 1; i <= 10; i++) {
						if (i === changedRowIndex || i === changedRowIndex + 1) {
							continue;
						}
						const newIndex = EngineStore.Validation.Message.calculateNewIndex(
							changedRowIndex,
							i,
							1
						);
						strictEqual(newIndex, i);
					}
				});
			});
		});
	});

	describe("delta = -1", () => {
		const changedRowIndex = 5;
		const delta = -1;
		describe(`changedRowIndex = ${changedRowIndex}`, () => {
			describe("set of referencedRowIndex", () => {
				it(`returns a by one decremented index if the index is ${changedRowIndex}`, () => {
					const oldIndex = changedRowIndex;
					const newIndex = EngineStore.Validation.Message.calculateNewIndex(
						changedRowIndex,
						oldIndex,
						delta
					);
					strictEqual(newIndex, oldIndex + delta);
				});

				it(`returns a by one incremented index if the index is ${changedRowIndex} - 1`, () => {
					const oldIndex = changedRowIndex - 1;
					const newIndex = EngineStore.Validation.Message.calculateNewIndex(
						changedRowIndex,
						oldIndex,
						delta
					);
					strictEqual(newIndex, oldIndex - delta);
				});

				it(`returns the old index for all other indicies`, () => {
					for (let i = 1; i <= 10; i++) {
						if (i === changedRowIndex || i === changedRowIndex - 1) {
							continue;
						}
						const newIndex = EngineStore.Validation.Message.calculateNewIndex(
							changedRowIndex,
							i,
							delta
						);
						strictEqual(newIndex, i);
					}
				});
			});
		});
	});
});
