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

import { deepEqual, deepStrictEqual, equal, strictEqual } from "node:assert/strict";
import type { Mock } from "node:test";
import { mock } from "node:test";

import { query } from "@com.mgmtp.a12.devtools/react";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import type {
	Locale,
	Localizable,
	Localizer
} from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";
import { defaultLocalizerFactory } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import { RESOURCE_KEYS } from "../../../../../back-end/localization/index.js";
import type { FormModel } from "../../../../../models/index.js";
import type { Config, DispatchConfiguration } from "../../../../../view/index.js";
import { defaultMapDispatchToProps } from "../../../../../view/index.js";
import { DateTimeInput } from "../../../../../view/internal/components/form-engine/cells/controls/date/date-time-input.js";
import { DateUtils } from "../../../../../view/internal/components/form-engine/cells/controls/date/date-utilities.js";
import { getComponentMocks } from "../../../../rtl-utils/getComponentMocks.js";
import { rtlRenderWrapper, type RtlRenderWrapper } from "../../../../rtl-utils/render-wrapper.js";
import { DocumentHelpers } from "../../../../utils/document-helpers.js";
import { DE_LOCALE } from "../../../../utils/localization.js";
import { DocumentModelHelpers } from "../../../../utils/model-helpers.js";
import { SetupHelpers } from "../../../../utils/setup.js";
import { setupModelsFixture } from "../../../../utils/setupFixture.js";
import { createModelPath } from "../../../../utils/test-model-helpers/dependent-enumeration.js";

import { inputTest } from "./generic-tests/input-tests.js";
import { createProps } from "./generic-tests/input-utils.js";

