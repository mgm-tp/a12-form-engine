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
import { useSelector, type DefaultRootState } from "react-redux";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import { useDocumentContext } from "@com.mgmtp.a12.contentengine/contentengine-core";
import {
	SettingTemplate,
	UIStateSelector,
	useContentEditorState,
	useSettingState,
	type BooleanSettingState
} from "@com.mgmtp.a12.contentengine/contentengine-editor";
import { useCollectDocumentElementIds } from "@com.mgmtp.a12.formengine/formengine-content-elements";
import type { BaseColumnType } from "@com.mgmtp.a12.widgets/widgets-core/lib/table/new-api/column.api.js";
import type {
	TableComponentRenderers,
	TableRenderPropsType
} from "@com.mgmtp.a12.widgets/widgets-core/lib/table/new-api/table-renderer.api.js";
import {
	DefaultTableComponentRenderers,
	Table
} from "@com.mgmtp.a12.widgets/widgets-core/lib/table/new-api/table.view.js";

import { SwitchSetting } from "./switchSetting.js";

const path = ["autoCollectNodes"];

export function AutoCollectNodesSetting(): JSX.Element {
	const [settingState] = useSettingState<BooleanSettingState>(path);

	return (
		<>
			<SwitchSetting label="Automatically collect fields and groups" settingPath={path} />

			{settingState && <ContainedNodeIdsList />}
		</>
	);
}

function ContainedNodeIdsList(): JSX.Element {
	const { getModelPathById } = useDocumentContext(c => c.model);
	const selectedNode = useContentEditorState(UIStateSelector.selectedNode());
	const result = useCollectDocumentElementIds(selectedNode);

	const fieldPathStrings = useSelector(state => getPaths(state, result.fieldIds, getModelPathById));
	const groupPathStrings = useSelector(state => getPaths(state, result.groupIds, getModelPathById));

	const columns: BaseColumnType[] = [
		{
			label: "Value",
			dataKey: "value"
		}
	];

	const componentRenderers: Partial<TableComponentRenderers<string, BaseColumnType>> = {
		bodyContentRenderer: (
			rendererProps: TableRenderPropsType.BodyContentProps<string, BaseColumnType>
		) => {
			if (rendererProps.column.dataKey === "value") {
				return rendererProps.row;
			}

			return <DefaultTableComponentRenderers.bodyContentRenderer {...rendererProps} />;
		}
	};

	return (
		<>
			{fieldPathStrings.length > 0 && (
				<SettingTemplate.Section label="Automatically Collected Fields">
					<Table
						data={fieldPathStrings}
						columns={columns}
						componentRenderers={componentRenderers}
					/>
				</SettingTemplate.Section>
			)}

			{groupPathStrings.length > 0 && (
				<SettingTemplate.Section label="Automatically Collected Groups">
					<Table
						data={groupPathStrings}
						columns={columns}
						componentRenderers={componentRenderers}
					/>
				</SettingTemplate.Section>
			)}
		</>
	);
}

function getPaths(
	state: DefaultRootState,
	docIds: string[],
	getModelPathById: (state: object, id: string) => ModelPath
): string[] {
	return docIds.reduce<string[]>((paths, docId) => {
		const path = ModelPath.toString(getModelPathById(state, docId));

		if (!paths.includes(path)) {
			paths.push(path);
		}

		return paths;
	}, []);
}
