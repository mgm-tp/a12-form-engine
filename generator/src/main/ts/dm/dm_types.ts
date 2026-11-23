// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";

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
