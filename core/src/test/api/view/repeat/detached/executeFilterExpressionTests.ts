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

import { equal, ok, strictEqual } from "node:assert/strict";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import { within } from "@com.mgmtp.a12.devtools/react";

import type { EngineStore } from "../../../../../back-end/store/internal/store.js";
import type { ReadonlyObjectMap } from "../../../../../models/internal/utils/json.js";
import { BODY_CELL, BODY_ROW, MESSAGE, TABLE_BODY } from "../../../../rtl-utils/data-roles.js";
import { createDocumentPath } from "../../../../utils/createDocumentPath.js";
import { createModelPath } from "../../../../utils/createModelPath.js";
import { loadData, setupFormEngineRendererWithRtlAsync } from "../../../../utils/setup.js";
import { setupFixture, setupModelsFixture } from "../../../../utils/setupFixture.js";
import { FORM_MODEL } from "../../../../utils/test-model-helpers/filter-expressions.js";

export function executeFilterExpressionTests(): void {
	const models = setupModelsFixture("repeat.filterexpressions");

	const fixture = setupFixture(() => ({
		document: loadData("repeat.filterexpressions", "data", models.documentModel)
	}));

	describe("Repeat with no filter expression", () => {
		it("shows all rows in the overview table", async () => {
			const wrapper = await setupFormEngineRendererWithRtlAsync({
				models,
				data: { document: fixture.document },
				ui: getUiState()
			});
			const detachedRepeatWithAllRows = within(wrapper.baseElement).getById(
				FORM_MODEL.DR.idOfRepeatNoFilterExpression
			);

			assertExpectedRowState(
				detachedRepeatWithAllRows,
				["Albert Alfons", "Barbie Bilbo", "Ceasar Cheesecake", "David Dudel"],
				"All contacts"
			);
		});
	});

	describe("Repeat with a filter expression", () => {
		it("should only show rows in the overview table which fit the filter expression", async () => {
			const wrapper = await setupFormEngineRendererWithRtlAsync({
				models,
				data: { document: fixture.document },
				ui: getUiState()
			});

			/**
			 * Field is nested in a repeatable sub-group
			 */
			const detachedRepeatWithNonPrivateNumbers = within(wrapper.baseElement).getById(
				FORM_MODEL.DR.idOfRepeatWithFilterExpressionNoPrivate
			);
			assertExpectedRowState(
				detachedRepeatWithNonPrivateNumbers,
				["Albert Alfons", "Barbie Bilbo", "David Dudel"],
				"Non-private numbers"
			);

			const detachedRepeatWithOnlyPrivateNumbers = within(wrapper.baseElement).getById(
				FORM_MODEL.DR.idOfRepeatWithFilterExpressionPrivate
			);
			assertExpectedRowState(
				detachedRepeatWithOnlyPrivateNumbers,
				["Albert Alfons", "Ceasar Cheesecake"],
				"Non-private numbers"
			);

			const detachedRepeatWithEmptyNumbers = within(wrapper.baseElement).getById(
				FORM_MODEL.DR.idOfRepeatWithFilterExpressionEmptyNumber
			);
			assertExpectedRowState(detachedRepeatWithEmptyNumbers, ["David Dudel"], "Empty number");

			/**
			 * Field is nested in a non-repeatable sub-group
			 */
			const repeatAdvertisementAllowed = within(wrapper.baseElement).getById(
				FORM_MODEL.DR.idOfRepeatWithFilterExpressionAdvertisementAllowed
			);
			assertExpectedRowState(
				repeatAdvertisementAllowed,
				["Albert Alfons", "Barbie Bilbo"],
				"Contacts Advertisement allowed"
			);

			const repeatAdvertisementNotAllowed = within(wrapper.baseElement).getById(
				FORM_MODEL.DR.idOfRepeatWithFilterExpressionAdvertisementnotAllowed
			);
			assertExpectedRowState(
				repeatAdvertisementNotAllowed,
				["David Dudel"],
				"Contacts Advertisement not allowed"
			);

			/**
			 * Field is not further nested
			 */
			const repeatMale = within(wrapper.baseElement).getById(
				FORM_MODEL.DR.idOfRepeatWithFilterExpressionMale
			);
			assertExpectedRowState(
				repeatMale,
				["Albert Alfons", "Ceasar Cheesecake", "David Dudel"],
				"Male contacts"
			);

			const repeatFemale = within(wrapper.baseElement).getById(
				FORM_MODEL.DR.idOfRepeatWithFilterExpressionFemale
			);
			assertExpectedRowState(repeatFemale, ["Barbie Bilbo"], "Female contacts");
		});

		it("should show no entry placeholder, when no rows are added", async () => {
			const repeatPath = createModelPath("DetachedRepeat", "sec1", "Private Contacts");
			const repeatInstanceState: ReadonlyObjectMap<EngineStore.Repeat.InstanceState> = {
				[ModelPath.toString(repeatPath)]: {}
			};

			const doc = {
				RootGroup: {
					Contacts: []
				}
			};

			const wrapper = await setupFormEngineRendererWithRtlAsync({
				models,
				data: { document: doc },
				ui: getUiState(repeatInstanceState)
			});

			const detachedRepeatWithOnlyPrivateNumbers = within(wrapper.baseElement).getById(
				FORM_MODEL.DR.idOfRepeatWithFilterExpressionPrivate
			);
			const body = within(detachedRepeatWithOnlyPrivateNumbers).getByDataRole(TABLE_BODY);
			const noResultsFoundMessage = within(body).queryByDataRole(MESSAGE);
			strictEqual(noResultsFoundMessage?.textContent, "There are no entries yet.");
		});

		describe("Row with row state 'recentlyAdded'", () => {
			const repeatPath = createModelPath("DetachedRepeat", "sec1", "Private Contacts");
			const repeatInstanceState: ReadonlyObjectMap<EngineStore.Repeat.InstanceState> = {
				[ModelPath.toString(repeatPath)]: {
					page: 1,
					newRow: {
						rowPath: createDocumentPath(["RootGroup"], ["Contacts"]),
						rowState: "recentlyAdded"
					}
				}
			};

			it("shows a message, when all rows are filtered by the expression", async () => {
				const doc = {
					RootGroup: {
						Contacts: [
							{
								Name: "NewPerson",
								Telephone: [{ Private: false, Number: 123 }]
							}
						]
					}
				};

				const wrapper = await setupFormEngineRendererWithRtlAsync({
					models,
					data: { document: doc },
					ui: getUiState(repeatInstanceState)
				});
				const detachedRepeatWithOnlyPrivateNumbers = within(wrapper.baseElement).getById(
					FORM_MODEL.DR.idOfRepeatWithFilterExpressionPrivate
				);

				const newEntryMessage = within(detachedRepeatWithOnlyPrivateNumbers).getById(
					`${FORM_MODEL.DR.idOfRepeatWithFilterExpressionPrivate}-emptyplaceholder_2`
				);
				strictEqual(newEntryMessage.textContent, "New entry doesn't match with filter options.");

				const body = within(detachedRepeatWithOnlyPrivateNumbers).getByDataRole(TABLE_BODY);
				const noResultsFoundMessage = within(body).queryByDataRole(MESSAGE);
				strictEqual(noResultsFoundMessage?.textContent, "No results found");
			});

			it("shows a message, when only the new row is filtered by the expression", async () => {
				const doc = {
					RootGroup: {
						Contacts: [
							{
								Name: "NewPerson",
								Telephon: [{ Private: false, Number: 123 }]
							},
							{
								Name: "Person2",
								Telephon: [{ Private: true, Number: 123 }]
							}
						]
					}
				};

				const wrapper = await setupFormEngineRendererWithRtlAsync({
					models,
					data: { document: doc },
					ui: getUiState(repeatInstanceState)
				});
				const detachedRepeatWithOnlyPrivateNumbers = within(wrapper.baseElement).getById(
					FORM_MODEL.DR.idOfRepeatWithFilterExpressionPrivate
				);
				const message = within(detachedRepeatWithOnlyPrivateNumbers).getById(
					`${FORM_MODEL.DR.idOfRepeatWithFilterExpressionPrivate}-emptyplaceholder_2`
				);

				strictEqual(message.textContent, "New entry doesn't match with filter options.");
			});

			it("shows no message, when new row is not filtered by the expression", async () => {
				const doc = {
					RootGroup: {
						Contacts: [
							{
								Name: "NewPerson",
								Telephone: [{ Private: true, Number: 123 }]
							},
							{
								Name: "Person2",
								Telephone: [{ Private: true, Number: 123 }]
							}
						]
					}
				};
				const wrapper = await setupFormEngineRendererWithRtlAsync({
					models,
					data: { document: doc },
					ui: getUiState(repeatInstanceState)
				});
				const detachedRepeatWithOnlyPrivateNumbers = within(wrapper.baseElement).getById(
					FORM_MODEL.DR.idOfRepeatWithFilterExpressionPrivate
				);
				const message = within(detachedRepeatWithOnlyPrivateNumbers).queryAllByDataRole("message");
				strictEqual(message.length, 0);
			});
		});

		describe("Row with row state 'workingOn'", () => {
			const repeatPath = createModelPath("DetachedRepeat", "sec1", "Private Contacts");
			const repeatInstanceState: ReadonlyObjectMap<EngineStore.Repeat.InstanceState> = {
				[ModelPath.toString(repeatPath)]: {
					page: 1,
					newRow: {
						rowPath: createDocumentPath(["RootGroup"], ["Contacts"]),
						rowState: "workingOn"
					}
				}
			};

			it("should not show a message, when all rows are filtered by the expression", async () => {
				const doc = {
					RootGroup: {
						Contacts: [
							{
								Name: "NewPerson",
								Telephone: [{ Private: false, Number: 123 }]
							}
						]
					}
				};

				const wrapper = await setupFormEngineRendererWithRtlAsync({
					models,
					data: { document: doc },
					ui: getUiState(repeatInstanceState)
				});

				const detachedRepeatWithOnlyPrivateNumbers = within(wrapper.baseElement).getById(
					FORM_MODEL.DR.idOfRepeatWithFilterExpressionPrivate
				);
				const message = within(detachedRepeatWithOnlyPrivateNumbers).queryAllByDataRole("message");
				strictEqual(message.length, 0);
			});

			it("should not show a message, when only the new row is filtered by the expression", async () => {
				const doc = {
					RootGroup: {
						Contacts: [
							{
								Name: "NewPerson",
								Telephon: [{ Private: false, Number: 123 }]
							},
							{
								Name: "Person2",
								Telephon: [{ Private: true, Number: 123 }]
							}
						]
					}
				};

				const wrapper = await setupFormEngineRendererWithRtlAsync({
					models,
					data: { document: doc },
					ui: getUiState(repeatInstanceState)
				});

				const detachedRepeatWithOnlyPrivateNumbers = within(wrapper.baseElement).getById(
					FORM_MODEL.DR.idOfRepeatWithFilterExpressionPrivate
				);
				const message = within(detachedRepeatWithOnlyPrivateNumbers).queryAllByDataRole("message");
				strictEqual(message.length, 0);
			});
		});
	});
}

function getUiState(repeatInstanceState?: ReadonlyObjectMap<EngineStore.Repeat.InstanceState>) {
	return {
		screenLocation: [
			{
				locationPath: createModelPath(FORM_MODEL.detachedRepeatScreen),
				path: [],
				repeatInstanceState
			}
		]
	};
}

function assertExpectedRowState(
	element: HTMLElement,
	cellValues: string[],
	repeatName: string
): void {
	const rows = within(element).getAllByDataRole(BODY_ROW);

	equal(rows.length, cellValues.length, `Wrong length of row in repeat ${repeatName}`);

	for (let i = 0; i < cellValues.length; i++) {
		const value = cellValues[i];
		const bodyCells = rows.at(i)?.querySelector(`[data-role="${BODY_CELL}"]`);
		ok(bodyCells);
		const textContent = bodyCells.firstElementChild?.innerHTML;
		equal(textContent, `<p>${value}</p>\n`);
	}
}
