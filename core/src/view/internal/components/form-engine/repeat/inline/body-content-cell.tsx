// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX } from "react";

import type { BodyContentCellProps } from "../components/body/overviewBodyContentCell.js";

/** @internal */
export function InlineBodyContentCell(props: BodyContentCellProps): JSX.Element | null {
	const { column, row, config: renderConfig, repeat } = props;
	const FieldOverviewColumn =
		renderConfig.renderOptions.config.formModelMap.FieldOverviewColumn.component;

	return (
		<FieldOverviewColumn
			key={row.rowIndexInDocument}
			modelElement={column.modelElement}
			config={renderConfig}
			repeat={repeat}
			alignment={column.specificHorizontalAlignment?.body}
		/>
	);
}
