// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX, ReactElement } from "react";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";

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
