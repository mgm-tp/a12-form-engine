// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ReactElement } from "react";

import type { FormModel } from "../../../../../../models/index.js";
import { DETACHED_REPEAT } from "../../data-roles.js";

import { OverviewBodyContentCell } from "../components/body/overviewBodyContentCell.js";
import { RepeatBodyRow } from "../components/body/RepeatBodyRow.js";
import { RepeatTemplate } from "../components/repeatTemplate.js";
import { findDefaultRowAction } from "../components/row-actions/findDefaultRowAction.js";
import { RepeatEditViewButton } from "../components/row-actions/RepeatEditViewButton.js";
import { getTableStyleOptions } from "../components/TableStyleOptions.js";
import type { RepeatProps } from "../RepeatProps.js";

/** @internal */
export interface DetachedRepeatProps extends RepeatProps {
	readonly modelElement: FormModel.DetachedRepeat;
}

/** @internal */
export function DetachedRepeat(props: DetachedRepeatProps): ReactElement {
	const { modelElement, config } = props;
	const { renderOptions: options, parentPath: repeatFormModelPath } = config;

	return (
		<RepeatTemplate
			defaultRowAction={findDefaultRowAction(
				modelElement,
				props.disabled,
				props.readonly,
				options,
				repeatFormModelPath
			)}
			EditViewButton={RepeatEditViewButton}
			BodyContentCell={OverviewBodyContentCell}
			BodyRow={RepeatBodyRow}
			defaultColumnVerticalAlignment={"middle"}
			tableStyleOptions={getTableStyleOptions(props.modelElement, options.config.cardView)}
			dataRole={DETACHED_REPEAT}
			{...props}
		/>
	);
}
