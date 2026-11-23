// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { SupportedType } from "@com.mgmtp.a12.utils/utils-localization/lib/main/conversion.js";

/** @internal */
export function parse(input: string): FilterNode;

/** @internal */
export type Node = FilterNode | GroupNode | FieldNode | StringNode;

/** @internal */
export type ParsedFilterNode = {
	readonly type: "filter";
	readonly content: SupportedType;
	readonly context: GroupNode | FieldNode;
	readonly operation: "=" | "!=";
};

/** @internal */
export type FilterNode = {
	readonly type: "filter";
	readonly content: string;
	readonly context: GroupNode | FieldNode;
	readonly operation: "=" | "!=";
};

/** @internal */
export type GroupNode = {
	readonly type: "group";
	readonly name: string;
	readonly context: GroupNode | FieldNode;
};

/** @internal */
export type FieldNode = {
	readonly type: "field";
	readonly name: string;
};

/** @internal */
export type StringNode = {
	readonly type: "string";
	readonly content: string;
};
