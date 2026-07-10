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

import { ok, strictEqual } from "node:assert/strict";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import { within } from "@com.mgmtp.a12.devtools/react";

import type { EngineStore, Models } from "../../../../../back-end/store/index.js";
import type { ReadonlyObjectMap } from "../../../../../models/index.js";
import { MESSAGE, TABLE_BODY } from "../../../../rtl-utils/data-roles.js";
import type { RtlRenderWrapper } from "../../../../rtl-utils/render-wrapper.js";
import { createDocumentPath } from "../../../../utils/createDocumentPath.js";
import { createModelPath } from "../../../../utils/createModelPath.js";
import {
	createRepeatInstanceStateEntry,
	createRepeatStaticStateEntry,
	setupFormEngineRendererWithRtlAsync
} from "../../../../utils/setup.js";
import {
	createDocumentForDetachedRepeat,
	DR
} from "../../../../utils/test-model-helpers/detached.repeat.js";
import { IR } from "../../../../utils/test-model-helpers/inline.repeat.js";
import { REPEAT } from "../../../../utils/test-model-helpers/repeat.js";

export function describeTestsForNewRowState(detachedModels: Models, models: Models) {
	const doc = createDocumentForDetachedRepeat([
		{ L1_Number: 200 },
		{ L1_Number: 100 } // new row
	]);

	type Getter<Result> = (wrapper: RtlRenderWrapper) => Result;

	const repeat: Getter<HTMLElement> = wrapper => {
		return within(wrapper.baseElement).getById(DR.SortingAndFiltering.ID_REPEAT);
	};

	const rowCount: Getter<number | undefined> = wrapper => {
		const tbody = within(repeat(wrapper)).getByDataRole(TABLE_BODY);
		const bodyRows = tbody ? within(tbody).queryAllByRole("row") : undefined;
		return bodyRows?.length;
	};

	const messageTexts: Getter<(string | null)[]> = wrapper => {
		const messages = within(repeat(wrapper)).queryAllByDataRole(MESSAGE);
		return messages.map(m => m.textContent);
	};

	const assertHiddenNewRowMessagePresent = (wrapper: RtlRenderWrapper) => {
		const texts = messageTexts(wrapper);
		ok(texts.some(t => t === "New entry doesn't match with filter options."));
	};

	it("shows the row if the filter matches", async () => {
		const wrapper = await setupFormEngineRendererWithRtlAsync({
			models: detachedModels,
			data: { document: doc },
			ui: {
				screenLocation: [
					createRootScreenState({
						newRow: {
							rowPath: createDocumentPath([REPEAT.rootGroup], [REPEAT.nestedL1, 4]),
							rowState: "recentlyAdded"
						}
					})
				],
				repeatStaticState: createStaticRepeatState({
					filters: {
						[IR.SortingAndFiltering.ID_L1_NUMBER_COLUMN]: {
							columnPath: [
								...DR.SortingAndFiltering.repeatFormModelPath,
								{ elementName: IR.SortingAndFiltering.ID_L1_NUMBER_COLUMN }
							],
							filter: { from: { data: 50 }, to: { data: 200 } }
						}
					}
				})
			}
		});
		strictEqual(rowCount(wrapper), 2, "Expected to find 2 rows");
	});

	describe("and the filter does not match the new row", () => {
		it("does not show the row and shows a hint", async () => {
			const wrapper = await setupFormEngineRendererWithRtlAsync({
				models: detachedModels,
				data: { document: doc },
				ui: {
					screenLocation: [
						createRootScreenState({
							newRow: {
								rowPath: createDocumentPath([REPEAT.rootGroup], [REPEAT.nestedL1, 4]),
								rowState: "recentlyAdded"
							}
						})
					],
					repeatStaticState: createStaticRepeatState({
						filters: {
							[IR.SortingAndFiltering.ID_L1_NUMBER_COLUMN]: {
								columnPath: [
									...DR.SortingAndFiltering.repeatFormModelPath,
									{ elementName: IR.SortingAndFiltering.ID_L1_NUMBER_COLUMN }
								],
								filter: { from: { data: 200 }, to: { data: 500 } }
							}
						}
					})
				}
			});

			strictEqual(rowCount(wrapper), 1, "Expected to find 1 row");

			assertHiddenNewRowMessagePresent(wrapper);
		});

		describe("and the filter does not match any other row", () => {
			it("does not show the row and shows a hint", async () => {
				const docAllRowsNotMatchingTheFilter = createDocumentForDetachedRepeat([
					{ L1_Number: 600 },
					{ L1_Number: 100 } // new row
				]);

				const wrapper = await setupFormEngineRendererWithRtlAsync({
					models,
					data: { document: docAllRowsNotMatchingTheFilter },
					ui: {
						screenLocation: [
							createRootScreenState({
								newRow: {
									rowPath: createDocumentPath([REPEAT.rootGroup], [REPEAT.nestedL1, 4]),
									rowState: "recentlyAdded"
								}
							})
						],
						repeatStaticState: createStaticRepeatState({
							filters: {
								[IR.SortingAndFiltering.ID_L1_NUMBER_COLUMN]: {
									columnPath: [
										...DR.SortingAndFiltering.repeatFormModelPath,
										{ elementName: IR.SortingAndFiltering.ID_L1_NUMBER_COLUMN }
									],
									filter: { from: { data: 200 }, to: { data: 500 } }
								}
							}
						})
					}
				});

				strictEqual(rowCount(wrapper), 0, "Expected to find 0 row");

				assertHiddenNewRowMessagePresent(wrapper);
			});
		});
	});
}

function createRootScreenState(
	o?: Partial<EngineStore.Repeat.InstanceState>
): EngineStore.ScreenState {
	return {
		path: [],
		locationPath: createModelPath("SortingAndFiltering"),
		repeatInstanceState: {
			[ModelPath.toString(DR.SortingAndFiltering.repeatFormModelPath)]: createRepeatEntry(o)
		}
	};
}

function createStaticRepeatState(
	o?: Partial<EngineStore.Repeat.StaticState>
): ReadonlyObjectMap<EngineStore.Repeat.StaticState> | undefined {
	return o
		? {
				[ModelPath.toString(DR.SortingAndFiltering.repeatFormModelPath)]:
					createRepeatStaticStateEntry(o)
			}
		: undefined;
}

function createRepeatEntry(
	o?: Partial<EngineStore.Repeat.InstanceState>
): EngineStore.Repeat.InstanceState {
	return createRepeatInstanceStateEntry({
		...o,
		newRow: o?.newRow?.rowPath
			? {
					rowPath: o.newRow.rowPath,
					rowState: o.newRow.rowState || "workingOn"
				}
			: undefined
	});
}
