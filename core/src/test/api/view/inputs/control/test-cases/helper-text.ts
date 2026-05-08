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

import type { Locale } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import { DE_LOCALE, US_LOCALE } from "../../../../../utils/localization.js";
import { setupModelsFixture } from "../../../../../utils/setupFixture.js";
import { IDS } from "../../../../../utils/test-model-helpers/controls.helper-text.js";

import { renderStringInput } from "./renderStringInput.js";

export function executeTestsForHelperText(): void {
	const models = setupModelsFixture("controls.helper-text");

	describe("given a form-model with the languages [en, de]", () => {
		describe("and a helper text defined for both languages for a control", () => {
			function assertHelperText(opts: { locale: Locale; helperText: string }): void {
				const { locale, helperText } = opts;
				const modelElement = renderStringInput({
					locale,
					models,
					elementId: IDS.ID_STRING_FIELD
				});
				strictEqual(modelElement.helperText, helperText);
			}

			it("renders a component with prop 'helperText' which is set to the english helperText text if the locale is 'en'", () => {
				assertHelperText({ locale: US_LOCALE, helperText: "String Helper Text (en)" });
			});

			it("renders a component with prop 'helperText' which is set to the german helperText text if the locale is 'de'", () => {
				assertHelperText({ locale: DE_LOCALE, helperText: "String Helper Text (de)" });
			});
		});
	});
}