const { Field } = DocumentModelHelpers;
describe("api.view.inputs", () => {
	describe("DateTimeInput", () => {
		const models = setupModelsFixture("controls.picustypes");
		const timeZoneModels = setupModelsFixture("controls.date-timezone");

		const documentElementDataType: DocumentModel.DateTimeType = {
			type: "DateTimeType",
			format: "yyyy-MM-dd'T'HH:mm:ss"
		};
		const baseProps = {
			documentElement: Field({ fieldType: documentElementDataType }),
			documentElementDataType,
			component: "TextLineStateless",
			renderFunction: DateTimeInput,
			getProps: (wrapper: RtlRenderWrapper) => query(wrapper.componentMap.BufferedTextLine).props(),
			formModelPath: createModelPath("foo", "bar")
		};
		const datePath = DocumentHelpers.createDocumentPath(
			["A12T_PicusTypes"],
			["DateAndDateTime"],
			["DateTime01"]
		);
		const datePathTimeZone = DocumentHelpers.createDocumentPath(["root"], ["DateTime01"]);

		const datePickerConfig: FormModel.DatePickerConfig = {
			absolute: true,
			maxYear: 2020,
			minYear: 2010,
			preselectionYear: 0
		};

		interface MockDispatchConfig extends DispatchConfiguration {
			onValueChange: Mock<DispatchConfiguration["onValueChange"]>;
			onParseError: Mock<DispatchConfiguration["onParseError"]>;
		}

		function setup(options: {
			customProps?: Partial<{ locale: Locale; config: Partial<Config> }>;
			localizer?: Localizer;
			timeZone?: "UTC" | "Europe/Berlin";
		}): { wrapper: RtlRenderWrapper; dispatchConfig: MockDispatchConfig } {
			const stubbedDispatch = defaultMapDispatchToProps(mock.fn());
			const dispatchConfig = {
				...stubbedDispatch.eventHandlers,
				onValueChange: mock.fn(),
				onParseError: mock.fn()
			};

			const { customProps, timeZone } = options;
			const props = createProps({
				...baseProps,
				models: timeZone === "Europe/Berlin" ? timeZoneModels : models,
				path: timeZone === "Europe/Berlin" ? datePathTimeZone : datePath,
				modelElement: { datePickerConfig, timeZone: timeZone ?? "UTC" },
				dispatchConfig,
				value: {
					data: new Date(2020, 10, 20),
					ui: "2020-10-20 06:00 AM",
					path: timeZone === "Europe/Berlin" ? datePathTimeZone : datePath
				},
				...customProps
			});
			const Component = baseProps.renderFunction;

			const localizer =
				options.localizer ??
				(customProps?.locale ? defaultLocalizerFactory({ locale: customProps.locale }) : undefined);

			const wrapper = rtlRenderWrapper(<Component {...props} />, {
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
					...baseProps,
					component: "TextLineStateless",
					path: DocumentHelpers.createDocumentPath(
						["A12T_PicusTypes"],
						["DateAndDateTime"],
						["DateTime01"]
					),
					placeholder: true
				},
				{ autoCompleteTest: false }
			);
		});

		describe("onValueSubmit", () => {
			describe("if the input is valid", () => {
				describe("and the model element contains timeZone === 'UTC'", () => {
					it("calls onValueChange with the correct arguments from the dispatch configuration", () => {
						const {
							wrapper: { componentMap },
							dispatchConfig
						} = setup({});
						const dateTimeTextLineProps = query(componentMap.DateTimeTextLine).props();
						dateTimeTextLineProps.onValueSubmit("10/10/2019 10:20 AM");

						strictEqual(
							dispatchConfig.onValueChange.mock.callCount(),
							1,
							`Dispatch function was called ${dispatchConfig.onValueChange.mock.callCount()} time(s). Expected call count: 1`
						);

						deepStrictEqual(dispatchConfig.onValueChange.mock.calls[0].arguments, [
							datePath,
							new Date("2019-10-10T10:20:00.000Z"),
							baseProps.formModelPath
						]);
					});

					it("strips leading and tailing spaces", () => {
						const {
							wrapper: { componentMap },
							dispatchConfig
						} = setup({});
						const dateTimeTextLineProps = query(componentMap.DateTimeTextLine).props();
						dateTimeTextLineProps.onValueSubmit("   10/10/2019 10:20 AM   ");

						deepStrictEqual(dispatchConfig.onValueChange.mock.calls[0].arguments, [
							datePath,
							new Date("2019-10-10T10:20:00.000Z"),
							baseProps.formModelPath
						]);
					});
				});

				describe("and the model element contains timeZone === 'Europe/Berlin'", () => {
					it("calls onValueChange with the correct arguments from the dispatch configuration", () => {
						const {
							wrapper: { componentMap },
							dispatchConfig
						} = setup({ timeZone: "Europe/Berlin" });
						const dateTimeTextLineProps = query(componentMap.DateTimeTextLine).props();
						dateTimeTextLineProps.onValueSubmit("10/10/2019 10:20 AM");

						strictEqual(
							dispatchConfig.onValueChange.mock.callCount(),
							1,
							`Dispatch function was called ${dispatchConfig.onValueChange.mock.callCount()} time(s). Expected call count: 1`
						);

						deepStrictEqual(dispatchConfig.onValueChange.mock.calls[0].arguments, [
							datePathTimeZone,
							new Date("2019-10-10T08:20:00.000Z"),
							baseProps.formModelPath
						]);
					});

					it("strips leading and tailing spaces", () => {
						const {
							wrapper: { componentMap },
							dispatchConfig
						} = setup({ timeZone: "Europe/Berlin" });
						const dateTimeTextLineProps = query(componentMap.DateTimeTextLine).props();
						dateTimeTextLineProps.onValueSubmit("   10/10/2019 10:20 AM   ");

						deepStrictEqual(dispatchConfig.onValueChange.mock.calls[0].arguments, [
							datePathTimeZone,
							new Date("2019-10-10T08:20:00.000Z"),
							baseProps.formModelPath
						]);
					});
				});
			});

			describe("if the input is invalid", () => {
				it("calls onParseError with the correct arguments from the dispatch configuration", () => {
					const {
						wrapper: { componentMap },
						dispatchConfig
					} = setup({});
					const dateTimeTextLineProps = query(componentMap.DateTimeTextLine).props();
					dateTimeTextLineProps.onValueSubmit("abc");

					const expectedParseError = {
						errorCode: "datumFormatFalsch",
						errorKey: "kernel.formalErrors.DATUM_FORMAT",
						errorText: {
							args: {
								dateFormat: {
									properties: {
										type: "date"
									},
									type: "dataFormat",
									value: "MM/dd/yyyy hh:mm a"
								}
							},
							defaults: {
								de: "Es sind nur Daten im Format $dateFormat$ erlaubt.",
								en: "Only dates in the format '$dateFormat$' are allowed.",
								fr: "Seules les dates au format '$dateFormat$' sont autorisées.",
								nl: "De datum dient in het formaat '$dateFormat$' te staan."
							},
							key: "kernel.formalErrors.DATUM_FORMAT"
						},
						severity: "ERROR"
					};

					strictEqual(
						dispatchConfig.onParseError.mock.callCount(),
						1,
						`Dispatch function was called ${dispatchConfig.onParseError.mock.callCount()} time(s). Expected call count: 1`
					);

					deepStrictEqual(dispatchConfig.onParseError.mock.calls[0].arguments, [
						datePath,
						"abc",
						expectedParseError
					]);
				});
			});
		});

		describe("Localization", () => {
			describe("default resources", () => {
				describe("en", () => {
					it("gives the localized labels to the `DateTimeControl`", () => {
						const {
							wrapper: { componentMap }
						} = setup({});
						const dateTimeTextLineProps = query(componentMap.DateTimeTextLine).props();

						equal(dateTimeTextLineProps.okLabel, "OK");
						equal(dateTimeTextLineProps.clearLabel, "Clear");
						equal(dateTimeTextLineProps.backLabel, "Back");
						equal(dateTimeTextLineProps.editTimeLabel, "Edit Time");
						equal(dateTimeTextLineProps.placeholderText, "Please select");
					});
				});

				describe("de", () => {
					it("gives the localized labels to the `DateTimeControl`", () => {
						const {
							wrapper: { componentMap }
						} = setup({ customProps: { locale: DE_LOCALE } });
						const dateTimeTextLineProps = query(componentMap.DateTimeTextLine).props();

						equal(dateTimeTextLineProps.okLabel, "OK");
						equal(dateTimeTextLineProps.clearLabel, "Löschen");
						equal(dateTimeTextLineProps.backLabel, "Zurück");
						equal(dateTimeTextLineProps.editTimeLabel, "Zeit bearbeiten");
						equal(dateTimeTextLineProps.placeholderText, "Bitte wählen");
					});
				});
			});

			it("uses the localizer service to localize the labels", () => {
				const localizer: Localizer = (...localizable: Localizable[]) => {
					const l = localizable[0];
					if (l.key === RESOURCE_KEYS.datetime.button.ok) {
						return "MY_RESOURCE_OK";
					}

					if (l.key === RESOURCE_KEYS.datetime.button.clear) {
						return "MY_RESOURCE_Clear";
					}

					if (l.key === RESOURCE_KEYS.datetime.button.back) {
						return "MY_RESOURCE_Back";
					}

					if (l.key === RESOURCE_KEYS.datetime.button.editTime) {
						return "MY_RESOURCE_Edit";
					}

					if (l.key === RESOURCE_KEYS.datetime.placeholderTime) {
						return "MY_RESOURCE_Placeholder";
					}

					return "";
				};

				const {
					wrapper: { componentMap }
				} = setup({ localizer });
				const dateTimeTextLineProps = query(componentMap.DateTimeTextLine).props();

				equal(dateTimeTextLineProps.okLabel, "MY_RESOURCE_OK");
				equal(dateTimeTextLineProps.clearLabel, "MY_RESOURCE_Clear");
				equal(dateTimeTextLineProps.backLabel, "MY_RESOURCE_Back");
				equal(dateTimeTextLineProps.editTimeLabel, "MY_RESOURCE_Edit");
				equal(dateTimeTextLineProps.placeholderText, "MY_RESOURCE_Placeholder");
			});
		});

		describe("other props", () => {
			it("gives the data value from the document to the `DateTimeControl`", () => {
				const {
					wrapper: { componentMap }
				} = setup({});
				const dateTimeTextLineProps = query(componentMap.DateTimeTextLine).props();
				deepEqual(dateTimeTextLineProps.typedValue, new Date(2020, 10, 20));
			});

			it("gives the ui value from the document to the `DateTimeControl`", () => {
				const {
					wrapper: { componentMap }
				} = setup({});
				const dateTimeTextLineProps = query(componentMap.DateTimeTextLine).props();
				deepEqual(dateTimeTextLineProps.value, "2020-10-20 06:00 AM");
			});

			it("sets yearRange to the calculated year range from the datePicker config", () => {
				mock.method(DateUtils, "calculateYearRange", () => ({
					start: 2020,
					end: 2025
				}));

				const {
					wrapper: { componentMap }
				} = setup({});
				const dateTimeTextLineProps = query(componentMap.DateTimeTextLine).props();
				deepEqual(dateTimeTextLineProps.yearRange, { start: 2020, end: 2025 });
			});

			it("sets initialDatePickerSelection to the calculated initial date from the datePicker config", () => {
				const stub = mock.method(DateUtils, "calculateInitialDate", () => initialDate);
				const initialDate = new Date(2020, 10, 20);

				const {
					wrapper: { componentMap }
				} = setup({});
				const dateTimeTextLineProps = query(componentMap.DateTimeTextLine).props();
				deepEqual(dateTimeTextLineProps.initialDatePickerSelection, initialDate);
				deepEqual(
					stub.mock.calls[0].arguments[0],
					datePickerConfig,
					"Expected that calculateInitialDate is called with datePicker config from the model element"
				);
			});

			it("sets enableDatePicker=true if disableDatePicker from the config is false", () => {
				const {
					wrapper: { componentMap }
				} = setup({ customProps: { config: { disableDatePicker: false } } });
				const dateTimeTextLineProps = query(componentMap.DateTimeTextLine).props();
				deepEqual(dateTimeTextLineProps.enableDatePicker, true);
			});

			it("sets enableDatePicker=false if disableDatePicker from the config is true", () => {
				const {
					wrapper: { componentMap }
				} = setup({ customProps: { config: { disableDatePicker: true } } });
				const dateTimeTextLineProps = query(componentMap.DateTimeTextLine).props();
				deepEqual(dateTimeTextLineProps.enableDatePicker, false);
			});

			it("sets timeMode to the value from the Config", () => {
				const {
					wrapper: { componentMap }
				} = setup({ customProps: { config: { timeMode: "12h" } } });
				const dateTimeTextLineProps = query(componentMap.DateTimeTextLine).props();
				deepEqual(dateTimeTextLineProps.timeMode, "12h");
			});

			it("sets timeZone to the value from the document model", async () => {
				const { componentMap } = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
					componentMap: getComponentMocks(),
					models: timeZoneModels
				});
				const dateTimeTextLineProps = query(componentMap.DateTimeTextLine).props();
				deepEqual(dateTimeTextLineProps.timeZone, "Europe/Berlin");
			});
		});

		// onChange: Tests in test\api\features\dirty-state.spec.ts
	});
});
