// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ReactElement } from "react";
import { useContext } from "react";

import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";

import { RESOURCE_KEYS } from "../../../../../../../../back-end/localization/internal/languages/keys.js";
import { createLocalizableFactory } from "../../../../../../../../back-end/localization/internal/localization.js";
import { getLocalizedResource } from "../../../../../../../../back-end/localization/internal/localize.js";
import { ModelSelectors } from "../../../../../../../../back-end/store/internal/selectors/models.js";
import { UiStateSelectors } from "../../../../../../../../back-end/store/internal/selectors/ui-state.js";
import type { ConfirmRepeatFilter } from "../../../../../../../../back-end/store/internal/store.js";
import { UiId } from "../../../../../../../../back-end/utils/internal/generateUiId.js";
import { WidgetMapContext } from "../../../../../../configuration/widget-map-context.js";

import { EmptyFilterInput } from "./emptyFilterInput.js";
import type { FilterCellProps } from "./filter-cell.js";

/** @internal */
export interface ConfirmFilterCellProps extends FilterCellProps {
	readonly filter?: ConfirmRepeatFilter;
}

/** @internal */
export interface ConfirmFilterCellProps extends FilterCellProps {
	readonly filter?: ConfirmRepeatFilter;
}

/** @internal */
export function ConfirmFilterCell(props: ConfirmFilterCellProps): ReactElement {
	const { options, element, filter, repeatFormModelPath } = props;
	const { localizer } = useContext(LocalizerContext);
	const disabled = UiStateSelectors.disabled()(options.state);
	const { CheckboxGroup, CheckboxGroupItem } = useContext(WidgetMapContext);

	const trueIsActive = filter?.filterTrue ?? false;
	const nullIsActive = filter?.filterNull ?? false;

	const localizableFactory = createLocalizableFactory(
		ModelSelectors.documentModel()(options.state),
		ModelSelectors.formModel()(options.state)
	);
	const trueLabel = localizer(...localizableFactory.confirmValue(element.elementPath, true));

	const idTrue = UiId.generateForFieldOverviewColumnFilter({
		id: element.id,
		uiIdPrefix: options.config.uiIdPrefix,
		suffix: "-yes"
	});

	const handleConfirmChange = () => {
		const newFilterValue =
			!trueIsActive || nullIsActive
				? {
						filterTrue: !trueIsActive,

						filterNull: nullIsActive
					}
				: undefined;

		options.eventHandlers.repeat.onFilterValueChange(
			repeatFormModelPath,
			element.id,
			newFilterValue
		);
	};

	const handleEmptyFilterChange = () => {
		const newFilterValue =
			trueIsActive || !nullIsActive
				? {
						filterTrue: trueIsActive,
						filterNull: !nullIsActive
					}
				: undefined;

		options.eventHandlers.repeat.onFilterValueChange(
			repeatFormModelPath,
			element.id,
			newFilterValue
		);
	};

	return (
		<CheckboxGroup
			disabled={disabled}
			label={getLocalizedResource(RESOURCE_KEYS.repeat.filter.confirm.title, localizer)}
			fitToParent={false}
		>
			<EmptyFilterInput
				options={options}
				element={element}
				repeatFormModelPath={repeatFormModelPath}
				filter={filter}
				onChange={handleEmptyFilterChange}
				presentation="checkbox"
			/>

			<CheckboxGroupItem
				id={idTrue}
				selected={trueIsActive}
				value="true"
				onChange={handleConfirmChange}
				label={trueLabel || ""}
				disabled={disabled}
			/>
		</CheckboxGroup>
	);
}
