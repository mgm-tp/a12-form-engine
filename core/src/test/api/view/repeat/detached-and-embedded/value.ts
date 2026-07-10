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

import { deepStrictEqual, ok, strictEqual } from "node:assert/strict";

import { within } from "@com.mgmtp.a12.devtools/react";
import { defaultLocalizerFactory } from "@com.mgmtp.a12.utils/utils-localization";

import { RESOURCE_KEYS } from "../../../../../back-end/localization/internal/languages/keys.js";
import { getLocalizedResource } from "../../../../../back-end/localization/internal/localize.js";
import { BULLET_LIST_ITEM, BULLET_LIST_UNORDERED } from "../../../../rtl-utils/data-roles.js";
import { US_LOCALE } from "../../../../utils/localization.js";
import { loadData, setupFormEngineRendererWithRtlAsync } from "../../../../utils/setup.js";
import { setupModelsFixture } from "../../../../utils/setupFixture.js";
import { createDocumentForRepeat } from "../../../../utils/test-model-helpers/repeat.js";

export function executeValueTests(options: {
	repeatForm: "embedded" | "detached";
	cellIds: {
		string: string;
		number: string;
		boolean: string;
		confirm: string;
		enumeration: string;
		date: string;
		dateTime: string;
		time: string;
		multiSelect: string;
	};
}): void {
	const models = setupModelsFixture("repeat", options.repeatForm);

	describe("given a cell of a field based column", () => {
		describe("based on a string field", () => {
			it("shows the formatted string", async () => {
				const document = createDocumentForRepeat({ nestedL1: [{ L1_String: "A" }] });
				const wrapper = await setupFormEngineRendererWithRtlAsync({
					models,
					data: { document }
				});
				const bodyCell = within(wrapper.baseElement).getById(options.cellIds.string);
				strictEqual(bodyCell.textContent, "A");
			});

			describe("and the underlying field string contains line breaks", () => {
				it("shows the value and a <br /> tag for each line break", async () => {
					const text = "<br>C <br>D <br>E <br>";
					const document = createDocumentForRepeat({ nestedL1: [{ L1_String: text }] });
					const wrapper = await setupFormEngineRendererWithRtlAsync({
						models,
						data: { document }
					});
					const bodyCell = within(wrapper.baseElement).getById(options.cellIds.string);
					const textContent = bodyCell.textContent;

					ok(
						textContent !== null && textContent.indexOf(text) >= 0,
						`Could not find "${text}" in ${textContent}`
					);
				});
			});

			describe("and the underlying field string contains XSS code", () => {
				it("shows the sanitized value", async () => {
					const xssValueDocument = loadData("repeat", "dataForXssValueTest", models.documentModel);
					const wrapper = await setupFormEngineRendererWithRtlAsync({
						models,
						data: { document: xssValueDocument }
					});
					const bodyCell = within(wrapper.baseElement).getById(options.cellIds.string);
					const textContent = bodyCell.textContent;
					strictEqual(textContent, "<img src=x onerror=alert(document.cookie) />");
				});
			});
		});

		describe("based on a number field", () => {
			it("shows the formatted number", async () => {
				const document = createDocumentForRepeat({ nestedL1: [{ L1_Number: 1 }] });
				const wrapper = await setupFormEngineRendererWithRtlAsync({
					models,
					data: { document }
				});
				const bodyCell = within(wrapper.baseElement).getById(options.cellIds.number);
				const textContent = bodyCell.textContent;
				strictEqual(textContent, "1");
			});
		});

		describe("based on a boolean field", () => {
			it("shows the formatted representation for 'true' if the boolean == true", async () => {
				const localizer = defaultLocalizerFactory({ locale: US_LOCALE });

				const document = createDocumentForRepeat({ nestedL1: [{ L1_Boolean: true }] });
				const wrapper = await setupFormEngineRendererWithRtlAsync({
					models,
					data: { document },
					localizer
				});

				const bodyCell = within(wrapper.baseElement).getById(options.cellIds.boolean);
				const textContent = bodyCell.textContent;

				strictEqual(
					textContent?.includes(getLocalizedResource(RESOURCE_KEYS.true, localizer)!),
					true
				);
			});

			it("shows the formatted representation for 'false' if the boolean == false", async () => {
				const localizer = defaultLocalizerFactory({ locale: US_LOCALE });

				const document = createDocumentForRepeat({ nestedL1: [{ L1_Boolean: false }] });
				const wrapper = await setupFormEngineRendererWithRtlAsync({
					models,
					data: { document },
					localizer
				});

				const bodyCell = within(wrapper.baseElement).getById(options.cellIds.boolean);
				const textContent = bodyCell.textContent;
				strictEqual(
					textContent?.includes(getLocalizedResource(RESOURCE_KEYS.false, localizer)!),
					true
				);
			});

			it("shows nothing if the boolean == null", async () => {
				const localizer = defaultLocalizerFactory({ locale: US_LOCALE });

				const document = createDocumentForRepeat({ nestedL1: [{ L1_Boolean: null }] });
				const wrapper = await setupFormEngineRendererWithRtlAsync({
					models,
					data: { document },
					localizer
				});

				const bodyCell = within(wrapper.baseElement).getById(options.cellIds.boolean);
				const textContent = bodyCell.textContent;
				strictEqual(textContent, "");
			});
		});

		describe("based on a confirm field", () => {
			it("shows the formatted representation for 'true' if the confirm == true", async () => {
				const localizer = defaultLocalizerFactory({ locale: US_LOCALE });

				const document = createDocumentForRepeat({ nestedL1: [{ L1_Confirm: true }] });
				const wrapper = await setupFormEngineRendererWithRtlAsync({
					models,
					data: { document },
					localizer,
					locale: US_LOCALE
				});

				const bodyCell = within(wrapper.baseElement).getById(options.cellIds.confirm);
				const textContent = bodyCell.textContent;

				strictEqual(
					textContent?.includes(getLocalizedResource(RESOURCE_KEYS.true, localizer)!),
					true
				);
			});

			it("shows nothing if the confirm == null", async () => {
				const localizer = defaultLocalizerFactory({ locale: US_LOCALE });

				const document = createDocumentForRepeat({ nestedL1: [{ L1_Confirm: null }] });
				const wrapper = await setupFormEngineRendererWithRtlAsync({
					models,
					data: { document },
					localizer
				});

				const bodyCell = within(wrapper.baseElement).getById(options.cellIds.confirm);
				const textContent = bodyCell.textContent;

				strictEqual(textContent, "");
			});
		});

		describe("based on a enumeration field", () => {
			it("shows the localized enumeration value", async () => {
				const document = createDocumentForRepeat({ nestedL1: [{ L1_Enumeration: "V1" }] });
				const wrapper = await setupFormEngineRendererWithRtlAsync({
					models,
					data: { document }
				});

				const bodyCell = within(wrapper.baseElement).getById(options.cellIds.enumeration);
				const textContent = bodyCell.textContent;
				strictEqual(textContent, "red");
			});
		});

		describe("based on a date field", () => {
			it("shows the formatted date", async () => {
				const document = createDocumentForRepeat({
					nestedL1: [{ L1_Date: new Date("2018-05-14") }]
				});
				const wrapper = await setupFormEngineRendererWithRtlAsync({
					models,
					data: { document }
				});

				const bodyCell = within(wrapper.baseElement).getById(options.cellIds.date);
				const textContent = bodyCell.textContent;
				strictEqual(textContent, "05/14/2018");
			});
		});

		describe("based on a date time field", () => {
			it("shows the formatted date time", async () => {
				const document = createDocumentForRepeat({
					nestedL1: [{ L1_DateTime: new Date("2019-05-13T08:00:00.000Z") }]
				});
				const wrapper = await setupFormEngineRendererWithRtlAsync({
					models,
					data: { document }
				});

				const bodyCell = within(wrapper.baseElement).getById(options.cellIds.dateTime);
				const textContent = bodyCell.textContent;
				strictEqual(textContent, "05/13/2019 08:00 AM");
			});
		});

		describe("based on a time field", () => {
			it("shows the formatted time", async () => {
				const document = createDocumentForRepeat({
					nestedL1: [{ L1_Time: new Date("1970-01-01T05:10:00.000Z") }]
				});
				const wrapper = await setupFormEngineRendererWithRtlAsync({
					models,
					data: { document }
				});

				const bodyCell = within(wrapper.baseElement).getById(options.cellIds.time);
				const textContent = bodyCell.textContent;
				strictEqual(textContent, "05:10 AM");
			});
		});

		describe("based on a multi-select group", () => {
			it("shows the single value if only one value is selected", async () => {
				const document = createDocumentForRepeat({
					nestedL1: [{ L1_MultiSelect: [{ value: "V1" }] }]
				});
				const wrapper = await setupFormEngineRendererWithRtlAsync({
					models,
					data: { document }
				});

				const bodyCell = within(wrapper.baseElement).getById(options.cellIds.multiSelect);
				const textContent = bodyCell.textContent;
				strictEqual(textContent, "Value 1");
			});

			it("shows a list oft values if multiple values are selected", async () => {
				const document = createDocumentForRepeat({
					nestedL1: [{ L1_MultiSelect: [{ value: "V1" }, { value: "V2" }] }]
				});
				const wrapper = await setupFormEngineRendererWithRtlAsync({
					models,
					data: { document }
				});

				const bodyCell = within(wrapper.baseElement).getById(options.cellIds.multiSelect);
				const bulletList = within(bodyCell).getByDataRole(BULLET_LIST_UNORDERED);
				const items = within(bulletList).getAllByDataRole(BULLET_LIST_ITEM);
				const labels = items.map(i => i.textContent);

				deepStrictEqual(labels, ["Value 1", "Value 2"]);
			});
		});
	});
}
