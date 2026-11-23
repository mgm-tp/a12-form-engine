// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { query } from "@com.mgmtp.a12.devtools/react";

import { getNullMock } from "../../../rtl-utils/mock-utils.js";
import { SetupHelpers } from "../../../utils/setup.js";
import { setupModelsFixture } from "../../../utils/setupFixture.js";
import { expressionLabelDocument } from "../../../utils/test-model-helpers/expression-label.js";

const { setupContentBoxRendererWithRtl } = SetupHelpers;

describe("api.view.content-box", () => {
	const models = setupModelsFixture("styles.title");
	const localizationModels = setupModelsFixture("localization");
	const controlModels = setupModelsFixture("controls");
	const expressionLabelModels = setupModelsFixture("localization", "expression-label");
	const dataContextModels = setupModelsFixture("test.expression-datacontext");

	describe("HeadingElement", () => {
		describe("given a label for the model", () => {
			it("renders a ContentBoxElements.Title widget with the localized title from the form-model", () => {
				const { widgetMap } = setupContentBoxRendererWithRtl({ models });

				query(widgetMap.ContentBoxTitle)
					.withProp("text", "THIS TITLE MUST NOT BE SHOWN!")
					.assertRenderedTimes(1);
			});

			it("renders a ContentBoxElements.Title widget with the aria-level from the config", () => {
				const { widgetMap } = setupContentBoxRendererWithRtl({
					models,
					config: { ariaLevel: 2 }
				});

				query(widgetMap.ContentBoxTitle).withProp("ariaLevel", 2).assertRenderedTimes(1);
			});

			it(
				"renders a ContentBoxElements.Title widget with the aria-level from the config " +
					"if the correction-screen is open",
				() => {
					const { widgetMap } = setupContentBoxRendererWithRtl({
						models,
						ui: {
							correctionScreen: { visible: true, showDetailsState: {} }
						},
						config: { ariaLevel: 2 }
					});

					query(widgetMap.ContentBoxTitle).withProp("ariaLevel", 2).assertRenderedTimes(1);
				}
			);
		});

		describe("given no label for the model", () => {
			it("renders a ContentBoxElements.Title widget with an empty title from the form-model", () => {
				const { widgetMap } = setupContentBoxRendererWithRtl({ models: controlModels });

				query(widgetMap.ContentBoxTitle).withProp("text", "").assertRenderedTimes(1);
			});

			it("renders a ContentBoxElements.Title widget with the aria-level from the config", () => {
				const { widgetMap } = setupContentBoxRendererWithRtl({
					models: controlModels,
					config: { ariaLevel: 2 }
				});

				query(widgetMap.ContentBoxTitle).withProp("ariaLevel", 2).assertRenderedTimes(1);
			});

			it(
				"renders a ContentBoxElements.Title widget with the aria-level from the config " +
					"if the correction-screen is open",
				() => {
					const { widgetMap } = setupContentBoxRendererWithRtl({
						models: controlModels,
						ui: {
							correctionScreen: { visible: true, showDetailsState: {} }
						},
						config: { ariaLevel: 2 }
					});

					query(widgetMap.ContentBoxTitle).withProp("ariaLevel", 2).assertRenderedTimes(1);
				}
			);
		});

		describe("given a subtitle for the model", () => {
			describe("which is a multilingual label", () => {
				it("renders a ContentBoxElements.Subtitle widget with the localized subtitle from the form-model", () => {
					const { widgetMap } = setupContentBoxRendererWithRtl({ models: localizationModels });

					query(widgetMap.ContentBoxSubtitle)
						.withProp("text", "FormModel.Subtitle.en")
						.assertRenderedTimes(1);
				});
			});

			describe("which is an expression label", () => {
				describe("that contains markdown formatting", () => {
					it("renders a ContentBoxElements.Subtitle widget with the formatted subtitle from the form-model", () => {
						const { componentMap } = setupContentBoxRendererWithRtl({
							models: expressionLabelModels,
							data: { document: expressionLabelDocument },
							componentMap: {
								HtmlTextSpan: getNullMock()
							}
						});

						query(componentMap.HtmlTextSpan)
							.withProp("content", "Model Subtitle in bold: <strong>TestValue</strong>")
							.assertRenderedTimes(1);
					});
				});

				describe("that contains no markdown formatting", () => {
					it("renders a ContentBoxElements.Subtitle widget with the subtitle from the form-model", () => {
						const { componentMap } = setupContentBoxRendererWithRtl({
							models: dataContextModels,
							componentMap: {
								HtmlTextSpan: getNullMock()
							}
						});

						query(componentMap.HtmlTextSpan)
							.withProp("content", "GlobalSubtitle [field1]")
							.assertRenderedTimes(1);
					});
				});
			});
		});

		describe("given no subtitle for the model", () => {
			it("does not render a ContentBoxElements.Subtitle widget", () => {
				const { widgetMap } = setupContentBoxRendererWithRtl({ models: controlModels });
				query(widgetMap.ContentBoxSubtitle).assertNotRendered();
			});
		});
	});
});
