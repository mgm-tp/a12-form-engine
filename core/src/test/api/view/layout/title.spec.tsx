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

import { strictEqual } from "node:assert/strict";

import { query } from "@com.mgmtp.a12.devtools/react";

import { DefaultComponentMap } from "../../../../view/internal/configuration/componentMap/DefaultComponentMap.js";
import { rtlRenderWrapperAsync } from "../../../rtl-utils/render-wrapper.js";

describe("api.view.layout", () => {
	describe("Title", () => {
		describe("Given an aria-level", () => {
			describe("and a text", () => {
				describe("with an aria-level smaller than 1", () => {
					it("sets level = 2 for the Typography widget, but does not set an aria-level", async () => {
						const wrapper = await rtlRenderWrapperAsync(
							<DefaultComponentMap.Title text={"Test"} initialAriaLevel={1} ariaLevel={-1} />
						);

						const headline = query(wrapper.widgetMap.TypographyHeadline).props();

						strictEqual(headline.level, 2);
						strictEqual(headline.ariaLevel, undefined);
					});
				});

				describe("with an aria-level between 1 and 5", () => {
					describe("and an initialAriaLevel of 1", () => {
						it("sets the given aria-level and computes the correct level for the Typography widget", async () => {
							const wrapper = await rtlRenderWrapperAsync(
								<DefaultComponentMap.Title text={"Test"} initialAriaLevel={1} ariaLevel={3} />
							);

							const headline = query(wrapper.widgetMap.TypographyHeadline).props();

							strictEqual(headline.level, 3);
							strictEqual(headline.ariaLevel, 3);
						});
					});

					describe("and an initialAriaLevel of 2", () => {
						it("sets the given aria-level and computes the correct level for the Typography widget", async () => {
							const wrapper = await rtlRenderWrapperAsync(
								<DefaultComponentMap.Title text={"Test"} initialAriaLevel={2} ariaLevel={3} />
							);

							const headline = query(wrapper.widgetMap.TypographyHeadline).props();

							strictEqual(headline.level, 2);
							strictEqual(headline.ariaLevel, 3);
						});
					});
				});

				describe("with an aria-level greater than 5", () => {
					it("sets the given aria-level and computes the correct level for the Typography widget", async () => {
						const wrapper = await rtlRenderWrapperAsync(
							<DefaultComponentMap.Title text={"Test"} initialAriaLevel={1} ariaLevel={7} />
						);

						const headline = query(wrapper.widgetMap.TypographyHeadline).props();

						strictEqual(headline.level, 5);
						strictEqual(headline.ariaLevel, 7);
					});
				});
			});

			describe("and no text", () => {
				it("computes the correct level for the Typography widget, but does not set an aria-level", async () => {
					const wrapper = await rtlRenderWrapperAsync(
						<DefaultComponentMap.Title initialAriaLevel={1} ariaLevel={3} />
					);

					const headline = query(wrapper.widgetMap.TypographyHeadline).props();

					strictEqual(headline.level, 3);
					strictEqual(headline.ariaLevel, undefined);
				});
			});
		});

		describe("Given no aria-level", () => {
			it("sets level 2 for the Typography widget, but does not set an aria-level", async () => {
				const wrapper = await rtlRenderWrapperAsync(
					<DefaultComponentMap.Title initialAriaLevel={1} />
				);

				const headline = query(wrapper.widgetMap.TypographyHeadline).props();

				strictEqual(headline.level, 2);
				strictEqual(headline.ariaLevel, undefined);
			});
		});

		describe("Given collapsed = true", () => {
			it("sets collapsible = true for the Typography widget", async () => {
				const wrapper = await rtlRenderWrapperAsync(<DefaultComponentMap.Title collapsed />);

				const headline = query(wrapper.widgetMap.TypographyHeadline).props();

				strictEqual(headline.collapsible, true);
			});
		});

		describe("Given onCollapsingChange", () => {
			it("sets collapsible = true for the Typography widget", async () => {
				const wrapper = await rtlRenderWrapperAsync(
					<DefaultComponentMap.Title onCollapsingChange={() => {}} />
				);

				const headline = query(wrapper.widgetMap.TypographyHeadline).props();

				strictEqual(headline.collapsible, true);
			});
		});

		describe("Given no collapsed = undefined and onCollapsingChange = undefined", () => {
			it("sets collapsible = undefined for the Typography widget", async () => {
				const wrapper = await rtlRenderWrapperAsync(<DefaultComponentMap.Title />);

				const headline = query(wrapper.widgetMap.TypographyHeadline).props();

				strictEqual(headline.collapsible, undefined);
			});
		});
	});
});
