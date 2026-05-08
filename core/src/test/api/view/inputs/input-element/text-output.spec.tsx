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

import { within } from "@com.mgmtp.a12.devtools/react";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import type { Locale } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";
import { defaultLocalizerFactory } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import type { Value } from "../../../../../view/index.js";
import { TextOutput } from "../../../../../view/internal/components/form-engine/cells/controls/text-output/text-output.js";
import type { Inputs } from "../../../../../view/internal/configuration/engine-configuration.js";
import { BULLET_LIST_ITEM, BULLET_LIST_UNORDERED } from "../../../../rtl-utils/data-roles.js";
import type { RtlRenderWrapper } from "../../../../rtl-utils/render-wrapper.js";
import { rtlRenderWrapperAsync } from "../../../../rtl-utils/render-wrapper.js";
import { DocumentHelpers } from "../../../../utils/document-helpers.js";
import { DE_LOCALE, US_LOCALE } from "../../../../utils/localization.js";
import { DocumentModelHelpers } from "../../../../utils/model-helpers.js";
import { setupModelsFixture } from "../../../../utils/setupFixture.js";

import { inputTest } from "./generic-tests/input-tests.js";
import type { FieldBasedProps } from "./generic-tests/input-utils.js";
import { createProps } from "./generic-tests/input-utils.js";
import { widgetMocksForInputTests } from "./inputTestWidgetMocks.js";

const { Field } = DocumentModelHelpers;

