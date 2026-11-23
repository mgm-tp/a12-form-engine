// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { createContext } from "react";

import type { BaseColumnType } from "@com.mgmtp.a12.widgets/widgets-core/lib/table/new-api/column.api.js";

import type { TableWidgetMap } from "../../../view/internal/components/form-engine/repeat/table-widget-map.js";

interface TableRenderContextProps extends TableWidgetMap {
	readonly columns: readonly BaseColumnType[];
}

/**
 * The context used to access table renderers, templates and columns inside the table implementation itself.
 *
 * Note: Do not use the outside context to access renderers, as it does not contain the
 * renderers passed as props. Do not overwrite the outside context, because the renderers
 * can use the context to lookup the default implementation and would find themselves.
 */
export const TableRenderContext = createContext<TableRenderContextProps>(
	{} as TableRenderContextProps
);
