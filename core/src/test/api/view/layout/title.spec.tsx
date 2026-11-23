// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
