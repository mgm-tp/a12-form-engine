// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ReactElement } from "react";
import { useContext } from "react";

import type { ButtonProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/button/main/button.api.js";

import type { FormModel } from "../../../../../../../../models/internal/form-model.js";
import { WidgetMapContext } from "../../../../../../configuration/widget-map-context.js";
import { MenuContext } from "../../MenuContext.js";
import type { RepeatRow } from "../../tableColumnTypes.js";

import { getListItemProps } from "../getListItemProps.js";
import { getScreenReaderCellId } from "../getScreenReaderCellId.js";

/** @internal */
export function RowActionButton(props: {
	id: string;
	name: string;
	title?: string;
	onClick(event: React.MouseEvent<HTMLElement>): void;
	disabled?: boolean;
	getRef?(ref: HTMLElement | null): void;
	repeat: FormModel.Repeat;
	row: RepeatRow;
	uiIdPrefix?: string;
}): ReactElement {
	const { id, name, title, onClick, disabled, getRef, repeat, row, uiIdPrefix } = props;
	const widgetMap = useContext(WidgetMapContext);
	const renderAsListItem = useContext(MenuContext).renderAsListItem;

	const cellId = getScreenReaderCellId(repeat, row, uiIdPrefix);

	const buttonProps = {
		id,
		onClick,
		disabled,
		icon: <widgetMap.Icon>{name}</widgetMap.Icon>,
		buttonRef: getRef,
		title,
		buttonAttributes: {
			"aria-labelledby": cellId ? `${id} ${cellId}` : id
		}
	} satisfies ButtonProps;

	return renderAsListItem ? (
		<widgetMap.ListItem
			key={name}
			{...getListItemProps({ ...buttonProps, label: buttonProps.title, title: undefined })}
		/>
	) : (
		<widgetMap.Button key={name} {...buttonProps} />
	);
}
