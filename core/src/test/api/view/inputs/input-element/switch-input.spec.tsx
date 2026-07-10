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

import { deepStrictEqual, equal } from "node:assert/strict";
import type { Mock } from "node:test";
import { mock } from "node:test";

import { query } from "@com.mgmtp.a12.devtools/react";
import type { DocumentModel, EntityInstancePath } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import { defaultLocalizerFactory, Locale } from "@com.mgmtp.a12.utils/utils-localization";

import type { FormModel } from "../../../../../models/index.js";
import type { DispatchConfiguration } from "../../../../../view/index.js";
import { defaultMapDispatchToProps } from "../../../../../view/index.js";
import { SwitchInput } from "../../../../../view/internal/components/form-engine/cells/controls/boolean/switch-input.js";
import type { Inputs } from "../../../../../view/internal/configuration/engine-configuration.js";
import { changeEventMock, isReactElement } from "../../../../rtl-utils/mock-utils.js";
import type { RtlRenderWrapper } from "../../../../rtl-utils/render-wrapper.js";
import { rtlRenderWrapperAsync } from "../../../../rtl-utils/render-wrapper.js";
import { createDocumentPath } from "../../../../utils/createDocumentPath.js";
import { createModelPath } from "../../../../utils/createModelPath.js";
import { DocumentModelHelpers } from "../../../../utils/DocumentModelHelpers.js";
import { setupModelsFixture } from "../../../../utils/setupFixture.js";

import { inputTest } from "./generic-tests/input-tests.js";
import { createProps } from "./generic-tests/input-utils.js";

const { Field } = DocumentModelHelpers;

