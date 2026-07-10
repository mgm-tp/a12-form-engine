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

import { equal, ok } from "node:assert/strict";
import type { Mock } from "node:test";
import { mock } from "node:test";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import { query, within } from "@com.mgmtp.a12.devtools/react";
import { DataRoles } from "@com.mgmtp.a12.widgets/widgets-core";
import type { HeadlineProps } from "@com.mgmtp.a12.widgets/widgets-core";

import type { Models } from "../../../../back-end/store/internal/store.js";
import type { WidgetMap } from "../../../../view/index.js";
import { defaultMapDispatchToProps } from "../../../../view/index.js";
import { mouseEventMock } from "../../../rtl-utils/mock-utils.js";
import type { RtlRenderWrapper, SetupWithRtlOptions } from "../../../rtl-utils/render-wrapper.js";
import { createModelPath } from "../../../utils/createModelPath.js";
import { RenderGroupFixture } from "../../../utils/rtl-render-group.js";
import { setupModelsFixture } from "../../../utils/setupFixture.js";
import { IDS as TitleIds } from "../../../utils/test-model-helpers/aria-level.js";
import { FORM_MODEL, IDS } from "../../../utils/test-model-helpers/collapsible-section.js";
import {
	expressionLabelDocument,
	IDS as ExpressionLabelIds,
	formattedExpressionUiState
} from "../../../utils/test-model-helpers/expression-label.js";
import { setupFormEngineRendererWithRtlAsync } from "../../../utils/setup.js";

import { TypographyHeadline } from "./typography-headline-mock.js";

