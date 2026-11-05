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

import type { Models } from "../../../back-end/store/index.js";
import type { FormModel } from "../../../models/index.js";

/**
 * The `enablement.readonly` fixture's `stringFieldArea` control (`exposition: "AREA"`),
 * repurposed as a markdown control by {@link withMarkdownEditor}.
 */
export const MARKDOWN = {
	CONTROL_ID: "a12-stringFieldArea-fieldimpl_f9a56",
	FCE_KEY: "/rootGroup/stringFieldArea"
} as const;

/**
 * Returns a copy of `models` with the `stringFieldArea` field's `exposition` cleared and
 * `isMarkdownEditor` set, so the fixture's plain multiline control renders as a
 * {@link MARKDOWN.CONTROL_ID markdown control} instead.
 */
export function withMarkdownEditor(models: Models): Models {
	const fieldMap = models.formModel.content.fieldConfiguration.fieldMap;
	const currentEntry = fieldMap[MARKDOWN.FCE_KEY];
	if (!currentEntry) {
		throw new Error(
			`Fixture is missing the expected field configuration entry: ${MARKDOWN.FCE_KEY}`
		);
	}
	const patchedEntry: FormModel.FieldConfigurationEntry = {
		...currentEntry,
		exposition: undefined,
		isMarkdownEditor: true
	};

	return {
		...models,
		formModel: {
			...models.formModel,
			content: {
				...models.formModel.content,
				fieldConfiguration: {
					...models.formModel.content.fieldConfiguration,
					fieldMap: {
						...fieldMap,
						[MARKDOWN.FCE_KEY]: patchedEntry
					}
				}
			}
		}
	};
}
