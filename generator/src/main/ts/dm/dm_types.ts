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

import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade";

/*
 * These function provide some plain type-asserts plus useful abstractions that
 * make handling of "logical fields" like attachment / multi-select easier.
 *
 * Note: "logical fields" (like physical fields, i.e. elements of type
 * DocumentModel.Field) cannot be repeatable, however the group of multi-select
 * is (physically) repeatable.
 */

// a physical group
export function isGroup(element: DocumentModel.Element): element is DocumentModel.Group {
	return element.type === "Group";
}

// a physical field
export function isField(element: DocumentModel.Element): element is DocumentModel.Field {
	return element.type === "Field";
}

// a logical repeatable group
export function isRepeatable(group: DocumentModel.Group): group is DocumentModel.Group {
	return group.repeatability > 1 && !isFieldLike(group);
}

// this is how kernel defines groups that behave like fields
interface FieldLikeGroup extends DocumentModel.Group {
	usageType: "attachment" | "multi-select";
}

// a logical field (=physical field or group that behaves like a field)
export type FieldLike = DocumentModel.Field | FieldLikeGroup;

export function isFieldLike(element: DocumentModel.Element): element is FieldLike {
	return (
		isField(element) || element.usageType === "attachment" || element.usageType === "multi-select"
	);
}

// a logical group
export function isGroupLike(element: DocumentModel.Element): element is DocumentModel.Group {
	return !isFieldLike(element);
}

export function getLocales(documentModel: DocumentModel): string[] {
	return documentModel.header.locales?.map(l => l.code) || [];
}

export function localeFromString(code: string) {
	return { code };
}
