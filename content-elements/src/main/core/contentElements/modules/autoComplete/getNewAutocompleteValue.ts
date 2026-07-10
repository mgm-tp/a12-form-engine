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

import type { DropDownItem } from "@com.mgmtp.a12.widgets/widgets-core";

/** @internal */
export function getNewAutocompleteValue(
	selectedValue: string | DropDownItem,
	items: { label: string; value: string }[],
	allowAddingNewItem: boolean
): string | null {
	const stringValue =
		typeof selectedValue === "string" // else DropDownItem
			? selectedValue.trim()
			: // use value for pre-defined enum options
				// use label for new items (e.g. custom values for strings with hintList)
				(selectedValue.value ?? selectedValue.label);

	// unset autocomplete when entered an empty string
	const value = stringValue ? stringValue : null;

	/*
	 * If for the autocomplete adding custom values is allowed and the new value is not
	 * amongst the known items, then, despite being a ui value, it is used as the new
	 * internal value. Otherwise null.
	 */
	const item = items.find(i => i.value === value);
	const newItem = allowAddingNewItem ? value : null;

	return item ? item.value : newItem;
}
