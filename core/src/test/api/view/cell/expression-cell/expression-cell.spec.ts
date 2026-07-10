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

import { fail, ok, strictEqual } from "node:assert/strict";

import { act } from "@testing-library/react";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import { query, screen } from "@com.mgmtp.a12.devtools/react";
import type { Locale, Localizer, ValueConversion } from "@com.mgmtp.a12.utils/utils-localization";
import {
	defaultDataFormats,
	defaultLocalizerFactory,
	defaultValueConversion
} from "@com.mgmtp.a12.utils/utils-localization";

import { createEngineStore } from "../../../../../back-end/store/index.js";
import type { EngineStore } from "../../../../../back-end/store/internal/store.js";
import type { Mutable } from "../../../../../back-end/utils/internal/types.js";
import type { FormModel } from "../../../../../models/index.js";
import { findElementByFormModelPath } from "../../../../../models/index.js";
import {
	isFormModelControlGrid,
	isFormModelSection
} from "../../../../../models/internal/FormModelGuards.js";
import { DocumentUtils } from "../../../../../models/internal/utils/document-utils.js";
import type { Config, FormModelMap } from "../../../../../view/index.js";
import { defaultMapDispatchToProps } from "../../../../../view/index.js";
import { getExpressionCellValueInUI } from "../../../../../view/internal/components/form-engine/cells/expression-cell/getExpressionCellValueInUI.js";
import { createConfig } from "../../../../../view/internal/configuration/Defaults.js";
import { getComponentMocks } from "../../../../rtl-utils/getComponentMocks.js";
import type { RtlRenderWrapper } from "../../../../rtl-utils/render-wrapper.js";
import { createDocumentPath } from "../../../../utils/createDocumentPath.js";
import { createModelPath } from "../../../../utils/createModelPath.js";
import { DE_LOCALE, US_LOCALE } from "../../../../utils/localization.js";
import { loadData, loadModels, setupFormEngineRendererWithRtl } from "../../../../utils/setup.js";
import type { JsonAdapter } from "../../../../utils/setup.js";
import { setupFixture, setupModelsFixture } from "../../../../utils/setupFixture.js";
import type { LocationStackPosition } from "../../../../utils/test-model-helpers/controls.js";
import {
	expressionLabelDocument,
	IDS as ExpressionLabelIds,
	formattedExpressionUiState
} from "../../../../utils/test-model-helpers/expression-label.js";
import { EXPRESSIONS } from "../../../../utils/test-model-helpers/expressions.js";
import { FORM_MODEL } from "../../../../utils/test-model-helpers/unmarshallFormModel.js";

