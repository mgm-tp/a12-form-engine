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

import { ok } from "node:assert/strict";
import { mock } from "node:test";

import { query } from "@com.mgmtp.a12.devtools/react";

import type { Models } from "../../../../../../back-end/store/internal/store.js";
import { BooleanRadioInput } from "../../../../../../view/internal/components/form-engine/cells/controls/boolean/boolean-radio-input.js";
import { DateFragmentInput } from "../../../../../../view/internal/components/form-engine/cells/controls/date/date-fragment-input.js";
import { DateInput } from "../../../../../../view/internal/components/form-engine/cells/controls/date/date-input.js";
import { RadioInput } from "../../../../../../view/internal/components/form-engine/cells/controls/enumeration/radio-input.js";
import { DateTextLine } from "../../../../../../view/internal/components/widgets/form-engine/dateTextLine.js";
import { getComponentMocks } from "../../../../../rtl-utils/getComponentMocks.js";
import { getInputMocks } from "../../../../../rtl-utils/getInputMocks.js";
import { setupModelsFixture } from "../../../../../utils/setupFixture.js";
import { EXTERNAL_ENUM } from "../../../../../utils/test-model-helpers/external-enumeration.js";
import {
	PICUS_TYPES,
	PICUS_TYPES as PICUS_TYPES_RTL,
	setupPicusTypeTest as setupPicusTypeTestRtl
} from "../../../../../utils/test-model-helpers/picustypes.js";

