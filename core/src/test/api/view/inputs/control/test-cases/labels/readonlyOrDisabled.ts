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

import type { EngineStore, Models } from "../../../../../../../back-end/store/index.js";
import { SetupHelpers } from "../../../../../../utils/setup.js";
import { setupModelsFixture } from "../../../../../../utils/setupFixture.js";
import { IDS as ReadonlyIds } from "../../../../../../utils/test-model-helpers/enablement.no-asterisks.js";
import { IDS } from "../../../../../../utils/test-model-helpers/tooltips.js";

import { renderStringInput } from "../renderStringInput.js";

export function executeReadonlyOrDisabledTests() {
	const noAsterisksModels = setupModelsFixture("enablement.no_asterisks_readonly_or_disabled");

	function assertLabel(opts: {
		models: Models;
		elementId: string;
		uiState?: Partial<EngineStore.UIState>;
		expectedLabel: string;
	}) {
		const modelElement = renderStringInput(opts);
		strictEqual(modelElement.label, opts.expectedLabel);
	}

	describe("and set to readonly", () => {
		describe("by the control settings", () => {
			it("renders a component with prop 'label' set to the formatted localized given label with no asterisk", () => {
				assertLabel({
					models: noAsterisksModels,
					elementId: ReadonlyIds.STRING_READONLY,
					expectedLabel: "Readonly Field"
				});
			});
		});
		describe("by being inside a control grid that is set to readonly", () => {
			it("renders a component with prop 'label' set to the formatted localized given label with no asterisk", () => {
				assertLabel({
					models: noAsterisksModels,
					elementId: ReadonlyIds.STRING_CG_READONLY,
					expectedLabel: "Control Grid Readonly"
				});
			});
		});
		describe("by being a computed field", () => {
			it("renders a component with prop 'label' set to the formatted localized given label with no asterisk", () => {
				assertLabel({
					models: noAsterisksModels,
					elementId: ReadonlyIds.STRING_COMPUTED,
					expectedLabel: "Computed Field"
				});
			});
		});
		describe("by depending on another field that sets this control to readonly", () => {
			it("renders a component with prop 'label' set to the formatted localized given label with no asterisk", () => {
				assertLabel({
					models: noAsterisksModels,
					elementId: ReadonlyIds.STRING_DEPENDENT,
					expectedLabel: "Dependent Field"
				});
			});
		});
		describe("by being inside a group that is depending on another field that sets this group to readonly", () => {
			it("renders a component with prop 'label' set to the formatted localized given label with no asterisk", () => {
				assertLabel({
					models: noAsterisksModels,
					elementId: ReadonlyIds.STRING_DEPENDENT_GROUP,
					expectedLabel: "In Dependent Group"
				});
			});
		});
	});

	describe("and the ui state is disabled", () => {
		it("renders a component with prop 'label' set to the formatted localized given label with no asterisk", () => {
			const models = SetupHelpers.loadModels("controls.tooltips");
			assertLabel({
				elementId: IDS.STRING_INPUT,
				models,
				uiState: { disabled: true },
				expectedLabel: "StringType"
			});
		});
	});
}
