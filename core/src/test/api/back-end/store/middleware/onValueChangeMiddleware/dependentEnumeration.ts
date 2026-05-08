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

import { strictEqual } from "node:assert/strict";

import type { GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import { DataSelectors, Events } from "../../../../../../back-end/store/index.js";
import { DocumentUtils } from "../../../../../../models/internal/utils/document-utils.js";
import { DocumentHelpers } from "../../../../../utils/document-helpers.js";
import { US_LOCALE } from "../../../../../utils/localization.js";
import { SetupHelpers } from "../../../../../utils/setup.js";
import { setupModelsFixture } from "../../../../../utils/setupFixture.js";

const { createDocumentPath } = DocumentHelpers;
const { createTestStore } = SetupHelpers;

export function executeTestsForDependentEnumeration(): void {
	describe("Dependent Enumerations", () => {
		const models = setupModelsFixture("dependencies.enumeration");

		function setupStore(document: object) {
			return createTestStore({
				storeConfig: {
					models,
					locale: US_LOCALE,
					data: { document }
				}
			});
		}

		describe("Control", () => {
			const MASTER_FIELD = createDocumentPath(["A12T_DependentEnumeration"], ["Brand"]);
			const DEPENDENT_FIELD = createDocumentPath(["A12T_DependentEnumeration"], ["Model"]);
			it(
				"clears a selected dependent enumeration" +
					" if the master field changes and valueForMasterChange is not given",
				() => {
					const store = setupStore({});
					store.dispatch(
						Events.valueChange({ path: MASTER_FIELD, value: "MERCEDES", formModelElementPath: [] })
					);
					store.dispatch(
						Events.valueChange({
							path: DEPENDENT_FIELD,
							value: "MERCEDES_A_CLASS",
							formModelElementPath: []
						})
					);

					// Check that the values was really set
					const documentBefore = DataSelectors.document()(store.getState());
					const value = DocumentUtils.getValue({
						document: documentBefore as GroupInstance,
						path: DEPENDENT_FIELD
					});

					strictEqual(value, "MERCEDES_A_CLASS");

					// Change Master
					store.dispatch(
						Events.valueChange({ path: MASTER_FIELD, value: "TOYOTA", formModelElementPath: [] })
					);
					const documentAfter = DataSelectors.document()(store.getState());
					const valueAfter = DocumentUtils.getValue({
						document: documentAfter as GroupInstance,
						path: DEPENDENT_FIELD
					});

					strictEqual(valueAfter, null, "Expected that the dependent enumeration gets cleared");
				}
			);

			it(
				"sets valueForMasterChange for a selected dependent enumeration" +
					" if the master field changes and valueForMasterChange is given",
				() => {
					const store = setupStore({});
					store.dispatch(
						Events.valueChange({ path: MASTER_FIELD, value: "MERCEDES", formModelElementPath: [] })
					);
					store.dispatch(
						Events.valueChange({
							path: DEPENDENT_FIELD,
							value: "MERCEDES_A_CLASS",
							formModelElementPath: []
						})
					);

					// Check that the values was really set
					const documentBefore = DataSelectors.document()(store.getState());
					const value = DocumentUtils.getValue({
						document: documentBefore as GroupInstance,
						path: DEPENDENT_FIELD
					});

					strictEqual(value, "MERCEDES_A_CLASS");

					// Change Master
					store.dispatch(
						Events.valueChange({ path: MASTER_FIELD, value: "VW", formModelElementPath: [] })
					);
					const documentAfter = DataSelectors.document()(store.getState());
					const valueAfter = DocumentUtils.getValue({
						document: documentAfter as GroupInstance,
						path: DEPENDENT_FIELD
					});

					strictEqual(
						valueAfter,
						"VW_UP",
						"Expected that the dependent enumeration gets set to VW_UP"
					);
				}
			);
		});

		describe("Repeat", () => {
			const MASTER_FIELD = createDocumentPath(
				["A12T_DependentEnumeration"],
				["Cars", 1],
				["Brand"]
			);
			const DEPENDENT_FIELD = createDocumentPath(
				["A12T_DependentEnumeration"],
				["Cars", 1],
				["Model"]
			);
			it(
				"clears a selected dependent enumeration" +
					" if the master field changes and valueForMasterChange is not given",
				() => {
					const store = setupStore({
						A12T_DependentEnumeration: {
							Cars: [{}]
						}
					});

					store.dispatch(
						Events.valueChange({ path: MASTER_FIELD, value: "MERCEDES", formModelElementPath: [] })
					);
					store.dispatch(
						Events.valueChange({
							path: DEPENDENT_FIELD,
							value: "MERCEDES_A_CLASS",
							formModelElementPath: []
						})
					);

					// Check that the values was really set
					const documentBefore = DataSelectors.document()(store.getState());
					const value = DocumentUtils.getValue({
						document: documentBefore as GroupInstance,
						path: DEPENDENT_FIELD
					});

					strictEqual(value, "MERCEDES_A_CLASS");

					// Change Master
					store.dispatch(
						Events.valueChange({ path: MASTER_FIELD, value: "TOYOTA", formModelElementPath: [] })
					);
					const documentAfter = DataSelectors.document()(store.getState());
					const valueAfter = DocumentUtils.getValue({
						document: documentAfter as GroupInstance,
						path: DEPENDENT_FIELD
					});

					strictEqual(valueAfter, null, "Expected that the dependent enumeration gets cleared");
				}
			);

			it(
				"sets valueForMasterChange for a selected dependent enumeration" +
					" if the master field changes and valueForMasterChange is given",
				() => {
					const store = setupStore({
						A12T_DependentEnumeration: {
							Cars: [{}]
						}
					});

					store.dispatch(
						Events.valueChange({ path: MASTER_FIELD, value: "MERCEDES", formModelElementPath: [] })
					);
					store.dispatch(
						Events.valueChange({
							path: DEPENDENT_FIELD,
							value: "MERCEDES_A_CLASS",
							formModelElementPath: []
						})
					);

					// Check that the values was really set
					const documentBefore = DataSelectors.document()(store.getState());
					const value = DocumentUtils.getValue({
						document: documentBefore as GroupInstance,
						path: DEPENDENT_FIELD
					});

					strictEqual(value, "MERCEDES_A_CLASS");

					// Change Master
					store.dispatch(
						Events.valueChange({ path: MASTER_FIELD, value: "VW", formModelElementPath: [] })
					);
					const documentAfter = DataSelectors.document()(store.getState());
					const valueAfter = DocumentUtils.getValue({
						document: documentAfter as GroupInstance,
						path: DEPENDENT_FIELD
					});

					strictEqual(
						valueAfter,
						"VW_UP",
						"Expected that the dependent enumeration gets set to VW_UP"
					);
				}
			);
		});
	});
}
