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
import type { Action } from "typescript-fsa";

import type { NodePath } from "@com.mgmtp.a12.contentengine/contentengine-core";
import {
	SettingTemplate,
	useSettingState
} from "@com.mgmtp.a12.contentengine/contentengine-editor";
import { Button } from "@com.mgmtp.a12.widgets/widgets-core/lib/button/main/button.view.js";
import { Icon } from "@com.mgmtp.a12.widgets/widgets-core/lib/icon/main/icon.view.js";
import type { BaseColumnType } from "@com.mgmtp.a12.widgets/widgets-core/lib/table/new-api/column.api.js";
import type {
	TableComponentRenderers,
	TableRenderPropsType
} from "@com.mgmtp.a12.widgets/widgets-core/lib/table/new-api/table-renderer.api.js";
import {
	DefaultTableComponentRenderers,
	Table
} from "@com.mgmtp.a12.widgets/widgets-core/lib/table/new-api/table.view.js";

import type {
	ChangeLocalizedTextPayload,
	DeleteLocalizedTextPayload
} from "../controllers/localizedTextActions.js";
import {
	AddLocalizedText,
	ChangeLocalizedText,
	DeleteLocalizedText
} from "../controllers/localizedTextActions.js";
import type { LocalizedTextSettingState } from "../controllers/localizedTextController.js";

import { ConfirmationButton } from "./confirmationButton.js";
import { StyledBufferedInput } from "./styledWidgets.js";

type LocalizedTextPayload = void | DeleteLocalizedTextPayload | ChangeLocalizedTextPayload;

interface LocalizedTextRowType {
	readonly locale?: string;
	readonly text?: string;
}

/** @internal */
export function LocalizedTextSetting(props: {
	label: string;
	settingPath: NodePath;
	initiallyCollapsed?: boolean;
	suffix?: React.ReactNode;
}): JSX.Element {
	const { label, settingPath, initiallyCollapsed, suffix } = props;

	const [settingState, dispatch] = useSettingState<
		LocalizedTextSettingState,
		Action<LocalizedTextPayload>
	>(settingPath);

	const columns: BaseColumnType[] = [
		{
			label: "Locale",
			dataKey: "locale"
		},
		{
			label: "Text",
			dataKey: "text"
		},
		{
			label: "",
			width: 0.3,
			actionColumn: true
		}
	];

	const componentRenderers: Partial<TableComponentRenderers<LocalizedTextRowType, BaseColumnType>> =
		{
			bodyContentRenderer: (
				props: TableRenderPropsType.BodyContentProps<LocalizedTextRowType, BaseColumnType>
			) => {
				if (props.column.dataKey === "locale") {
					return (
						<StyledBufferedInput
							value={props.row.locale}
							onValueSubmit={(value?: string) => {
								dispatch(
									ChangeLocalizedText({
										rowIndex: props.rowIndex,
										localizedText: { ...props.row, locale: value }
									})
								);
							}}
							$width={"100%"}
						/>
					);
				} else if (props.column.dataKey === "text") {
					return (
						<StyledBufferedInput
							value={props.row.text}
							onValueSubmit={(value?: string) => {
								dispatch(
									ChangeLocalizedText({
										rowIndex: props.rowIndex,
										localizedText: { ...props.row, text: value }
									})
								);
							}}
							$width={"100%"}
						/>
					);
				} else if (props.column.actionColumn) {
					return (
						<ConfirmationButton
							icon={<Icon>delete</Icon>}
							confirmationTitle={"Delete Text"}
							confirmationMessage={
								"Deleting this text cannot be reverted. Are you sure you want to delete it?"
							}
							action={() => {
								dispatch(DeleteLocalizedText({ rowIndex: props.rowIndex }));
							}}
						/>
					);
				}

				return <DefaultTableComponentRenderers.bodyContentRenderer {...props} />;
			}
		};

	return (
		<SettingTemplate.Section label={label} collapsed={initiallyCollapsed}>
			<Table data={settingState} columns={columns} componentRenderers={componentRenderers} />
			<Button
				label={"Add"}
				onClick={() => {
					dispatch(AddLocalizedText());
				}}
			/>
			{suffix}
		</SettingTemplate.Section>
	);
}
