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

import { equal } from "node:assert/strict";

import { within } from "@com.mgmtp.a12.devtools/react";

import { CSS_ELLIPSIS } from "../../../../rtl-utils/data-roles.js";
import { setupFixture, setupModelsFixture } from "../../../../utils/setupFixture.js";
import { DR } from "../../../../utils/test-model-helpers/detached.repeat.js";
import { ER } from "../../../../utils/test-model-helpers/embedded.repeat.js";
import { createDocumentForRepeat } from "../../../../utils/test-model-helpers/repeat.js";

import { renderEllipsisTest } from "../renderEllipsisTest.js";

describe("api.view.repeat", () => {
	describe("Overview Body Content Cell", () => {
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

		describe("Given a detached repeat", () => {
			const detachedRepeatModels = setupModelsFixture("repeat", "detached");
			describe("and no row height given", () => {
				it("does not wrap the content in a 'CssEllipsis' widget", async () => {
					const cell = await renderEllipsisTest({
						models: detachedRepeatModels,
						document: fixture.data.repeat,
						id: DR.SortingAndFiltering.ID_COLUMN_L1_STRING
					});
					const cssEllipsis = within(cell).queryByDataRole(CSS_ELLIPSIS);
					equal(cssEllipsis, null);
				});
			});

			describe("and given a rowHeight", () => {
				it("wraps the content in a 'CssEllipsis' widget", async () => {
					const cell = await renderEllipsisTest({
						models: detachedRepeatModels,
						document: fixture.data.repeat,
						screenName: "TableStyle",
						id: DR.TableStyle.ID_COLUMN_L1_STRING
					});
					within(cell).getByDataRole(CSS_ELLIPSIS);
				});

				it("renders a multi-select as a comma separated list and wraps the output in a 'CssEllipsis' widget", async () => {
					const cell = await renderEllipsisTest({
						models: detachedRepeatModels,
						document: fixture.data.repeat,
						screenName: "TableStyle",
						id: DR.TableStyle.ID_COLUMN_L1_MULTI_SELECT
					});
					const cssEllipsis = within(cell).queryByDataRole(CSS_ELLIPSIS);
					const content = cssEllipsis?.textContent;
					equal(content, "Value 1, Value 2, Value 3");
				});
			});
		});

		describe("Given an embedded repeat", () => {
			const embeddedRepeatModels = setupModelsFixture("repeat", "embedded");
			describe("and no row height given", () => {
				it("does not wrap text content in a 'CssEllipsis' widget", async () => {
					const cell = await renderEllipsisTest({
						models: embeddedRepeatModels,
						document: fixture.data.repeat,
						id: ER.SortingAndFiltering.ID_COLUMN_L1_STRING
					});
					const cssEllipsis = within(cell).queryByDataRole(CSS_ELLIPSIS);
					equal(cssEllipsis, null);
				});

				it("does not wrap multi-select output in a 'CssEllipsis' widget", async () => {
					const cell = await renderEllipsisTest({
						models: embeddedRepeatModels,
						document: fixture.data.repeat,
						id: ER.SortingAndFiltering.ID_COLUMN_L1_MULTI_SELECT
					});
					const cssEllipsis = within(cell).queryByDataRole(CSS_ELLIPSIS);
					equal(cssEllipsis, null);
				});
			});

			describe("and given a rowHeight", () => {
				it("wraps the content in a 'CssEllipsis' widget", async () => {
					const cell = await renderEllipsisTest({
						models: embeddedRepeatModels,
						document: fixture.data.repeat,
						screenName: "TableStyle",
						id: ER.TableStyle.ID_COLUMN_L1_STRING
					});
					within(cell).getByDataRole(CSS_ELLIPSIS);
				});

				it("renders a multi-select as a comma separated list and wraps the output in a 'CssEllipsis' widget", async () => {
					const cell = await renderEllipsisTest({
						models: embeddedRepeatModels,
						document: fixture.data.repeat,
						screenName: "TableStyle",
						id: ER.TableStyle.ID_COLUMN_L1_MULTI_SELECT
					});
					const cssEllipsis = within(cell).queryByDataRole(CSS_ELLIPSIS);
					const content = cssEllipsis?.textContent;
					equal(content, "Value 1, Value 2, Value 3");
				});
			});
		});
	});
});
