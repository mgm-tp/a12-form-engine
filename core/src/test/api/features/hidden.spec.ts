// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
