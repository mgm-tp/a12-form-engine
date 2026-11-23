// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { ComponentType, ReactElement } from "react";
import { useContext } from "react";

import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";

import { createLocalizableFactory } from "../../../../../../../../back-end/localization/internal/localization.js";
import { ModelSelectors } from "../../../../../../../../back-end/store/index.js";
import type { EngineStore } from "../../../../../../../../back-end/store/index.js";
import type { FormModel } from "../../../../../../../../models/index.js";
import type { FormModelMap } from "../../../../../../configuration/engine-configuration.js";
import type { RepeatRow } from "../../tableColumnTypes.js";

import { CopyRepeatRowAction } from "./CopyRepeatRowAction.js";
import { DeleteRepeatRowAction } from "./DeleteRepeatRowAction.js";
import { DownloadRepeatRowAction } from "./DownloadRepeatRowAction.js";
import type { GetTitle } from "./GetTitle.js";
import { ReorderRepeatRowAction } from "./ReorderRepeatRowAction.js";

/** @internal */
export interface StandardRowActionButtonsProps extends RowActionButtonsProps {
	readonly EditViewButton?: ComponentType<RowActionButtonsProps>;
}

/** @internal */
export interface RowActionButtonsProps {
	readonly config: FormModelMap.RenderConfiguration;
	readonly row: RepeatRow;
	readonly totalNumberOfRows: number;
	readonly repeat: FormModel.Repeat;
	readonly repeatState?: EngineStore.Repeat.Entry;
	readonly readonly?: boolean;
}

/** @internal */
export function StandardRowActionButtons(props: StandardRowActionButtonsProps): ReactElement {
	const { config, row, totalNumberOfRows, repeat, EditViewButton, readonly } = props;

	const { localizer } = useContext(LocalizerContext);

	const localizableFactory = createLocalizableFactory(
		ModelSelectors.documentModel()(config.renderOptions.state),
		ModelSelectors.formModel()(config.renderOptions.state)
	);

	const getTitle: GetTitle = type => {
		return localizer(...localizableFactory.componentButtonLabels(repeat, config.parentPath, type));
	};

	const index = row.path[row.path.length - 1].index;

	const moveButton = (
		<ReorderRepeatRowAction
			{...{
				config,
				repeat,
				row,
				repeatFormModelPath: config.parentPath,
				renderOptions: config.renderOptions,
				upDisabled: index <= 1,
				downDisabled: index >= totalNumberOfRows,
				getTitle,
				repeatReadonly: readonly
			}}
		/>
	);

	const cloneButton = (
		<CopyRepeatRowAction
			{...{
				repeat,
				totalNumberOfRows,
				renderOptions: config.renderOptions,
				repeatFormModelPath: config.parentPath,
				row,
				getTitle,
				repeatReadonly: readonly
			}}
		/>
	);

	const downloadButton = (
		<DownloadRepeatRowAction
			{...{
				repeat,
				renderOptions: config.renderOptions,
				row,
				getTitle,
				repeatReadonly: readonly
			}}
		/>
	);

	const deleteButton = (
		<DeleteRepeatRowAction
			{...{
				repeat,
				renderOptions: config.renderOptions,
				repeatFormModelPath: config.parentPath,
				row,
				localizableFactory,
				getTitle,
				repeatReadonly: readonly
			}}
		/>
	);

	const editButton = EditViewButton ? [<EditViewButton key="edit-view" {...props} />] : [];

	return (
		<>
			{downloadButton} {moveButton} {editButton} {cloneButton} {deleteButton}
		</>
	);
}
