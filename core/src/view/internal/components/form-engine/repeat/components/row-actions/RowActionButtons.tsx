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

import { UiStateSelectors } from "../../../../../../../back-end/store/internal/selectors/ui-state.js";
import { UiId } from "../../../../../../../back-end/utils/internal/generateUiId.js";
import { FormModel } from "../../../../../../../models/index.js";

import { MenuContext } from "../MenuContext.js";

import { CustomRowActionButton } from "./CustomRowActionButton.js";
import {
	StandardRowActionButtons,
	type StandardRowActionButtonsProps
} from "./standard/StandardRowActionButtons.js";

/** @internal */
export function RowActionButtons(props: StandardRowActionButtonsProps): JSX.Element {
	const { renderOptions: options, parentPath: repeatFormModelPath } = props.config;
	const repeat = props.repeat;
	const row = props.row;
	const { renderAsListItem } = useContext(MenuContext);

	const customRowActions = FormModel.Repeat.isInstance(repeat)
		? (repeat.rowActionGroup?.action ?? [])
		: [];
	const rowActionId = (actionEvent: string) =>
		UiId.generateForRowActionButton({
			uiIdPrefix: options.config.uiIdPrefix,
			repeat,
			rowIndex: row.path[row.path.length - 1].index,
			eventType: "custom-" + actionEvent,
			buttonType: renderAsListItem ? "list-item" : "button"
		});

	const customEventButtons = customRowActions.map((action, index) => {
		return (
			<CustomRowActionButton
				id={rowActionId(action.event)}
				key={index}
				row={row}
				repeatFormModelPath={repeatFormModelPath}
				action={action}
				index={index}
				renderOptions={options}
				repeat={repeat}
				repeatReadonly={props.readonly}
			/>
		);
	});

	const repeatInstanceStateEntry = UiStateSelectors.repeatInstanceStateEntry(
		props.config.parentPath
	)(props.config.renderOptions.state);
	const repeatStaticStateEntry = UiStateSelectors.repeatStaticStateEntry(props.config.parentPath)(
		props.config.renderOptions.state
	);
	return (
		<>
			{customEventButtons}
			<StandardRowActionButtons
				config={props.config}
				repeat={repeat}
				row={row}
				repeatState={{ ...repeatInstanceStateEntry, ...repeatStaticStateEntry }}
				totalNumberOfRows={props.totalNumberOfRows}
				readonly={props.readonly}
				EditViewButton={props.EditViewButton}
			/>
		</>
	);
}
