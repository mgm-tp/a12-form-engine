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

import { ok, strictEqual } from "node:assert/strict";

import type { GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade";

import { DataSelectors, Events, UiStateSelectors } from "../../../../../../back-end/store/index.js";
import { ReadonlyObjectMap } from "../../../../../../models/index.js";
import {
	DocumentPath,
	DocumentUtils
} from "../../../../../../models/internal/utils/document-utils.js";
import { createDocumentPath } from "../../../../../utils/createDocumentPath.js";
import { createTestStore } from "../../../../../utils/setup.js";
import { setupModelsFixture } from "../../../../../utils/setupFixture.js";

export function executeTestsForChainedDependenciesAndComputations(): void {
	describe("Chained Dependencies and Computations", () => {
		const models = setupModelsFixture("dependencies.element-computations");

		function setupStore() {
			return createTestStore({
				storeConfig: {
					models,
					data: {
						document: {
							root: {
								input_field: true,
								computation_field_1: true,
								dependent_field_1: true,
								computation_field_2: true,
								dependent_field_2: true
							}
						}
					}
				}
			});
		}

		const INPUT_FIELD = createDocumentPath(["root"], ["input_field"]);
		const COMPUTATION_FIELD_1 = createDocumentPath(["root"], ["computation_field_1"]);
		const DEPENDENT_FIELD_1 = createDocumentPath(["root"], ["dependent_field_1"]);
		const COMPUTATION_FIELD_2 = createDocumentPath(["root"], ["computation_field_2"]);
		const DEPENDENT_FIELD_2 = createDocumentPath(["root"], ["dependent_field_2"]);

		describe("changing the field `Input`", () => {
			it("sets all fields in the chain to the correct value", () => {
				const store = setupStore();
				store.dispatch(
					Events.valueChange({ path: INPUT_FIELD, value: false, formModelElementPath: [] })
				);

				const document1: GroupInstance = DataSelectors.document()(
					store.getState()
				) as GroupInstance;

				strictEqual(DocumentUtils.getValue({ document: document1, path: INPUT_FIELD }), false);
				strictEqual(
					DocumentUtils.getValue({ document: document1, path: COMPUTATION_FIELD_1 }),
					false
				);
				strictEqual(
					DocumentUtils.getValue({ document: document1, path: DEPENDENT_FIELD_1 }),
					false
				);
				strictEqual(
					DocumentUtils.getValue({ document: document1, path: COMPUTATION_FIELD_2 }),
					false
				);
				strictEqual(
					DocumentUtils.getValue({ document: document1, path: DEPENDENT_FIELD_2 }),
					false
				);

				store.dispatch(
					Events.valueChange({ path: INPUT_FIELD, value: true, formModelElementPath: [] })
				);

				const document2: GroupInstance = DataSelectors.document()(
					store.getState()
				) as GroupInstance;

				strictEqual(DocumentUtils.getValue({ document: document2, path: INPUT_FIELD }), true);
				strictEqual(
					DocumentUtils.getValue({ document: document2, path: COMPUTATION_FIELD_1 }),
					true
				);
				strictEqual(DocumentUtils.getValue({ document: document2, path: DEPENDENT_FIELD_1 }), true);
				strictEqual(
					DocumentUtils.getValue({ document: document2, path: COMPUTATION_FIELD_2 }),
					true
				);
				strictEqual(DocumentUtils.getValue({ document: document2, path: DEPENDENT_FIELD_2 }), true);
			});

			it("sets the error messages in the chain correctly", () => {
				const store = setupStore();
				store.dispatch(
					Events.valueChange({ path: INPUT_FIELD, value: false, formModelElementPath: [] })
				);

				const messages1 = Array.from(
					ReadonlyObjectMap.keys(UiStateSelectors.messages()(store.getState()))
				);

				ok(messages1.some(x => x === DocumentPath.toString(INPUT_FIELD)));
				ok(messages1.some(x => x === DocumentPath.toString(COMPUTATION_FIELD_1)));
				ok(messages1.some(x => x === DocumentPath.toString(DEPENDENT_FIELD_1)));
				ok(messages1.some(x => x === DocumentPath.toString(COMPUTATION_FIELD_2)));
				ok(messages1.some(x => x === DocumentPath.toString(DEPENDENT_FIELD_2)));

				store.dispatch(
					Events.valueChange({ path: INPUT_FIELD, value: true, formModelElementPath: [] })
				);
				const messages2 = Array.from(
					ReadonlyObjectMap.keys(UiStateSelectors.messages()(store.getState()))
				);

				ok(!messages2.some(x => x === DocumentPath.toString(INPUT_FIELD)));
				ok(!messages2.some(x => x === DocumentPath.toString(COMPUTATION_FIELD_1)));
				ok(!messages2.some(x => x === DocumentPath.toString(DEPENDENT_FIELD_1)));
				ok(!messages2.some(x => x === DocumentPath.toString(COMPUTATION_FIELD_2)));
				ok(!messages2.some(x => x === DocumentPath.toString(DEPENDENT_FIELD_2)));
			});
		});

		describe("changing the field `Dependent (1)`", () => {
			it("sets all fields in the chain to the correct value", () => {
				const store = setupStore();
				store.dispatch(
					Events.valueChange({ path: DEPENDENT_FIELD_1, value: false, formModelElementPath: [] })
				);

				const document1: GroupInstance = DataSelectors.document()(
					store.getState()
				) as GroupInstance;

				strictEqual(DocumentUtils.getValue({ document: document1, path: INPUT_FIELD }), true);
				strictEqual(
					DocumentUtils.getValue({ document: document1, path: COMPUTATION_FIELD_1 }),
					true
				);
				strictEqual(
					DocumentUtils.getValue({ document: document1, path: DEPENDENT_FIELD_1 }),
					false
				);
				strictEqual(
					DocumentUtils.getValue({ document: document1, path: COMPUTATION_FIELD_2 }),
					false
				);
				strictEqual(
					DocumentUtils.getValue({ document: document1, path: DEPENDENT_FIELD_2 }),
					false
				);
			});

			it("sets the error messages in the chain correctly", () => {
				const store = setupStore();
				store.dispatch(
					Events.valueChange({ path: DEPENDENT_FIELD_1, value: false, formModelElementPath: [] })
				);

				const messages1 = Array.from(
					ReadonlyObjectMap.keys(UiStateSelectors.messages()(store.getState()))
				);

				ok(!messages1.some(x => x === DocumentPath.toString(INPUT_FIELD)));
				ok(!messages1.some(x => x === DocumentPath.toString(COMPUTATION_FIELD_1)));
				ok(messages1.some(x => x === DocumentPath.toString(DEPENDENT_FIELD_1)));
				ok(messages1.some(x => x === DocumentPath.toString(COMPUTATION_FIELD_2)));
				ok(messages1.some(x => x === DocumentPath.toString(DEPENDENT_FIELD_2)));

				store.dispatch(
					Events.valueChange({ path: DEPENDENT_FIELD_1, value: true, formModelElementPath: [] })
				);
				const messages2 = Array.from(
					ReadonlyObjectMap.keys(UiStateSelectors.messages()(store.getState()))
				);

				ok(!messages2.some(x => x === DocumentPath.toString(INPUT_FIELD)));
				ok(!messages2.some(x => x === DocumentPath.toString(COMPUTATION_FIELD_1)));
				ok(!messages2.some(x => x === DocumentPath.toString(DEPENDENT_FIELD_1)));
				ok(!messages2.some(x => x === DocumentPath.toString(COMPUTATION_FIELD_2)));
				ok(!messages2.some(x => x === DocumentPath.toString(DEPENDENT_FIELD_2)));
			});
		});

		describe("changing the field `Dependent (2)`", () => {
			it("sets all fields in the chain to the correct value", () => {
				const store = setupStore();
				store.dispatch(
					Events.valueChange({ path: DEPENDENT_FIELD_2, value: false, formModelElementPath: [] })
				);

				const document1: GroupInstance = DataSelectors.document()(
					store.getState()
				) as GroupInstance;

				strictEqual(DocumentUtils.getValue({ document: document1, path: INPUT_FIELD }), true);
				strictEqual(
					DocumentUtils.getValue({ document: document1, path: COMPUTATION_FIELD_1 }),
					true
				);
				strictEqual(DocumentUtils.getValue({ document: document1, path: DEPENDENT_FIELD_1 }), true);
				strictEqual(
					DocumentUtils.getValue({ document: document1, path: COMPUTATION_FIELD_2 }),
					true
				);
				strictEqual(
					DocumentUtils.getValue({ document: document1, path: DEPENDENT_FIELD_2 }),
					false
				);
			});

			it("sets the error messages in the chain correctly", () => {
				const store = setupStore();
				store.dispatch(
					Events.valueChange({ path: DEPENDENT_FIELD_2, value: false, formModelElementPath: [] })
				);

				const messages1 = Array.from(
					ReadonlyObjectMap.keys(UiStateSelectors.messages()(store.getState()))
				);

				ok(!messages1.some(x => x === DocumentPath.toString(INPUT_FIELD)));
				ok(!messages1.some(x => x === DocumentPath.toString(COMPUTATION_FIELD_1)));
				ok(!messages1.some(x => x === DocumentPath.toString(DEPENDENT_FIELD_1)));
				ok(!messages1.some(x => x === DocumentPath.toString(COMPUTATION_FIELD_2)));
				ok(messages1.some(x => x === DocumentPath.toString(DEPENDENT_FIELD_2)));

				store.dispatch(
					Events.valueChange({ path: DEPENDENT_FIELD_2, value: true, formModelElementPath: [] })
				);
				const messages2 = Array.from(
					ReadonlyObjectMap.keys(UiStateSelectors.messages()(store.getState()))
				);

				ok(!messages2.some(x => x === DocumentPath.toString(INPUT_FIELD)));
				ok(!messages2.some(x => x === DocumentPath.toString(COMPUTATION_FIELD_1)));
				ok(!messages2.some(x => x === DocumentPath.toString(DEPENDENT_FIELD_1)));
				ok(!messages2.some(x => x === DocumentPath.toString(COMPUTATION_FIELD_2)));
				ok(!messages2.some(x => x === DocumentPath.toString(DEPENDENT_FIELD_2)));
			});
		});
	});
}
