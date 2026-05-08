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
 * 1. Open-Source License – EUPL v1.2
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
