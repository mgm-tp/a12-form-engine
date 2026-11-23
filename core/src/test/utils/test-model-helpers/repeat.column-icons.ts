// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

export namespace IDS {
	export const ID_INLINE_REPEAT = "a12-inlinerepeat-675ac-table";
	export const ID_DETACHED_REPEAT = "a12-detachedrepeat-98492-table";
	export const ID_EMBEDDED_REPEAT = "a12-embeddedrepeat-e62fb-table";

	export interface TestTableColumns {
		FIELD_COLUMN: string;
		FIELD_COLUMN_ICON: string;
		FIELD_COLUMN_ICON_LABEL_HIDDEN: string;
		FIELD_COLUMN_ICON_LABEL_HIDDEN_HINT: string;
		FIELD_COLUMN_ICON_HINT: string;
		FIELD_COLUMN_HINT: string;
		FIELD_COLUMN_LABEL_HIDDEN: string;
		FIELD_COLUMN_LABEL_HIDDEN_HINT: string;

		EXPR_COLUMN: string;
		EXPR_COLUMN_ICON: string;
		EXPR_COLUMN_ICON_LABEL_HIDDEN: string;
		EXPR_COLUMN_LABEL_HIDDEN: string;
	}

	export const IR_COLUMNS: TestTableColumns = {
		FIELD_COLUMN: "fieldbasedrepeatoverviewcolumn-cff2c",
		FIELD_COLUMN_ICON: "fieldbasedrepeatoverviewcolumn-ab684",
		FIELD_COLUMN_ICON_LABEL_HIDDEN: "fieldbasedrepeatoverviewcolumn-39e96",
		FIELD_COLUMN_ICON_LABEL_HIDDEN_HINT: "fieldbasedrepeatoverviewcolumn-3992c",
		FIELD_COLUMN_ICON_HINT: "fieldbasedrepeatoverviewcolumn-c1f7b",
		FIELD_COLUMN_HINT: "fieldbasedrepeatoverviewcolumn-4cea7",
		FIELD_COLUMN_LABEL_HIDDEN: "fieldbasedrepeatoverviewcolumn-a266f",
		FIELD_COLUMN_LABEL_HIDDEN_HINT: "fieldbasedrepeatoverviewcolumn-74629",

		EXPR_COLUMN: "expressionrepeatoverviewcolumn-b96a8",
		EXPR_COLUMN_ICON: "expressionrepeatoverviewcolumn-b5e6a",
		EXPR_COLUMN_ICON_LABEL_HIDDEN: "expressionrepeatoverviewcolumn-06773",
		EXPR_COLUMN_LABEL_HIDDEN: "expressionrepeatoverviewcolumn-c812c"
	};

	export const DR_COLUMNS: TestTableColumns = {
		FIELD_COLUMN: "fieldbasedrepeatoverviewcolumn-32339",
		FIELD_COLUMN_ICON: "fieldbasedrepeatoverviewcolumn-de426",
		FIELD_COLUMN_ICON_LABEL_HIDDEN: "fieldbasedrepeatoverviewcolumn-417de",
		FIELD_COLUMN_ICON_LABEL_HIDDEN_HINT: "fieldbasedrepeatoverviewcolumn-3345d",
		FIELD_COLUMN_ICON_HINT: "fieldbasedrepeatoverviewcolumn-b89f4",
		FIELD_COLUMN_HINT: "fieldbasedrepeatoverviewcolumn-9f881",
		FIELD_COLUMN_LABEL_HIDDEN: "fieldbasedrepeatoverviewcolumn-34f84",
		FIELD_COLUMN_LABEL_HIDDEN_HINT: "fieldbasedrepeatoverviewcolumn-bccba",

		EXPR_COLUMN: "expressionrepeatoverviewcolumn-af651",
		EXPR_COLUMN_ICON: "expressionrepeatoverviewcolumn-114be",
		EXPR_COLUMN_ICON_LABEL_HIDDEN: "expressionrepeatoverviewcolumn-b5110",
		EXPR_COLUMN_LABEL_HIDDEN: "expressionrepeatoverviewcolumn-bdfec"
	};

	export const ER_COLUMNS: TestTableColumns = {
		FIELD_COLUMN: "fieldbasedrepeatoverviewcolumn-6f543",
		FIELD_COLUMN_ICON: "fieldbasedrepeatoverviewcolumn-e4cb7",
		FIELD_COLUMN_ICON_LABEL_HIDDEN: "fieldbasedrepeatoverviewcolumn-910a5",
		FIELD_COLUMN_ICON_LABEL_HIDDEN_HINT: "fieldbasedrepeatoverviewcolumn-99907",
		FIELD_COLUMN_ICON_HINT: "fieldbasedrepeatoverviewcolumn-624ea",
		FIELD_COLUMN_HINT: "fieldbasedrepeatoverviewcolumn-9136e",
		FIELD_COLUMN_LABEL_HIDDEN: "fieldbasedrepeatoverviewcolumn-77290",
		FIELD_COLUMN_LABEL_HIDDEN_HINT: "fieldbasedrepeatoverviewcolumn-124f3",

		EXPR_COLUMN: "expressionrepeatoverviewcolumn-0f4e1",
		EXPR_COLUMN_ICON: "expressionrepeatoverviewcolumn-f52b7",
		EXPR_COLUMN_ICON_LABEL_HIDDEN: "expressionrepeatoverviewcolumn-3fba2",
		EXPR_COLUMN_LABEL_HIDDEN: "expressionrepeatoverviewcolumn-db62f"
	};
}
