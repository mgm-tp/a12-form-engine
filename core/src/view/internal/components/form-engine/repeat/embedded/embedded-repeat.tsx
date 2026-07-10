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

import type { JSX, ReactElement } from "react";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";

import { ModelSelectors } from "../../../../../../back-end/store/internal/selectors/models.js";
import { UiStateSelectors } from "../../../../../../back-end/store/internal/selectors/ui-state.js";
import type { FormModel } from "../../../../../../models/index.js";
import { findElementByFormModelPath } from "../../../../../../models/index.js";
import { DocumentPath } from "../../../../../../models/internal/utils/document-utils.js";
import { EMBEDDED_REPEAT } from "../../data-roles.js";

import { ExpandedRow } from "../components/body/expandedRow.js";
import { OverviewBodyContentCell } from "../components/body/overviewBodyContentCell.js";
import type { BodyRowProps } from "../components/body/RepeatBodyRow.js";
import { RepeatBodyRow } from "../components/body/RepeatBodyRow.js";
import { RepeatTemplate } from "../components/repeatTemplate.js";
import { findDefaultRowAction } from "../components/row-actions/findDefaultRowAction.js";
import { RepeatEditViewButton } from "../components/row-actions/RepeatEditViewButton.js";
import type { RepeatTableColumn } from "../components/tableColumnTypes.js";
import { getTableStyleOptions } from "../components/TableStyleOptions.js";
import type { RepeatProps } from "../RepeatProps.js";

import { ErrorHint } from "./error-hint.js";

/** @internal */
export interface EmbeddedRepeatProps extends RepeatProps {
	readonly modelElement: FormModel.EmbeddedRepeat;
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
export function EmbeddedRepeat(props: EmbeddedRepeatProps): ReactElement {
	const { modelElement, config } = props;
	const { renderOptions, parentPath: repeatFormModelPath } = config;

	return (
		<RepeatTemplate
			defaultRowAction={findDefaultRowAction(
				modelElement,
				props.disabled,
				props.readonly,
				renderOptions,
				repeatFormModelPath
			)}
			EditViewButton={RepeatEditViewButton}
			ErrorHintButton={ErrorHint}
			BodyContentCell={OverviewBodyContentCell}
			BodyRow={EmbeddedRepeatRow}
			defaultColumnVerticalAlignment={"middle"}
			additionalLeftColumns={additionalColumns}
			tableStyleOptions={getTableStyleOptions(modelElement, renderOptions.config.cardView)}
			dataRole={EMBEDDED_REPEAT}
			{...props}
		/>
	);
}

function EmbeddedRepeatRow(bodyRowProps: BodyRowProps): JSX.Element {
	const { parentPath: repeatFormModelPath, renderOptions } = bodyRowProps.config;

	const repeat = findElementByFormModelPath(
		ModelSelectors.formModel()(renderOptions.state),
		repeatFormModelPath
	);
	if (repeat === undefined) {
		throw new Error(
			`No repeat found for given form-model path ${ModelPath.toString(repeatFormModelPath)}`
		);
	}

	const repeatInstanceStateEntry = UiStateSelectors.repeatInstanceStateEntry(repeatFormModelPath)(
		renderOptions.state
	);
	const expandedRowPath = repeatInstanceStateEntry?.expandedRowPath;

	if (expandedRowPath && DocumentPath.equal(bodyRowProps.row.path, expandedRowPath)) {
		return <ExpandedRow {...bodyRowProps} />;
	} else {
		return <RepeatBodyRow {...bodyRowProps} />;
	}
}
