// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX } from "react";
import { useContext } from "react";

import type { FormModel } from "../../../../../models/internal/form-model.js";
import { WidgetMapContext } from "../../../configuration/widget-map-context.js";
import { HelperClasses } from "../../../utilities/css-classes.js";
import { nmTokensToString } from "../../../utilities/nmtokens.js";
import { MenuContext } from "../../form-engine/repeat/components/MenuContext.js";
import { getListItemProps } from "../../form-engine/repeat/components/row-actions/getListItemProps.js";
import { getScreenReaderCellId } from "../../form-engine/repeat/components/row-actions/getScreenReaderCellId.js";
import type { RepeatRow } from "../../form-engine/repeat/components/tableColumnTypes.js";

/** @internal */
export interface ReorderButtonProps {
	uiIdUpButton: string;
	uiIdDownButton: string;
	onUp(): void;
	onDown(): void;
	upDisabled?: boolean;
	downDisabled?: boolean;
	upButtonTitle?: string;
	downButtonTitle?: string;
	repeat: FormModel.Repeat;
	row: RepeatRow;
	uiIdPrefix?: string;
}

/** @internal */
export function ReorderButton(props: ReorderButtonProps): JSX.Element {
	const widgetMap = useContext(WidgetMapContext);
	const renderAsListItem = useContext(MenuContext).renderAsListItem;

	const cellId = getScreenReaderCellId(props.repeat, props.row, props.uiIdPrefix);

	const upButtonProps = {
		id: props.uiIdUpButton,
		disabled: props.upDisabled,
		icon: <widgetMap.Icon>keyboard_arrow_up</widgetMap.Icon>,
		title: props.upButtonTitle,
		onClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
			props.onUp();
			event.stopPropagation();
		},
		buttonAttributes: {
			"aria-labelledby": cellId ? `${props.uiIdUpButton} ${cellId}` : props.uiIdUpButton
		}
	};

	const downButtonProps = {
		id: props.uiIdDownButton,
		disabled: props.downDisabled,
		icon: <widgetMap.Icon>keyboard_arrow_down</widgetMap.Icon>,
		title: props.downButtonTitle,
		onClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
			props.onDown();
			event.stopPropagation();
		},
		buttonAttributes: {
			"aria-labelledby": cellId ? `${props.uiIdDownButton} ${cellId}` : props.uiIdDownButton
		}
	};

	return renderAsListItem ? (
		<>
			<widgetMap.ListItem
				key={"up"}
				{...getListItemProps({ ...upButtonProps, label: upButtonProps.title, title: undefined })}
			/>
			<widgetMap.ListItem
				key={"down"}
				{...getListItemProps({
					...downButtonProps,
					label: downButtonProps.title,
					title: undefined
				})}
			/>
		</>
	) : (
		<div
			className={nmTokensToString([HelperClasses.INLINE_BLOCK, HelperClasses.MIDDLE_ALIGN])}
			key="move"
		>
			<widgetMap.Button key={"up"} {...upButtonProps} />
			<widgetMap.Button key={"down"} {...downButtonProps} />
		</div>
	);
}
