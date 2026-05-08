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

import { useMemo, type JSX } from "react";
import type { Action } from "typescript-fsa";

import type {
	DocumentModelService,
	SettingPath
} from "@com.mgmtp.a12.contentengine/contentengine-editor";
import {
	ErrorMessages,
	ModelStateSelector,
	SettingTemplate,
	useContentEditorState,
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

import type { ChangeEntryPayload, DeleteEntryPayload } from "../controllers/stringListActions.js";
import { AddEntry, ChangeEntry, DeleteEntry } from "../controllers/stringListActions.js";
import type { StringListSettingState } from "../controllers/stringListController.js";

import { ConfirmationButton } from "./confirmationButton.js";
import { StyledBufferedInput } from "./styledWidgets.js";

type StringListPayload = void | DeleteEntryPayload | ChangeEntryPayload;

/** @internal */
export function RuleListSetting(): JSX.Element {
	const settingPath = ["rules"];

	const [settingState, dispatch] = useSettingState<
		StringListSettingState,
		Action<StringListPayload>
	>(settingPath);

	const columns: BaseColumnType[] = [
		{
			label: "Value",
			dataKey: "value"
		},
		{
			label: "",
			width: 0.3,
			actionColumn: true
		}
	];

	const componentRenderers: Partial<TableComponentRenderers<string, BaseColumnType>> = {
		bodyContentRenderer: (props: TableRenderPropsType.BodyContentProps<string, BaseColumnType>) => {
			if (props.column.dataKey === "value") {
				return <StringSetting settingPath={settingPath} rowIndex={props.rowIndex} />;
			} else if (props.column.actionColumn) {
				return (
					<ConfirmationButton
						icon={<Icon>delete</Icon>}
						confirmationTitle={"Delete entry"}
						confirmationMessage={
							"Deleting this entry cannot be reverted. Are you sure you want to delete it?"
						}
						action={() => {
							dispatch(DeleteEntry({ rowIndex: props.rowIndex }));
						}}
					/>
				);
			}

			return <DefaultTableComponentRenderers.bodyContentRenderer {...props} />;
		}
	};

	return (
		<SettingTemplate.Section label={"Rules"} collapsed={settingState.length === 0}>
			<Table data={settingState} columns={columns} componentRenderers={componentRenderers} />
			<Button
				label={"Add"}
				onClick={() => {
					dispatch(AddEntry());
				}}
			/>
		</SettingTemplate.Section>
	);
}

const StringSetting = (props: { settingPath: SettingPath; rowIndex: number }): JSX.Element => {
	const { settingPath, rowIndex } = props;

	const [settingState, dispatch] = useSettingState<StringListSettingState>(settingPath);
	const documentModelService = useContentEditorState(ModelStateSelector.documentModelService());

	const input = settingState.at(rowIndex) || "";

	const errorMessage = useMemo(() => {
		return getErrorMessage({
			documentModelService
		});
	}, [documentModelService]);

	return (
		<StyledBufferedInput
			value={input}
			error={!!errorMessage}
			errorMessage={errorMessage}
			onValueSubmit={(value?: string) => {
				dispatch(
					ChangeEntry({
						rowIndex: props.rowIndex,
						value: value ?? ""
					})
				);
			}}
			$width={"100%"}
		/>
	);
};

function getErrorMessage(options: {
	documentModelService?: DocumentModelService;
}): string | undefined {
	const { documentModelService } = options;

	if (!documentModelService) {
		return ErrorMessages.missingDocumentModelService();
	}

	return undefined;
}
