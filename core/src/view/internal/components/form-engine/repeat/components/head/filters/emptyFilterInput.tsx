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

import { useContext } from "react";

import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react";
import { addPrefix } from "@com.mgmtp.a12.widgets/widgets-core";

import { RESOURCE_KEYS } from "../../../../../../../../back-end/localization/internal/languages/keys.js";
import { getLocalizedResource } from "../../../../../../../../back-end/localization/internal/localize.js";
import { UiStateSelectors } from "../../../../../../../../back-end/store/internal/selectors/ui-state.js";
import { UiId } from "../../../../../../../../back-end/utils/internal/generateUiId.js";
import type { FormModel } from "../../../../../../../../models/index.js";
import { WidgetMapContext } from "../../../../../../configuration/widget-map-context.js";

import type { FilterCellPropsBase } from "./filter-cell.js";

/** @internal */
export interface EmptyFilterInputProps extends FilterCellPropsBase {
	readonly element: FormModel.RepeatOverviewColumn;
	readonly presentation?: "switch" | "checkbox";
	onChange(): void;
}

/** @internal */
export function EmptyFilterInput(props: EmptyFilterInputProps) {
	const { options, element, onChange, presentation = "switch", filter } = props;
	const { localizer } = useContext(LocalizerContext);
	const { Switch, CheckboxGroupItem, Message } = useContext(WidgetMapContext);

	const disabled = UiStateSelectors.disabled()(options.state);
	const isSelected = filter?.filterNull ?? false;

	const idEmpty = UiId.generateForFieldOverviewColumnFilter({
		id: element.id,
		uiIdPrefix: options.config.uiIdPrefix,
		suffix: "-empty"
	});

	const emptyLabel = (
		<Message className={addPrefix("-u-padding-0")}>
			{getLocalizedResource(RESOURCE_KEYS.repeat.filter.empty, localizer)}
		</Message>
	);

	return presentation === "checkbox" ? (
		<CheckboxGroupItem
			id={idEmpty}
			disabled={disabled}
			onChange={onChange}
			selected={isSelected}
			value="empty"
			label={emptyLabel}
		/>
	) : (
		<Switch
			id={idEmpty}
			disabled={disabled}
			onChange={onChange}
			checked={isSelected}
			checkedOption={emptyLabel}
		/>
	);
}
