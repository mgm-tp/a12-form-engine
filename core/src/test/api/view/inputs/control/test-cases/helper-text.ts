// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