export function executeTestsForRendering(): void {
	const picusTypesModels = setupModelsFixture("controls.picustypes");
	const externalEnumerationModels = setupModelsFixture("controls.externalenumeration");

	function testPicusTypes() {
		return testWithModels(picusTypesModels);
	}

	function testExternalEnumeration() {
		return testWithModels(externalEnumerationModels);
	}

	function testWithModels(models: Models) {
		const inputMap = getInputMocks();
		setupPicusTypeTestRtl({
			models,
			inputMap
		});
		return inputMap;
	}

	describe("Given a field with data type String", () => {
		describe("and lineBreaksPermitted=true", () => {
			it("renders a MultilineInput", () => {
				const inputMap = testPicusTypes();

				query(inputMap.MultilineInput)
					.withProp("uiId", PICUS_TYPES_RTL.STRING_05)
					.assertRenderedTimes(1);
			});
		});

		describe("and no field configuration entry", () => {
			it("renders a StringInput", () => {
				const inputMap = testPicusTypes();
				query(inputMap.StringInput)
					.withProp("uiId", PICUS_TYPES_RTL.STRING_01)
					.assertRenderedTimes(1);
			});
		});

		describe("and a field configuration entry ", () => {
			describe("containing an external enumeration source", () => {
				describe("and the exposition compact", () => {
					it("renders a DropDownInput", () => {
						const inputMap = testExternalEnumeration();
						query(inputMap.DropDownInput)
							.withProp("uiId", EXTERNAL_ENUM.ID_EXTERNAL_ENUM_COMPACT)
							.assertRenderedTimes(1);
					});
				});

				describe("and the exposition autocomplete", () => {
					it("renders an AutoCompleteInput", () => {
						const inputMap = testExternalEnumeration();
						query(inputMap.AutoCompleteInput)
							.withProp("uiId", EXTERNAL_ENUM.ID_EXTERNAL_ENUM_AUTOCOMPLETE)
							.assertRenderedTimes(1);
					});
				});

				describe("and the exposition full", () => {
					it("renders a RadioInput", () => {
						const inputMap = testExternalEnumeration();

						query(inputMap.RadioInput)
							.withProp("uiId", EXTERNAL_ENUM.ID_EXTERNAL_ENUM_FULL)
							.assertRenderedTimes(1);
					});
				});

				describe("and the exposition inline", () => {
					it("renders a RadioInput with prop 'inline' set to true on its Radio child component", () => {
						const inputMap = {
							...getInputMocks(),
							RadioInput: mock.fn(RadioInput)
						};
						const { widgetMap } = setupPicusTypeTestRtl({
							models: externalEnumerationModels,
							inputMap
						});

						query(inputMap.RadioInput)
							.withProp("uiId", EXTERNAL_ENUM.ID_EXTERNAL_ENUM_INLINE)
							.assertRenderedTimes(1);

						query(widgetMap.Radio)
							.withId(EXTERNAL_ENUM.ID_EXTERNAL_ENUM_INLINE)
							.withProp("inline", true)
							.assertRenderedTimes(1);
					});
				});
			});

			describe("containing exposition=Area", () => {
				it("renders a MultilineInput", () => {
					const inputMap = testPicusTypes();

					const input = query(inputMap.MultilineInput)
						.withProp("uiId", PICUS_TYPES_RTL.STRING_04)
						.props();

					const element = input.documentElement;
					ok(
						element.type === "Field" &&
							element.fieldType.type === "StringType" &&
							element.fieldType.lineBreaksPermitted === undefined,
						"Setup error. Expected StringDataType with no 'lineBreaksPermitted'"
					);
				});
			});
		});
	});

	describe("Given a field with data type Number", () => {
		it("renders a NumberInput", () => {
			const inputMap = testPicusTypes();

			query(inputMap.NumberInput)
				.withProp("uiId", PICUS_TYPES_RTL.NUMBER_01)
				.assertRenderedTimes(1);
		});
	});

	describe("Given a field with data type Enumeration", () => {
		describe("and exposition 'compact'", () => {
			it("renders a DropDownInput", () => {
				const inputMap = testPicusTypes();

				query(inputMap.DropDownInput)
					.withProp("uiId", PICUS_TYPES_RTL.ENUMERATION_COMPACT)
					.assertRenderedTimes(1);
			});
		});

		describe("and exposition 'autocomplete'", () => {
			it("renders an AutoCompleteInput", () => {
				const inputMap = testPicusTypes();

				query(inputMap.AutoCompleteInput)
					.withProp("uiId", PICUS_TYPES_RTL.ENUMERATION_AUTOCOMPLETE)
					.assertRenderedTimes(1);
			});
		});

		describe("and exposition 'full'", () => {
			it("renders a RadioInput", () => {
				const inputMap = testPicusTypes();

				query(inputMap.RadioInput)
					.withProp("uiId", PICUS_TYPES_RTL.ENUMERATION_RADIO_FULL)
					.assertRenderedTimes(1);
			});
		});

		describe("and exposition 'inline'", () => {
			it("renders a RadioInput", () => {
				const inputMap = testPicusTypes();

				query(inputMap.RadioInput)
					.withProp("uiId", PICUS_TYPES_RTL.ENUMERATION_RADIO_INLINE)
					.assertRenderedTimes(1);
			});
		});
	});

	describe("Given a field with data type Date", () => {
		it("renders a DateInput with a date picker", () => {
			const inputMap = {
				...getInputMocks(),
				DateInput: mock.fn(DateInput)
			};
			const componentMap = {
				...getComponentMocks(),
				DateTextLine
			};
			const { widgetMap } = setupPicusTypeTestRtl({
				models: picusTypesModels,
				componentMap,
				inputMap
			});

			query(inputMap.DateInput).withProp("uiId", PICUS_TYPES.DATE_01).assertRenderedTimes(1);

			query(widgetMap.Button)
				.withProp("id", `${PICUS_TYPES.DATE_01}-picker`)
				.assertRenderedTimes(1);
		});
	});

	describe("Given a field with data type DateFragment", () => {
		it("renders a DateFragmentInput without a date picker", () => {
			const inputMap = {
				...getInputMocks(),
				DateFragmentInput: mock.fn(DateFragmentInput)
			};
			const componentMap = {
				...getComponentMocks(),
				DateTextLine
			};
			const { widgetMap } = setupPicusTypeTestRtl({
				models: picusTypesModels,
				componentMap,
				inputMap
			});

			query(inputMap.DateFragmentInput)
				.withProp("uiId", PICUS_TYPES.DATE_FRAGMENT_01)
				.assertRenderedTimes(1);

			query(widgetMap.Button)
				.withProp("id", `${PICUS_TYPES.DATE_FRAGMENT_01}-picker`)
				.assertNotRendered();
		});
	});

	describe("Given a field with data type DateTime", () => {
		it("renders a DateTimeInput", () => {
			const inputMap = testPicusTypes();

			query(inputMap.DateTimeInput)
				.withProp("uiId", PICUS_TYPES.DATUM_ZEIT_01)
				.assertRenderedTimes(1);
		});
	});

	describe("Given a field with data type Time", () => {
		it("renders a TimeInput", () => {
			const inputMap = testPicusTypes();

			query(inputMap.TimeInput).withProp("uiId", PICUS_TYPES.ZEIT_01).assertRenderedTimes(1);
		});
	});

	describe("Given a field with data type DateRange", () => {
		it("renders a DateRangeInput", () => {
			const inputMap = testPicusTypes();

			query(inputMap.DateRangeInput)
				.withProp("uiId", PICUS_TYPES.DATE_RANGE_01)
				.assertRenderedTimes(1);
		});
	});

	describe("Given a field with data type Boolean", () => {
		describe("and no exposition", () => {
			it("renders a BooleanSelectInput", () => {
				const inputMap = testPicusTypes();

				query(inputMap.BooleanSelectInput)
					.withProp("uiId", PICUS_TYPES.BOOLEAN_SELECT_01)
					.assertRenderedTimes(1);
			});
		});

		describe("and exposition 'boolean_select'", () => {
			it("renders a BooleanSelectInput", () => {
				const inputMap = testPicusTypes();

				query(inputMap.BooleanSelectInput)
					.withProp("uiId", PICUS_TYPES.BOOLEAN_SELECT_02)
					.assertRenderedTimes(1);
			});
		});

		describe("and exposition 'checkbox'", () => {
			it("renders a CheckboxInput", () => {
				const inputMap = testPicusTypes();

				query(inputMap.CheckboxInput)
					.withProp("uiId", PICUS_TYPES.BOOLEAN_01)
					.assertRenderedTimes(1);
			});
		});

		describe("and exposition 'switch'", () => {
			it("renders a SwitchInput", () => {
				const inputMap = testPicusTypes();

				query(inputMap.SwitchInput).withProp("uiId", PICUS_TYPES.BOOLEAN_03).assertRenderedTimes(1);
			});
		});

		describe("and exposition 'switch-with-values'", () => {
			it("renders a SwitchInput", () => {
				const inputMap = testPicusTypes();

				query(inputMap.SwitchInput).withProp("uiId", PICUS_TYPES.BOOLEAN_04).assertRenderedTimes(1);
			});
		});

		describe("and exposition 'full", () => {
			it("renders a BooleanRadioInput", () => {
				const inputMap = testPicusTypes();

				query(inputMap.BooleanRadioInput)
					.withProp("uiId", PICUS_TYPES.BOOLEAN_RADIO_FULL)
					.assertRenderedTimes(1);
			});
		});

		describe("and exposition 'inline", () => {
			it("renders a BooleanRadioInput with prop 'inline' set to true on its Radio child component", () => {
				const inputMap = {
					...getInputMocks(),
					BooleanRadioInput: mock.fn(BooleanRadioInput)
				};
				const { widgetMap } = setupPicusTypeTestRtl({
					models: picusTypesModels,
					inputMap
				});

				query(inputMap.BooleanRadioInput)
					.withProp("uiId", PICUS_TYPES.BOOLEAN_RADIO_INLINE)
					.assertRenderedTimes(1);

				query(widgetMap.Radio)
					.withId(PICUS_TYPES.BOOLEAN_RADIO_INLINE)
					.withProp("inline", true)
					.assertRenderedTimes(1);
			});
		});
	});

	describe("Given a field with data type Confirm", () => {
		describe("and no exposition", () => {
			it("renders a CheckboxInput", () => {
				const inputMap = testPicusTypes();

				query(inputMap.CheckboxInput)
					.withProp("uiId", PICUS_TYPES.CONFIRM_01)
					.assertRenderedTimes(1);
			});
		});

		describe("and exposition 'checkbox", () => {
			it("renders a CheckboxInput", () => {
				const inputMap = testPicusTypes();

				query(inputMap.CheckboxInput)
					.withProp("uiId", PICUS_TYPES.CONFIRM_02)
					.assertRenderedTimes(1);
			});
		});

		describe("and exposition 'switch'", () => {
			it("renders a SwitchInput", () => {
				const inputMap = testPicusTypes();

				query(inputMap.SwitchInput).withProp("uiId", PICUS_TYPES.CONFIRM_03).assertRenderedTimes(1);
			});
		});

		describe("and exposition 'switch-with-values'", () => {
			it("renders a SwitchInput", () => {
				const inputMap = testPicusTypes();

				query(inputMap.SwitchInput).withProp("uiId", PICUS_TYPES.CONFIRM_04).assertRenderedTimes(1);
			});
		});
	});

	describe("Given a field with data type Custom", () => {
		it("renders a StringInput", () => {
			const inputMap = testPicusTypes();

			query(inputMap.StringInput).withProp("uiId", PICUS_TYPES.CUSTOM_01).assertRenderedTimes(1);
		});
	});

	describe("Given a group with customType='attachment'", () => {
		describe("and no exposition", () => {
			it("renders an AttachmentInput", () => {
				const inputMap = testPicusTypes();

				query(inputMap.AttachmentInput)
					.withProp("uiId", PICUS_TYPES.ATTACHMENT_01)
					.assertRenderedTimes(1);
			});
		});

		describe("and exposition compact", () => {
			it("renders an AttachmentInput", () => {
				const inputMap = testPicusTypes();

				query(inputMap.AttachmentInput)
					.withProp("uiId", PICUS_TYPES.ATTACHMENT_02)
					.assertRenderedTimes(1);
			});
		});
	});

	describe("Given a group with customType='multiselect'", () => {
		describe("and exposition autocomplete", () => {
			it("renders a MultiSelectInput", () => {
				const inputMap = testPicusTypes();

				query(inputMap.MultiSelectInput)
					.withProp("uiId", PICUS_TYPES.MULTI_SELECT01)
					.assertRenderedTimes(1);
			});
		});

		describe("and exposition full", () => {
			it("renders a CheckboxGroup", () => {
				const inputMap = testPicusTypes();

				query(inputMap.CheckboxGroupInput)
					.withProp("uiId", PICUS_TYPES.MULTI_SELECT02)
					.assertRenderedTimes(1);
			});
		});

		describe("and exposition inline", () => {
			it("renders as CheckboxGroup", () => {
				const inputMap = testPicusTypes();

				query(inputMap.CheckboxGroupInput)
					.withProp("uiId", PICUS_TYPES.MULTI_SELECT03)
					.assertRenderedTimes(1);
			});
		});
	});
}
