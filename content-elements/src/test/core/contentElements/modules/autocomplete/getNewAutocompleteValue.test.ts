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

import type { DropDownItem } from "@com.mgmtp.a12.widgets/widgets-core";

import { getNewAutocompleteValue } from "../../../../../main/core/contentElements/modules/autoComplete/getNewAutocompleteValue.js";

describe("core.contentElements", () => {
	describe("getNewAutocompleteValue", () => {
		function items() {
			return [
				{ label: "Option A", value: "A" },
				{ label: "Option B", value: "B" },
				{ label: "Option C", value: "C" }
			];
		}

		describe("string input", () => {
			it("returns matching item value when input matches an item value", () => {
				const result = getNewAutocompleteValue("A", items(), false);

				strictEqual(result, "A");
			});

			it("returns matching item value when input matches an item value with whitespace", () => {
				const result = getNewAutocompleteValue("  A  ", items(), false);

				strictEqual(result, "A");
			});

			it("returns null when input does not match any item and allowAddingNewItem is false", () => {
				const result = getNewAutocompleteValue("D", items(), false);

				strictEqual(result, null);
			});

			it("returns trimmed input value when input does not match any item and allowAddingNewItem is true", () => {
				const result = getNewAutocompleteValue("  D  ", items(), true);

				strictEqual(result, "D");
			});

			it("returns null when input is empty string regardless of allowAddingNewItem", () => {
				const result1 = getNewAutocompleteValue("", items(), false);
				const result2 = getNewAutocompleteValue("", items(), true);

				strictEqual(result1, null);
				strictEqual(result2, null);
			});

			it("returns null when input is whitespace-only string regardless of allowAddingNewItem", () => {
				const result1 = getNewAutocompleteValue("   ", items(), false);
				const result2 = getNewAutocompleteValue("   ", items(), true);

				strictEqual(result1, null);
				strictEqual(result2, null);
			});
		});

		describe("DropDownItem input with value", () => {
			it("returns matching item value when DropDownItem.value matches an item", () => {
				const dropdownItem: DropDownItem = { label: "Option A", value: "A" };
				const result = getNewAutocompleteValue(dropdownItem, items(), false);

				strictEqual(result, "A");
			});

			it("returns null when DropDownItem.value does not match any item and allowAddingNewItem is false", () => {
				const dropdownItem: DropDownItem = { label: "Custom", value: "D" };
				const result = getNewAutocompleteValue(dropdownItem, items(), false);

				strictEqual(result, null);
			});

			it("returns DropDownItem.value when it does not match any item and allowAddingNewItem is true", () => {
				const dropdownItem: DropDownItem = { label: "Custom", value: "D" };
				const result = getNewAutocompleteValue(dropdownItem, items(), true);

				strictEqual(result, "D");
			});

			it("handles DropDownItem with empty value", () => {
				const dropdownItem: DropDownItem = { label: "Empty", value: "" };
				const result1 = getNewAutocompleteValue(dropdownItem, items(), false);
				const result2 = getNewAutocompleteValue(dropdownItem, items(), true);

				strictEqual(result1, null);
				strictEqual(result2, null);
			});
		});

		describe("DropDownItem input without value (only label)", () => {
			it("returns matching item value when DropDownItem.label matches an item value", () => {
				const dropdownItem: DropDownItem = { label: "A" };
				const result = getNewAutocompleteValue(dropdownItem, items(), false);

				strictEqual(result, "A");
			});

			it("returns null when DropDownItem.label does not match any item and allowAddingNewItem is false", () => {
				const dropdownItem: DropDownItem = { label: "Custom Label" };
				const result = getNewAutocompleteValue(dropdownItem, items(), false);

				strictEqual(result, null);
			});

			it("returns DropDownItem.label when it does not match any item and allowAddingNewItem is true", () => {
				const dropdownItem: DropDownItem = { label: "Custom Label" };
				const result = getNewAutocompleteValue(dropdownItem, items(), true);

				strictEqual(result, "Custom Label");
			});

			it("handles DropDownItem with empty label", () => {
				const dropdownItem: DropDownItem = { label: "" };
				const result1 = getNewAutocompleteValue(dropdownItem, items(), false);
				const result2 = getNewAutocompleteValue(dropdownItem, items(), true);

				strictEqual(result1, null);
				strictEqual(result2, null);
			});
		});
	});
});
