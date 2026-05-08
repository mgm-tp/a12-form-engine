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

import { deepStrictEqual, ok, strictEqual } from "node:assert/strict";
import { mock } from "node:test";

import type { Header } from "@com.mgmtp.a12.base/base-model-api/lib/main/header/index.js";
import type {
	Localizable,
	Localizer
} from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import type { EngineState } from "../../../back-end/store/index.js";
import type { FormModel } from "../../../models/index.js";
import type { FormModelMap } from "../../../view/index.js";
import {
	getLabel,
	getSubtitle,
	getTitleLabel
} from "../../../view/internal/components/form-engine/model-element-labels.js";
import { DefaultComponentMap } from "../../../view/internal/configuration/componentMap/DefaultComponentMap.js";
import { US_LOCALE } from "../../utils/localization.js";
import { setupModelsFixture } from "../../utils/setupFixture.js";

describe("unit.localization.model-element-labels", () => {
	const models = setupModelsFixture("localization");

	const engineState: EngineState = {
		data: { document: {}, dirty: false },
		locale: US_LOCALE,
		models,
		ui: {
			backup: [],
			correctionScreen: { visible: false, showDetailsState: {} },
			dirty: false,
			disabled: false,
			messages: {},
			readonly: false,
			screenLocation: [],
			sectionState: {},
			validationBar: { expanded: false, visible: false, currentMessageKey: undefined }
		}
	};

	const localizerSpy = mock.fn<Localizer>();

	const renderOptions = { state: engineState } as FormModelMap.RenderOptions;

	afterEach(() => {
		localizerSpy.mock.resetCalls();
	});

	describe("getTitleLabel", () => {
		it("passes localizables without defaults to the localizer when given a model element without label texts in the model", () => {
			const titledElement = {
				title: { type: "Multilingual", multilingualText: {} }
			} as FormModel.Screen;

			getTitleLabel(
				renderOptions,
				titledElement,
				[{ elementName: "foo" }, { elementName: "bar" }],
				[],
				localizerSpy,
				{ parseValue: () => ({}), formatValue: () => "" },
				DefaultComponentMap
			);

			strictEqual(localizerSpy.mock.callCount(), 1);

			const localizables = localizerSpy.mock.calls[0].arguments;
			ok(localizables[0].key.endsWith(".title"));
			deepStrictEqual(localizables[0].defaults, {});
		});
	});

	describe("getSubtitle", () => {
		it("passes localizables without defaults to the localizer when given a form model without label texts for the subtitle", () => {
			const formModelContent = {
				subtitle: {
					type: "Multilingual",
					multilingualText: {}
				}
			} as FormModel.Content;

			getSubtitle(
				renderOptions,
				{
					header: {} as Header,
					content: formModelContent
				},
				localizerSpy,
				{ parseValue: () => ({}), formatValue: () => "" },
				DefaultComponentMap
			);

			strictEqual(localizerSpy.mock.callCount(), 1);

			const localizables: Localizable[] = localizerSpy.mock.calls[0].arguments;
			ok(localizables[0].key.endsWith(".subtitle"));
			deepStrictEqual(localizables[0].defaults, {});
		});
	});

	describe("getLabel", () => {
		const emptyLabel: FormModel.Label = {
			type: "Multilingual",
			multilingualText: {}
		};

		const labelElements = [
			{
				name: "button",
				element: () => {
					return {
						buttonStyling: {
							label: emptyLabel
						}
					} as FormModel.EventButton;
				}
			},
			{
				name: "row action",
				element: () => {
					return { buttonStyling: { label: emptyLabel } } as FormModel.RowAction;
				}
			},
			{
				name: "control",
				element: () => {
					return { label: emptyLabel } as FormModel.Control;
				}
			},
			{
				name: "expression cell",
				element: () => {
					return { label: emptyLabel } as FormModel.ExpressionCell;
				}
			},
			{
				name: "expression column",
				element: () => {
					return { label: emptyLabel } as FormModel.ExpressionOverviewColumn;
				}
			},
			{
				name: "field column",
				element: () => {
					return { label: emptyLabel } as FormModel.FieldOverviewColumn;
				}
			}
		];

		labelElements.forEach(({ name, element }) => {
			it(`passes localizables without defaults to the localizer when given a ${name} without label texts`, () => {
				getLabel({
					options: renderOptions,
					element: element(),
					formModelPath: [{ elementName: "foo" }, { elementName: "bar" }],
					dataContext: [],
					localizer: localizerSpy,
					converter: { parseValue: () => ({}), formatValue: () => "" }
				});

				strictEqual(localizerSpy.mock.callCount(), 1);

				const localizables: Localizable[] = localizerSpy.mock.calls[0].arguments;
				ok(localizables[0].key.endsWith(".label"));
				deepStrictEqual(localizables[0].defaults, {});
			});
		});
	});
});
