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

import { equal } from "node:assert/strict";

import { query, within } from "@com.mgmtp.a12.devtools/react";

import { BULLET_LIST_ITEM } from "../../../../../rtl-utils/data-roles.js";
import { SetupHelpers } from "../../../../../utils/setup.js";
import { setupModelsFixture } from "../../../../../utils/setupFixture.js";
import { DEP_ELEMENT } from "../../../../../utils/test-model-helpers/dependent-element.js";
import { createModelPath } from "../../../../../utils/test-model-helpers/dependent-enumeration.js";
import { IR } from "../../../../../utils/test-model-helpers/inline.repeat.js";
import { IDS } from "../../../../../utils/test-model-helpers/readonly-presentation.js";
import { renderWithInputMocks } from "../../../../../utils/test-model-helpers/render-with-inputmocks.js";
import { createDocumentForRepeat } from "../../../../../utils/test-model-helpers/repeat.js";
import { executeReadonlyPropTest } from "../../control/executeReadonlyPropTest.js";

const { loadData } = SetupHelpers;

export function executeTestForFieldOverviewColumnReadOnly(): void {
	const dependentElementModels = setupModelsFixture("dependencies.element");
	const computationModels = setupModelsFixture("computation-validation.computation");
	const inlineRepeatModels = setupModelsFixture("repeat", "inline");
	const readonlyPresentationModels = setupModelsFixture(
		"enablement.readonly",
		"readonly-presentation"
	);

	it("renders a component with prop 'readonly=true' if the related field is computed", async () => {
		const wrapper = await renderWithInputMocks({
			models: computationModels,
			data: {
				document: {
					root: {
						NonRep: {},
						Rep: [
							{
								FieldA: 1,
								FieldB: 2,
								FieldC: 3
							}
						],
						FieldD: 3
					}
				}
			}
		});

		const input = query(wrapper.inputMap.NumberInput)
			.withProp("uiId", "a12-fieldbasedrepeatoverviewcolumn-070fa-cell-0")
			.props();
		equal(input.modelElement.readonly, true);
	});

	it("renders a component with prop 'readonly=true' if the parent repeat is read-only", async () => {
		const document = loadData("repeat", "data", inlineRepeatModels.documentModel);
		const wrapper = await renderWithInputMocks({
			models: inlineRepeatModels,
			data: { document }
		});

		const input = query(wrapper.inputMap.StringInput)
			.withProp("uiId", IR.SortingAndFiltering.ID_L1_STRING_READONLY)
			.props();
		equal(input.modelElement.readonly, true);
	});

	it("renders a component with prop 'readonly=true' if the column is readonly", async () => {
		const document = loadData("repeat", "data", inlineRepeatModels.documentModel);
		const wrapper = await renderWithInputMocks({
			models: inlineRepeatModels,
			data: { document },
			ui: {
				screenLocation: [{ locationPath: createModelPath(IR.ColumnProperties.screen), path: [] }]
			}
		});

		const input = query(wrapper.inputMap.StringInput)
			.withProp("uiId", IR.ColumnProperties.ID_L1_STRING_READONLY)
			.props();
		equal(input.modelElement.readonly, true);
	});

	describe("readonly presentation", () => {
		describe("Given a column which does not reference an attachment", () => {
			it("renders a normal Input if the column is read-only and the readonly presentation is not defined", async () => {
				const document = loadData("repeat", "data", inlineRepeatModels.documentModel);
				const wrapper = await renderWithInputMocks({
					models: inlineRepeatModels,
					data: { document },
					ui: { readonly: true }
				});

				query(wrapper.inputMap.StringInput)
					.withProp("uiId", IR.SortingAndFiltering.ID_L1_STRING_READONLY)
					.assertRendered();
			});

			it("renders a TextOutput if the column is read-only and the readonly presentation of the column is 'TEXT'", async () => {
				const document = { rootGroup: { repeatableGroup: [{}] } };
				const wrapper = await renderWithInputMocks({
					models: readonlyPresentationModels,
					data: { document },
					ui: { readonly: true }
				});

				query(wrapper.widgetMap.TextOutput)
					.withProp("id", IDS.STRING_TO_RO_PRESENTATION)
					.assertRendered();
			});

			it("renders a normal Input if the column is read-only and the readonly presentation is 'INPUT'", async () => {
				const document = { rootGroup: { repeatableGroup: [{}] } };
				const wrapper = await renderWithInputMocks({
					models: readonlyPresentationModels,
					data: { document },
					ui: { readonly: true }
				});

				query(wrapper.inputMap.StringInput)
					.withProp("uiId", IDS.STRING_INPUT_RO_PRESENTATION)
					.assertRendered();
			});
		});

		describe("Given a column which references an attachment", () => {
			it("renders a normal Input if the column is read-only and the readonly presentation is 'TEXT'", async () => {
				const document = { rootGroup: { repeatableGroup: [{}] } };
				const wrapper = await renderWithInputMocks({
					models: readonlyPresentationModels,
					data: { document },
					ui: { readonly: true }
				});

				query(wrapper.inputMap.AttachmentInput)
					.withProp("uiId", IDS.ATTACHMENT_TO_RO_PRESENTATION)
					.assertRendered();
			});
		});

		describe("Given a column which references a multi-select", () => {
			describe("and showCommaSeparated is false", () => {
				it("renders a TextOutput with a bullet list", async () => {
					const document = createDocumentForRepeat({
						nestedL1: [{ L1_MultiSelect: [{ value: "V1" }, { value: "V2" }] }]
					});
					const wrapper = await renderWithInputMocks({
						models: inlineRepeatModels,
						data: { document },
						ui: { readonly: true }
					});

					const input = within(wrapper.baseElement).getById(
						IR.General.ID_L1_MULTI_SELECT_READONLY_BULLET
					);
					const listItems = within(input).getAllByDataRole(BULLET_LIST_ITEM);

					equal(listItems.length, 2, "Expected to find two list entries");
				});
			});

			describe("and showCommaSeparated is true", () => {
				it("renders a TextOutput with a comma separated list", async () => {
					const document = createDocumentForRepeat({
						nestedL1: [{ L1_MultiSelect: [{ value: "V1" }, { value: "V2" }] }]
					});
					const wrapper = await renderWithInputMocks({
						models: inlineRepeatModels,
						data: { document },
						ui: { readonly: true }
					});

					const input = query(wrapper.widgetMap.TextOutput)
						.withProp("id", IR.General.ID_L1_MULTI_SELECT_READONLY_COMMA)
						.props();

					equal(input.children, "Value 1, Value 2");
				});
			});
		});
	});

	describe("by dependencies", () => {
		describe("Master field inside repeatable group", () => {
			it("renders a component with prop 'readonly=true' if a field dependencies with case readonly applies", async () => {
				await executeReadonlyPropTest({
					models: dependentElementModels,
					path: DEP_ELEMENT.pathToDepRepeatMasterField,
					value: "Readonly",
					shouldBeReadonly: true,
					componentId: DEP_ELEMENT.ENUMERATION.ID_IR_DEP_FIELD_MASTER_OUTSIDE,
					document: DEP_ELEMENT.createDocument()
				});
			});
		});

		describe("Master field outside repeatable group", () => {
			it("renders a component with prop 'readonly=true' if a group dependencies with case readonly applies", async () => {
				await executeReadonlyPropTest({
					models: dependentElementModels,
					path: DEP_ELEMENT.pathToRepeatGroupMasterField,
					value: "1",
					shouldBeReadonly: true,
					componentId: DEP_ELEMENT.ENUMERATION.ID_IR_DEP_FIELD,
					document: DEP_ELEMENT.createDocument()
				});
			});
		});
	});
}
