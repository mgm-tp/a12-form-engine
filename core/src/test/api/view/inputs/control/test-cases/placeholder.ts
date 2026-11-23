// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { strictEqual } from "node:assert/strict";

import type { Locale } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import { DE_LOCALE, US_LOCALE } from "../../../../../utils/localization.js";
import { setupModelsFixture } from "../../../../../utils/setupFixture.js";
import { IDS } from "../../../../../utils/test-model-helpers/controls.placeholder.js";

import { renderStringInput } from "./renderStringInput.js";

export function executeTestsForPlaceholder(): void {
	const models = setupModelsFixture("controls.placeholder");

	describe("given a form-model with the languages [en, de]", () => {
		describe("and a placeholder text defined for both languages for a control", () => {
			function assertPlaceholder(locale: Locale, elementId: string, value: string): void {
				const modelElement = renderStringInput({ locale, models, elementId });
				strictEqual(modelElement.placeholder, value);
			}
			it("renders a component with prop 'placeholder' which is set to the english placeholder text if the locale is 'en'", () => {
				assertPlaceholder(US_LOCALE, IDS.ID_STRING_FIELD, "Please insert a text");
			});

			it("renders a component with prop 'placeholder' which is set to the german placeholder text if the locale is 'de'", () => {
				assertPlaceholder(DE_LOCALE, IDS.ID_STRING_FIELD, "Bitte Text einfügen");
			});
		});
	});
}
