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

import {
	InternalUiStateSelectors,
	UiStateSelectors
} from "../../../../../back-end/store/internal/selectors/ui-state.js";
import type { EngineState } from "../../../../../back-end/store/internal/store.js";
import type { EngineStore } from "../../../../../back-end/store/internal/store.js";

/**
 * @internal
 * Collects every validation message the correction mode shows, flattened out of both slices:
 * the messages of document elements (including parse errors) and those of Custom Screen Elements.
 * Callers apply their own ordering.
 */
export function collectValidationMessages(
	state: EngineState
): (EngineStore.Validation.Message | EngineStore.Validation.CustomMessage)[] {
	const messages = UiStateSelectors.messages()(state);
	const customMessages = InternalUiStateSelectors.customMessages()(state);

	return [
		...Object.values(messages).flatMap(message => [
			...(message?.validationMessages ?? []),
			...(message?.parseError ? [message.parseError.message] : [])
		]),
		...Object.values(customMessages).flatMap(entry => entry?.validationMessages ?? [])
	];
}