describe("api.view.inputs", () => {
	describe("Switch", () => {
		const models = setupModelsFixture("controls.dmtypes");

		const documentElementDataType: DocumentModel.BooleanType = { type: "BooleanType" };
		const baseProps = {
			documentElement: Field({ fieldType: documentElementDataType }),
			documentElementDataType,
			component: "Switch",
			renderFunction: SwitchInput,
			path: createDocumentPath(["A12T_DmTypes"], ["Boolean"], ["Boolean03"]),
			formModelPath: createModelPath("foo", "bar")
		} as const;

		/** General test which are similar for all inputs */
		describe("General", () => {
			inputTest(
				() => models,
				baseProps,

				{
					autoCompleteTest: false,
					placeholderTest: false
				}
			);
		});

		describe("onChange", () => {
			const path = createDocumentPath(["A12T_DmTypes"], ["Boolean"], ["Boolean03"]);

			interface MockDispatchConfig extends DispatchConfiguration {
				onValueChange: Mock<DispatchConfiguration["onValueChange"]>;
				onParseError: Mock<DispatchConfiguration["onParseError"]>;
			}

			async function setup(value?: {
				data: string | number | boolean | Date | null | object;
				ui: string;
			}): Promise<{ wrapper: RtlRenderWrapper; dispatchConfig: MockDispatchConfig }> {
				const stubbedDispatch = defaultMapDispatchToProps(mock.fn());
				const dispatchConfig = {
					...stubbedDispatch.eventHandlers,
					onValueChange: mock.fn(),
					onParseError: mock.fn()
				};

				const props: Inputs.InputProps<DocumentModel.BooleanType> = createProps({
					...baseProps,
					models: models,
					path: path,
					modelElement: {},
					dispatchConfig,
					value: value ? { ...value, path } : undefined
				});
				const Component = baseProps.renderFunction;
				const wrapper = await rtlRenderWrapperAsync(<Component {...props} />);

				return { wrapper, dispatchConfig };
			}

			it("calls onValueChange with the changed data (true -> false)", async () => {
				const { wrapper, dispatchConfig } = await setup();
				const input = query(wrapper.widgetMap.Switch).props();
				input.onChange(false, changeEventMock);

				equal(
					dispatchConfig.onValueChange.mock.callCount(),
					1,
					`Dispatch function was called ${dispatchConfig.onValueChange.mock.callCount()} time(s). Expected call count: ${1}`
				);

				deepStrictEqual(dispatchConfig.onValueChange.mock.calls[0].arguments, [
					path,
					false,
					baseProps.formModelPath
				]);
			});

			it("calls onValueChange with the changed data (false -> true)", async () => {
				const { wrapper, dispatchConfig } = await setup({ data: false, ui: "false" });
				const input = query(wrapper.widgetMap.Switch).props();
				input.onChange(true, changeEventMock);

				deepStrictEqual(dispatchConfig.onValueChange.mock.calls[0].arguments, [
					path,
					true,
					baseProps.formModelPath
				]);
			});
		});

		describe("exposition", () => {
			function setup(
				path: EntityInstancePath,
				exposition: FormModel.ExpositionPresentation
			): Promise<RtlRenderWrapper> {
				const props: Inputs.InputProps<DocumentModel.BooleanType> = createProps({
					...baseProps,
					models: models,
					path: path,
					modelElement: { exposition },
					value: {
						data: false,
						ui: "false",
						path
					}
				});
				const Component = baseProps.renderFunction;
				return rtlRenderWrapperAsync(<Component {...props} />);
			}

			describe("'switch'", () => {
				it("renders a Switch without displaying the options", async () => {
					const wrapper = await setup(
						createDocumentPath(["A12T_DmTypes"], ["Boolean"], ["Boolean03"]),
						"SWITCH"
					);
					const input = query(wrapper.widgetMap.Switch).props();
					equal(input.checkedOption, undefined);
					equal(input.uncheckedOption, undefined);
				});
			});

			describe("'switch-with-values'", () => {
				it("renders a Switch which also displays the option", async () => {
					const wrapper = await setup(
						createDocumentPath(["A12T_DmTypes"], ["Boolean"], ["Boolean04"]),
						"SWITCH_WITH_VALUES"
					);
					const input = query(wrapper.widgetMap.Switch).props();
					equal(input.checkedOption, "yes");
					equal(input.uncheckedOption, "no");
				});
			});
		});

		describe("icon", () => {
			it("renders the custom icon when checked", async () => {
				const path = createDocumentPath(["A12T_DmTypes"], ["Boolean"], ["Boolean03"]);
				const props: Inputs.InputProps<DocumentModel.BooleanType> = createProps({
					...baseProps,
					models,
					path,
					modelElement: { icon: { name: "star" } },
					value: { data: true, ui: "true", path }
				});
				const Component = baseProps.renderFunction;
				const wrapper = await rtlRenderWrapperAsync(<Component {...props} />);
				const input = query(wrapper.widgetMap.Switch).props();
				const iconProps = isReactElement(input.checkedIcon) ? input.checkedIcon.props : undefined;
				equal(iconProps?.children, "star");
			});
		});

		describe("localization", () => {
			function setup(locale: Locale): Promise<RtlRenderWrapper> {
				const path = createDocumentPath(["A12T_DmTypes"], ["Boolean"], ["Boolean04"]);

				const props: Inputs.InputProps<DocumentModel.BooleanType> = createProps({
					...baseProps,
					models: models,
					path,
					modelElement: { exposition: "SWITCH_WITH_VALUES" },
					value: { data: false, ui: "false", path },
					locale
				});
				const Component = baseProps.renderFunction;
				return rtlRenderWrapperAsync(<Component {...props} />, {
					localizer: defaultLocalizerFactory({ locale })
				});
			}

			function checkLocalizationOfOptionLabels(
				locale: string,
				checkedLabel: string,
				uncheckedLabel: string
			): void {
				describe(`locale=${locale}`, () => {
					it(`renders a Switch with the option labels '${checkedLabel}' and '${uncheckedLabel}'`, async () => {
						const wrapper = await setup(Locale.fromString(locale) as Locale);
						const input = query(wrapper.widgetMap.Switch).props();
						equal(input.checkedOption, checkedLabel);
						equal(input.uncheckedOption, uncheckedLabel);
					});
				});
			}

			checkLocalizationOfOptionLabels("en_US", "yes", "no");
			checkLocalizationOfOptionLabels("de_DE", "ja", "nein");
		});
	});
});
