// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ReactElement } from "react";

import { FormModel } from "../../../../../../models/index.js";
import { INLINE_REPEAT } from "../../data-roles.js";

import { RepeatBodyRow } from "../components/body/RepeatBodyRow.js";
import { RepeatTemplate } from "../components/repeatTemplate.js";
import type { RepeatTableColumn } from "../components/tableColumnTypes.js";
import { getTableStyleOptions } from "../components/TableStyleOptions.js";
import type { RepeatProps } from "../RepeatProps.js";

import { InlineBodyContentCell } from "./body-content-cell.js";
import { ErrorHint } from "./error-hint.js";

/** @internal */
export interface InlineRepeatProps extends RepeatProps {
	readonly modelElement: FormModel.InlineRepeat;
}

const additionalColumns: [RepeatTableColumn] = [
	{
		type: "validation",
		actionColumn: true,
		label: "Actions",
		sortable: false,
		pinning: "left",
		specificVerticalAlignment: { body: "middle" },
		horizontalAlignment: "left"
	}
];

/** @internal */
export function InlineRepeat(props: InlineRepeatProps): ReactElement {
	const repeatOverviewColumn = props.modelElement.repeatOverviewColumn;
	const defaultColumnVerticalAlignment = repeatOverviewColumn?.some(c =>
		FormModel.ExpressionOverviewColumn.isInstance(c)
	)
		? "middle"
		: "top";

	return (
		<RepeatTemplate
			ErrorHintButton={ErrorHint}
			BodyContentCell={InlineBodyContentCell}
			BodyRow={RepeatBodyRow}
			defaultColumnVerticalAlignment={defaultColumnVerticalAlignment}
			additionalLeftColumns={additionalColumns}
			tableStyleOptions={getTableStyleOptions(
				props.modelElement,
				props.config.renderOptions.config.cardView
			)}
			dataRole={INLINE_REPEAT}
			{...props}
		/>
	);
}
