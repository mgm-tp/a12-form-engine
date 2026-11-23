// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

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
