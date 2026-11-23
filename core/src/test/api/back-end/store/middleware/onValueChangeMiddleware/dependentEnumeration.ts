// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
