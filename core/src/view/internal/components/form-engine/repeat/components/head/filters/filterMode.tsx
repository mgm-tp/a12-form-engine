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
import { useContext, useState } from "react";

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";
import { addPrefix } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/utils.js";

import { RESOURCE_KEYS } from "../../../../../../../../back-end/localization/internal/languages/keys.js";
import { getLocalizedResource } from "../../../../../../../../back-end/localization/internal/localize.js";
import type { MultiSelectRepeatFilter } from "../../../../../../../../back-end/store/index.js";
import type { FormModelMap } from "../../../../../../configuration/engine-configuration.js";
import { WidgetMapContext } from "../../../../../../configuration/widget-map-context.js";

interface FilterModeProps {
	readonly repeatFormModelPath: ModelPath;
	readonly elementId: string;
	readonly filter: MultiSelectRepeatFilter | undefined;
	readonly options: FormModelMap.RenderOptions;
	readonly disabled: boolean;
}

/** @internal */
export function FilterMode(props: FilterModeProps): ReactElement {
	const { disabled, repeatFormModelPath, elementId, filter, options } = props;
	const { Button, Icon, List, ListItem, ListSubHeader, PopUpMenu } = useContext(WidgetMapContext);
	const { localizer } = useContext(LocalizerContext);

	const [isPopupButtonActive, setPopupButtonActive] = useState(false);

	const filterMode = filter?.mode ?? "or";
	const iconTitle =
		filterMode === "or"
			? getLocalizedResource(RESOURCE_KEYS.multiselect.filterOr, localizer)
			: getLocalizedResource(RESOURCE_KEYS.multiselect.filterAnd, localizer);

	const handleFilterModeChange = (selectedMode: "or" | "and") => {
		options.eventHandlers.repeat.onFilterValueChange(repeatFormModelPath, elementId, {
			...filter,
			values: filter?.values ?? {},
			mode: selectedMode
		} as MultiSelectRepeatFilter);
	};

	return (
		<PopUpMenu
			triggerButtonTitle="Filter operation"
			onVisibilityChange={isPopupVisible => setPopupButtonActive(isPopupVisible)}
			disabled={disabled}
			triggerElement={
				<Button
					disabled={disabled}
					icon={
						<Icon
							className={addPrefix("-u-text-lg")}
							iconTheme={!isPopupButtonActive ? "custom" : undefined}
							title={iconTitle}
						>
							{isPopupButtonActive ? "close" : filterMode}
						</Icon>
					}
				/>
			}
			/*Stopping the propagation is necessary because the label of a CheckBoxGroup has an onClick as well and
			only the filter button inside the label should receive the click*/
			onTriggerElementClick={e => e.stopPropagation()}
		>
			<List divider>
				<ListSubHeader fill>Filter Operation</ListSubHeader>
				<ListItem
					text="Or"
					graphic={
						<Icon title="Or" iconTheme="custom">
							or
						</Icon>
					}
					meta={filterMode === "or" && <Icon>check</Icon>}
					onClick={() => handleFilterModeChange("or")}
				/>
				<ListItem
					text="And"
					graphic={
						<Icon title="And" iconTheme="custom">
							and
						</Icon>
					}
					meta={filterMode === "and" && <Icon>check</Icon>}
					onClick={() => handleFilterModeChange("and")}
				/>
			</List>
		</PopUpMenu>
	);
}
