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

import type { ComponentType, ReactElement } from "react";
import { useContext } from "react";

import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react";

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
