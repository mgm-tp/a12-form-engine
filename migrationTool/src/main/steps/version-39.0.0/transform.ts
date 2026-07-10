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

import type { FormModel as OldFormModel } from "../version-38.0.0/FormModel.js";

import type { FormModel } from "./FormModel.js";

export default function (model: OldFormModel): FormModel {
	const annotation = model.header.annotations?.find(
		annotation => annotation.name === "bindingConfiguration"
	);

	if (annotation?.value) {
		(annotation as { value: string }).value = transformBindingConfigEditDialogWidths(
			annotation.value
		);
	}

	return model as FormModel;
}

function transformBindingConfigEditDialogWidths(bindingConfig: string): string {
	const entries: unknown[] = JSON.parse(bindingConfig);

	for (const entry of entries) {
		if (!isRelationshipEntry(entry)) {
			continue;
		}
		for (const component of entry.details.components ?? []) {
			const props = component.props;
			if (props === undefined || !("editDialogWidth" in props)) {
				continue;
			}
			const { editDialogWidth } = props;
			if (typeof editDialogWidth === "number") {
				props.editDialogWidth = String(editDialogWidth);
			} else if (typeof editDialogWidth !== "string") {
				throw new Error(
					`Unexpected type "${typeof editDialogWidth}" for "editDialogWidth" in bindingConfiguration component "${component.name ?? "(unknown)"}". Expected number or string.`
				);
			}
		}
	}

	return JSON.stringify(entries);
}

interface RelationshipEntry {
	type: "relationship";
	details: {
		components?: Array<{
			name?: string;
			props?: Record<string, unknown>;
		}>;
	};
}

function isRelationshipEntry(entry: unknown): entry is RelationshipEntry {
	return (
		typeof entry === "object" &&
		entry !== null &&
		(entry as RelationshipEntry).type === "relationship"
	);
}
