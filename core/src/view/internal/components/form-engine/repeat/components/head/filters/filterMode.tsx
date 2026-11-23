// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
