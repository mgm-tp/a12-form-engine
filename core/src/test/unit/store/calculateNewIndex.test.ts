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
