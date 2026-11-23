// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX } from "react";
import { useContext } from "react";

import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";

import { createLocalizableFactory } from "../../../../../../../back-end/localization/internal/localization.js";
import { ModelSelectors } from "../../../../../../../back-end/store/internal/selectors/models.js";

import { EditRepeatRowAction } from "./standard/EditRepeatRowAction.js";
import type { GetTitle } from "./standard/GetTitle.js";
import type { RowActionButtonsProps } from "./standard/StandardRowActionButtons.js";
import { ViewRepeatRowAction } from "./standard/ViewRepeatRowAction.js";

/** @internal */
export function RepeatEditViewButton(props: RowActionButtonsProps): JSX.Element {
	const { config, row, repeat, readonly } = props;

	const localizer = useContext(LocalizerContext).localizer;

	const localizableFactory = createLocalizableFactory(
		ModelSelectors.documentModel()(config.renderOptions.state),
		ModelSelectors.formModel()(config.renderOptions.state)
	);

	const getTitle: GetTitle = type => {
		return localizer(...localizableFactory.componentButtonLabels(repeat, config.parentPath, type));
	};

	const RepeatRowAction = readonly ? ViewRepeatRowAction : EditRepeatRowAction;

	return (
		<RepeatRowAction
			row={row}
			repeat={repeat}
			renderOptions={config.renderOptions}
			repeatFormModelPath={config.parentPath}
			getTitle={getTitle}
			repeatReadonly={props.readonly}
		/>
	);
}
