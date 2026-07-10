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

import { equal, fail } from "node:assert/strict";

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import { query, within } from "@com.mgmtp.a12.devtools/react";
import { ExpressionBuilder } from "@com.mgmtp.a12.expression/expression-core";

import { UiId } from "../../../../../back-end/utils/internal/generateUiId.js";
import type { Mutable } from "../../../../../back-end/utils/internal/types.js";
import type { FormModel } from "../../../../../models/index.js";
import { findElementByFormModelPath } from "../../../../../models/index.js";
import { isFormModelRepeat } from "../../../../../models/internal/FormModelGuards.js";
import type { TableWidgetMap } from "../../../../../view/internal/components/form-engine/repeat/table-widget-map.js";
import type { RtlRenderWrapper } from "../../../../rtl-utils/render-wrapper.js";
import { createModelPath } from "../../../../utils/createModelPath.js";
import { setupFormEngineRendererWithRtlAsync } from "../../../../utils/setup.js";
import { setupModelsFixture } from "../../../../utils/setupFixture.js";

describe("api.view.repeat", () => {
	describe("Title", () => {
		describe("Inline-Repeat", () => {
			const inlineRepeatModelPath = createModelPath(
				"title",
				"Inline Repeat",
				"sec1",
				"inline-repeat-rep"
			);
			executeTestForTitle(inlineRepeatModelPath);
		});

		describe("Detached-Repeat", () => {
			const detachedRepeatModelPath = createModelPath(
				"title",
				"Detached Repeat",
				"sec1",
				"detached-repeat-rep"
			);
			executeTestForTitle(detachedRepeatModelPath);
		});

		describe("Embedded-Repeat", () => {
			const embeddedRepeatModelPath = createModelPath(
				"title",
				"Embedded Repeat",
				"sec1",
				"embedded-repeat-rep"
			);
			executeTestForTitle(embeddedRepeatModelPath);
		});
	});
});

