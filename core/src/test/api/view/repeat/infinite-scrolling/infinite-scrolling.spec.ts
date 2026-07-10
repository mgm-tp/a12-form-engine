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

import { equal, notEqual } from "node:assert/strict";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import { query } from "@com.mgmtp.a12.devtools/react";
import type { GroupInstance } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import type { InfiniteScrollTableProps } from "@com.mgmtp.a12.widgets/widgets-core";

import type { EngineStore, Models } from "../../../../../back-end/store/internal/store.js";
import type { Mutable } from "../../../../../back-end/utils/internal/types.js";
import type { FormModel } from "../../../../../models/index.js";
import type { Config } from "../../../../../view/index.js";
import type { RtlRenderWrapper } from "../../../../rtl-utils/render-wrapper.js";
import { RenderGroupFixture } from "../../../../utils/rtl-render-group.js";
import {
	loadData,
	loadModels,
	setupFormEngineRendererWithRtlAsync
} from "../../../../utils/setup.js";
import { setupFixture, setupModelsFixture } from "../../../../utils/setupFixture.js";
import { FORM_MODEL } from "../../../../utils/test-model-helpers/repeat.infinite-scrolling.js";
import { createModelPath } from "../../../../utils/createModelPath.js";

import { IdEquals } from "../query-predicates.js";

function setupWithOptions(options: {
	models: Models;
	data: GroupInstance;
	screenName: string;
	repeatEntryPath?: ModelPath;
	repeatEntry?: EngineStore.Repeat.InstanceState;
	focusedComponent?: EngineStore.FocusedComponent;
	config?: Partial<Config>;
}): Promise<RtlRenderWrapper> {
	const repeatInstanceState =
		options.repeatEntryPath && options.repeatEntry
			? {
					[ModelPath.toString(options.repeatEntryPath)]: options.repeatEntry
				}
			: undefined;

	const screenLocation: EngineStore.ScreenState[] = [
		{
			locationPath: createModelPath(options.screenName),
			path: [],
			repeatInstanceState,
			focusedComponent: options.focusedComponent
		}
	];

	return setupFormEngineRendererWithRtlAsync({
		models: options.models,
		data: { document: options.data },
		ui: {
			screenLocation
		},
		config: options.config
	});
}

// There seems to be no type-safe way to use the TableProps union type from widgets
type MaybeInfiniteScrollTableProps = Omit<InfiniteScrollTableProps, "infiniteScrollOptions"> &
	Pick<Partial<InfiniteScrollTableProps>, "infiniteScrollOptions">;

function executeInfiniteScrollingTest(
	screenName: string,
	repeatFormModelPath: ModelPath,
	repeatId: string
): void {
	const tableId = `a12-${repeatId}-table`;
	describe("given a repeat without infiniteScrolling=true and no tableHeight set", () => {
		it("renders the repeat table without prop virtualized", async () => {
			const models = (() => {
				type InfiniteScrollingRepeat = FormModel.DetachedRepeat | FormModel.InlineRepeat;

				const tmp = loadModels("repeat.infinite-scrolling");
				const screen = tmp.formModel.content.screens.find(s => screenName === s.name);
				const repeat = screen?.screenElements.find(
					IdEquals(repeatId)
				) as Mutable<InfiniteScrollingRepeat>;
				delete repeat.infiniteScrolling;
				delete repeat.tableStyle;
				return tmp;
			})();

			const data = loadData("repeat.infinite-scrolling", "dataSmall", models.documentModel);

			const { tableMap } = await setupWithOptions({
				models,
				data,
				screenName
			});

			const table = query(tableMap.Table).withId(tableId).props();
			equal(
				(table as MaybeInfiniteScrollTableProps).infiniteScrollOptions,
				undefined,
				"Expected that table is not virtualized"
			);
		});
	});

	describe("given a repeat with infiniteScrolling=true, a tableHeight, a rowHeight and a cardHeight", () => {
		const models = setupModelsFixture("repeat.infinite-scrolling");
		const fixture = setupFixture(() => ({
			data: loadData("repeat.infinite-scrolling", "dataSmall", models.documentModel)
		}));

		interface TableRender extends RtlRenderWrapper {
			table: MaybeInfiniteScrollTableProps;
		}

		describe("when cardView is disabled", async () => {
			async function renderAndReturnWithTable(): Promise<TableRender> {
				const wrapper = await setupWithOptions({ models, data: fixture.data, screenName });

				const table = query(wrapper.tableMap.Table)
					.withId(tableId)
					.props() as MaybeInfiniteScrollTableProps;

				return { ...wrapper, table };
			}

			const { it, render } = RenderGroupFixture<TableRender>(renderAndReturnWithTable);

			it("renders the repeat table with the style property height set to the given tableHeight", () => {
				notEqual(
					render.wrapper.table.infiniteScrollOptions,
					undefined,
					"Expected that table has infiniteScrollOptions"
				);

				equal(
					render.wrapper.table.style?.height,
					500,
					"Expected that table has style 'height' set to 'tableHeight'"
				);
			});

			it("renders a repeat table with infiniteScrollOptions where the row height is set to the given one", () => {
				equal(
					render.wrapper.table.infiniteScrollOptions?.rowHeight,
					50,
					"Expected that 'rowHeight' of 50 is set"
				);
			});

			it("renders a repeat table with infiniteScrollOptions where the row count is set to the total number of rows", () => {
				equal(render.wrapper.table.infiniteScrollOptions?.rowCount, 30);
			});
		});

		describe("when cardView is disabled", () => {
			describe("and a screenState with a respective focusedComponent that includes an index", () => {
				it("renders the (virtualized) repeat table with a infiniteScrollOptions prop that contains the mapped index of the row as the scrollToIndex", async () => {
					const focusedComponent = {
						formModelPath: repeatFormModelPath,
						index: 5
					};

					const { tableMap } = await setupWithOptions({
						models,
						data: fixture.data,
						screenName,
						focusedComponent
					});

					const table = query(tableMap.Table)
						.withId(tableId)
						.props() as MaybeInfiniteScrollTableProps;
					equal(
						table.infiniteScrollOptions?.overrideListProps?.scrollToIndex,
						focusedComponent.index,
						"Expected that scrollToIndex equals focusedComponent.index"
					);
				});
			});
		});

		describe("when cardView is enabled", () => {
			it("renders a repeat table with infiniteScrollOptions where the row height is set to the cardHeight", async () => {
				const { tableMap } = await setupWithOptions({
					models,
					data: fixture.data,
					screenName,
					config: { cardView: true }
				});
				const table = query(tableMap.Table)
					.withId(tableId)
					.props() as MaybeInfiniteScrollTableProps;

				equal(
					table.infiniteScrollOptions?.rowHeight,
					400,
					"Expected that 'rowHeight' is set to the 'cardHeight' value of 400"
				);
			});
		});
	});
}

describe("api.view.repeat", () => {
	describe("repeat.infinite-scrolling", () => {
		describe("Inline-Repeat", () => {
			executeInfiniteScrollingTest(
				FORM_MODEL.irScreen,
				FORM_MODEL.inlineRepeat,
				FORM_MODEL.defaultRowHeightIR
			);
		});

		describe("Detached-Repeat", () => {
			executeInfiniteScrollingTest(
				FORM_MODEL.drScreen,
				FORM_MODEL.detachedRepeat,
				FORM_MODEL.defaultRowHeightDR
			);
		});
	});
});