describe("api.view.cell", () => {
	describe("Expression Cell", () => {
		const models = setupModelsFixture("controls.expressions");
		const fixture = setupFixture(() => ({
			document: loadData("controls.expressions", "data", models.documentModel),
			backupDocument: loadData("controls.expressions", "data-for-backup", models.documentModel)
		}));

		async function setup(
			options: {
				locationPosition?: LocationStackPosition;
				config?: Partial<Config>;
			} = {}
		): Promise<RtlRenderWrapper> {
			const repeatPath = createDocumentPath([EXPRESSIONS.ROOT], [EXPRESSIONS.repeatableGroup, 1]);
			const screenLocation: EngineStore.ScreenState[] = [
				{
					locationPath: [{ elementName: EXPRESSIONS.screenName }],
					path: [],
					repeatInstanceState:
						options.locationPosition === "embedded"
							? {
									[ModelPath.toString(EXPRESSIONS.er_locationPath)]: {
										expandedRowPath: repeatPath
									}
								}
							: {}
				}
			];

			if (options.locationPosition === "detached") {
				screenLocation.push({
					path: repeatPath,
					locationPath: EXPRESSIONS.dr_locationPath
				});
			}

			return act(() =>
				setupFormEngineRendererWithRtl({
					models,
					data: { document: fixture.document },
					ui: {
						backup: [{ document: fixture.backupDocument, messages: {} }],
						screenLocation: screenLocation
					},
					config: options.config,
					componentMap: getComponentMocks(),
					withWidgets: true
				})
			);
		}

		describe("label", () => {
			const expressionLabelModels = setupModelsFixture("localization", "expression-label");
			const unmarshallFormModelModels = setupModelsFixture("test.unmarshallFormModel");

			describe("section", () => {
				describe("with a multilingual label defined in the model", () => {
					it("renders a label", () => {
						const { widgetMap } = setupFormEngineRendererWithRtl({ models });
						const props = query(widgetMap.TextOutput).withTestId(EXPRESSIONS.ID_NAME).props();
						strictEqual(props.label, "Expression (eng)");
					});
				});

				describe("with an expression label defined in the model", () => {
					it("renders a label", async () => {
						const { componentMap } = await act(() =>
							setupFormEngineRendererWithRtl({
								models: expressionLabelModels,
								data: { document: expressionLabelDocument },
								componentMap: getComponentMocks(),
								withWidgets: true
							})
						);
						const props = query(componentMap.HtmlTextSpan)
							.withTestId(ExpressionLabelIds.EXPRESSION_CELL)
							.props();
						strictEqual(props.content, "Expression Cell: TestValue");
					});

					it("renders a formatted title if the expression contained markdown formatting", async () => {
						const { componentMap } = await act(() =>
							setupFormEngineRendererWithRtl({
								models: expressionLabelModels,
								data: { document: expressionLabelDocument },
								ui: formattedExpressionUiState,
								componentMap: getComponentMocks(),
								withWidgets: true
							})
						);
						const props = query(componentMap.HtmlTextSpan)
							.withTestId(ExpressionLabelIds.EXPRESSION_CELL_FORMATTED)
							.props();
						strictEqual(props.content, "Expression Cell crossed out: <del>TestValue</del>");
					});
				});

				describe("with no label defined in the model", () => {
					it("doesn't render a label", () => {
						const { widgetMap } = setupFormEngineRendererWithRtl({
							models: unmarshallFormModelModels
						});
						const props = query(widgetMap.TextOutput)
							.withTestId(FORM_MODEL.idExpressionCell)
							.props();
						strictEqual(props.label, undefined);
					});
				});
			});
		});

		describe("value", () => {
			describe("when the cell is located in a top-level screen", () => {
				it("reads the value from the document", async () => {
					const { componentMap } = await setup();
					const props = query(componentMap.HtmlTextDiv).groupByTestId().at(0).props();
					strictEqual(props.content?.includes("Heinz"), true);
				});

				it("reads the value and does not exchange null to false for boolean fields", async () => {
					const { componentMap } = await setup();
					const props = query(componentMap.HtmlTextDiv).groupByTestId().at(0).props();
					const pTags = props.content.split("<p>");

					// Pre-check the data
					const value = DocumentUtils.getValue({
						document: fixture.document,
						path: createDocumentPath(["RootGroup"], ["ContactGroup", 3], ["Married"])
					});
					strictEqual(
						value,
						null,
						"Wrong test setup: Expected that the value is undefined in the document"
					);

					// Search for the pTag of 'Schneider'
					const actualTag = pTags.find(t => t.includes("Schneider"));
					strictEqual(actualTag?.includes("not married"), false);
				});
			});

			describe("when the cell is located in an embedded-repeat detail control-grid", () => {
				it("reads the value correctly from the document", async () => {
					const { componentMap } = await setup({ locationPosition: "embedded" });
					const props = query(componentMap.HtmlTextDiv).groupByTestId().at(0).props();
					strictEqual(props.content?.includes("3,000 EUR"), true);
				});
			});

			describe("when the control is located in a detached-repeat detail-screen", () => {
				it("reads the value correctly from the document", async () => {
					const { componentMap } = await setup({ locationPosition: "detached" });
					const props = query(componentMap.HtmlTextDiv).groupByTestId().at(0).props();
					strictEqual(props.content?.includes("3,000 EUR"), true);
				});
			});

			describe("when the value is empty", () => {
				createLocalizationTest(US_LOCALE);
				createLocalizationTest(DE_LOCALE);

				function createLocalizationTest(locale: Locale): void {
					describe(locale.language, () => {
						it("sets the no data options to true and shows a localized 'no data' string", async () => {
							const { widgetMap } = setupFormEngineRendererWithRtl({ models, locale });
							const cell = await screen.findById("a12-expressionCell-83438-expression");
							const expectedText = locale.language === "en" ? "no data" : "keine Daten";
							strictEqual(cell.textContent?.includes(expectedText), true);
							const props = query(widgetMap.TextOutput).withTestId("expressionCell-83438").props();
							strictEqual(props.noData, true);
						});
					});
				}

				it("sets the no data option to false if the localizer does not return a 'no data' localization", () => {
					const { widgetMap } = setupFormEngineRendererWithRtl({ models, localizer: () => "" });
					const props = query(widgetMap.TextOutput).withTestId("expressionCell-83438").props();
					strictEqual(props.noData, false);
				});
			});
		});

		describe("formatting", () => {
			it("markdown formatting is applied", async () => {
				const { componentMap } = await setup();
				const props = query(componentMap.HtmlTextDiv).groupByTestId().at(0).props();
				const pTags = props.content.split("<p>");

				const actualTag = pTags.find(t => t.includes("Heinz"));
				strictEqual(actualTag?.includes("<strong>Müller</strong>"), true);
			});

			it("markdown structuring is applied", async () => {
				const { componentMap } = await setup();
				const props = query(componentMap.HtmlTextDiv).groupByTestId().at(0).props();
				strictEqual(props.content?.includes("<li>Johann  </li>"), true);
				strictEqual(props.content?.includes("<li>Lia</li>"), true);
			});

			describe("if an expression condition is fulfilled", () => {
				it("conditional string is shown", async () => {
					const { componentMap } = await setup();
					const props = query(componentMap.HtmlTextDiv).groupByTestId().at(0).props();
					const pTags = props.content.split("<p>");
					const index = pTags.findIndex(t => t.includes("Heinz"));
					strictEqual(pTags[index + 1]?.includes("Costs: 3,000 EUR"), true);
				});
			});

			describe("if an expression condition is not fulfilled", () => {
				it("conditional string is not shown", async () => {
					const { componentMap } = await setup();
					const props = query(componentMap.HtmlTextDiv).groupByTestId().at(0).props();
					const pTags = props.content.split("<p>");

					const index = pTags.findIndex(t => t.includes("Sandra"));
					strictEqual(pTags[index + 1]?.includes("Costs"), false);
				});
			});
		});

		describe("getExpressionCellValue", () => {
			function setupTests(
				cellPath: ModelPath,
				jsonAdapter?: JsonAdapter,
				locale?: Locale
			): {
				renderOptions: FormModelMap.RenderOptions;
				expressionCell: FormModel.ExpressionCell;
				localizer: Localizer;
				converter: ValueConversion;
			} {
				const expressionModels = loadModels("controls.expressions", undefined, jsonAdapter);
				const document1 = loadData("controls.expressions", "data", models.documentModel);
				const initialState = createEngineStore({
					models: expressionModels,
					locale: locale ?? US_LOCALE,
					data: { document: document1 }
				});

				const renderOptions: FormModelMap.RenderOptions = {
					config: createConfig({}),
					eventHandlers: defaultMapDispatchToProps(a => a).eventHandlers,
					state: initialState
				};

				const converter = defaultValueConversion(defaultDataFormats(locale ?? US_LOCALE));

				const localizer = defaultLocalizerFactory({
					locale: locale ?? US_LOCALE
				});

				const expressionCell = findElementByFormModelPath(
					expressionModels.formModel,
					cellPath
				) as FormModel.ExpressionCell;

				return { renderOptions, expressionCell, localizer, converter };
			}

			it("returns the evaluated expression when given a valid expression and respective data", () => {
				const expressionCellPath = createModelPath(
					"Expressions Sample Screen",
					"Screen 0",
					"String",
					"row-1asd1",
					"expression-2"
				);

				const { renderOptions, expressionCell, localizer, converter } =
					setupTests(expressionCellPath);
				const evaluatedExpression = getExpressionCellValueInUI(
					renderOptions,
					expressionCell,
					localizer,
					converter
				);
				strictEqual(evaluatedExpression, "<p>HeinzSandraEmma</p>\n");
			});

			it("localizes the expression correctly", () => {
				const expressionCellPath2 = createModelPath(
					"Expressions Sample Screen",
					"Screen 0",
					"String",
					"row-0a230",
					"expression"
				);

				const {
					renderOptions: optionsEn,
					expressionCell: expressionCellEn,
					localizer: localizerEN,
					converter: converterEN
				} = setupTests(expressionCellPath2, undefined, US_LOCALE);
				const evaluatedExpressionEn = getExpressionCellValueInUI(
					optionsEn,
					expressionCellEn,
					localizerEN,
					converterEN
				);
				ok(evaluatedExpressionEn.includes("married"));
				ok(evaluatedExpressionEn.includes("not married"));
				ok(evaluatedExpressionEn.includes("Costs"));

				const {
					renderOptions: optionsDe,
					expressionCell: expressionCellDe,
					localizer: localizerDE,
					converter: converterDE
				} = setupTests(expressionCellPath2, undefined, DE_LOCALE);
				const evaluatedExpressionDe = getExpressionCellValueInUI(
					optionsDe,
					expressionCellDe,
					localizerDE,
					converterDE
				);
				ok(evaluatedExpressionDe.includes("verheiratet"));
				ok(evaluatedExpressionDe.includes("nicht verheiratet"));
				ok(evaluatedExpressionDe.includes("Kosten"));
			});

			it("throws an error if given an invalid expression using a field reference on a group", () => {
				const expressionCellPath = createModelPath(
					"Expressions Sample Screen",
					"Screen 0",
					"String",
					"row-1asd1",
					"expression-2"
				);

				const expressionAdapter: JsonAdapter = json => {
					const sec = json.content.screens[0].screenElements[0];
					ok(isFormModelSection(sec), "Invalid setup, section is missing");

					const cg = sec.screenElements?.[0];
					ok(isFormModelControlGrid(cg), "Invalid setup, cg is missing");

					const expressionCell = cg.row?.[1].cell?.[0] as Mutable<FormModel.ExpressionCell>;

					expressionCell.expression = "kontext(RootGroup){ kontext(ContactGroup){ [Children] } }";
					return json;
				};
				const { renderOptions, expressionCell, localizer, converter } = setupTests(
					expressionCellPath,
					expressionAdapter
				);
				try {
					getExpressionCellValueInUI(renderOptions, expressionCell, localizer, converter);
					fail("Expected an error");
				} catch (e) {
					ok(e instanceof Error);
					strictEqual(
						e.message,
						"Invalid field reference in expression: /RootGroup/ContactGroup/Children"
					);
				}
			});
		});

		it("check that disableParagraphWrapping is set for TextOutput", async () => {
			const { widgetMap } = await setup();
			const props = query(widgetMap.TextOutput).groupByTestId().at(0).props();
			strictEqual(props.disableParagraphWrapping, true);
		});
	});
});
