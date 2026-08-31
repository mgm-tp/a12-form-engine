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

import { deepStrictEqual, strictEqual } from "node:assert/strict";
import type { Mock } from "node:test";
import { mock } from "node:test";

import { query } from "@com.mgmtp.a12.devtools/react";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade";
import type { Locale, Localizer } from "@com.mgmtp.a12.utils/utils-localization";
import { defaultLocalizerFactory } from "@com.mgmtp.a12.utils/utils-localization";

import type { FormModel } from "../../../../../models/index.js";
import type { Config, DispatchConfiguration } from "../../../../../view/index.js";
import { defaultMapDispatchToProps } from "../../../../../view/index.js";
import { DateInput } from "../../../../../view/internal/components/form-engine/cells/controls/date/date-input.js";
import { DateUtils } from "../../../../../view/internal/components/form-engine/cells/controls/date/date-utilities.js";
import { getComponentMocks } from "../../../../rtl-utils/getComponentMocks.js";
import type { RtlRenderWrapper } from "../../../../rtl-utils/render-wrapper.js";
import { rtlRenderWrapperAsync } from "../../../../rtl-utils/render-wrapper.js";
import { createDocumentPath } from "../../../../utils/createDocumentPath.js";
import { createModelPath } from "../../../../utils/createModelPath.js";
import { DocumentModelHelpers } from "../../../../utils/DocumentModelHelpers.js";
import { DE_LOCALE, US_LOCALE } from "../../../../utils/localization.js";
import { setupModelsFixture } from "../../../../utils/setupFixture.js";
import { setupFormEngineRendererWithRtlAsync } from "../../../../utils/setup.js";

import { inputTest } from "./generic-tests/input-tests.js";
import { createProps } from "./generic-tests/input-utils.js";

