// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { strictEqual } from "node:assert/strict";

import { screen, within } from "@com.mgmtp.a12.devtools/react";

import type { Models } from "../../../../../back-end/store/index.js";
import { ICON } from "../../../../rtl-utils/data-roles.js";
import { DE_LOCALE } from "../../../../utils/localization.js";
import { SetupHelpers } from "../../../../utils/setup.js";
import { BUTTONS } from "../../../../utils/test-model-helpers/button.melies.js";
import {
	createDocumentPath,
	createModelPath
} from "../../../../utils/test-model-helpers/dependent-enumeration.js";

const { setupFormEngineRendererWithRtl } = SetupHelpers;

export function testIconTheme(params: {
	models: Models;
	filledId: string;
	outlinedId: string;
	customId: string;
}): void {
	const { models, filledId, outlinedId, customId } = params;

	function setup(): void {
		setupFormEngineRendererWithRtl({
			models,
			locale: DE_LOCALE,
			data: {},
			ui: {
				screenLocation: [
					{
						path: createDocumentPath(),
						locationPath: createModelPath(BUTTONS.iconThemes)
					}
				]
			}
		});
	}

	describe("icon", () => {
		it(`renders the correct icon theme from the buttons icon theme in the model`, () => {
			setup();

			const iconThemeFilled = findButtonIconTheme(filledId);
			strictEqual(iconThemeFilled, null, "Expected iconTheme to be undefined");

			const iconThemeOutlined = findButtonIconTheme(outlinedId);
			strictEqual(iconThemeOutlined, "outlined", "Expected iconTheme to be 'outlined'");

			const iconThemeCustom = findButtonIconTheme(customId);
			strictEqual(iconThemeCustom, "custom", "Expected iconTheme to be 'custom'");
		});

		function findButtonIconTheme(id: string) {
			const icon = within(screen.getById(id)).getByDataRole(ICON);
			return icon.getAttribute("data-icon-theme");
		}
	});
}
