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
import { useContext } from "react";

import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";

import { RESOURCE_KEYS } from "../../../../../../../../back-end/localization/internal/languages/keys.js";
import { createLocalizableFactory } from "../../../../../../../../back-end/localization/internal/localization.js";
import { getLocalizedResource } from "../../../../../../../../back-end/localization/internal/localize.js";
import { ModelSelectors } from "../../../../../../../../back-end/store/internal/selectors/models.js";
import { UiStateSelectors } from "../../../../../../../../back-end/store/internal/selectors/ui-state.js";
import type { BooleanRepeatFilter } from "../../../../../../../../back-end/store/internal/store.js";
import { UiId } from "../../../../../../../../back-end/utils/internal/generateUiId.js";
import { WidgetMapContext } from "../../../../../../configuration/widget-map-context.js";

import { EmptyFilterInput } from "./emptyFilterInput.js";
import type { FilterCellProps } from "./filter-cell.js";

/** @internal */
export interface BooleanFilterCellProps extends FilterCellProps {
	readonly filter?: BooleanRepeatFilter;
}

/** @internal */
export function BooleanFilterCell(props: BooleanFilterCellProps): ReactElement {
	const { options, element, filter, repeatFormModelPath } = props;
	const { localizer } = useContext(LocalizerContext);
	const disabled = UiStateSelectors.disabled()(options.state);
	const { CheckboxGroup, CheckboxGroupItem } = useContext(WidgetMapContext);

	const trueIsActive = filter?.filterTrue ?? false;
	const falseIsActive = filter?.filterFalse ?? false;
	const nullIsActive = filter?.filterNull ?? false;

	const localizableFactory = createLocalizableFactory(
		ModelSelectors.documentModel()(options.state),
		ModelSelectors.formModel()(options.state)
	);

	const trueLabel = localizer(...localizableFactory.booleanValue(element.elementPath, true));

	const falseLabel = localizer(...localizableFactory.booleanValue(element.elementPath, false));

	const idTrue = UiId.generateForFieldOverviewColumnFilter({
		id: element.id,
		uiIdPrefix: options.config.uiIdPrefix,
		suffix: "-yes"
	});

	const idFalse = UiId.generateForFieldOverviewColumnFilter({
		id: element.id,
		uiIdPrefix: options.config.uiIdPrefix,
		suffix: "-no"
	});

	const handleEmptyFilterChange = () => {
		options.eventHandlers.repeat.onFilterValueChange(
			repeatFormModelPath,
			element.id,
			trueIsActive || falseIsActive || !nullIsActive
				? {
						filterTrue: trueIsActive,
						filterFalse: falseIsActive,
						filterNull: !nullIsActive
					}
				: undefined
		);
	};

	const handleFilterTrueSelection = () => {
		options.eventHandlers.repeat.onFilterValueChange(
			repeatFormModelPath,
			element.id,
			!trueIsActive || falseIsActive || nullIsActive
				? {
						filterTrue: !trueIsActive,
						filterFalse: falseIsActive,
						filterNull: nullIsActive
					}
				: undefined
		);
	};

	const handleFilterFalseSelection = () => {
		options.eventHandlers.repeat.onFilterValueChange(
			repeatFormModelPath,
			element.id,
			!falseIsActive || trueIsActive || nullIsActive
				? {
						filterTrue: trueIsActive,
						filterFalse: !falseIsActive,
						filterNull: nullIsActive
					}
				: undefined
		);
	};

	return (
		<CheckboxGroup
			disabled={disabled}
			label={getLocalizedResource(RESOURCE_KEYS.repeat.filter.boolean.title, localizer)}
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
				onChange={handleFilterTrueSelection}
				label={trueLabel ?? ""}
				disabled={disabled}
			/>

			<CheckboxGroupItem
				id={idFalse}
				selected={falseIsActive}
				value="false"
				onChange={handleFilterFalseSelection}
				label={falseLabel ?? ""}
				disabled={disabled}
			/>
		</CheckboxGroup>
	);
}
