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

import { act } from "react";

import { within } from "@com.mgmtp.a12.devtools/react";

import { DefaultWidgetMap } from "../../../../view/index.js";
import { DefaultTableWidgetMap } from "../../../../view/internal/components/form-engine/repeat/table-widget-map.js";
import { BODY_CELL, BUTTON, HEAD_CELL } from "../../../rtl-utils/data-roles.js";
import { US_LOCALE } from "../../../utils/localization.js";
import { SetupHelpers } from "../../../utils/setup.js";
import { setupModelsFixture } from "../../../utils/setupFixture.js";

const { setupFormEngineRendererWithRtl } = SetupHelpers;

describe("api.view.Styles", () => {
	const models = setupModelsFixture("styles");

	it("Custom styles", async () => {
		const { container } = await act(() =>
			setupFormEngineRendererWithRtl({
				withWidgets: true,
				models,
				data: {
					document: {
						Root: {
							NonRepeatableDummy: null,
							Repeat: [{ RepeatableDummy: "test1" }]
						}
					}
				},
				config: {
					widgetMap: DefaultWidgetMap
				}
			})
		);

		const { getById } = within(container);

		// total number of styles s1..s<n>
		const STYLE_COUNT = 16;

		/**
		 * Assert that the given element has exactly set the given style (and no
		 * other).
		 */
		function assertStyle(element: HTMLElement, expectedStyle: number, message: string): void {
			ok(expectedStyle <= STYLE_COUNT);
			for (let i = 1; i <= STYLE_COUNT; i++) {
				const hasClass = element.classList.contains(`s${i}`);
				const expected = expectedStyle === i;
				strictEqual(hasClass, expected, message);
			}
		}

		assertStyle(getById("a12-section-baff6"), 1, "Section");

		assertStyle(getById("a12-section-dfa97"), 1, "Collapsible Section");

		assertStyle(getById("a12-multicolumnsection-11944"), 2, "MultiColumnSection");

		assertStyle(getById("a12-controlgrid-235dc"), 2, "ControlGrid");

		assertStyle(getById("a12-row-aa2db"), 3, "ControlGrid-Row");

		assertStyle(getById("a12-detachedrepeat-e2913"), 4, "DetachedRepeat");

		assertStyle(getById("a12-inlinerepeat-19c7c"), 5, "InlineRepeat");

		assertStyle(getById("a12-buttonpanel-d8bee"), 6, "ButtonPanel");

		assertStyle(getById("a12-button-d29fb"), 7, "Button");

		assertStyle(getById("a12-NonRepeatableDummy-F3-group"), 8, "Control");

		assertStyle(getById("a12-button-c258f"), 9, "SubHeaderBox-Button1");

		assertStyle(getById("a12-button-24e80"), 10, "SubHeaderBox-Button2");

		assertStyle(getById("a12-button-11c41"), 11, "FooterBox-Button3");

		assertStyle(getById("a12-button-b4ab1"), 12, "FooterBox-Button4");

		const detachedRepeat = getById("a12-detachedrepeat-e2913");
		assertStyle(within(detachedRepeat).getAllByDataRole(BUTTON)[0], 13, "DetachedRepeat-RowAction");

		assertStyle(
			within(detachedRepeat).getAllByDataRole(BUTTON)[1],
			14,
			"DetachedRepeat-RowAction-Confirmation"
		);

		assertStyle(
			within(getById("a12-inlinerepeat-19c7c")).getAllByDataRole(BUTTON)[0],
			15,
			"InlineRepeat-RowAction"
		);

		assertStyle(
			within(getById("a12-inlinerepeat-19c7c")).getAllByDataRole(BUTTON)[1],
			16,
			"InlineRepeat-RowAction-Confirmation"
		);

		assertStyle(
			within(detachedRepeat).getAllByDataRole(HEAD_CELL)[0],
			8,
			"DetachedRepeat-FieldBasedRepeatOverviewColumn-Header"
		);

		assertStyle(
			within(detachedRepeat).getAllByDataRole(HEAD_CELL)[1],
			9,
			"DetachedRepeat-ExpressionRepeatOverviewColumn-Header"
		);

		assertStyle(
			within(detachedRepeat).getAllByDataRole(BODY_CELL)[0],
			7,
			"DetachedRepeat-FieldBasedRepeatOverviewColumn-Content"
		);

		assertStyle(
			within(detachedRepeat).getAllByDataRole(BODY_CELL)[1],
			1,
			"DetachedRepeat-ExpressionRepeatOverviewColumn-Content"
		);
	});

	describe("Helper class styles", () => {
		it("Control", async () => {
			const { container } = await act(() =>
				setupFormEngineRendererWithRtl({
					withWidgets: true,
					models,
					locale: US_LOCALE,
					data: {},
					ui: {
						screenLocation: [
							{
								locationPath: [{ elementName: "Screen2" }],
								path: []
							}
						]
					},
					config: {
						widgetMap: DefaultWidgetMap
					}
				})
			);

			const ID_NUMBER_CONTROL = "a12-numberField-field_26379";
			const numberFieldGroup = within(container).getById(`${ID_NUMBER_CONTROL}-group`);
			const numberField5Group = within(container).getById(`${ID_NUMBER_CONTROL}-5-group`);

			ok(
				numberFieldGroup.classList.contains("h_rightAlign"),
				"sets the h_rightAligned style if no style is given"
			);

			ok(
				numberField5Group.classList.contains("h_boldFontWeight"),
				"Expected that `h_boldFontWeight` is set as class"
			);

			ok(
				numberField5Group.classList.contains("h_yellowFC"),
				"Expected that `h_yellowFC` is set as class"
			);

			strictEqual(
				numberField5Group.classList.contains("h_rightAlign"),
				false,
				"Expected that `h_rightAlign` is not set as class"
			);
		});

		it("FieldBasedOverviewColumn", async () => {
			const { container } = await act(() =>
				setupFormEngineRendererWithRtl({
					withWidgets: true,
					tableMap: DefaultTableWidgetMap,
					config: { widgetMap: DefaultWidgetMap },
					models,
					locale: US_LOCALE,
					data: {
						document: { Root: { Repeat: [{}] } }
					},
					ui: {
						screenLocation: [
							{
								locationPath: [{ elementName: "Screen2" }],
								path: []
							}
						]
					}
				})
			);

			const table = within(container).getById("a12-inlinerepeat-48a71");

			const contentCells = within(table).getAllByDataRole(BODY_CELL);
			ok(
				contentCells[0].classList.contains("table__contentCell--align-right"),
				"Expected that `table__contentCell--align-right` is set as class"
			);

			ok(
				contentCells[4].classList.contains("h_boldFontWeight"),
				"Expected that `h_boldFontWeight` is set as class"
			);
			ok(
				contentCells[4].classList.contains("h_yellowFC"),
				"Expected that `h_yellowFC` is set as class"
			);

			strictEqual(
				contentCells[4].classList.contains("h_rightAlign"),
				false,
				"Expected that `h_rightAlign` is not set as class"
			);
		});
	});
});
