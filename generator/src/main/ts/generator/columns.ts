// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

import { documentModelDFS } from "../dm/dm_dfs.js";
import { documentModelMap } from "../dm/dm_filter.js";
import type { FieldLike } from "../dm/dm_types.js";
import { isFieldLike, isGroup, isRepeatable } from "../dm/dm_types.js";
import type { FormModel } from "../form_model.js";

export function createColumns(group: DocumentModel.Group): FormModel.RepeatOverviewColumn[] {
	const uniqueFields = getUniqueFields(group);

	return uniqueFields.map(createColumn);
}

// select unique fields by removing all repeatables
function getUniqueFields(g: DocumentModel.Group): FieldLike[] {
	const onlyUniqueGroups = documentModelMap(removeRepeatableChildren).apply(g);
	return documentModelDFS(onlyUniqueGroups).filter(isFieldLike);
}

function removeRepeatableChildren(e: DocumentModel.Element): DocumentModel.Element {
	return isGroup(e)
		? {
				...e,
				elements: e.elements.filter(nonRepeatable)
			}
		: e;
}

function nonRepeatable(e: DocumentModel.Element) {
	return !(isGroup(e) && isRepeatable(e));
}

function createColumn(fieldLike: FieldLike): FormModel.FieldOverviewColumn {
	return {
		type: "FieldBasedRepeatOverviewColumn",
		id: `Column_for_${fieldLike.id}`,
		elementRef: fieldLike.id
	};
}
