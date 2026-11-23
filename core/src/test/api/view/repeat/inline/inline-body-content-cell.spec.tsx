// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { equal } from "node:assert/strict";

import { within } from "@com.mgmtp.a12.devtools/react";

import { CSS_ELLIPSIS } from "../../../../rtl-utils/data-roles.js";
import { setupFixture, setupModelsFixture } from "../../../../utils/setupFixture.js";
import { IR } from "../../../../utils/test-model-helpers/inline.repeat.js";
import { createDocumentForRepeat } from "../../../../utils/test-model-helpers/repeat.js";

import { renderEllipsisTest } from "../renderEllipsisTest.js";

/**
 * Here, we only test if a CssEllipsis is wrapped around the content, depending on rowHeight.
 * Other more general rendering tests are already covered in rendering.ts and read-only.ts
 * for the FieldOverviewColumn.
 */
describe("api.view.repeat", () => {
	describe("Inline Body Content Cell", () => {
		const inlineRepeatModels = setupModelsFixture("repeat", "inline");
		const fixture = setupFixture(() => ({
			data: {
				repeat: createDocumentForRepeat({
					nestedL1: [
						{
							L1_String: "A",
							L1_Number: 44,
							L1_MultiSelect: [{ value: "V1" }, { value: "V2" }, { value: "V3" }]
						}
					]
				})
			}
		}));

		describe("Given an inline repeat", () => {
			describe("and the repeat is readonly with readonlyPresentation 'TEXT'", () => {
				describe("and no row height given", () => {
					it("does not wrap the content in a 'CssEllipsis' widget", async () => {
						const cell = await renderEllipsisTest({
							models: inlineRepeatModels,
							document: fixture.data.repeat,
							id: IR.SortingAndFiltering.ID_L1_STRING_READONLY_TEXT_OUTPUT
						});
						const cssEllipsis = within(cell).queryByDataRole(CSS_ELLIPSIS);
						equal(cssEllipsis, null);
					});
				});

				describe("and given a rowHeight", () => {
					it("wraps the content in a 'CssEllipsis' widget", async () => {
						const cell = await renderEllipsisTest({
							models: inlineRepeatModels,
							document: fixture.data.repeat,
							screenName: "TableStyle",
							id: IR.TableStyle.ID_COLUMN_L1_STRING
						});
						within(cell).getByDataRole(CSS_ELLIPSIS);
					});

					it("renders a multi-select as a comma separated list and wraps the output in a 'CssEllipsis' widget", async () => {
						const cell = await renderEllipsisTest({
							models: inlineRepeatModels,
							document: fixture.data.repeat,
							screenName: "TableStyle",
							id: IR.TableStyle.ID_COLUMN_L1_MULTI_SELECT
						});
						const cssEllipsis = within(cell).queryByDataRole(CSS_ELLIPSIS);
						const content = cssEllipsis?.textContent;
						equal(content, "Value 1, Value 2, Value 3");
					});
				});
			});
		});
	});
});
