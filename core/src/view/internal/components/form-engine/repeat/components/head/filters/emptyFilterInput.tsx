// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { useContext } from "react";

import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";
import { addPrefix } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/utils.js";

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
