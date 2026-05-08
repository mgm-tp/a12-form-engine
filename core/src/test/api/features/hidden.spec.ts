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

import { ok, strictEqual } from "node:assert/strict";

import { within } from "@com.mgmtp.a12.devtools/react";
import type { GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { EngineStore } from "../../../back-end/store/internal/store.js";
import type { RtlRenderWrapper } from "../../rtl-utils/render-wrapper.js";
import { SetupHelpers } from "../../utils/setup.js";
import { setupModelsFixture } from "../../utils/setupFixture.js";
import {
	createDocumentThatHidesEverything,
	createDocumentThatShowsEverything,
	createDocumentWithAllValuesFilled,
	createDocumentWithSomeFieldsHidden,
	createNestedDrUiState,
	HIDDEN
} from "../../utils/test-model-helpers/hidden.js";

describe("api.features", () => {
	describe("hidden", () => {
		const models = setupModelsFixture("enablement.hidden");

		function setupWrapper(
			dataCreator: () => GroupInstance,
			uiStateCreator: () => Partial<EngineStore.UIState> = () => ({})
		): Promise<RtlRenderWrapper> {
			const data = dataCreator();
			return SetupHelpers.setupFormEngineRendererWithRtlAsync({
				models,
				data: { document: data },
				ui: uiStateCreator()
			});
		}

		// works for field overview and expression columns
		function cellOutput(wrapper: RtlRenderWrapper, repeatId: string, cellId: string): string {
			const repeat = within(wrapper.baseElement).getById(repeatId);
			const tableCell = within(repeat).getById(cellId);
			return tableCell.textContent ?? "";
		}

		describe("A repeat", () => {
			it("is hidden if a dependent group specification using 'hidden' applies", async () => {
				const wrapper = await setupWrapper(createDocumentThatHidesEverything);

				const inlineRepeat = within(wrapper.baseElement).queryById(HIDDEN.IR_ID);
				ok(inlineRepeat === null, "the repeat should not be visible");
			});

			it("is not hidden if no dependent group specification using 'hidden' applies", async () => {
				const wrapper = await setupWrapper(createDocumentThatShowsEverything);

				const inlineRepeat = within(wrapper.baseElement).queryById(HIDDEN.IR_ID);
				ok(inlineRepeat, "the repeat should be visible");
			});
		});

		describe("A control", () => {
			it("is hidden if a dependent field specification using 'hidden' applies", async () => {
				const wrapper = await setupWrapper(createDocumentThatHidesEverything);

				const inputControl = within(wrapper.baseElement).queryById(HIDDEN.STRINGFIELD2_ID);
				ok(inputControl === null, "the control should not be visible");
			});

			it("is not hidden if no dependent field specification using 'hidden' applies", async () => {
				const wrapper = await setupWrapper(createDocumentThatShowsEverything);

				const inputControl = within(wrapper.baseElement).queryById(HIDDEN.STRINGFIELD2_ID);
				ok(inputControl, "the control should be visible");
			});
		});

		describe("An embedded repeat overview table cell", () => {
			it("is hidden if a dependent field specification using 'hidden' applies", async () => {
				const wrapper = await setupWrapper(createDocumentWithSomeFieldsHidden);
				strictEqual(
					cellOutput(wrapper, HIDDEN.ER_ID, HIDDEN.ER_DATEFIELD_ID),
					"",
					"the table cell should be empty"
				);
			});

			it("is not hidden if no dependent field specification using 'hidden' applies", async () => {
				const wrapper = await setupWrapper(createDocumentWithAllValuesFilled);
				strictEqual(
					cellOutput(wrapper, HIDDEN.ER_ID, HIDDEN.ER_DATEFIELD_ID),
					HIDDEN.DATEFIELD_DEFAULT_VALUE,
					`the table cell should contain the ${HIDDEN.DATEFIELD_DEFAULT_VALUE}`
				);
			});
		});

		describe("A detached repeat overview table cell", () => {
			it("is hidden if a dependent field specification using 'hidden' applies", async () => {
				const wrapper = await setupWrapper(createDocumentWithSomeFieldsHidden);
				strictEqual(
					cellOutput(wrapper, HIDDEN.DR_ID, HIDDEN.DR_DATEFIELD_ID),
					"",
					"the table cell should be empty"
				);
			});

			it("is not hidden if no dependent field specification using 'hidden' applies", async () => {
				const wrapper = await setupWrapper(createDocumentWithAllValuesFilled);
				strictEqual(
					cellOutput(wrapper, HIDDEN.DR_ID, HIDDEN.DR_DATEFIELD_ID),
					HIDDEN.DATEFIELD_DEFAULT_VALUE,
					`the table cell should contain the ${HIDDEN.DATEFIELD_DEFAULT_VALUE}`
				);
			});
		});

		describe("An expression column cell", () => {
			it("does not contain a field value if a dependent field specification using 'hidden' applies", async () => {
				const wrapper = await setupWrapper(createDocumentWithSomeFieldsHidden);
				ok(
					cellOutput(wrapper, HIDDEN.ER_ID, HIDDEN.ER_EXPRESSION_CELL_ID).indexOf(
						HIDDEN.DATEFIELD_DEFAULT_VALUE
					) < 0,
					"The expression should not contain the field value"
				);
			});

			it("contains a field value if no dependent field specification using 'hidden' applies", async () => {
				const wrapper = await setupWrapper(createDocumentWithAllValuesFilled);
				ok(
					cellOutput(wrapper, HIDDEN.ER_ID, HIDDEN.ER_EXPRESSION_CELL_ID).indexOf(
						HIDDEN.DATEFIELD_DEFAULT_VALUE
					) >= 0,
					"The expression should contain the field value"
				);
			});

			describe("in a nested repeat", () => {
				it("does not contain a field value if a dependent field specification using 'hidden' applies", async () => {
					const wrapper = await setupWrapper(
						createDocumentWithSomeFieldsHidden,
						createNestedDrUiState
					);
					ok(
						cellOutput(wrapper, HIDDEN.NESTED_ER_ID, HIDDEN.NESTED_ER_EXPRESSION_CELL_ID).indexOf(
							HIDDEN.STRINGFIELD3_DEFAULT_VALUE
						) < 0,
						"The expression should not contain the field value"
					);
				});

				it("contains a field value if no dependent field specification using 'hidden' applies", async () => {
					const wrapper = await setupWrapper(
						createDocumentWithAllValuesFilled,
						createNestedDrUiState
					);
					ok(
						cellOutput(wrapper, HIDDEN.NESTED_ER_ID, HIDDEN.NESTED_ER_EXPRESSION_CELL_ID).indexOf(
							HIDDEN.STRINGFIELD3_DEFAULT_VALUE
						) >= 0,
						"The expression should contain the field value"
					);
				});
			});
		});
	});
});
