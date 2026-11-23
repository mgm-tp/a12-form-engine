// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import type { Models } from "../../../../../../back-end/store/internal/store.js";

import type { FieldBasedProps, GroupBasedProps } from "./input-utils.js";
import { executeAriaDescribedbyTest } from "./test-cases/aria-describedby.js";
import { executeAriaRequiredTest } from "./test-cases/aria-required.js";
import { executeAutocompleteTest } from "./test-cases/autocomplete.js";
import { executeDisabledTest } from "./test-cases/disabled.js";
import { executeHelperTextTest } from "./test-cases/helper-text.js";
import { executeTestForHintTooltips } from "./test-cases/hintTooltip.js";
import { executeTestForLabel } from "./test-cases/label.js";
import { executeLabelHiddenButReadTest } from "./test-cases/labelHiddenButRead.js";
import { executePlaceholderTest } from "./test-cases/placeholder.js";
import { executeReadonlyTest } from "./test-cases/readonly.js";
import { executeSuffixTest } from "./test-cases/suffix.js";
import { executeTooltipsOnTopTest } from "./test-cases/tooltipsOnTop.js";
import { executeTruncateSuffixTest } from "./test-cases/truncateSuffix.js";
import { executeValidationMessagesTest } from "./test-cases/validation-messages.js";
import { executeTestForValidationTooltips } from "./test-cases/validationTooltips.js";

export interface TestsToExecute {
	/** Default: true */
	readonly readOnlyTest: false;
	/** Default: true */
	readonly validationMessageTest: false;
	/** Default: true */
	readonly tooltipsOnTopTest: false;
	/** Default: false */
	readonly suffixTest: true;
	/** Default: true */
	readonly errorWarningPropTest: false;
	/** Default: true */
	readonly labelTest: false;
	/** Default: true */
	readonly labelHiddenButReadTest: false;
	/** Default: false */
	readonly truncateSuffixTest: true;
	/** Default: true */
	readonly disabledTest: false;
	/** Default: true */
	readonly placeholderTest: false;
	/** Default: true */
	readonly validationTooltipsTest: false;
	/** Default: true */
	readonly hintTooltipTest: false;
	/** Default: true */
	readonly ariaRequiredTest: false;
	/** Default: true */
	readonly ariaDescribedbyTest: false;
	/** Default: true */
	readonly helperTextTest: false;
	/** Default: true */
	readonly autoCompleteTest: false;
}

/**
 * Tests the following props:
 * read-only
 * label
 * labelHiddenButRead
 * toolTipsOnTop
 * suffix
 * truncateSuffix
 * disabled
 * placeholder
 * autocomplete
 *
 * error message box???
 */
export function inputTest<T extends DocumentModel.FieldType>(
	models: () => Models,
	baseProps: FieldBasedProps<T> | GroupBasedProps,
	testToExecute?: Partial<TestsToExecute>
): void {
	if (testToExecute?.readOnlyTest !== false) {
		describe("readonly", () => {
			executeReadonlyTest(models, baseProps);
		});
	}

	if (testToExecute?.validationMessageTest !== false) {
		describe("Validation messages", () => {
			executeValidationMessagesTest(
				models,
				baseProps,
				testToExecute?.errorWarningPropTest || false
			);
		});
	}

	if (testToExecute?.tooltipsOnTopTest !== false) {
		describe("tooltipsOnTop", () => {
			executeTooltipsOnTopTest(models, baseProps);
		});
	}

	if (testToExecute?.labelTest !== false) {
		describe("label", () => {
			executeTestForLabel(models, baseProps);
		});
	}

	if (testToExecute?.labelHiddenButReadTest !== false) {
		describe("labelHiddenButRead", () => {
			executeLabelHiddenButReadTest(models, baseProps);
		});
	}

	if (testToExecute?.suffixTest === true) {
		describe("suffix", () => {
			executeSuffixTest(models, baseProps);
		});
	}

	if (testToExecute?.truncateSuffixTest === true) {
		describe("truncateSuffix", () => {
			executeTruncateSuffixTest(models, baseProps);
		});
	}

	if (testToExecute?.disabledTest !== false) {
		describe("disabled", () => {
			executeDisabledTest(models, baseProps);
		});
	}

	if (testToExecute?.placeholderTest !== false) {
		describe("placeholder", () => {
			executePlaceholderTest(models, baseProps);
		});
	}

	if (testToExecute?.validationTooltipsTest !== false) {
		describe("validation tooltips", () => {
			executeTestForValidationTooltips(models, baseProps);
		});
	}

	if (testToExecute?.hintTooltipTest !== false) {
		describe("hint tooltips", () => {
			executeTestForHintTooltips(models, baseProps);
		});
	}

	if (testToExecute?.ariaRequiredTest !== false) {
		describe("aria-required", () => {
			executeAriaRequiredTest(models, baseProps);
		});
	}

	if (testToExecute?.ariaDescribedbyTest !== false) {
		describe("aria-describedby", () => {
			executeAriaDescribedbyTest(models, baseProps, testToExecute?.suffixTest);
		});
	}

	if (testToExecute?.helperTextTest !== false) {
		describe("helper text", () => {
			executeHelperTextTest(models, baseProps);
		});
	}

	if (testToExecute?.autoCompleteTest !== false) {
		describe("autocomplete", () => {
			executeAutocompleteTest(models, baseProps);
		});
	}
}
