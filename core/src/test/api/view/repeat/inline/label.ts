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

import { doesNotMatch, equal } from "node:assert/strict";

import { query } from "@com.mgmtp.a12.devtools/react";

import type { FormModel } from "../../../../../models/index.js";
import { SetupHelpers } from "../../../../utils/setup.js";
import { setupModelsFixture } from "../../../../utils/setupFixture.js";
import { IDS as ReadonlyIds } from "../../../../utils/test-model-helpers/enablement.no-asterisks.js";
import { IDS as MarkingIds } from "../../../../utils/test-model-helpers/validation.required.markingOfRequiredFields.js";

import { ModelElementIdEquals } from "../query-predicates.js";

export function executeLabelTests(): void {
	const inlineModels = setupModelsFixture("enablement.no_asterisks_readonly_or_disabled");
	const markingOfRequiredFieldsModels = setupModelsFixture(
		"computation-validation.required",
		"markingOfRequiredFields"
	);

	describe("given a overview column referencing a required field", () => {
		describe("and it being readonly", () => {
			describeTestForLabelWithNoAsterisk(ReadonlyIds.IR_STRING_READONLY);
		});

		describe("and it being a computed field", () => {
			describeTestForLabelWithNoAsterisk(ReadonlyIds.IR_STRING_COMPUTED);
		});

		describe("and the form being disabled", () => {
			describeTestForLabelWithNoAsterisk(ReadonlyIds.IR_STRING_READONLY, true);
		});
	});

	describe("markingOfRequiredFieldsOnColumn", () => {
		describe("column referencing optional field", () => {
			executeTest(MarkingIds.IR_OPTIONAL_UNSET, "OptionalString", false, undefined);
			executeTest(MarkingIds.IR_OPTIONAL_NONE, "OptionalString", false, "NONE");
			executeTest(MarkingIds.IR_OPTIONAL_ALWAYS, "OptionalString", true, "ALWAYS");
		});
		describe("column referencing required field", () => {
			executeTest(MarkingIds.IR_REQUIRED_UNSET, "RequiredString", true, undefined);
			executeTest(MarkingIds.IR_REQUIRED_NONE, "RequiredString", false, "NONE");
			executeTest(MarkingIds.IR_REQUIRED_ALWAYS, "RequiredString", true, "ALWAYS");
		});
	});

	function describeTestForLabelWithNoAsterisk(columnId: string, disabled?: boolean): void {
		it("renders no asterisk next to the label", async () => {
			const { tableMap } = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
				models: inlineModels,
				ui: {
					disabled
				}
			});
			const cell = query(tableMap.headCellRenderer)
				.withPropMatching("column", ModelElementIdEquals(columnId))
				.props();
			const label = typeof cell.column.label === "string" ? cell.column.label : "*expected_string*";
			doesNotMatch(label, /\*$/, "expected no * at end of label");
		});
	}

	function executeTest(
		columnId: string,
		label: string,
		asteriskExpected: boolean,
		marking?: FormModel.MarkingOfRequiredFields
	) {
		describe(`and 'markingOfRequiredFields' is set to ${marking}`, () => {
			it(`renders a component with prop 'label' set to the given label with${
				asteriskExpected ? "" : " no"
			} asterisk`, async () => {
				const { tableMap } = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
					models: markingOfRequiredFieldsModels
				});
				const cell = query(tableMap.headCellRenderer)
					.withPropMatching("column", ModelElementIdEquals(columnId))
					.props();
				const actual =
					typeof cell.column.label === "string" ? cell.column.label : "*expected_string*";
				const expected = `${label}${asteriskExpected ? "*" : ""}`;

				equal(actual, expected);
			});
		});
	}
}
