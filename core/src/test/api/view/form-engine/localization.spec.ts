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

import { deepEqual, equal, ok } from "node:assert/strict";
import { mock } from "node:test";

import { act } from "react";

import { query, within } from "@com.mgmtp.a12.devtools/react";
import type { Locale } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";
import {
	defaultLocalizerFactory,
	localizableFromModel
} from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";
import type { MenuItemType } from "@com.mgmtp.a12.widgets/widgets-core/lib/menu/main/menu.api.ts";
import type { MultiselectProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/multiselect/main/multiselect.api.js";
import type { BaseColumnType } from "@com.mgmtp.a12.widgets/widgets-core/lib/table/new-api/column.api.js";

import { LocalizableFactory } from "../../../../back-end/localization/internal/localization.js";
import type { EngineStore } from "../../../../back-end/store/internal/store.js";
import { UiId } from "../../../../back-end/utils/internal/generateUiId.js";
import { RepeatTableColumn } from "../../../../view/internal/components/form-engine/repeat/components/tableColumnTypes.js";
import type { ComponentMap } from "../../../../view/internal/configuration/componentMap/component-map.js";
import { DefaultComponentMap } from "../../../../view/internal/configuration/componentMap/DefaultComponentMap.js";
import type { InputMap } from "../../../../view/internal/configuration/componentMap/input/input-map.js";
import { MODAL_OVERLAY } from "../../../rtl-utils/data-roles.js";
import { HtmlTextSpanMock } from "../../../rtl-utils/getComponentMocks.js";
import { ControlInputMock, getInputMocks } from "../../../rtl-utils/getInputMocks.js";
import { mouseEventMock } from "../../../rtl-utils/mock-utils.js";
import type { RtlRenderWrapper, SetupWithRtlOptions } from "../../../rtl-utils/render-wrapper.js";
import type { TestLocale } from "../../../utils/localization.js";
import { DE_LOCALE, US_LOCALE } from "../../../utils/localization.js";
import { ModelHelpers } from "../../../utils/model-helpers.js";
import { RenderGroupFixture } from "../../../utils/rtl-render-group.js";
import { SetupHelpers } from "../../../utils/setup.js";
import { setupModelsFixture } from "../../../utils/setupFixture.js";
import { LOCALIZATION } from "../../../utils/test-model-helpers/localization.js";
import { queryRadioItemsProps } from "../../../utils/test-model-helpers/radio-item-query.js";

import { ModelElementIdEquals } from "../repeat/query-predicates.js";

describe("api.back-end.localization", () => {
	const models = setupModelsFixture("localization");

	describe("Localization of various form model elements", () => {
		for (const locale of [US_LOCALE, DE_LOCALE]) {
			describe(`Language: ${locale.language}`, () => {
				describeTestsForRepeat(locale);
				describeTestsForControlLabel(locale);
				describeTestsForTitle(locale);
				describeTestsForTextCell(locale);
				describeTestsForNavigationButton(locale);
				describeTestsForMenuItem(locale);
			});
		}

		function setup(
			locale: Locale,
			screenState?: EngineStore.ScreenState,
			inputMap?: InputMap,
			componentMap?: Partial<ComponentMap>
		): Promise<RtlRenderWrapper> {
			return SetupHelpers.setupFormEngineRendererWithRtlAsync(
				setupOptions(locale, screenState, inputMap, componentMap)
			);
		}

		function setupConnected(
			locale: Locale,
			screenState?: EngineStore.ScreenState
		): Promise<RtlRenderWrapper> {
			return SetupHelpers.setupConnectedFormEngineWithRtlAsync(setupOptions(locale, screenState));
		}

		function setupOptions(
			locale: Locale,
			screenState?: EngineStore.ScreenState,
			inputMap?: InputMap,
			componentMap?: Partial<ComponentMap>
		): SetupWithRtlOptions {
			return {
				inputMap,
				componentMap,
				models,
				locale: locale,
				data: {
					document: { root: { repeat: [{ F1: "Dummy", F2: "Dummy" }] } }
				},
				ui: {
					screenLocation: screenState !== undefined ? [screenState] : undefined
				},
				localizer: defaultLocalizerFactory({ locale })
			};
		}

		function fieldTypeFromIdString(idStr: string) {
			return idStr.match(/(?:a12-)?([a-z]+)/i)?.[1];
		}

		function describeTestsForRepeat(locale: TestLocale) {
			const dummyConfirmationTexts = {
				title: [
					{
						locale: "de",
						text: "GERMAN_TEXT_FOR_CONFIRM_TITLE"
					},
					{ locale: "en", text: "ENGLISH_TEXT_FOR_CONFIRM_TITLE" }
				],
				message: [
					{
						locale: "de",
						text: "GERMAN_TEXT_FOR_CONFIRM_MESSAGE"
					},
					{ locale: "en", text: "ENGLISH_TEXT_FOR_CONFIRM_MESSAGE" }
				]
			};

			describe("Repeat", () => {
				const { it, render } = RenderGroupFixture(() => setup(locale));

				const colIds = [
					"fieldOverviewColumn-1",
					"fieldbasedrepeatoverviewcolumn-1025f",
					"fieldOverviewColumn-2",
					"fieldbasedrepeatoverviewcolumn-a06b6"
				];

				const column = (wrapper: RtlRenderWrapper) => (colId: string) =>
					query(wrapper.tableMap.headCellRenderer)
						.withPropMatching("column", ModelElementIdEquals(colId))
						.props().column;

				const label = (column: BaseColumnType) => column.label;

				describe("column labels", () => {
					describe("if no label is defined for the column", () => {
						it("shows the label of the corresponding control", () => {
							equal(
								label(column(render.wrapper)(colIds[0])),
								`DocumentModelLabel.${locale.language}`
							);
						});
					});

					describe("if a label is defined for the column", () => {
						it("uses the column label", () => {
							equal(label(column(render.wrapper)(colIds[1])), `FormModelLabel.${locale.language}`);
						});
					});

					describe("if a field config label is defined for the column", () => {
						it("uses the field config label label", () => {
							equal(
								label(column(render.wrapper)(colIds[2])),
								`FieldConfigLabel.${locale.language}`
							);
						});
					});
				});

				const hintText = (column: BaseColumnType) =>
					RepeatTableColumn.isInstance(column) && RepeatTableColumn.isFieldColumn(column)
						? column.hintText
						: undefined;

				describe("column hints", () => {
					describe("if a hint text is only provided by the underlying document model field", () => {
						it("uses the document model hint", () => {
							equal(
								hintText(column(render.wrapper)(colIds[0])),
								`DocumentModelHint.${locale.language}`
							);
						});
					});

					describe("if a hint text is provided by the document model field and on the detail screen control", () => {
						it("still uses the document model hint and not the control hint", () => {
							equal(
								hintText(column(render.wrapper)(colIds[1])),
								`DocumentModelHint.${locale.language}`
							);
						});
					});

					describe("if a hint text is provided by the document model field and the field configuration", () => {
						it("uses the hint of the field configuration", () => {
							equal(
								hintText(column(render.wrapper)(colIds[2])),
								`FieldConfigHint.${locale.language}`
							);
						});
					});

					describe("if a hint text is provided by field, field configuration and detail screen control", () => {
						it("still uses the hint of the field configuration and not the control hint", () => {
							equal(
								hintText(column(render.wrapper)(colIds[3])),
								`FieldConfigHint.${locale.language}`
							);
						});
					});
				});

				describe("repeat buttons", () => {
					describe("if no custom label is provided for the buttons of the repeat", () => {
						it("uses the default button label provided by the model", () => {
							const button = query(render.wrapper.widgetMap.Button)
								.withId(LOCALIZATION.ID_REPEAT_DEFAULT_BUTTON)
								.props();
							equal(button.label, `Default.ADD.${locale.language}`);
						});
					});

					describe("if a custom label is provided for the buttons of the repeat", () => {
						it("uses the custom label", () => {
							const button = query(render.wrapper.widgetMap.Button)
								.withId(LOCALIZATION.ID_REPEAT_CUSTOM_BUTTON)
								.props();
							equal(button.label, `Custom.ADD.${locale.language}`);
						});
					});
				});

				describe("filter button", () => {
					it("shows the filter button title in the correct language", () => {
						const button = query(render.wrapper.widgetMap.Button)
							.withTestId("/Screen1/Repeat/RepeatDefaultLabels-toggle_filter")
							.props();

						const expectedTitle = { en: "Open filter", de: "Filter öffnen" };
						equal(button.title, expectedTitle[locale.language]);
					});
				});
			});

			describe("Repeat", () => {
				describe("confirmation dialog", () => {
					before(() => {
						mock.method(LocalizableFactory.prototype, "componentConfirmationTitles", () => [
							localizableFromModel("CONFIRM_TITLE_KEY", dummyConfirmationTexts.title)
						]);

						mock.method(LocalizableFactory.prototype, "componentConfirmationMessages", () => [
							localizableFromModel("CONFIRM_MESSAGE_KEY", dummyConfirmationTexts.message)
						]);
					});

					const renderModalConfirmation = (buttonId: string) => async () => {
						const wrapper = await setupConnected(locale);

						const confirmationButton = query(wrapper.widgetMap.Button).withId(buttonId).props();

						await act(() => {
							confirmationButton.onClick?.(mouseEventMock);
						});

						return wrapper;
					};

					describe("for a delete action", () => {
						const { it, render } = RenderGroupFixture(
							renderModalConfirmation(LOCALIZATION.ID_REPEAT_DEFAULT_DELETE_BUTTON)
						);

						it("shows the confirmation in the correct language", async () => {
							const modalOverlay = within(render.wrapper.baseElement).getByDataRole(MODAL_OVERLAY);
							for (const msg of Object.entries(dummyConfirmationTexts)) {
								ok(
									modalOverlay.textContent?.includes(
										// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
										msg[1].find(entry => entry.locale === locale.language)!.text
									),
									msg[0]
								);
							}
						});
					});

					describe("for a custom row action", () => {
						const { it, render } = RenderGroupFixture(
							renderModalConfirmation(LOCALIZATION.ID_REPEAT_CUSTOM_CONFIRM_BUTTON)
						);

						it("shows the confirmation in the correct language", async () => {
							const modalOverlay = within(render.wrapper.baseElement).getByDataRole(MODAL_OVERLAY);
							for (const text of ["Title", "Message"]) {
								ok(modalOverlay.textContent?.includes(`Custom.Confirm.${text}.${locale.language}`));
							}
						});
					});
				});
			});
		}

		function describeTestsForControlLabel(locale: TestLocale) {
			describe("no multilingual texts provided", () => {
				const inputMap = {
					...getInputMocks(),
					Input: mock.fn(ControlInputMock)
				};
				const { it } = RenderGroupFixture(() => setup(locale, undefined, inputMap));
				const fieldIds = [
					LOCALIZATION.STRING_FIELD.ID_FIELD_NO_LABEL,
					LOCALIZATION.NUMBER_FIELD.ID_FIELD_NO_LABEL,
					LOCALIZATION.BOOLEAN_FIELD.ID_FIELD_NO_LABEL,
					LOCALIZATION.DATE_FIELD.ID_FIELD_NO_LABEL,
					LOCALIZATION.ENUM_SELECT_FIELD.ID_FIELD_NO_LABEL,
					LOCALIZATION.ENUM_RADIO_FIELD.ID_FIELD_NO_LABEL,
					LOCALIZATION.MULTI_SELECT_FIELD.ID_FIELD_NO_LABEL,
					LOCALIZATION.CONFIRM_FIELD.ID_FIELD_NO_LABEL
				];

				for (const fieldId of fieldIds) {
					describe(`${fieldTypeFromIdString(fieldId)} control`, () => {
						it("has no label", () => {
							const input = query(inputMap.Input).withProp("uiId", fieldId).props();
							equal(input.modelElement.label, undefined);
						});

						it("has no hint", () => {
							const input = query(inputMap.Input).withProp("uiId", fieldId).props();
							equal(input.modelElement.hintText, undefined);
						});
					});
				}
			});

			describe("no multilingual texts provided", () => {
				const { it, render } = RenderGroupFixture(() => setup(locale));

				const expected = [1, 2].map(i => `DocumentModelValue${i}.${locale.language}`);

				describe("enum control radio", () => {
					it("has correctly localized value labels", () => {
						const labels = queryRadioItemsProps(render.wrapper.widgetMap.RadioItem)
							.withDataTestIdPrefix(LOCALIZATION.ENUM_RADIO_FIELD.ID_FIELD_NO_LABEL)
							.map(ri => ri.label);

						deepEqual(labels, expected);
					});
				});

				describe("multi select", () => {
					it("has correctly localized value labels", () => {
						const multiSelect = query(render.wrapper.widgetMap.MultiSelect)
							.withId(LOCALIZATION.MULTI_SELECT_FIELD.ID_FIELD_NO_LABEL)
							.props();

						const labels = (multiSelect.items as MultiselectProps.Item[]).map(i => i.label);

						deepEqual(labels, expected);
					});
				});
			});

			describe("multilingual texts provided only by the document model", () => {
				const inputMap = {
					...getInputMocks(),
					Input: mock.fn(ControlInputMock)
				};
				const { it } = RenderGroupFixture(() => setup(locale, undefined, inputMap));
				const fieldIds = [
					LOCALIZATION.STRING_FIELD.ID_FIELD_LABEL_PICUS,
					LOCALIZATION.NUMBER_FIELD.ID_FIELD_LABEL_PICUS,
					LOCALIZATION.BOOLEAN_FIELD.ID_FIELD_LABEL_PICUS,
					LOCALIZATION.DATE_FIELD.ID_FIELD_LABEL_PICUS,
					LOCALIZATION.ENUM_SELECT_FIELD.ID_FIELD_LABEL_PICUS,
					LOCALIZATION.ENUM_RADIO_FIELD.ID_FIELD_LABEL_PICUS,
					LOCALIZATION.CONFIRM_FIELD.ID_FIELD_LABEL_PICUS
				];

				for (const fieldId of fieldIds) {
					describe(`${fieldTypeFromIdString(fieldId)} control`, () => {
						it("has label from document model", () => {
							const label = query(inputMap.Input).withProp("uiId", fieldId).props()
								.modelElement.label;
							ok(
								typeof label === "string" &&
									label.startsWith(`DocumentModelLabel.${locale.language}`)
							);
						});

						it("has hint from document model", () => {
							const input = query(inputMap.Input).withProp("uiId", fieldId).props();
							equal(input.modelElement.hintText, `DocumentModelHint.${locale.language}`);
						});
					});
				}

				// dm doesn't support hints for multi-selects
				describe("multi-select control", () => {
					it("has label from document model", () => {
						const label = query(inputMap.Input)
							.withProp("uiId", LOCALIZATION.MULTI_SELECT_FIELD.ID_FIELD_LABEL_PICUS)
							.props().modelElement.label;
						ok(
							typeof label === "string" && label.startsWith(`DocumentModelLabel.${locale.language}`)
						);
					});
				});
			});

			describe("multilingual texts provided by document and form model", () => {
				const inputMap = {
					...getInputMocks(),
					Input: mock.fn(ControlInputMock)
				};
				const { it } = RenderGroupFixture(() => setup(locale, undefined, inputMap));
				const fieldIds = [
					LOCALIZATION.STRING_FIELD.ID_FIELD_LABEL_PICUS_MELIES,
					LOCALIZATION.NUMBER_FIELD.ID_FIELD_LABEL_PICUS_MELIES,
					LOCALIZATION.BOOLEAN_FIELD.ID_FIELD_LABEL_PICUS_MELIES,
					LOCALIZATION.DATE_FIELD.ID_FIELD_LABEL_PICUS_MELIES,
					LOCALIZATION.ENUM_SELECT_FIELD.ID_FIELD_LABEL_PICUS_MELIES,
					LOCALIZATION.ENUM_RADIO_FIELD.ID_FIELD_LABEL_PICUS_MELIES,
					LOCALIZATION.MULTI_SELECT_FIELD.ID_FIELD_LABEL_PICUS_MELIES,
					LOCALIZATION.CONFIRM_FIELD.ID_FIELD_LABEL_PICUS_MELIES
				];

				for (const fieldId of fieldIds) {
					describe(`${fieldTypeFromIdString(fieldId)} control`, () => {
						it("has label from form model", () => {
							const label = query(inputMap.Input).withProp("uiId", fieldId).props()
								.modelElement.label;
							ok(
								typeof label === "string" && label.startsWith(`FormModelLabel.${locale.language}`)
							);
						});

						it("has hint from form model", () => {
							const input = query(inputMap.Input).withProp("uiId", fieldId).props();
							equal(input.modelElement.hintText, `FormModelHint.${locale.language}`);
						});
					});
				}
			});

			describe("multilingual texts provided by document model and field config", () => {
				const inputMap = {
					...getInputMocks(),
					Input: mock.fn(ControlInputMock)
				};
				const { it } = RenderGroupFixture(() => setup(locale, undefined, inputMap));
				const fieldIds = [
					LOCALIZATION.STRING_FIELD.ID_FIELD_LABEL_PICUS_FIELD_CONFIG,
					LOCALIZATION.NUMBER_FIELD.ID_FIELD_LABEL_PICUS_FIELD_CONFIG,
					LOCALIZATION.BOOLEAN_FIELD.ID_FIELD_LABEL_PICUS_FIELD_CONFIG,
					LOCALIZATION.DATE_FIELD.ID_FIELD_LABEL_PICUS_FIELD_CONFIG,
					LOCALIZATION.ENUM_SELECT_FIELD.ID_FIELD_LABEL_PICUS_FIELD_CONFIG,
					LOCALIZATION.ENUM_RADIO_FIELD.ID_FIELD_LABEL_PICUS_FIELD_CONFIG,
					LOCALIZATION.MULTI_SELECT_FIELD.ID_FIELD_LABEL_PICUS_FIELD_CONFIG,
					LOCALIZATION.CONFIRM_FIELD.ID_FIELD_LABEL_PICUS_FIELD_CONFIG
				];

				for (const fieldId of fieldIds) {
					describe(`${fieldTypeFromIdString(fieldId)} control`, () => {
						it("has label from field config", () => {
							const label = query(inputMap.Input).withProp("uiId", fieldId).props()
								.modelElement.label;
							ok(
								typeof label === "string" && label.startsWith(`FieldConfigLabel.${locale.language}`)
							);
						});

						it("has hint from field config", () => {
							const input = query(inputMap.Input).withProp("uiId", fieldId).props();
							equal(input.modelElement.hintText, `FieldConfigHint.${locale.language}`);
						});
					});
				}
			});
		}

		function describeTestsForTitle(locale: TestLocale) {
			describe("titles", () => {
				const { it, render } = RenderGroupFixture(() =>
					setup(locale, undefined, undefined, { Title: mock.fn(DefaultComponentMap.Title) })
				);

				const elementIds = [
					LOCALIZATION.ID_CONTROL_GRID,
					LOCALIZATION.ID_ROW,
					LOCALIZATION.ID_REPEAT_DEFAULT_LABEL,
					LOCALIZATION.ID_INLINE_REPEAT,
					LOCALIZATION.ID_EMBEDDED_REPEAT,
					LOCALIZATION.ID_SECTION,
					LOCALIZATION.ID_COLLAPSIBLE_SECTION,
					LOCALIZATION.ID_MULTI_COLUMN_SECTION
				];

				for (const id of elementIds) {
					describe(`${fieldTypeFromIdString(id)} title`, () => {
						it("has the correct localized text", () => {
							const title = query(render.wrapper.componentMap.Title)
								.withTestId(UiId.generateForTitle({ id }))
								.props();

							equal(title.text, `FormModelLabel.${locale.language}`);
						});
					});
				}
			});
		}

		function describeTestsForTextCell(locale: TestLocale) {
			describe("textCell", () => {
				const { it, render } = RenderGroupFixture(() =>
					setup(locale, undefined, undefined, {
						HtmlTextDiv: mock.fn(DefaultComponentMap.HtmlTextDiv)
					})
				);
				it("has the correct localized text", () => {
					const text = query(render.wrapper.componentMap.HtmlTextDiv)
						.withTestId(`${LOCALIZATION.ID_TEXT_CELL}-htmlTextDiv`)
						.props();
					equal(text.content, `Text.${locale.language}`);
				});
			});
		}

		function describeTestsForNavigationButton(locale: TestLocale) {
			function renderForNavigationButtonTest(): Promise<RtlRenderWrapper> {
				return setup(
					locale,
					{ locationPath: ModelHelpers.createModelPath("Screen2"), path: [] },
					undefined,
					{ HtmlTextSpan: mock.fn(HtmlTextSpanMock) }
				);
			}

			describe("Navigation Buttons", () => {
				const { it, render } = RenderGroupFixture(renderForNavigationButtonTest);

				// button labels are rendered as string
				describe("label for the button given", () => {
					it("has the correct localized label given", () => {
						const button = query(render.wrapper.widgetMap.Button)
							.withId(LOCALIZATION.BUTTONS.ID_BP_BUTTON_WITH_LABEL)
							.props();
						equal(button.label, `Screen1.${locale.language}`);
					});
				});

				// screen labels are rendered as HtmlTextSpan
				describe("no label for the button given", () => {
					describe("target: screen name", () => {
						it("sets the localized title of the screen as the label", () => {
							const label = query(render.wrapper.componentMap.HtmlTextSpan)
								.withTestId(LOCALIZATION.BUTTONS.ID_BP_SCREEN_WITHOUT_LABEL)
								.props();
							equal(label.content, `Screen1.Title.${locale.language}`);
						});
					});

					describe("target: next", () => {
						it("sets the localized title of the next screen as the label", () => {
							const label = query(render.wrapper.componentMap.HtmlTextSpan)
								.withTestId(LOCALIZATION.BUTTONS.ID_BP_NEXT_WITHOUT_LABEL)
								.props();
							equal(label.content, `Screen3.Title.${locale.language}`);
						});
					});

					describe("target: previous", () => {
						it("sets the localized title of the previous screen as the label", () => {
							const label = query(render.wrapper.componentMap.HtmlTextSpan)
								.withTestId(LOCALIZATION.BUTTONS.ID_BP_PREVIOUS_WITHOUT_LABEL)
								.props();
							equal(label.content, `Screen1.Title.${locale.language}`);
						});
					});
				});
			});
		}

		function describeTestsForMenuItem(locale: TestLocale) {
			function renderForMenuItemTest(): Promise<RtlRenderWrapper> {
				return SetupHelpers.setupConnectedFormEngineWithRtlAsync({
					componentMap: { HtmlTextSpan: mock.fn(HtmlTextSpanMock) },
					models: models,
					locale,
					data: {
						document: { root: { repeat: [{ F1: "Dummy", F2: "Dummy" }] } }
					},
					ui: {
						screenLocation: [
							{
								locationPath: ModelHelpers.createModelPath("Screen2"),
								path: []
							}
						]
					}
				});
			}

			const MenuItemWithId = (id: string) => (mi: MenuItemType) => mi.id === id;

			describe("Menu Item", () => {
				const { it, render } = RenderGroupFixture(renderForMenuItemTest);

				// button labels are rendered as string
				describe("label for the button given", () => {
					it("has the correct localized label given", () => {
						const button = query(render.wrapper.widgetMap.FlyoutMenu)
							.props()
							.items.find(MenuItemWithId(LOCALIZATION.BUTTONS.ID_MENU_ITEM_BUTTON_WITH_LABEL));
						equal(button?.label, `Screen1.${locale.language}`);
					});
				});

				// screen labels are rendered as HtmlTextSpan
				describe("no label for the button given", () => {
					describe("target: screen name", () => {
						it("sets the localized title of the screen as the label", () => {
							const label = query(render.wrapper.componentMap.HtmlTextSpan)
								.withTestId(LOCALIZATION.BUTTONS.ID_MENU_ITEM_SCREEN_WITHOUT_LABEL)
								.props();
							equal(label.content, `Screen2.Title.${locale.language}`);
						});
					});

					describe("target: next", () => {
						it("sets the localized title of the next screen as the label", () => {
							const label = query(render.wrapper.componentMap.HtmlTextSpan)
								.withTestId(LOCALIZATION.BUTTONS.ID_MENU_ITEM_NEXT_WITHOUT_LABEL)
								.props();
							equal(label.content, `Screen3.Title.${locale.language}`);
						});
					});

					describe("target: previous", () => {
						it("sets the localized title of the previous screen as the label", () => {
							const label = query(render.wrapper.componentMap.HtmlTextSpan)
								.withTestId(LOCALIZATION.BUTTONS.ID_MENU_ITEM_PREVIOUS_WITHOUT_LABEL)
								.props();
							equal(label.content, `Screen1.Title.${locale.language}`);
						});
					});
				});
			});
		}
	});
});
