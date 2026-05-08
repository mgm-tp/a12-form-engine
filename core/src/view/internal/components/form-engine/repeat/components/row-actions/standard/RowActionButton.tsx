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
