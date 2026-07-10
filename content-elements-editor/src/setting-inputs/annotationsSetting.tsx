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
 * 1. Open-Source License - EUPL v1.2
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

import type { Action } from "@com.mgmtp.a12.client/typescript-fsa-redux-5-compat";
import {
	SettingTemplate,
	useSettingState
} from "@com.mgmtp.a12.contentengine/contentengine-editor";
import {
	Button,
	Icon,
	DefaultTableComponentRenderers,
	Table
} from "@com.mgmtp.a12.widgets/widgets-core";
import type {
	BaseColumnType,
	TableComponentRenderers,
	TableRenderPropsType
} from "@com.mgmtp.a12.widgets/widgets-core";

import type {
	ChangeAnnotationPayload,
	DeleteAnnotationPayload
} from "../controllers/annotationActions.js";
import {
	AddAnnotation,
	ChangeAnnotation,
	DeleteAnnotation
} from "../controllers/annotationActions.js";
import type { AnnotationsSettingState } from "../controllers/annotationController.js";

import { ConfirmationButton } from "./confirmationButton.js";
import { StyledBufferedInput } from "./styledWidgets.js";

type AnnotationPayload = void | DeleteAnnotationPayload | ChangeAnnotationPayload;

interface AnnotationRowType {
	readonly name?: string;
	readonly value?: string;
}

/** @internal */
export function AnnotationsSetting(): JSX.Element {
	const [settingState, dispatch] = useSettingState<
		AnnotationsSettingState,
		Action<AnnotationPayload>
	>(["annotations"]);

	const columns: BaseColumnType[] = [
		{
			label: "Name",
			dataKey: "name"
		},
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

	const componentRenderers: Partial<TableComponentRenderers<AnnotationRowType, BaseColumnType>> = {
		bodyContentRenderer: (
			props: TableRenderPropsType.BodyContentProps<AnnotationRowType, BaseColumnType>
		) => {
			if (props.column.dataKey === "name") {
				return (
					<StyledBufferedInput
						value={props.row.name}
						onValueSubmit={(value?: string) => {
							dispatch(
								ChangeAnnotation({
									rowIndex: props.rowIndex,
									annotation: { ...props.row, name: value }
								})
							);
						}}
						$width={"100%"}
					/>
				);
			} else if (props.column.dataKey === "value") {
				return (
					<StyledBufferedInput
						value={props.row.value}
						onValueSubmit={(value?: string) => {
							dispatch(
								ChangeAnnotation({
									rowIndex: props.rowIndex,
									annotation: { ...props.row, value }
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
						confirmationTitle={"Delete Annotation"}
						confirmationMessage={
							"Deleting this annotation cannot be reverted. Are you sure you want to delete it?"
						}
						action={() => {
							dispatch(DeleteAnnotation({ rowIndex: props.rowIndex }));
						}}
					/>
				);
			}

			return <DefaultTableComponentRenderers.bodyContentRenderer {...props} />;
		}
	};

	return (
		<SettingTemplate.Section label={"Annotations"} collapsed={true}>
			<Table data={settingState} columns={columns} componentRenderers={componentRenderers} />
			<Button
				label={"Add"}
				onClick={() => {
					dispatch(AddAnnotation());
				}}
			/>
		</SettingTemplate.Section>
	);
}