describe("api.view.layout", () => {
	describe("Sections", () => {
		describe("when empty", () => {
			const models = setupModelsFixture("container", "container-visibility");
			const EMPTY_SECTION_ID = "a12-section-5318f";
			const SECTION_HIDDEN_IF_EMPTY_ID = "a12-section-b7fcd";

			it("is hidden", async () => {
				const wrapper = await setupFormEngineRendererWithRtlAsync({ models });

				const section = within(wrapper.baseElement).queryById(EMPTY_SECTION_ID);
				ok(section === null);
			});

			it("is hidden when all children are hidden", async () => {
				const wrapper = await setupFormEngineRendererWithRtlAsync({
					models,
					data: {}
				});

				const section = within(wrapper.baseElement).queryById(SECTION_HIDDEN_IF_EMPTY_ID);
				ok(section, "Expected to find section!");
			});

			it("is hidden when all children are hidden", async () => {
				const wrapper = await setupFormEngineRendererWithRtlAsync({
					models,
					data: {
						document: {
							rootGroup: {
								booleanField: true
							}
						}
					}
				});

				const section = within(wrapper.baseElement).queryById(SECTION_HIDDEN_IF_EMPTY_ID);
				ok(section === null);
			});
		});

		describe("collapse", () => {
			const collapsibleSectionModels: Models = setupModelsFixture(
				"container",
				"collapsible-section"
			);
			interface RenderArgs {
				sectionId: string;
				sectionState: {
					sectionPath: ModelPath;
					sectionCollapsed: boolean;
				};
			}

			interface RenderResult extends RtlRenderWrapper {
				headline: HeadlineProps;
				onCollapseSection: Mock<(state: boolean) => void>;
			}

			async function renderWithSectionState(options: RenderArgs): Promise<RenderResult> {
				const stubbedDispatch = defaultMapDispatchToProps(mock.fn());
				const onCollapseSection = mock.fn();
				const dispatchConfig = {
					...stubbedDispatch.eventHandlers,
					onCollapseSection
				};

				const wrapper = await setupFormEngineRendererWithRtlAsync({
					models: collapsibleSectionModels,
					ui: {
						sectionState: {
							[ModelPath.toString(options.sectionState.sectionPath)]:
								options.sectionState.sectionCollapsed
						}
					},
					dispatchConfig
				});

				const headline = query(wrapper.widgetMap.TypographyHeadline)
					.withTestId(options.sectionId)
					.props();
				equal(headline.collapsible, true);

				return {
					...wrapper,
					headline,
					onCollapseSection
				};
			}

			function assertOnCollapseSectionCall(collapsed: boolean, wrapper: RenderResult): void {
				const mock = wrapper.onCollapseSection.mock;
				equal(mock.callCount(), 1, "Expected that onCollapseSection is called once");
				equal(mock.calls[0].arguments[0], collapsed);
			}

			function assertHeadlineCollapsedState(collapsed: boolean, wrapper: RenderResult): void {
				const headline = wrapper.headline;
				equal(headline.collapsible, true);
				equal(headline.collapsed, collapsed);
			}

			describe("given a section with 'collapse=OFF'", () => {
				it("always renders a non collapsible section", async () => {
					const wrapper = await setupFormEngineRendererWithRtlAsync({
						models: collapsibleSectionModels,
						ui: {
							sectionState: { ["/Screen1/not-collapsible"]: false }
						}
					});
					const headline = query(wrapper.widgetMap.TypographyHeadline)
						.withTestId(IDS.nonCollapsibleSectionCollapseOff)
						.props();
					ok(headline.collapsible === undefined);
				});
			});

			describe("given a section form model element with 'collapse=OPEN'", () => {
				describe("and no collapse information in the section state for this section", () => {
					it("renders an open collapsible section with collapsed = false", async () => {
						const wrapper = await renderWithSectionState({
							sectionState: {
								sectionPath: createModelPath("Any", "path"),
								sectionCollapsed: true
							},
							sectionId: IDS.collapsibleSectionWithCollapseOpen
						});

						within(wrapper.baseElement).getById(IDS.cgCollapsibleSectionWithCollapseOpen);
						assertHeadlineCollapsedState(false, wrapper);
					});
				});

				const renderWithCollapsedState = (sectionCollapsed: boolean) =>
					renderWithSectionState({
						sectionId: IDS.collapsibleSectionWithCollapseOpen,
						sectionState: {
							sectionCollapsed,
							sectionPath: FORM_MODEL.collapsibleSectionWithCollapseOpen
						}
					});

				describe("and a collapse information in the section state for this section which is OPEN", () => {
					it("renders an open collapsible section with collapsed = false", async () => {
						const wrapper = await renderWithCollapsedState(false);
						const controlGrid = within(wrapper.baseElement).queryById(
							IDS.cgCollapsibleSectionWithCollapseOpen
						);

						assertHeadlineCollapsedState(false, wrapper);
						ok(controlGrid);
					});

					it("dispatches 'onCollapseSection' with 'true' as parameter, when the section header of an open section is clicked", async () => {
						const wrapper = await renderWithCollapsedState(false);
						wrapper.headline.onCollapsingChange?.(mouseEventMock);

						assertOnCollapseSectionCall(true, wrapper);
					});
				});

				describe("and a collapse information in the section state for this section which is CLOSED", () => {
					const { it, render } = RenderGroupFixture<RenderResult>(() =>
						renderWithCollapsedState(true)
					);

					it("renders a closed collapsible section", () => {
						const controlGrid = within(render.wrapper.baseElement).queryById(
							IDS.cgCollapsibleSectionWithCollapseOpen
						);

						assertHeadlineCollapsedState(true, render.wrapper);
						ok(controlGrid === null);
					});

					it("dispatches 'onCollapseSection' with 'false' as parameter, when the section header of a closed section is clicked", () => {
						const headline = render.wrapper.headline;
						headline.onCollapsingChange?.(mouseEventMock);

						assertOnCollapseSectionCall(false, render.wrapper);
					});
				});
			});

			describe("given a section form model element with 'collapse=CLOSED'", () => {
				describe("and no collapse information in the section state for this section", () => {
					it("renders a closed collapsible section with collapsed = true ", async () => {
						const wrapper = await renderWithSectionState({
							sectionState: {
								sectionPath: createModelPath("Any", "path"),
								sectionCollapsed: true
							},
							sectionId: IDS.collapsibleSectionWithCollapseClosed
						});
						const controlGrid = within(wrapper.baseElement).queryById(
							IDS.cgCollapsibleSectionWithCollapseClosed
						);

						assertHeadlineCollapsedState(true, wrapper);
						ok(controlGrid === null);
					});
				});

				describe("and a collapse information in the section state for this section which is OPEN", () => {
					const renderExpanded = () =>
						renderWithSectionState({
							sectionState: {
								sectionCollapsed: false,
								sectionPath: FORM_MODEL.collapsibleSectionWithCollapseClosed
							},
							sectionId: IDS.collapsibleSectionWithCollapseClosed
						});

					const { it, render } = RenderGroupFixture<RenderResult>(renderExpanded);

					it("renders an open collapsible section", () => {
						const controlGrid = within(render.wrapper.baseElement).queryById(
							IDS.cgCollapsibleSectionWithCollapseClosed
						);

						assertHeadlineCollapsedState(false, render.wrapper);
						ok(controlGrid);
					});

					it("dispatches 'onCollapseSection' with 'true' as parameter, when the section header of an open section is clicked", () => {
						const headline = render.wrapper.headline;
						headline.onCollapsingChange?.(mouseEventMock);

						assertOnCollapseSectionCall(true, render.wrapper);
					});
				});

				describe("and a collapse information in the section state for this section which is CLOSED", () => {
					const renderCollapsed = () =>
						renderWithSectionState({
							sectionState: {
								sectionCollapsed: true,
								sectionPath: FORM_MODEL.collapsibleSectionWithCollapseClosed
							},
							sectionId: IDS.collapsibleSectionWithCollapseClosed
						});

					const { it, render } = RenderGroupFixture<RenderResult>(renderCollapsed);

					it("renders a closed collapsible section", () => {
						const controlGrid = within(render.wrapper.baseElement).queryById(
							IDS.cgCollapsibleSectionWithCollapseClosed
						);

						assertHeadlineCollapsedState(true, render.wrapper);
						ok(controlGrid === null);
					});

					it("dispatches 'onCollapseSection' with 'false' as parameter, when the section header of a closed section is clicked", () => {
						const headline = render.wrapper.headline;
						headline.onCollapsingChange?.(mouseEventMock);

						assertOnCollapseSectionCall(false, render.wrapper);
					});
				});
			});
		});

		describe("title", () => {
			const a11yModels = setupModelsFixture("a11y", "aria-level");
			const expressionLabelModels = setupModelsFixture("localization", "expression-label");

			const widgetMap: Partial<WidgetMap> = {
				TypographyHeadline
			};

			function renderTitleTest(options: SetupWithRtlOptions): Promise<RtlRenderWrapper> {
				return setupFormEngineRendererWithRtlAsync({
					...options,
					config: {
						widgetMap
					}
				});
			}

			function headlineBySectionId(sectionId: string, wrapper: RtlRenderWrapper): HTMLElement {
				return within(wrapper.baseElement).getByTestId(`${sectionId}-title-headline`);
			}

			function headlineLabelBySectionId(sectionId: string, wrapper: RtlRenderWrapper): HTMLElement {
				const headline = headlineBySectionId(sectionId, wrapper);
				return within(headline).getByDataRole(DataRoles.Typography.Headline.Label);
			}

			describe("section", () => {
				describe("with a multilingual label defined in the model", () => {
					it("renders a title", async () => {
						const wrapper = await renderTitleTest({
							models: a11yModels
						});

						const labelText = headlineLabelBySectionId(
							TitleIds.SECTION_WITH_LABEL,
							wrapper
						).textContent;
						equal(labelText, "section with label");
					});
				});

				describe("with an expression label defined in the model", () => {
					it("renders a title", async () => {
						const wrapper = await renderTitleTest({
							models: expressionLabelModels,
							data: { document: expressionLabelDocument }
						});

						const labelText = headlineLabelBySectionId(
							ExpressionLabelIds.SECTION,
							wrapper
						).textContent;
						equal(labelText, "Section: TestValue");
					});

					it("renders a formatted title if the expression contained markdown formatting", async () => {
						const wrapper = await renderTitleTest({
							models: expressionLabelModels,
							data: { document: expressionLabelDocument },
							ui: formattedExpressionUiState
						});

						const labelText = headlineLabelBySectionId(
							ExpressionLabelIds.SECTION_FORMATTED,
							wrapper
						).firstElementChild?.innerHTML;
						equal(labelText, "Section in bold: <strong>TestValue</strong>");
					});
				});

				describe("with no label defined in the model", () => {
					it("doesn't render a title", async () => {
						const wrapper = await renderTitleTest({
							models: a11yModels
						});

						const headline = within(wrapper.baseElement).queryByTestId(
							`${TitleIds.SECTION_WITHOUT_LABEL}-title-headline`
						);
						ok(headline === null);
					});
				});
			});

			describe("collapsible section", () => {
				describe("with a multilingual label defined in the model", () => {
					it("renders the label in the header", async () => {
						const wrapper = await renderTitleTest({
							models: a11yModels
						});

						const headline = headlineLabelBySectionId(
							TitleIds.COLLAPSIBLE_SECTION_WITH_LABEL,
							wrapper
						);
						ok(headline.textContent);
					});
				});

				describe("with an expression label defined in the model", () => {
					it("renders the label in the header", async () => {
						const wrapper = await renderTitleTest({
							models: expressionLabelModels,
							data: { document: expressionLabelDocument }
						});

						const labelText = headlineLabelBySectionId(
							ExpressionLabelIds.COLLAPSIBLE_SECTION,
							wrapper
						).textContent;
						equal(labelText, "Collapsible Section: TestValue");
					});

					it("renders a formatted label in the header if the expression contained markdown formatting", async () => {
						const wrapper = await renderTitleTest({
							models: expressionLabelModels,
							data: { document: expressionLabelDocument },
							ui: formattedExpressionUiState
						});

						const labelText = headlineLabelBySectionId(
							ExpressionLabelIds.COLLAPSIBLE_SECTION_FORMATTED,
							wrapper
						).firstElementChild?.innerHTML;
						equal(labelText, "Collapsible Section in bold: <strong>TestValue</strong>");
					});
				});

				describe("with no label defined in the model", () => {
					it("renders a headline with an empty label in the header", async () => {
						const wrapper = await renderTitleTest({
							models: a11yModels
						});

						const labelText = headlineLabelBySectionId(
							TitleIds.COLLAPSIBLE_SECTION_WITHOUT_LABEL,
							wrapper
						).textContent;
						equal(labelText, "");
					});
				});
			});
		});
	});
});
