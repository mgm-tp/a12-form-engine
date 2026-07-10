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

import { screen, within } from "@com.mgmtp.a12.devtools/react";

import type { Models } from "../../../../../back-end/store/index.js";
import { ICON } from "../../../../rtl-utils/data-roles.js";
import { createDocumentPath } from "../../../../utils/createDocumentPath.js";
import { createModelPath } from "../../../../utils/createModelPath.js";
import { DE_LOCALE } from "../../../../utils/localization.js";
import { setupFormEngineRendererWithRtl } from "../../../../utils/setup.js";
import { BUTTONS } from "../../../../utils/test-model-helpers/button.form.js";

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
