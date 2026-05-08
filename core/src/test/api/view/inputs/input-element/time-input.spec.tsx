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
import type { Locale, Localizer } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";
import { defaultLocalizerFactory } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";
import type { TimePickerProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/time-picker/main/time-picker.api.js";

import type { FormModel } from "../../../../../models/internal/form-model.js";
import type { Config, DispatchConfiguration, Value } from "../../../../../view/index.js";
import { defaultMapDispatchToProps } from "../../../../../view/index.js";
import { TimeInput } from "../../../../../view/internal/components/form-engine/cells/controls/date/time-input.js";
import type { RtlRenderWrapper } from "../../../../rtl-utils/render-wrapper.js";
import { rtlRenderWrapperAsync } from "../../../../rtl-utils/render-wrapper.js";
import { DocumentHelpers } from "../../../../utils/document-helpers.js";
import { DocumentModelHelpers } from "../../../../utils/model-helpers.js";
import { SetupHelpers } from "../../../../utils/setup.js";
import { setupModelsFixture } from "../../../../utils/setupFixture.js";
import { createModelPath } from "../../../../utils/test-model-helpers/dependent-enumeration.js";

import { inputTest } from "./generic-tests/input-tests.js";
import { createProps } from "./generic-tests/input-utils.js";

const { Field } = DocumentModelHelpers;
describe("api.view.inputs", () => {
	describe("TimeInput", () => {
		const models = setupModelsFixture("controls.picustypes");
		const timeZoneModels = setupModelsFixture("controls.date-timezone");

		const documentElementDataType: DocumentModel.TimeType = {
			type: "TimeType",
			format: "HH:mm:ss"
		};
		const baseProps = {
			documentElement: Field({ fieldType: documentElementDataType }),
			documentElementDataType,
			component: "TimePicker",
			renderFunction: TimeInput,
			formModelPath: createModelPath("foo", "bar")
		} as const;

		const datePath = DocumentHelpers.createDocumentPath(
			["A12T_PicusTypes"],
			["DateAndDateTime"],
			["Time01"]
		);
		const datePathTimeZone = DocumentHelpers.createDocumentPath(["root"], ["Time01"]);

		let mountPoint: HTMLDivElement;

		before(() => {
			mountPoint = document.createElement("div");
			document.body.appendChild(mountPoint);
		});

		after(() => {
			document.body.removeChild(mountPoint);
		});

		interface MockDispatchConfig extends DispatchConfiguration {
			onValueChange: Mock<DispatchConfiguration["onValueChange"]>;
			onParseError: Mock<DispatchConfiguration["onParseError"]>;
		}

		async function setup(options: {
			customProps?: Partial<{ locale: Locale; config: Partial<Config> }>;
			localizer?: Localizer;
			timeZone?: "UTC" | "Europe/Berlin";
			readonly?: boolean;
			disabled?: boolean;
			value?: Omit<Value, "path">;
			style?: FormModel.Style[];
		}): Promise<{ wrapper: RtlRenderWrapper; dispatchConfig: MockDispatchConfig }> {
			const stubbedDispatch = defaultMapDispatchToProps(mock.fn());
			const dispatchConfig = {
				...stubbedDispatch.eventHandlers,
				onValueChange: mock.fn(),
				onParseError: mock.fn()
			};

			const { customProps, timeZone, readonly, disabled, value, style } = options;
			const props = createProps({
				...baseProps,
				models: timeZone === "Europe/Berlin" ? timeZoneModels : models,
				path: timeZone === "Europe/Berlin" ? datePathTimeZone : datePath,
				modelElement: { timeZone: timeZone ?? "UTC", readonly, disabled, style },
				dispatchConfig,
				value: value
					? {
							...value,
							path: timeZone === "Europe/Berlin" ? datePathTimeZone : datePath
						}
					: {
							data: new Date("1970-01-01T06:30:00.000Z"),
							ui: "06:30 AM",
							path: timeZone === "Europe/Berlin" ? datePathTimeZone : datePath
						},
				...customProps
			});
			const Component = baseProps.renderFunction;

			const localizer =
				options.localizer ??
				(customProps?.locale ? defaultLocalizerFactory({ locale: customProps.locale }) : undefined);

			const wrapper = await rtlRenderWrapperAsync(<Component {...props} />, {
				locale: customProps?.locale,
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
					path: DocumentHelpers.createDocumentPath(
						["A12T_PicusTypes"],
						["DateAndDateTime"],
						["Time01"]
					)
				},
				{
					autoCompleteTest: false
				}
			);
		});

		describe("Change the time value", () => {
			function changeTimeInput(timePicker: TimePickerProps, value?: Date) {
				timePicker.onChange?.(value);
			}

			describe("If the input is valid", () => {
				describe("and not empty", () => {
					it("calls onValueChange with the correct arguments from the dispatch configuration", async () => {
						const { wrapper, dispatchConfig } = await setup({});
						const timePicker = query(wrapper.widgetMap.TimePicker).props();
						const date = new Date();
						changeTimeInput(timePicker, date);

						strictEqual(
							dispatchConfig.onValueChange.mock.callCount(),
							1,
							`Dispatch function was called ${dispatchConfig.onValueChange.mock.callCount()} time(s). Expected call count: ${1}`
						);

						deepStrictEqual(dispatchConfig.onValueChange.mock.calls[0].arguments, [
							datePath,
							date,
							baseProps.formModelPath
						]);
					});
				});

				describe("and empty", () => {
					it("calls onValueChange with the correct arguments from the dispatch configuration", async () => {
						const { wrapper, dispatchConfig } = await setup({});
						const timePicker = query(wrapper.widgetMap.TimePicker).props();
						changeTimeInput(timePicker, undefined);

						strictEqual(
							dispatchConfig.onValueChange.mock.callCount(),
							1,
							`Dispatch function was called ${dispatchConfig.onValueChange.mock.callCount()} time(s). Expected call count: ${1}`
						);

						deepStrictEqual(dispatchConfig.onValueChange.mock.calls[0].arguments, [
							datePath,
							null,
							baseProps.formModelPath
						]);
					});
				});
			});
		});

		describe("other props", () => {
			it("gives the data value from the document to the `TimePicker`", async () => {
				const { wrapper } = await setup({});
				const timePicker = query(wrapper.widgetMap.TimePicker).props();
				deepEqual(timePicker.value, new Date("1970-01-01T06:30:00.000Z"));
			});

			it("sets hidePickerButton=false if disableDatePicker from the config is false", async () => {
				const { wrapper } = await setup({ customProps: { config: { disableDatePicker: false } } });
				const timePicker = query(wrapper.widgetMap.TimePicker).props();
				equal(timePicker.hidePickerButton, false);
			});

			it("sets hidePickerButton=true if disableDatePicker from the config is true", async () => {
				const { wrapper } = await setup({ customProps: { config: { disableDatePicker: true } } });
				const timePicker = query(wrapper.widgetMap.TimePicker).props();
				equal(timePicker.hidePickerButton, true);
			});

			it("sets hidePickerButton=true if the input is readonly", async () => {
				const { wrapper } = await setup({ customProps: { config: { disableDatePicker: true } } });
				const timePicker = query(wrapper.widgetMap.TimePicker).props();
				equal(timePicker.hidePickerButton, true);
			});

			it("sets hidePickerButton=true if the input is disabled", async () => {
				const { wrapper } = await setup({ customProps: { config: { disableDatePicker: true } } });
				const timePicker = query(wrapper.widgetMap.TimePicker).props();
				equal(timePicker.hidePickerButton, true);
			});

			it("sets timeMode to the value from the Config", async () => {
				const { wrapper } = await setup({ customProps: { config: { timeMode: "12h" } } });
				const timePicker = query(wrapper.widgetMap.TimePicker).props();
				equal(timePicker.mode, "12h");
			});

			it("sets timeZone to the value from the document model", async () => {
				const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
					models: timeZoneModels
				});
				const timePicker = query(wrapper.widgetMap.TimePicker).props();
				equal(timePicker.timezone, "Europe/Berlin");
			});

			it("sets focusOnInputAfterPicking to true", async () => {
				const { wrapper } = await setup({});
				const timePicker = query(wrapper.widgetMap.TimePicker).props();
				equal(timePicker.focusOnInputAfterPicking, true);
			});

			it("sets the styles from the model element in the timeInputWrapperProps", async () => {
				const { wrapper } = await setup({ style: [{ name: "s1" }, { name: "s2" }] });
				const timePicker = query(wrapper.widgetMap.TimePicker).props();
				deepEqual(timePicker.timeInputWrapperProps?.className, "s1 s2");
			});
		});

		// onChange is further tested in test\api\features\dirty-state.spec.ts
	});
});
