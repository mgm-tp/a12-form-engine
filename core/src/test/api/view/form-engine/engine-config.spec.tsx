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

import { strictEqual } from "node:assert/strict";
import { mock } from "node:test";

import { query } from "@com.mgmtp.a12.devtools/react";

import { createEngineStore } from "../../../../back-end/store/index.js";
import { createConfig } from "../../../../view/internal/configuration/Defaults.js";
import { getWidgetMocks } from "../../../rtl-utils/getWidgetMocks.js";
import { DE_LOCALE } from "../../../utils/localization.js";
import { SetupHelpers } from "../../../utils/setup.js";
import { setupFixture, setupModelsFixture } from "../../../utils/setupFixture.js";

const CustomContentBox = mock.fn(() => <div>CUSTOM</div>);
const WIDGET_MAP = { ...getWidgetMocks(), ActionContentbox: CustomContentBox };

describe("api.view.engine-configuration", () => {
	const models = setupModelsFixture("buttons");
	describe("widgetMap", () => {
		it("will be set to the config if it is given", () => {
			const state = createEngineStore({
				models,
				data: {},
				locale: DE_LOCALE
			});
			const config = createConfig(
				{
					widgetMap: WIDGET_MAP
				},
				state
			);
			strictEqual(config.widgetMap, WIDGET_MAP, "given widgetMap set to config");
		});
	});

	describe("ariaLevel", () => {
		const fixture = setupFixture(() => {
			const state = createEngineStore({
				models,
				data: {},
				locale: DE_LOCALE
			});

			return {
				state
			};
		});

		it("is set to the given value in the config", () => {
			const config = createConfig(
				{
					ariaLevel: 2
				},
				fixture.state
			);
			strictEqual(config.ariaLevel, 2, "given aria level set in config");
		});

		it("defaults to 1 in the config if not given", () => {
			const config = createConfig({}, fixture.state);
			strictEqual(config.ariaLevel, 1, "default aria level 1 set in config");
		});
	});

	describe("ContentBox", () => {
		it("uses the `ActionContentbox` widget as default", async () => {
			const wrapper = await SetupHelpers.setupFormEngineRendererWithRtlAsync({
				models
			});
			query(wrapper.widgetMap.ActionContentbox).assertRendered();
		});

		it("will use a different component instead of the `ActionContentbox` widget if it is configured", async () => {
			SetupHelpers.setupFormEngineRendererWithRtlAsync({
				models,
				config: {
					widgetMap: WIDGET_MAP
				}
			});
			query(CustomContentBox).assertRendered();
		});
	});
});
