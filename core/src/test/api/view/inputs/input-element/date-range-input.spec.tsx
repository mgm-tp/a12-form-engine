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
import type { Config, DispatchConfiguration, Value } from "../../../../../view/index.js";
import { defaultMapDispatchToProps } from "../../../../../view/index.js";
import { DateRangeInput } from "../../../../../view/internal/components/form-engine/cells/controls/date/date-range-input.js";
import { DateUtils } from "../../../../../view/internal/components/form-engine/cells/controls/date/date-utilities.js";
import { getComponentMocks } from "../../../../rtl-utils/getComponentMocks.js";
import type { RtlRenderWrapper } from "../../../../rtl-utils/render-wrapper.js";
import { rtlRenderWrapperAsync } from "../../../../rtl-utils/render-wrapper.js";
import { createModelPath } from "../../../../utils/createModelPath.js";
import { DocumentModelHelpers } from "../../../../utils/DocumentModelHelpers.js";
import { DE_LOCALE, US_LOCALE } from "../../../../utils/localization.js";
import { setupFormEngineRendererWithRtlAsync } from "../../../../utils/setup.js";
import { setupModelsFixture } from "../../../../utils/setupFixture.js";
import { createDocumentPath } from "../../../../utils/createDocumentPath.js";

import { inputTest } from "./generic-tests/input-tests.js";
import { createProps } from "./generic-tests/input-utils.js";

