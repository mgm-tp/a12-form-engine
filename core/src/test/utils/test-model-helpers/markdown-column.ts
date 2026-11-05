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

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";

import type { Models } from "../../../back-end/store/index.js";
import type { FormModel } from "../../../models/index.js";

import { createModelPath } from "../createModelPath.js";

/**
 * The `repeat.inline` fixture's `L1_String` repeat overview column
 * (`fieldbasedrepeatoverviewcolumn-2c388`, field `F18`), repurposed as a markdown column by
 * {@link withMarkdownColumnEditor}. Unlike the `enablement.readonly` fixture's
 * `stringFieldArea` used for the plain-Control markdown tests, this field has no field
 * configuration entry in the fixture to begin with, so the entry is added rather than patched.
 */
export const MARKDOWN_COLUMN = {
	CELL_ID: "a12-fieldbasedrepeatoverviewcolumn-2c388-cell-0",
	ELEMENT_PATH: createModelPath("Root", "Nested_L1", "L1_String"),
	ELEMENT_REF: "F18",
	/** Arbitrary - only used to verify it round-trips to the widget's props unchanged. */
	ATTACHMENT_PATH: createModelPath("Screen1", "markdownImages")
} as const;

/**
 * Returns a copy of `models` with the `L1_String` repeat overview column's `isMarkdownEditor`
 * set and `markdownAttachmentRepeatPath` set to {@link MARKDOWN_COLUMN.ATTACHMENT_PATH}, so
 * it renders as a markdown control instead of a plain text cell.
 */
export function withMarkdownColumnEditor(models: Models): Models {
	const fieldMap = models.formModel.content.fieldConfiguration.fieldMap;
	const patchedEntry: FormModel.FieldConfigurationEntry = {
		elementRef: MARKDOWN_COLUMN.ELEMENT_REF,
		elementPath: MARKDOWN_COLUMN.ELEMENT_PATH,
		isMarkdownEditor: true,
		markdownAttachmentRepeatPath: MARKDOWN_COLUMN.ATTACHMENT_PATH
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
						[ModelPath.toString(MARKDOWN_COLUMN.ELEMENT_PATH)]: patchedEntry
					}
				}
			}
		}
	};
}
