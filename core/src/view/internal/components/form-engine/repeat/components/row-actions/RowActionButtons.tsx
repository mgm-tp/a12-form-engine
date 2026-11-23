// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX } from "react";
import { useContext } from "react";

import { UiStateSelectors } from "../../../../../../../back-end/store/internal/selectors/ui-state.js";
import { UiId } from "../../../../../../../back-end/utils/internal/generateUiId.js";
import { FormModel } from "../../../../../../../models/index.js";

import { MenuContext } from "../MenuContext.js";

import { CustomRowActionButton } from "./CustomRowActionButton.js";
import { StandardRowActionButtons } from "./standard/StandardRowActionButtons.js";
import type { StandardRowActionButtonsProps } from "./standard/StandardRowActionButtons.js";

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
