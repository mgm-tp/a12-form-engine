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
