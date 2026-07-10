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

import { defaultLocalizerFactory } from "@com.mgmtp.a12.utils/utils-localization";
import type { LocalizedText } from "@com.mgmtp.a12.utils/utils-localization";

import type { BaseControlProps, MarkingOfRequiredFields } from "../../../../index.js";
import { GET_LOCALIZED_MODEL_TEXTS_WRAPPER } from "../../../../main/core/contentElements/elementConfiguration/getLocalizedModelTexts.js";
import type { LocalizedModelTexts } from "../../../../main/core/contentElements/elementConfiguration/getLocalizedModelTexts.js";

describe("core.contentElements.elementConfiguration", () => {
	describe("getLocalizedModelTexts", () => {
		it("returns localized texts from the dm if no texts are given at the node", () => {
			const result = setup({ withoutTextsInCM: true });

			strictEqual(result.label, "DM_Label");
			strictEqual(result.hint, "DM_ExternalDescription");
			strictEqual(result.helperText, "DM_HelperText");
		});

		it("returns localized texts from the node if they are given", () => {
			const result = setup({});

			strictEqual(result.label, "CM_Label");
			strictEqual(result.hint, "CM_Hint");
			strictEqual(result.placeholder, "CM_Placeholder");
			strictEqual(result.checkedLabel, "CM_CheckedLabel");
			strictEqual(result.uncheckedLabel, "CM_UncheckedLabel");
		});

		describe("markingOfRequiredFields", () => {
			describe("the field is readonly", () => {
				it("does not add an asterisk to the label even if the field is required", () => {
					const result = setup({ readonly: true, required: true });

					strictEqual(result.label, "CM_Label");
				});
			});

			describe("the field is editable", () => {
				it("does not add an asterisk if no label is given", () => {
					const result = setup({ withoutTextsInCM: true, withoutTextsInDM: true });

					strictEqual(result.label, undefined);
				});

				describe("markingOfRequiredFields === undefined", () => {
					it("adds an asterisk to the label if the field is required", () => {
						const result = setup({ required: true });

						strictEqual(result.label, "CM_Label*");
					});

					it("does not add an asterisk to the label if the field is not required", () => {
						const result = setup({});

						strictEqual(result.label, "CM_Label");
					});
				});

				describe("markingOfRequiredFields === 'ALWAYS'", () => {
					it("adds an asterisk to the label even if the field is not required", () => {
						const result = setup({ globalMarkingOfRequiredFields: "ALWAYS" });

						strictEqual(result.label, "CM_Label*");
					});
				});

				describe("markingOfRequiredFields === 'REQUIRED'", () => {
					it("adds an asterisk to the label if the field is required", () => {
						const result = setup({
							globalMarkingOfRequiredFields: "REQUIRED",
							required: true
						});

						strictEqual(result.label, "CM_Label*");
					});

					it("does not add an asterisk to the label if the field is not required", () => {
						const result = setup({ globalMarkingOfRequiredFields: "REQUIRED" });

						strictEqual(result.label, "CM_Label");
					});
				});

				describe("markingOfRequiredFields === 'NONE'", () => {
					it("does not add an asterisk to the label even if the field is required", () => {
						const result = setup({
							globalMarkingOfRequiredFields: "NONE",
							required: true
						});

						strictEqual(result.label, "CM_Label");
					});
				});

				it("the setting at the node overrides the global setting", () => {
					const result = setup({
						globalMarkingOfRequiredFields: "NONE",
						nodeMarkingOfRequiredFields: "ALWAYS"
					});

					strictEqual(result.label, "CM_Label*");
				});
			});
		});

		describe("suffix", () => {
			it("returns the suffix from the node if it is given", () => {
				const result = setup({});

				strictEqual(result.suffix, "CM_Suffix");
			});

			it("returns the amount suffix if given an amount field and no suffix at the node", () => {
				const result = setup({
					withoutTextsInCM: true,
					isAmountField: true,
					amountSuffixValue: "AmountSuffix"
				});

				strictEqual(result.suffix, "AmountSuffix");
			});
		});
	});
});

function setup(options: {
	withoutTextsInCM?: boolean;
	withoutTextsInDM?: boolean;
	readonly?: boolean;
	required?: boolean;
	nodeMarkingOfRequiredFields?: MarkingOfRequiredFields;
	globalMarkingOfRequiredFields?: MarkingOfRequiredFields;
	isAmountField?: boolean;
	amountSuffixValue?: string;
}): LocalizedModelTexts {
	const {
		withoutTextsInCM,
		withoutTextsInDM,
		readonly,
		required,
		nodeMarkingOfRequiredFields,
		globalMarkingOfRequiredFields,
		isAmountField,
		amountSuffixValue
	} = options;

	const cmTexts = {
		label: localizedText("CM_Label"),
		hint: localizedText("CM_Hint"),
		placeholder: localizedText("CM_Placeholder"),
		checkedLabel: localizedText("CM_CheckedLabel"),
		uncheckedLabel: localizedText("CM_UncheckedLabel"),
		suffix: localizedText("CM_Suffix")
	};

	const dmTexts = {
		label: localizedText("DM_Label"),
		externalDescription: localizedText("DM_ExternalDescription"),
		helperText: localizedText("DM_HelperText")
	};

	return GET_LOCALIZED_MODEL_TEXTS_WRAPPER.getLocalizedModelTexts({
		contentModelName: "test-model",
		documentModelName: "test-document-model",
		dataReference: "",
		node: {
			id: "test-node",
			namespace: "test-namespace",
			type: "test-element-type",
			props: {
				elementId: "test-element-id",
				...(!withoutTextsInCM ? cmTexts : {}),
				markingOfRequiredFields: nodeMarkingOfRequiredFields
			} satisfies BaseControlProps
		},
		dmElement: {
			id: "test-element",
			name: "test-name",
			type: "Field",
			fieldType: {
				type: "NumberType",
				trait: isAmountField ? "amount" : undefined
			},
			...(!withoutTextsInDM ? dmTexts : {})
		},
		readonly: readonly ?? false,
		required: required ?? false,
		markingOfRequiredFields: globalMarkingOfRequiredFields,
		amountSuffixValue,
		localizer: defaultLocalizerFactory({ locale: { language: "en" } })
	});
}

function localizedText(text: string): LocalizedText[] {
	return [{ locale: "en", text }];
}