const { Field } = DocumentModelHelpers;
describe("api.view.inputs", () => {
	describe("DateRangeInput", () => {
		const models = setupModelsFixture("controls.datecontrol-options");
		const timeZoneModels = setupModelsFixture("controls.date-timezone");

		const baseProps = {
			formModelPath: createModelPath("foo", "bar")
		};

		const dateRangePathFullDate = createDocumentPath(["DateRanges"], ["dateRangeFieldyyyyMMdd"]);

		const dateRangePathOnlyYear = createDocumentPath(["DateRanges"], ["dateRangeFieldyyyy"]);

		const dateRangePathFullDateTimeZone = createDocumentPath(["root"], ["DateRange01"]);

		const datePickerConfig: FormModel.DatePickerConfig = {
			absolute: true,
			maxYear: 2020,
			minYear: 2010,
			preselectionYear: 0
		};

		function getBaseProps(dataType?: DocumentModel.DateRangeType) {
			const documentElementDataType: DocumentModel.DateRangeType = dataType ?? {
				type: "DateRangeType",
				format: "yyyy-MM-dd",
				rangeSeparator: "/"
			};

			return {
				...baseProps,
				documentElement: Field({ fieldType: documentElementDataType }),
				documentElementDataType,
				component: "TextField",
				renderFunction: DateRangeInput
			};
		}

		interface MockDispatchConfig extends DispatchConfiguration {
			onValueChange: Mock<DispatchConfiguration["onValueChange"]>;
			onParseError: Mock<DispatchConfiguration["onParseError"]>;
		}

		async function setup(options: {
			customProps?: Partial<{
				locale: Locale;
				config: Partial<Config>;
				dataType: DocumentModel.DateRangeType;
				value: Value;
			}>;
			localizer?: Localizer;
			timeZone?: "UTC" | "Europe/Berlin";
		}): Promise<{ wrapper: RtlRenderWrapper; dispatchConfig: MockDispatchConfig }> {
			const { customProps, timeZone } = options;
			const baseProps = getBaseProps(customProps?.dataType);

			const path = customProps?.value?.path
				? customProps?.value?.path
				: timeZone === "Europe/Berlin"
					? dateRangePathFullDateTimeZone
					: dateRangePathFullDate;

			const value = customProps?.value ?? {
				data: [new Date(2020, 10, 20), new Date(2020, 10, 25)],
				ui: "10/20/2020-10/25/2020",
				path
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
				path: path,
				modelElement: { datePickerConfig, timeZone: timeZone ?? "UTC" },
				dispatchConfig,
				value,
				...customProps
			});
			const Component = baseProps.renderFunction;

			const localizer =
				options.localizer ??
				(customProps?.locale ? defaultLocalizerFactory({ locale: customProps.locale }) : undefined);

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
					path: createDocumentPath(["DateRanges"], ["dateRangeFieldyyyyMMdd"]),
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
						const input = query(wrapper.componentMap.DateRangeTextLine).props();
						input.onValueSubmit("10/10/2019-10/15/2019");

						strictEqual(
							dispatchConfig.onValueChange.mock.callCount(),
							1,
							`Dispatch function was called ${dispatchConfig.onValueChange.mock.callCount()} time(s). Expected call count: ${1}`
						);

						deepStrictEqual(dispatchConfig.onValueChange.mock.calls[0].arguments, [
							dateRangePathFullDate,
							[new Date("2019-10-10"), new Date("2019-10-15")],
							baseProps.formModelPath
						]);
					});

					it("strips leading and tailing spaces", async () => {
						const { wrapper, dispatchConfig } = await setup({});
						const input = query(wrapper.componentMap.DateRangeTextLine).props();
						input.onValueSubmit("   10/10/2019-10/15/2019   ");

						deepStrictEqual(dispatchConfig.onValueChange.mock.calls[0].arguments, [
							dateRangePathFullDate,
							[new Date("2019-10-10"), new Date("2019-10-15")],
							baseProps.formModelPath
						]);
					});
				});

				describe("and the model element contains timeZone === 'Europe/Berlin'", () => {
					it("calls onValueChange with the correct arguments from the dispatch configuration", async () => {
						const { wrapper, dispatchConfig } = await setup({ timeZone: "Europe/Berlin" });
						const input = query(wrapper.componentMap.DateRangeTextLine).props();
						input.onValueSubmit("10/10/2019-10/15/2019");

						strictEqual(
							dispatchConfig.onValueChange.mock.callCount(),
							1,
							`Dispatch function was called ${dispatchConfig.onValueChange.mock.callCount()} time(s). Expected call count: ${1}`
						);

						deepStrictEqual(dispatchConfig.onValueChange.mock.calls[0].arguments, [
							dateRangePathFullDateTimeZone,
							[new Date("2019-10-09T22:00:00.000Z"), new Date("2019-10-14T22:00:00.000Z")],
							baseProps.formModelPath
						]);
					});

					it("strips leading and tailing spaces", async () => {
						const { wrapper, dispatchConfig } = await setup({ timeZone: "Europe/Berlin" });
						const input = query(wrapper.componentMap.DateRangeTextLine).props();
						input.onValueSubmit("   10/10/2019-10/15/2019   ");

						deepStrictEqual(dispatchConfig.onValueChange.mock.calls[0].arguments, [
							dateRangePathFullDateTimeZone,
							[new Date("2019-10-09T22:00:00.000Z"), new Date("2019-10-14T22:00:00.000Z")],
							baseProps.formModelPath
						]);
					});
				});
			});

			describe("if the input is invalid", () => {
				it("calls onParseError with the correct arguments from the dispatch configuration", async () => {
					const { wrapper, dispatchConfig } = await setup({});
					const input = query(wrapper.componentMap.DateRangeTextLine).props();
					input.onValueSubmit("abc-abc");

					const expectedParseError = {
						errorCode: "datumBereichFormatFalsch",
						errorKey: "kernel.formalErrors.DATUM_BEREICH_FORMAT",
						errorText: {
							args: {
								timeIntervalFormat: {
									properties: {
										type: "dateRange"
									},
									type: "dataFormat",
									value: {
										dateFormat: "MM/dd/yyyy",
										dateRangeSeparator: "-"
									}
								}
							},
							defaults: {
								de: "Es sind nur Datumsbereiche vom Format $timeIntervalFormat$ erlaubt.",
								en: "Only date ranges of the format $timeIntervalFormat$ are allowed.",
								fr: "Seules les plages de dates au format $timeIntervalFormat$ sont autorisées.",
								nl: "Alleen datumbereiken van het formaat $timeIntervalFormat$ zijn toegestaan."
							},
							key: "kernel.formalErrors.DATUM_BEREICH_FORMAT"
						},
						severity: "ERROR"
					};

					strictEqual(
						dispatchConfig.onParseError.mock.callCount(),
						1,
						`Dispatch function was called ${dispatchConfig.onParseError.mock.callCount()} time(s). Expected call count: ${1}`
					);

					deepStrictEqual(dispatchConfig.onParseError.mock.calls[0].arguments, [
						dateRangePathFullDate,
						"abc-abc",
						expectedParseError,
						baseProps.formModelPath
					]);
				});
			});
		});

		describe("Localization", () => {
			describe("default resources", () => {
				describe("en", () => {
					it("gives the correct localized open label to the `DateRangeTextLine`", async () => {
						const { wrapper } = await setup({ customProps: { locale: US_LOCALE } });
						const dateRangeControl = query(wrapper.componentMap.DateRangeTextLine).props();

						strictEqual(dateRangeControl.openPickerLabel, "Select date range");
					});

					it("gives the correct localized ok label to the `DateRangeTextLine`", async () => {
						const { wrapper } = await setup({ customProps: { locale: US_LOCALE } });
						const dateRangeControl = query(wrapper.componentMap.DateRangeTextLine).props();

						strictEqual(dateRangeControl.okLabel, "OK");
					});

					it("gives the correct localized clear label to the `DateRangeTextLine`", async () => {
						const { wrapper } = await setup({ customProps: { locale: US_LOCALE } });
						const dateRangeControl = query(wrapper.componentMap.DateRangeTextLine).props();

						strictEqual(dateRangeControl.clearLabel, "Clear");
					});
				});

				describe("de", () => {
					it("gives the correct localized open label to the `DateRangeTextLine`", async () => {
						const { wrapper } = await setup({ customProps: { locale: DE_LOCALE } });
						const dateRangeControl = query(wrapper.componentMap.DateRangeTextLine).props();

						strictEqual(dateRangeControl.openPickerLabel, "Datumsbereich wählen");
					});

					it("gives the correct localized ok label to the `DateRangeTextLine`", async () => {
						const { wrapper } = await setup({ customProps: { locale: DE_LOCALE } });
						const dateRangeControl = query(wrapper.componentMap.DateRangeTextLine).props();

						strictEqual(dateRangeControl.okLabel, "OK");
					});

					it("gives the correct localized clear label to the `DateRangeTextLine`", async () => {
						const { wrapper } = await setup({ customProps: { locale: DE_LOCALE } });
						const dateRangeControl = query(wrapper.componentMap.DateRangeTextLine).props();

						strictEqual(dateRangeControl.clearLabel, "Löschen");
					});
				});
			});

			it("uses the localizer service to localize the labels", async () => {
				const localizer: Localizer = () => "MY_RESOURCE_OK";

				const { wrapper } = await setup({ localizer });
				const dateRangeControl = query(wrapper.componentMap.DateRangeTextLine).props();

				strictEqual(dateRangeControl.okLabel, "MY_RESOURCE_OK");
			});
		});

		describe("other props", () => {
			it("gives the data value from the document to the `DateRangeTextLine`", async () => {
				const { wrapper } = await setup({});
				const dateRangeControl = query(wrapper.componentMap.DateRangeTextLine).props();

				deepStrictEqual(dateRangeControl.typedValue, {
					from: new Date(2020, 10, 20),
					to: new Date(2020, 10, 25)
				});
			});

			it("gives the ui value from the document to the `DateRangeTextLine`", async () => {
				const { wrapper } = await setup({});
				const dateRangeControl = query(wrapper.componentMap.DateRangeTextLine).props();

				deepStrictEqual(dateRangeControl.value, "10/20/2020-10/25/2020");
			});

			it("sets yearRange to the calculated year range from the datePicker config", async () => {
				const stub = mock.method(DateUtils, "calculateYearRange", () => ({
					start: 2020,
					end: 2025
				}));

				const { wrapper } = await setup({});
				const dateRangeControl = query(wrapper.componentMap.DateRangeTextLine).props();

				deepStrictEqual(dateRangeControl.yearRange, { start: 2020, end: 2025 });
				deepStrictEqual(
					stub.mock.calls[0].arguments[0],
					datePickerConfig,
					"Expected that calculateInitialDate is called with datePicker config from the model element"
				);
			});

			it("sets initialDatePickerSelection to the calculated initial date from the datePicker config", async () => {
				const stub = mock.method(DateUtils, "calculateInitialDateRange", () => initialDateRange);
				const initialDateRange = { from: new Date(2020, 10, 20), to: undefined };

				const { wrapper } = await setup({});
				const dateRangeControl = query(wrapper.componentMap.DateRangeTextLine).props();

				deepStrictEqual(dateRangeControl.initialDatePickerSelection, initialDateRange);
				deepStrictEqual(
					stub.mock.calls[0].arguments[0],
					datePickerConfig,
					"Expected that calculateInitialDate is called with datePicker config from the model element"
				);
			});

			describe("if the given date format is yyyy-MM-dd", () => {
				it("sets enableDatePicker=true if disableDatePicker from the config is false", async () => {
					const { wrapper } = await setup({
						customProps: { config: { disableDatePicker: false } }
					});
					const dateRangeControl = query(wrapper.componentMap.DateRangeTextLine).props();

					deepStrictEqual(dateRangeControl.enableDatePicker, true);
				});

				it("sets enableDatePicker=false if disableDatePicker from the config is true", async () => {
					const { wrapper } = await setup({ customProps: { config: { disableDatePicker: true } } });
					const dateRangeControl = query(wrapper.componentMap.DateRangeTextLine).props();

					deepStrictEqual(dateRangeControl.enableDatePicker, false);
				});
			});

			describe("if the given date format is not yyyy-MM-dd", () => {
				it("sets enableDatePicker=false if disableDatePicker from the config is false", async () => {
					const { wrapper } = await setup({
						customProps: {
							config: { disableDatePicker: false },
							dataType: {
								type: "DateRangeType",
								format: "yyyy",
								rangeSeparator: "/"
							},
							value: {
								data: [new Date(2020, 1, 1), new Date(2022, 1, 1)],
								ui: "2020-2022",
								path: dateRangePathOnlyYear
							}
						}
					});
					const dateRangeControl = query(wrapper.componentMap.DateRangeTextLine).props();

					deepStrictEqual(dateRangeControl.enableDatePicker, false);
				});

				it("sets enableDatePicker=false if disableDatePicker from the config is true", async () => {
					const { wrapper } = await setup({
						customProps: {
							config: { disableDatePicker: false },
							dataType: {
								type: "DateRangeType",
								format: "yyyy",
								rangeSeparator: "/"
							},
							value: {
								data: [new Date(2020, 1, 1), new Date(2022, 1, 1)],
								ui: "2020-2022",
								path: dateRangePathOnlyYear
							}
						}
					});
					const dateRangeControl = query(wrapper.componentMap.DateRangeTextLine).props();

					deepStrictEqual(dateRangeControl.enableDatePicker, false);
				});
			});

			it("sets timeZone to the value from the document model", async () => {
				const wrapper = await setupFormEngineRendererWithRtlAsync({
					componentMap: getComponentMocks(),
					models: timeZoneModels
				});
				const dateRangeControl = query(wrapper.componentMap.DateRangeTextLine).props();

				deepStrictEqual(dateRangeControl.timeZone, "Europe/Berlin");
			});
		});

		// onChange: Tests in test\api\features\dirty-state.spec.ts
	});
});
