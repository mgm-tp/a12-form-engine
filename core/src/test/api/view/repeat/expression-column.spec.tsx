// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { equal } from "node:assert/strict";

import { within } from "@com.mgmtp.a12.devtools/react";

import { CSS_ELLIPSIS } from "../../../rtl-utils/data-roles.js";
import { setupFixture, setupModelsFixture } from "../../../utils/setupFixture.js";
import { DR } from "../../../utils/test-model-helpers/detached.repeat.js";
import { ER } from "../../../utils/test-model-helpers/embedded.repeat.js";
import { createDocumentForRepeat } from "../../../utils/test-model-helpers/repeat.js";

import { renderEllipsisTest } from "./renderEllipsisTest.js";

describe("api.view.repeat", () => {
	describe("Expression Column", () => {
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
			describe("and no rowHeight given", () => {
				it("does not wrap the content in a 'CssEllipsis' widget", async () => {
					const cell = await renderEllipsisTest({
						models: detachedRepeatModels,
						document: fixture.data.repeat,
						id: DR.SortingAndFiltering.ID_COLUMN_L1_EXPRESSION
					});
					const cssEllipsis = within(cell).queryByDataRole(CSS_ELLIPSIS);
					equal(cssEllipsis, null);
				});
			});

			describe("and given a rowHeight", () => {
				it("wraps the expression content in a 'CssEllipsis' widget", async () => {
					const cell = await renderEllipsisTest({
						models: detachedRepeatModels,
						document: fixture.data.repeat,
						screenName: "TableStyle",
						id: DR.TableStyle.ID_COLUMN_L1_EXPRESSION
					});
					within(cell).getByDataRole(CSS_ELLIPSIS);
				});
			});
		});

		describe("Given an embedded repeat", () => {
			const embeddedRepeatModels = setupModelsFixture("repeat", "embedded");
			describe("and no rowHeight given", () => {
				it("does not wrap the content in a 'CssEllipsis' widget", async () => {
					const cell = await renderEllipsisTest({
						models: embeddedRepeatModels,
						document: fixture.data.repeat,
						id: ER.SortingAndFiltering.ID_COLUMN_L1_EXPRESSION
					});
					const cssEllipsis = within(cell).queryByDataRole(CSS_ELLIPSIS);
					equal(cssEllipsis, null);
				});
			});

			describe("and given a rowHeight", () => {
				it("wraps the expression content in a 'CssEllipsis' widget", async () => {
					const cell = await renderEllipsisTest({
						models: embeddedRepeatModels,
						document: fixture.data.repeat,
						screenName: "TableStyle",
						id: ER.TableStyle.ID_COLUMN_L1_EXPRESSION
					});
					within(cell).getByDataRole(CSS_ELLIPSIS);
				});
			});
		});
	});
});