describe("api.view.inputs", () => {
	describe("TextOutput", () => {
		const models = setupModelsFixture("controls.picustypes");

		const documentElementDataType: DocumentModel.NumberType = {
			type: "NumberType",
			zeroNotAllowed: true
		};
		const baseProps: FieldBasedProps<typeof documentElementDataType> = {
			documentElement: Field({ fieldType: documentElementDataType }),
			documentElementDataType,
			component: "TextOutput",
			renderFunction: TextOutput,
			path: DocumentHelpers.createDocumentPath(["A12T_PicusTypes"], ["Number"], ["Number01"])
		};

		/** General test which are similar for all inputs */
		describe("General", () => {
			inputTest(() => models, baseProps, {
				ariaRequiredTest: false,
				disabledTest: false,
				placeholderTest: false,
				readOnlyTest: false,
				hintTooltipTest: false,
				ariaDescribedbyTest: false,
				helperTextTest: false,
				labelHiddenButReadTest: false,
				autoCompleteTest: false
			});
		});

		function setup<T extends DocumentModel.FieldType | DocumentModel.Group>(options: {
			readonly locale?: Locale;
			readonly documentElement: DocumentModel.Element;
			readonly documentElementDataType: T;
			readonly value: Value;
			readonly modelElement?: Partial<Inputs.ModelElement>;
		}): Promise<RtlRenderWrapper> {
			const props = createProps({
				...baseProps,
				models: models,
				modelElement: options.modelElement || {},
				documentElement: options.documentElement,
				documentElementDataType: options.documentElementDataType,
				value: options.value,
				path: options.value.path,
				locale: options.locale
			});
			const Component = baseProps.renderFunction as any;
			return rtlRenderWrapperAsync(<Component {...props} />, {
				widgetMap: widgetMocksForInputTests(),
				localizer: options.locale ? defaultLocalizerFactory({ locale: options.locale }) : undefined
			});
		}

		/**
		 * Hide label is not handled in the widget itself, like it is for inputs.
		 * Therefore, the general labelHiddenButReadTest cannot be used here.
		 */
		describe("Label", () => {
			describe("hide label === true", () => {
				it("does not render a label", async () => {
					const wrapper = await setup({
						locale: US_LOCALE,
						documentElement: Field({ fieldType: { type: "StringType" } }),
						documentElementDataType: { type: "StringType" },
						value: { data: null, ui: "", path: [] },
						modelElement: { label: "Test", labelHiddenButRead: true }
					});
					const textOutput = within(wrapper.baseElement).getById("1");
					const label = within(textOutput).queryByDataRole("label");
					equal(label, null, "Expected no label, when hide label is true");
				});
			});

			describe("hide label === false", () => {
				it("renders a label", async () => {
					const wrapper = await setup({
						locale: US_LOCALE,
						documentElement: Field({ fieldType: { type: "StringType" } }),
						documentElementDataType: { type: "StringType" },
						value: { data: null, ui: "", path: [] },
						modelElement: { label: "Test", labelHiddenButRead: false }
					});
					const textOutput = within(wrapper.baseElement).getById("1");
					const label = within(textOutput).getByDataRole("label").textContent;
					equal(label, "Test", "Expected a label, when hide label is false");
				});
			});

			describe("hide label === undefined", () => {
				it("renders a label", async () => {
					const wrapper = await setup({
						locale: US_LOCALE,
						documentElement: Field({ fieldType: { type: "StringType" } }),
						documentElementDataType: { type: "StringType" },
						value: { data: null, ui: "", path: [] },
						modelElement: { label: "Test" }
					});
					const textOutput = within(wrapper.baseElement).getById("1");
					const label = within(textOutput).getByDataRole("label").textContent;
					equal(label, "Test", "Expected a label, when hide label is undefined");
				});
			});
		});

		describe("Value", () => {
			describe("String", () => {
				let stringDocumentElementDataType: DocumentModel.StringType;

				before(() => {
					stringDocumentElementDataType = { type: "StringType", lineBreaksPermitted: false };
				});

				describe("no data value given", () => {
					describe("locale=en", () => {
						it("shows 'no data'", async () => {
							const wrapper = await setup({
								locale: US_LOCALE,
								documentElement: Field({ fieldType: stringDocumentElementDataType }),
								documentElementDataType: stringDocumentElementDataType,
								value: { data: null, ui: "", path: [] }
							});
							const textOutput = within(wrapper.baseElement).getById("1");
							const text = textOutput.textContent;
							ok(text?.includes("no data"), `Expected that ${text} contains 'no data'`);
						});
					});

					describe("locale=de", () => {
						it("shows 'keine Daten'", async () => {
							const wrapper = await setup({
								locale: DE_LOCALE,
								documentElement: Field({ fieldType: stringDocumentElementDataType }),
								documentElementDataType: stringDocumentElementDataType,
								value: { data: null, ui: "", path: [] }
							});
							const textOutput = within(wrapper.baseElement).getById("1");
							const text = textOutput.textContent;
							ok(text?.includes("keine Daten"), `Expected that ${text} contains 'keine Daten'`);
						});
					});
				});

				describe("data value given", () => {
					it("shows the ui value", async () => {
						const wrapper = await setup({
							documentElement: Field({ fieldType: stringDocumentElementDataType }),
							documentElementDataType: stringDocumentElementDataType,
							value: { data: "42", ui: "42 ui", path: [] }
						});
						const textOutput = within(wrapper.baseElement).getById("1");
						const text = textOutput.textContent;
						equal(text, "42 ui");
					});

					it("shows asterisks instead of string if secret is set for the control", async () => {
						const wrapper = await setup({
							documentElement: Field({ fieldType: stringDocumentElementDataType }),
							documentElementDataType: stringDocumentElementDataType,
							value: { data: "42", ui: "42 ui", path: [] },
							modelElement: { secret: true }
						});
						const textOutput = within(wrapper.baseElement).getById("1");
						const text = textOutput.textContent;
						equal(text, "*****");
					});
				});

				describe("value with line break given", () => {
					it("shows the value and a <br /> tag for each line break", async () => {
						const wrapper = await setup({
							documentElement: Field({ fieldType: stringDocumentElementDataType }),
							documentElementDataType: stringDocumentElementDataType,
							value: { data: "42", ui: "\nC\nD\nE\n", path: [] }
						});
						const spanChildren = within(wrapper.baseElement).getById("1").innerHTML;

						ok(spanChildren?.includes("<br>C <br>D <br>E <br>"));
					});
				});
			});

			describe("Number", () => {
				let numberDocumentElementDataType: DocumentModel.NumberType;

				before(() => {
					numberDocumentElementDataType = { type: "NumberType", zeroNotAllowed: true };
				});

				describe("no suffix given", () => {
					it("shows the value with no suffix", async () => {
						const wrapper = await setup({
							documentElement: Field({ fieldType: numberDocumentElementDataType }),
							documentElementDataType: numberDocumentElementDataType,
							value: { data: "42", ui: "42", path: [] }
						});
						const textOutput = within(wrapper.baseElement).getById("1");
						const text = textOutput.textContent;
						equal(text, "42");
					});
				});

				describe("suffix given", () => {
					it("shows the value with the suffix", async () => {
						const wrapper = await setup({
							documentElement: Field({ fieldType: numberDocumentElementDataType }),
							documentElementDataType: numberDocumentElementDataType,
							value: { data: "42", ui: "42", path: [] },
							modelElement: { suffix: "MySuffix" }
						});
						const textOutput = within(wrapper.baseElement).getById("1");
						const text = textOutput.textContent;
						equal(text, "42 MySuffix");
					});
				});
			});

			describe("Boolean", () => {
				let booleanDocumentElementDataType: DocumentModel.BooleanType;

				before(() => {
					booleanDocumentElementDataType = { type: "BooleanType" };
				});

				describe("locale=en", () => {
					it("shows 'yes' if the value is true", async () => {
						const wrapper = await setup({
							locale: US_LOCALE,
							documentElement: Field({ fieldType: booleanDocumentElementDataType }),
							documentElementDataType: booleanDocumentElementDataType,
							value: { data: true, ui: "", path: [] }
						});
						const textOutput = within(wrapper.baseElement).getById("1");
						const text = textOutput.textContent;
						equal(text, "yes");
					});

					it("shows 'no' if the value is false", async () => {
						const wrapper = await setup({
							locale: US_LOCALE,
							documentElement: Field({ fieldType: booleanDocumentElementDataType }),
							documentElementDataType: booleanDocumentElementDataType,
							value: { data: false, ui: "", path: [] }
						});
						const textOutput = within(wrapper.baseElement).getById("1");
						const text = textOutput.textContent;
						equal(text, "no");
					});
				});

				describe("locale=de", () => {
					it("shows 'ja' if the value is true", async () => {
						const wrapper = await setup({
							locale: DE_LOCALE,
							documentElement: Field({ fieldType: booleanDocumentElementDataType }),
							documentElementDataType: booleanDocumentElementDataType,
							value: { data: true, ui: "", path: [] }
						});
						const textOutput = within(wrapper.baseElement).getById("1");
						const text = textOutput.textContent;
						equal(text, "ja");
					});

					it("shows 'nein' if the value is false", async () => {
						const wrapper = await setup({
							locale: DE_LOCALE,
							documentElement: Field({ fieldType: booleanDocumentElementDataType }),
							documentElementDataType: booleanDocumentElementDataType,
							value: { data: false, ui: "", path: [] }
						});
						const textOutput = within(wrapper.baseElement).getById("1");
						const text = textOutput.textContent;
						equal(text, "nein");
					});
				});
			});

			describe("Confirm", () => {
				let confirmDocumentElementDataType: DocumentModel.ConfirmType;

				before(() => {
					confirmDocumentElementDataType = { type: "ConfirmType" };
				});

				describe("locale=en", () => {
					it("shows 'yes' if the value is true", async () => {
						const wrapper = await setup({
							locale: US_LOCALE,
							documentElement: Field({ fieldType: confirmDocumentElementDataType }),
							documentElementDataType: confirmDocumentElementDataType,
							value: { data: true, ui: "", path: [] }
						});
						const textOutput = within(wrapper.baseElement).getById("1");
						const text = textOutput.textContent;
						equal(text, "yes");
					});

					it("shows 'no data' if the value is null", async () => {
						const wrapper = await setup({
							locale: US_LOCALE,
							documentElement: Field({ fieldType: confirmDocumentElementDataType }),
							documentElementDataType: confirmDocumentElementDataType,
							value: { data: null, ui: "", path: [] }
						});
						const textOutput = within(wrapper.baseElement).getById("1");
						const text = textOutput.textContent;
						ok(text?.includes("no data"), `Expected that ${text} contains 'no data'`);
					});
				});

				describe("locale=de", () => {
					it("shows 'ja' if the value is true", async () => {
						const wrapper = await setup({
							locale: DE_LOCALE,
							documentElement: Field({ fieldType: confirmDocumentElementDataType }),
							documentElementDataType: confirmDocumentElementDataType,
							value: { data: true, ui: "", path: [] }
						});
						const textOutput = within(wrapper.baseElement).getById("1");
						const text = textOutput.textContent;
						equal(text, "ja");
					});

					it("shows ' keine Daten ' if the value is null", async () => {
						const wrapper = await setup({
							locale: DE_LOCALE,
							documentElement: Field({ fieldType: confirmDocumentElementDataType }),
							documentElementDataType: confirmDocumentElementDataType,
							value: { data: null, ui: "", path: [] }
						});
						const textOutput = within(wrapper.baseElement).getById("1");
						const text = textOutput.textContent;
						ok(text?.includes("keine Daten"), `Expected that ${text} contains 'keine Daten'`);
					});
				});
			});

			describe("MultiSelect", () => {
				let multiSelectDocumentElementDataType: DocumentModel.Group;

				before(() => {
					multiSelectDocumentElementDataType = DocumentModelHelpers.Group({
						usageType: "multi-select"
					});
				});

				describe("one value", () => {
					it("shows the value", async () => {
						const wrapper = await setup({
							documentElement: multiSelectDocumentElementDataType,
							documentElementDataType: multiSelectDocumentElementDataType,
							value: {
								data: [{ value: "key_blue" }],
								ui: "",
								path: DocumentHelpers.createDocumentPath(
									["A12T_PicusTypes"],
									["MultiSelect"],
									["MultiSelect01"]
								)
							},
							modelElement: {
								elementPath: DocumentHelpers.createDocumentPath(
									["A12T_PicusTypes"],
									["MultiSelect"],
									["MultiSelect01"]
								)
							}
						});
						const textOutput = within(wrapper.baseElement).getById("1");
						const text = textOutput.textContent;
						equal(text, "Blue");
					});
				});

				describe("multiple values", () => {
					it("shows a list of values", async () => {
						const wrapper = await setup({
							documentElement: multiSelectDocumentElementDataType,
							documentElementDataType: multiSelectDocumentElementDataType,
							value: {
								data: [{ value: "key_blue" }, { value: "key_red" }],
								ui: "",
								path: DocumentHelpers.createDocumentPath(
									["A12T_PicusTypes"],
									["MultiSelect"],
									["MultiSelect01"]
								)
							},
							modelElement: {
								elementPath: DocumentHelpers.createDocumentPath(
									["A12T_PicusTypes"],
									["MultiSelect"],
									["MultiSelect01"]
								)
							}
						});
						const textOutput = within(wrapper.baseElement).getById("1");
						const bulletList = within(textOutput).getByDataRole(BULLET_LIST_UNORDERED);
						const items = within(bulletList).getAllByDataRole(BULLET_LIST_ITEM);
						const texts = items.map(item => item.textContent);
						deepEqual(texts, ["Blue", "Red"]);
					});
				});
			});

			describe("Date", () => {
				let dateDocumentElementDataType: DocumentModel.DateType;

				before(() => {
					dateDocumentElementDataType = { type: "DateType", format: "yyyy-MM-dd" };
				});

				it("shows the ui value", async () => {
					const wrapper = await setup({
						documentElement: Field({ fieldType: dateDocumentElementDataType }),
						documentElementDataType: dateDocumentElementDataType,
						value: { data: "a date", ui: "2019-05-02", path: [] }
					});
					const textOutput = within(wrapper.baseElement).getById("1");
					const text = textOutput.textContent;
					equal(text, "2019-05-02");
				});
			});

			describe("DateFragment", () => {
				let dateDocumentElementDataType: DocumentModel.DateFragmentType;

				before(() => {
					dateDocumentElementDataType = {
						type: "DateFragmentType",
						formatOfFragment: "yyyy"
					};
				});

				it("shows the ui value", async () => {
					const wrapper = await setup({
						documentElement: Field({ fieldType: dateDocumentElementDataType }),
						documentElementDataType: dateDocumentElementDataType,
						value: { data: "a date fragment", ui: "2019", path: [] }
					});
					const textOutput = within(wrapper.baseElement).getById("1");
					const text = textOutput.textContent;
					equal(text, "2019");
				});
			});

			describe("DateTime", () => {
				let dateTimeDocumentElementDataType: DocumentModel.DateTimeType;

				before(() => {
					dateTimeDocumentElementDataType = {
						type: "DateTimeType",
						format: "yyyy-MM-dd'T'HH:mm:ss"
					};
				});

				it("shows the ui value", async () => {
					const wrapper = await setup({
						documentElement: Field({ fieldType: dateTimeDocumentElementDataType }),
						documentElementDataType: dateTimeDocumentElementDataType,
						value: { data: "a date", ui: "2019-05-02 10.00", path: [] }
					});
					const textOutput = within(wrapper.baseElement).getById("1");
					const text = textOutput.textContent;
					equal(text, "2019-05-02 10.00");
				});
			});

			describe("Time", () => {
				let timeDocumentElementDataType: DocumentModel.TimeType;

				before(() => {
					timeDocumentElementDataType = { type: "TimeType", format: "HH:mm:ss" };
				});

				it("shows the ui value", async () => {
					const wrapper = await setup({
						documentElement: Field({ fieldType: timeDocumentElementDataType }),
						documentElementDataType: timeDocumentElementDataType,
						value: { data: "a time", ui: "10.00", path: [] }
					});
					const textOutput = within(wrapper.baseElement).getById("1");
					const text = textOutput.textContent;
					equal(text, "10.00");
				});
			});

			describe("DateRange", () => {
				let dateRangeDocumentElementDataType: DocumentModel.DateRangeType;

				before(() => {
					dateRangeDocumentElementDataType = {
						type: "DateRangeType",
						format: "yyyy-MM-dd",
						rangeSeparator: "/"
					};
				});

				it("shows the ui value", async () => {
					const wrapper = await setup({
						documentElement: Field({ fieldType: dateRangeDocumentElementDataType }),
						documentElementDataType: dateRangeDocumentElementDataType,
						value: { data: "a date range", ui: "01/01/2022-01/05/2022", path: [] }
					});
					const textOutput = within(wrapper.baseElement).getById("1");
					const text = textOutput.textContent;
					equal(text, "01/01/2022-01/05/2022");
				});
			});

			describe("Custom", () => {
				let customDocumentElementDataType: DocumentModel.CustomFieldType;

				before(() => {
					customDocumentElementDataType = { type: "CustomFieldType", name: "CustomName" };
				});

				describe("no data value given", () => {
					describe("locale=en", () => {
						it("shows 'no data'", async () => {
							const wrapper = await setup({
								locale: US_LOCALE,
								documentElement: Field({ fieldType: customDocumentElementDataType }),
								documentElementDataType: customDocumentElementDataType,
								value: { data: null, ui: "", path: [] }
							});
							const textOutput = within(wrapper.baseElement).getById("1");
							const text = textOutput.textContent;
							ok(text?.includes("no data"), `Expected that ${text} contains 'no data'`);
						});
					});

					describe("locale=de", () => {
						it("shows 'keine Daten'", async () => {
							const wrapper = await setup({
								locale: DE_LOCALE,
								documentElement: Field({ fieldType: customDocumentElementDataType }),
								documentElementDataType: customDocumentElementDataType,
								value: { data: null, ui: "", path: [] }
							});
							const textOutput = within(wrapper.baseElement).getById("1");
							const text = textOutput.textContent;
							ok(text?.includes("keine Daten"), `Expected that ${text} contains 'keine Daten'`);
						});
					});
				});

				describe("data value given", () => {
					it("shows the ui value", async () => {
						const wrapper = await setup({
							documentElement: Field({ fieldType: customDocumentElementDataType }),
							documentElementDataType: customDocumentElementDataType,
							value: { data: "42", ui: "42 ui", path: [] }
						});
						const textOutput = within(wrapper.baseElement).getById("1");
						const text = textOutput.textContent;
						equal(text, "42 ui");
					});

					it("shows asterisks instead of string if secret is set for the control", async () => {
						const wrapper = await setup({
							documentElement: Field({ fieldType: customDocumentElementDataType }),
							documentElementDataType: customDocumentElementDataType,
							value: { data: "42", ui: "42 ui", path: [] },
							modelElement: { secret: true }
						});
						const textOutput = within(wrapper.baseElement).getById("1");
						const text = textOutput.textContent;
						equal(text, "*****");
					});
				});
			});
		});
	});
});
