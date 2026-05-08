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

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";

import { createLocalizableFactory } from "../../../../../../../back-end/localization/internal/localization.js";
import { ModelSelectors } from "../../../../../../../back-end/store/internal/selectors/models.js";
import { UiId } from "../../../../../../../back-end/utils/internal/generateUiId.js";
import { findElementByFormModelPath, FormModel } from "../../../../../../../models/index.js";
import type { FormModelMap } from "../../../../../configuration/engine-configuration.js";
import { DefaultRepeatButtonNames } from "../../../../../configuration/engine-configuration.js";
import { WidgetMapContext } from "../../../../../configuration/widget-map-context.js";
import { isStandardRowActionDisabled } from "../../../../../utilities/enablements/disabled-row-actions.js";

interface AddButtonProps {
	readonly options: FormModelMap.RenderOptions;
	readonly element: FormModel.Repeat;
	readonly formModelPath: ModelPath;
	onClick(): void;
	getRef?(ref: HTMLElement | null): void;
}

/** @internal */
export function AddButton(props: AddButtonProps): ReactElement {
	const { options, element, formModelPath, onClick, getRef } = props;
	const { Button } = useContext(WidgetMapContext);
	const { localizer } = useContext(LocalizerContext);

	const id = UiId.generateForAddButton({ repeat: element, uiIdPrefix: options.config.uiIdPrefix });

	const localizableFactory = createLocalizableFactory(
		ModelSelectors.documentModel()(options.state),
		ModelSelectors.formModel()(options.state)
	);

	const repeat = findElementByFormModelPath(
		ModelSelectors.formModel()(options.state),
		formModelPath
	);

	const addButtonLabelLocalizables =
		repeat && FormModel.Repeat.isInstance(repeat)
			? localizableFactory.componentButtonLabels(repeat, formModelPath, "ADD")
			: [];

	const label = localizer(...addButtonLabelLocalizables);

	const isDisabled = isStandardRowActionDisabled({
		byRow: options.config.enablements?.byRow ?? {},
		eventName: DefaultRepeatButtonNames.add,
		repeat: element,
		state: options.state
	});

	return (
		<Button
			id={id}
			label={label}
			onClick={onClick}
			disabled={isDisabled}
			key={id}
			buttonRef={getRef}
		/>
	);
}
