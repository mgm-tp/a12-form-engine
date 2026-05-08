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

import { useCallback, useMemo, type JSX } from "react";
import type { Action } from "typescript-fsa";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import type {
	DocumentModelService,
	SettingPath
} from "@com.mgmtp.a12.contentengine/contentengine-editor";
import {
	ErrorMessages,
	ModelStateSelector,
	SettingTemplate,
	Throwable,
	useContentEditorState,
	useSettingState
} from "@com.mgmtp.a12.contentengine/contentengine-editor";
import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import { Button } from "@com.mgmtp.a12.widgets/widgets-core/lib/button/main/button.view.js";
import type { DropDownItem } from "@com.mgmtp.a12.widgets/widgets-core/lib/dropdown/main/template/dropdown.tpl.api.js";
import { Icon } from "@com.mgmtp.a12.widgets/widgets-core/lib/icon/main/icon.view.js";
import { Autocomplete } from "@com.mgmtp.a12.widgets/widgets-core/lib/input/autocomplete/main/autocomplete.view.js";
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

import { candidateElements } from "./candidates.js";
import { ConfirmationButton } from "./confirmationButton.js";

type StringListPayload = void | DeleteEntryPayload | ChangeEntryPayload;

// TODO: merge with ElementIdSettings or StringListSettings?
/** @internal */
export function ElementIdListSettings(props: {
	label: string;
	path: SettingPath;
	nodeId: string;
	elementFilter: (element: DocumentModel.Element) => boolean;
	invalidElementError: string;
}): JSX.Element {
	const [settingState, dispatch] = useSettingState<
		StringListSettingState,
		Action<StringListPayload>
	>(props.path);

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
		bodyContentRenderer: (
			rendererProps: TableRenderPropsType.BodyContentProps<string, BaseColumnType>
		) => {
			if (rendererProps.column.dataKey === "value") {
				return (
					<ElementIdSetting
						nodeId={props.nodeId}
						settingPath={props.path}
						rowIndex={rendererProps.rowIndex}
						elementFilter={props.elementFilter}
						invalidElementError={props.invalidElementError}
					/>
				);
			} else if (rendererProps.column.actionColumn) {
				return (
					<ConfirmationButton
						icon={<Icon>delete</Icon>}
						confirmationTitle={"Delete entry"}
						confirmationMessage={
							"Deleting this entry cannot be reverted. Are you sure you want to delete it?"
						}
						action={() => {
							dispatch(DeleteEntry({ rowIndex: rendererProps.rowIndex }));
						}}
					/>
				);
			}

			return <DefaultTableComponentRenderers.bodyContentRenderer {...rendererProps} />;
		}
	};

	return (
		<SettingTemplate.Section label={props.label} collapsed={settingState.length === 0}>
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

const ElementIdSetting = (props: {
	nodeId: string;
	settingPath: SettingPath;
	rowIndex: number;
	elementFilter: (element: DocumentModel.Element) => boolean;
	invalidElementError: string;
}): JSX.Element => {
	const { nodeId, settingPath, rowIndex, elementFilter, invalidElementError } = props;

	const [settingState, dispatch] = useSettingState<StringListSettingState>(settingPath);
	const documentModelService = useContentEditorState(ModelStateSelector.documentModelService());
	const documentModel = useContentEditorState(ModelStateSelector.documentModel());
	const nodePath = useContentEditorState(ModelStateSelector.nodeDataById())(nodeId)?.nodePath;

	const candidateElementsSelector = useContentEditorState(
		candidateElements({ traverseRepeatableGroups: true })
	);
	const modelPathSelector = useContentEditorState(ModelStateSelector.modelPathById());

	const dropDownItems: DropDownItem[] = useMemo(() => {
		if (!nodePath) {
			throw new Error(`Can not compute node path for node ${nodeId}`);
		}

		if (!documentModel) {
			return [];
		}

		return candidateElementsSelector(nodePath, elementFilter)
			.unwrapOr([])
			.map(({ element, path }) => ({
				value: element.id,
				label: ModelPath.toString(path)
			}));
	}, [candidateElementsSelector, documentModel, elementFilter, nodeId, nodePath]);

	const onDropDownValueChange = useCallback(
		(item: DropDownItem): void => {
			dispatch(
				ChangeEntry({
					rowIndex,
					value: item.value ?? ""
				})
			);
		},
		[dispatch, rowIndex]
	);

	const errorMessage = useMemo(() => {
		return getErrorMessage({
			settingState,
			rowIndex,
			documentModelService,
			elementFilter,
			invalidElementError
		});
	}, [settingState, rowIndex, documentModelService, elementFilter, invalidElementError]);

	const internalValue = settingState[rowIndex];
	const valueForInput = useMemo(() => {
		const modelPath = modelPathSelector(internalValue);

		if (modelPath.isErr()) {
			return internalValue;
		}

		return modelPath.value;
	}, [modelPathSelector, internalValue]);

	return (
		<Autocomplete
			allowAddingNewItem
			items={dropDownItems}
			error={!!errorMessage}
			errorMessage={errorMessage}
			hintTemplate="{count} matches"
			onValueChange={onDropDownValueChange}
			inputPlaceHolder="Please select or start typing"
			value={valueForInput}
		/>
	);
};

function getErrorMessage(options: {
	settingState: StringListSettingState;
	rowIndex: number;
	documentModelService?: DocumentModelService;
	elementFilter: (element: DocumentModel.Element) => boolean;
	invalidElementError: string;
}): string | undefined {
	const { settingState, rowIndex, documentModelService, elementFilter, invalidElementError } =
		options;

	if (!documentModelService) {
		return ErrorMessages.missingDocumentModelService();
	}

	const dmElementThrowable = Throwable.wrap(() =>
		documentModelService.getElementById(settingState[rowIndex])
	);

	if (dmElementThrowable.isErr()) {
		return dmElementThrowable.error.message;
	}

	const dmElement = dmElementThrowable.value;

	if (elementFilter && !elementFilter(dmElement)) {
		return invalidElementError;
	}

	return undefined;
}