const { Field } = DocumentModelHelpers;
describe("api.view.inputs", () => {
	describe("DateInput", () => {
		const models = setupModelsFixture("controls.dmtypes");
		const timeZoneModels = setupModelsFixture("controls.date-timezone");

		const baseProps = {
			formModelPath: createModelPath("foo", "bar")
		};

		const datePath = createDocumentPath(["A12T_DmTypes"], ["DateAndDateTime"], ["Date01"]);
		const datePathTimeZone = createDocumentPath(["root"], ["Date01"]);

		const datePickerConfig: FormModel.DatePickerConfig = {
			absolute: true,
			maxYear: 2020,
			minYear: 2010,
			preselectionYear: 0
		};

		function getBaseProps() {
			const documentElementDataType: DocumentModel.DateType = {
				type: "DateType",
				format: "yyyy-MM-dd"
			};

			return {
				...baseProps,
				documentElement: Field({ fieldType: documentElementDataType }),
				documentElementDataType,
				component: "TextField",
				renderFunction: DateInput
			};
		}

		interface MockDispatchConfig extends DispatchConfiguration {
			onValueChange: Mock<DispatchConfiguration["onValueChange"]>;
			onParseError: Mock<DispatchConfiguration["onParseError"]>;
		}

		async function setup(options: {
			customProps?: Partial<{ locale: Locale; config: Partial<Config> }>;
			localizer?: Localizer;
			timeZone?: "UTC" | "Europe/Berlin";
		}): Promise<{ wrapper: RtlRenderWrapper; dispatchConfig: MockDispatchConfig }> {
			const { customProps, localizer, timeZone } = options;
			const baseProps = getBaseProps();
			const value = {
				data: new Date(2020, 10, 20),
				ui: "2020-10-20",
				path: timeZone === "Europe/Berlin" ? datePathTimeZone : datePath
			};

			const stubbedDispatch = defaultMapDispatchToProps(mock.fn());
			const dispatchConfig = {
				...stubbedDispatch.eventHandlers,
				onValueChange: mock.fn(),
				onParseError: mock.fn()
			};

			const props = createProps({
				...baseProps,
				models: timeZone === "Europe/Berlin" ? timeZoneModels : models,
				path: timeZone === "Europe/Berlin" ? datePathTimeZone : datePath,
				modelElement: { datePickerConfig, timeZone: timeZone ?? "UTC" },
				dispatchConfig,
				value,
				...customProps
			});
			const Component = baseProps.renderFunction;
			const wrapper = await rtlRenderWrapperAsync(<Component {...props} />, {
				componentMap: getComponentMocks(),
				localizer
			});

			return { wrapper, dispatchConfig };
		}

		/** General test which are similar for all inputs */
		describe("General", () => {
			inputTest(
				() => models,
				{
					...getBaseProps(),
					component: "TextField",
					path: createDocumentPath(["A12T_DmTypes"], ["DateAndDateTime"], ["Date01"]),
					placeholder: true
				},
				{ autoCompleteTest: false }
			);
		});

		describe("onValueSubmit", () => {
			describe("if the input is valid", () => {
				describe("and the model element contains timeZone === 'UTC'", () => {
					it("calls onValueChange with the correct arguments from the dispatch configuration", async () => {
						const { wrapper, dispatchConfig } = await setup({});
						const input = query(wrapper.componentMap.DateTextLine).props();
						input.onValueSubmit("10/10/2019");

						strictEqual(
							dispatchConfig.onValueChange.mock.callCount(),
							1,
							`Dispatch function was called ${dispatchConfig.onValueChange.mock.callCount()} time(s). Expected call count: ${1}`
						);

						deepStrictEqual(dispatchConfig.onValueChange.mock.calls[0].arguments, [
							datePath,
							new Date("2019-10-10"),
							baseProps.formModelPath
						]);
					});

					it("strips leading and tailing spaces", async () => {
						const { wrapper, dispatchConfig } = await setup({});
						const input = query(wrapper.componentMap.DateTextLine).props();
						input.onValueSubmit("   10/10/2019   ");

						deepStrictEqual(dispatchConfig.onValueChange.mock.calls[0].arguments, [
							datePath,
							new Date("2019-10-10"),
							baseProps.formModelPath
						]);
					});
				});

				describe("and the model element contains timeZone === 'Europe/Berlin'", () => {
					it("calls onValueChange with the correct arguments from the dispatch configuration", async () => {
						const { wrapper, dispatchConfig } = await setup({ timeZone: "Europe/Berlin" });
						const input = query(wrapper.componentMap.DateTextLine).props();
						input.onValueSubmit("10/10/2019");

						strictEqual(
							dispatchConfig.onValueChange.mock.callCount(),
							1,
							`Dispatch function was called ${dispatchConfig.onValueChange.mock.callCount()} time(s). Expected call count: ${1}`
						);

						deepStrictEqual(dispatchConfig.onValueChange.mock.calls[0].arguments, [
							datePathTimeZone,
							new Date("2019-10-09T22:00:00.000Z"),
							baseProps.formModelPath
						]);
					});

					it("strips leading and tailing spaces", async () => {
						const { wrapper, dispatchConfig } = await setup({ timeZone: "Europe/Berlin" });
						const input = query(wrapper.componentMap.DateTextLine).props();
						input.onValueSubmit("   10/10/2019   ");

						deepStrictEqual(dispatchConfig.onValueChange.mock.calls[0].arguments, [
							datePathTimeZone,
							new Date("2019-10-09T22:00:00.000Z"),
							baseProps.formModelPath
						]);
					});
				});
			});

			describe("if the input is invalid", () => {
				it("calls onParseError with the correct arguments from the dispatch configuration", async () => {
					const { wrapper, dispatchConfig } = await setup({});
					const input = query(wrapper.componentMap.DateTextLine).props();
					input.onValueSubmit("abc");

					const expectedParseError = {
						errorCode: "datumFormatFalsch",
						errorKey: "kernel.formalErrors.DATUM_FORMAT",
						errorText: {
							key: "kernel.formalErrors.DATUM_FORMAT",
							args: {
								dateFormat: {
									properties: {
										type: "date"
									},
									type: "dataFormat",
									value: "MM/dd/yyyy"
								}
							},
							defaults: {
								de: "Es sind nur Daten im Format $dateFormat$ erlaubt.",
								en: "Only dates in the format '$dateFormat$' are allowed.",
								fr: "Seules les dates au format '$dateFormat$' sont autorisées.",
								nl: "De datum dient in het formaat '$dateFormat$' te staan."
							}
						},
						severity: "ERROR"
					};

					strictEqual(
						dispatchConfig.onParseError.mock.callCount(),
						1,
						`Dispatch function was called ${dispatchConfig.onParseError.mock.callCount()} time(s). Expected call count: ${1}`
					);

					deepStrictEqual(dispatchConfig.onParseError.mock.calls[0].arguments, [
						datePath,
						"abc",
						expectedParseError,
						baseProps.formModelPath
					]);
				});
			});
		});

		describe("Localization", () => {
			describe("default resources", () => {
				describe("en", () => {
					it("gives the correct localized ok label to the `DateTextLine`", async () => {
						const locale = US_LOCALE;
						const { wrapper } = await setup({
							customProps: { locale },
							localizer: defaultLocalizerFactory({ locale })
						});
						const dateControl = query(wrapper.componentMap.DateTextLine).props();

						strictEqual(dateControl.okLabel, "OK");
					});
				});

				describe("de", () => {
					it("gives the correct localized ok label to the `DateTextLine`", async () => {
						const { wrapper } = await setup({ customProps: { locale: DE_LOCALE } });
						const dateControl = query(wrapper.componentMap.DateTextLine).props();

						strictEqual(dateControl.okLabel, "OK");
					});
				});
			});

			it("uses the localizer service to localize the labels", async () => {
				const localizer: Localizer = () => "MY_RESOURCE_OK";
				const { wrapper } = await setup({ localizer });
				const dateControl = query(wrapper.componentMap.DateTextLine).props();

				strictEqual(dateControl.okLabel, "MY_RESOURCE_OK");
			});
		});

		describe("other props", () => {
			it("gives the data value from the document to the `DateTextLine`", async () => {
				const { wrapper } = await setup({});
				const dateControl = query(wrapper.componentMap.DateTextLine).props();
				deepStrictEqual(dateControl.typedValue, new Date(2020, 10, 20));
			});

			it("gives the ui value from the document to the `DateTextLine`", async () => {
				const { wrapper } = await setup({});
				const dateControl = query(wrapper.componentMap.DateTextLine).props();
				deepStrictEqual(dateControl.value, "2020-10-20");
			});

			it("sets yearRange to the calculated year range from the datePicker config", async () => {
				const stub = mock.method(DateUtils, "calculateYearRange", () => ({
					start: 2020,
					end: 2025
				}));

				const { wrapper } = await setup({});
				const dateControl = query(wrapper.componentMap.DateTextLine).props();
				deepStrictEqual(dateControl.yearRange, { start: 2020, end: 2025 });
				deepStrictEqual(
					stub.mock.calls[0].arguments[0],
					datePickerConfig,
					"Expected that calculateInitialDate is called with datePicker config from the model element"
				);
			});

			it("sets initialDatePickerSelection to the calculated initial date from the datePicker config", async () => {
				const stub = mock.method(DateUtils, "calculateInitialDate", () => initialDate);
				const initialDate = new Date(2020, 10, 20);

				const { wrapper } = await setup({});
				const dateControl = query(wrapper.componentMap.DateTextLine).props();
				deepStrictEqual(dateControl.initialDatePickerSelection, initialDate);
				deepStrictEqual(
					stub.mock.calls[0].arguments[0],
					datePickerConfig,
					"Expected that calculateInitialDate is called with datePicker config from the model element"
				);
			});

			it("sets enableDatePicker=true if disableDatePicker from the config is false", async () => {
				const { wrapper } = await setup({ customProps: { config: { disableDatePicker: false } } });
				const dateControl = query(wrapper.componentMap.DateTextLine).props();
				deepStrictEqual(dateControl.enableDatePicker, true);
			});

			it("sets enableDatePicker=false if disableDatePicker from the config is true", async () => {
				const { wrapper } = await setup({ customProps: { config: { disableDatePicker: true } } });
				const dateControl = query(wrapper.componentMap.DateTextLine).props();
				deepStrictEqual(dateControl.enableDatePicker, false);
			});

			it("sets timeZone to the value from the document model", async () => {
				const wrapper = await setupFormEngineRendererWithRtlAsync({
					componentMap: getComponentMocks(),
					models: timeZoneModels
				});
				const dateControl = query(wrapper.componentMap.DateTextLine).props();
				deepStrictEqual(dateControl.timeZone, "Europe/Berlin");
			});
		});

		// onChange: Tests in test\api\features\dirty-state.spec.ts
	});
});