function executeTestForTitle(formModelPathToRepeat: ModelPath): void {
	const models = setupModelsFixture("a11y", "repeat");
	let mutableRepeat: Mutable<FormModel.Repeat>;

	before(() => {
		const repeat = findElementByFormModelPath(models.formModel, formModelPathToRepeat);

		if (!repeat || !isFormModelRepeat(repeat)) {
			fail("Wrong setup. Given model path does not return a repeat!");
		}

		mutableRepeat = repeat;
	});

	after(() => {
		mutableRepeat = undefined!;
	});

	describe("Given a multilingual repeat title", () => {
		const REPEAT_TITLE = "Test Repeat Title";

		describe("and 'titleHidden=undefined'", () => {
			const fixture = () => {
				mutableRepeat.titleHidden = undefined;
				mutableRepeat.title = {
					type: "Multilingual",
					multilingualText: {
						text: [{ text: REPEAT_TITLE, locale: "en" }]
					}
				};

				return { wrapper: setupFormEngineRendererWithRtlAsync({ models }) };
			};

			it("renders a title component", async () => {
				findAndAssertTitle({ wrapper: await fixture().wrapper, text: REPEAT_TITLE });
			});

			it("sets the 'ariaLabel' property of the table with the localized title", async () => {
				const { tableMap } = await fixture().wrapper;
				findAndAssertAriaLabel({ table: tableMap.Table, text: REPEAT_TITLE });
			});
		});

		describe("and 'titleHidden=false'", () => {
			const fixture = () => {
				mutableRepeat.titleHidden = false;
				mutableRepeat.title = {
					type: "Multilingual",
					multilingualText: {
						text: [{ text: REPEAT_TITLE, locale: "en" }]
					}
				};
				return { wrapper: setupFormEngineRendererWithRtlAsync({ models }) };
			};

			it("renders a title component", async () => {
				findAndAssertTitle({ wrapper: await fixture().wrapper, text: REPEAT_TITLE });
			});

			it("sets the 'ariaLabel' property of the table with the localized title", async () => {
				const { tableMap } = await fixture().wrapper;
				findAndAssertAriaLabel({ table: tableMap.Table, text: REPEAT_TITLE });
			});
		});

		describe("and 'titleHidden=true'", () => {
			const fixture = () => {
				mutableRepeat.titleHidden = true;
				mutableRepeat.title = {
					type: "Multilingual",
					multilingualText: {
						text: [{ text: REPEAT_TITLE, locale: "en" }]
					}
				};
				return { wrapper: setupFormEngineRendererWithRtlAsync({ models }) };
			};

			it("renders no title component", async () => {
				findAndAssertTitle({ wrapper: await fixture().wrapper });
			});

			it("sets the 'ariaLabel' property of the table with the localized title", async () => {
				const { tableMap } = await fixture().wrapper;
				findAndAssertAriaLabel({ table: tableMap.Table, text: REPEAT_TITLE });
			});
		});
	});

	describe("Given an expression repeat title", () => {
		const REPEAT_TITLE = "Test Repeat Title";
		const EXPRESSION_TITLE = "kontext(root) { kontext(nonrep) { [string1] } }";

		describe("and 'titleHidden=undefined'", () => {
			const fixture = () => {
				mutableRepeat.titleHidden = undefined;
				mutableRepeat.title = {
					type: "Expression",
					expressionText: EXPRESSION_TITLE,
					expressionTree: ExpressionBuilder.build(EXPRESSION_TITLE)
				};
				return {
					wrapper: setupFormEngineRendererWithRtlAsync({
						models,
						data: { document: { root: { nonrep: { string1: REPEAT_TITLE } } } }
					})
				};
			};

			it("renders a title component", async () => {
				findAndAssertTitle({ wrapper: await fixture().wrapper, text: REPEAT_TITLE });
			});

			it("sets the 'ariaLabel' property of the table with the localized title", async () => {
				const { tableMap } = await fixture().wrapper;
				findAndAssertAriaLabel({ table: tableMap.Table, text: REPEAT_TITLE });
			});
		});

		describe("and 'titleHidden=false'", () => {
			const fixture = () => {
				mutableRepeat.titleHidden = false;
				mutableRepeat.title = {
					type: "Expression",
					expressionText: "kontext(root) { kontext(nonrep) { [string1] } }",
					expressionTree: ExpressionBuilder.build(EXPRESSION_TITLE)
				};
				return {
					wrapper: setupFormEngineRendererWithRtlAsync({
						models,
						data: { document: { root: { nonrep: { string1: REPEAT_TITLE } } } }
					})
				};
			};

			it("renders a title component", async () => {
				findAndAssertTitle({ wrapper: await fixture().wrapper, text: REPEAT_TITLE });
			});

			it("sets the 'ariaLabel' property of the table with the localized title", async () => {
				const { tableMap } = await fixture().wrapper;
				findAndAssertAriaLabel({ table: tableMap.Table, text: REPEAT_TITLE });
			});
		});

		describe("and 'titleHidden=true'", () => {
			const fixture = () => {
				mutableRepeat.titleHidden = true;
				mutableRepeat.title = {
					type: "Expression",
					expressionText: "kontext(root) { kontext(nonrep) { [string1] } }",
					expressionTree: ExpressionBuilder.build(EXPRESSION_TITLE)
				};
				return {
					wrapper: setupFormEngineRendererWithRtlAsync({
						models,
						data: { document: { root: { nonrep: { string1: REPEAT_TITLE } } } }
					})
				};
			};

			it("renders no title component", async () => {
				findAndAssertTitle({ wrapper: await fixture().wrapper });
			});

			it("sets the 'ariaLabel' property of the table with the localized title", async () => {
				const { tableMap } = await fixture().wrapper;
				findAndAssertAriaLabel({ table: tableMap.Table, text: REPEAT_TITLE });
			});
		});
	});

	describe("Given no repeat title", () => {
		it("renders no title component", async () => {
			mutableRepeat.titleHidden = true;
			mutableRepeat.title = {
				type: "Multilingual",
				multilingualText: {
					text: []
				}
			};
			const wrapper = await setupFormEngineRendererWithRtlAsync({ models });

			findAndAssertTitle({ wrapper });
		});
	});

	function findAndAssertTitle(options: { wrapper: RtlRenderWrapper; text?: string }): void {
		const titleId = UiId.generateForTitle({ id: mutableRepeat.id });
		const title = within(options.wrapper.baseElement).queryById(titleId);

		equal(title?.textContent, options.text);
	}

	function findAndAssertAriaLabel(options: { table: TableWidgetMap["Table"]; text: string }): void {
		const tableId = UiId.generateForRepeatTable({ id: mutableRepeat.id });
		const table = query(options.table).withId(tableId).props();
		equal(table?.ariaLabel, options.text);
	}
}
