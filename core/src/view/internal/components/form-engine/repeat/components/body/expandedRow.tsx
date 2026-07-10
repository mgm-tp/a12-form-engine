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

import type { ReactElement } from "react";
import { useContext } from "react";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react";

import { createLocalizableFactory } from "../../../../../../../back-end/localization/internal/localization.js";
import { ModelSelectors } from "../../../../../../../back-end/store/internal/selectors/models.js";
import { UiStateSelectors } from "../../../../../../../back-end/store/internal/selectors/ui-state.js";
import { UiId } from "../../../../../../../back-end/utils/internal/generateUiId.js";
import type { FormModel } from "../../../../../../../models/index.js";
import { findElementByFormModelPath } from "../../../../../../../models/index.js";
import { isFormModelEmbeddedRepeat } from "../../../../../../../models/internal/FormModelGuards.js";
import { DefaultRepeatButtonNames } from "../../../../../configuration/engine-configuration.js";
import { WidgetMapContext } from "../../../../../configuration/widget-map-context.js";
import { isStandardRowActionHidden } from "../../../../../utilities/enablements/hidden-row-actions.js";
import { DataContext } from "../../../data-context.js";
import { createControlGrid } from "../../../model-components.js";
import { TableWidgetMapContext } from "../../table-widget-map.js";
import { InternalDocumentPath } from "../../../../../../../models/internal/utils/document-utils.js";

import { RowActionButtons } from "../row-actions/RowActionButtons.js";
import { getScreenReaderCellId } from "../row-actions/getScreenReaderCellId.js";
import type { RowActionButtonsProps } from "../row-actions/standard/StandardRowActionButtons.js";

import type { BodyRowProps } from "./RepeatBodyRow.js";
import { onBlurRow } from "./onBlur.js";

/** @internal */
export function ExpandedRow(props: BodyRowProps): ReactElement {
	const { config, totalNumberOfRows, readonly, row } = props;
	const { parentPath: repeatFormModelPath, renderOptions } = config;
	const {
		TableTemplate: { BodyRow, ExpandableRow, ExpandableRowBody, ExpandableRowFooter }
	} = useContext(TableWidgetMapContext);
	const { Button, ButtonGroup } = useContext(WidgetMapContext);
	const localizer = useContext(LocalizerContext).localizer;

	const repeat = findElementByFormModelPath(
		ModelSelectors.formModel()(renderOptions.state),
		repeatFormModelPath
	);

	if (repeat === undefined || !isFormModelEmbeddedRepeat(repeat)) {
		throw new Error(
			`No embedded repeat found for given form-model path ${ModelPath.toString(
				repeatFormModelPath
			)}`
		);
	}

	const repeatInstanceStateEntry = UiStateSelectors.repeatInstanceStateEntry(repeatFormModelPath)(
		renderOptions.state
	);
	const expandedRowPath = repeatInstanceStateEntry?.expandedRowPath;

	if (expandedRowPath === undefined) {
		throw new Error(
			`No expanded row in repeat state for the repeat ${ModelPath.toString(
				repeatFormModelPath
			)} given`
		);
	}

	const closeButtonId = UiId.generate({
		element: repeat,
		infix: "close-button",
		uiIdPrefix: renderOptions.config.uiIdPrefix
	});

	const localizableFactory = createLocalizableFactory(
		ModelSelectors.documentModel()(renderOptions.state),
		ModelSelectors.formModel()(renderOptions.state)
	);

	const returnButtonLocalizables = localizableFactory.componentButtonLabels(
		repeat,
		repeatFormModelPath,
		"CLOSE"
	);
	const closeButtonLabel = localizer(...returnButtonLocalizables);

	/**
	 * FIXME: the expanded row index is 0-based while the row action
	 * button indices are 1-based
	 */
	const uiId = UiId.generateForEmbeddedRepeatExpandedRow({
		repeat,
		rowIndex: expandedRowPath[expandedRowPath.length - 1].index - 1,
		uiIdPrefix: config.renderOptions.config.uiIdPrefix
	});

	const rowActionButtons = (
		<RowActionButtons
			config={config}
			readonly={readonly}
			repeat={repeat}
			row={row}
			totalNumberOfRows={totalNumberOfRows}
			EditViewButton={readonly ? DisabledViewButton : DisabledEditButton}
		/>
	);

	return (
		<DataContext.Provider value={expandedRowPath}>
			<BodyRow selected highlightVariant="info">
				<ExpandableRow id={uiId} onBlur={event => onBlurRow({ event, config, row })}>
					<ExpandableRowBody data-testid={`${uiId}-body`}>
						{createControlGrid(repeat.controlGrid, config)}
					</ExpandableRowBody>
					<ExpandableRowFooter data-testid={`${uiId}-footer`}>
						<ButtonGroup alignment="right">
							<Button
								id={closeButtonId}
								onClick={event => {
									props.config.renderOptions.eventHandlers.repeat.onCloseEmbeddedRepeatRow(
										repeatFormModelPath
									);
									event.stopPropagation();
								}}
							>
								{closeButtonLabel}
							</Button>
							{rowActionButtons}
						</ButtonGroup>
					</ExpandableRowFooter>
				</ExpandableRow>
			</BodyRow>
		</DataContext.Provider>
	);
}

function DisabledEditButton(props: RowActionButtonsProps): ReactElement | null {
	return <DisabledEditViewButton {...props} eventType={"edit"} type="EDIT" iconName="edit" />;
}

function DisabledViewButton(props: RowActionButtonsProps): ReactElement | null {
	return <DisabledEditViewButton {...props} eventType={"view"} type="VIEW" iconName="launch" />;
}

function DisabledEditViewButton(
	props: RowActionButtonsProps & {
		type: FormModel.RepeatButtonLabelEnum;
		eventType: string;
		iconName: string;
	}
): ReactElement | null {
	const {
		type,
		eventType,
		iconName,
		repeat,
		row: { path },
		config: { renderOptions, parentPath }
	} = props;

	const widgetMap = useContext(WidgetMapContext);
	const { localizer } = useContext(LocalizerContext);

	const hidden = isStandardRowActionHidden({
		byRow: renderOptions.config.enablements?.byRow ?? {},
		eventName: DefaultRepeatButtonNames.edit,
		rowIndex: InternalDocumentPath.rowIndex(path),
		state: renderOptions.state,
		repeat,
		enabledInModel: true,
		repeatReadonly: repeat.readonly
	});

	if (hidden) {
		return null;
	}

	const id = UiId.generateForRowActionButton({
		uiIdPrefix: renderOptions.config.uiIdPrefix,
		repeat,
		rowIndex: path[path.length - 1].index,
		eventType,
		buttonType: "button"
	});

	const localizableFactory = createLocalizableFactory(
		ModelSelectors.documentModel()(renderOptions.state),
		ModelSelectors.formModel()(renderOptions.state)
	);

	const localizedTitle = localizer(
		...localizableFactory.componentButtonLabels(repeat, parentPath, type)
	);

	const cellId = getScreenReaderCellId(
		repeat,
		props.row,
		props.config.renderOptions.config.uiIdPrefix
	);

	return (
		<widgetMap.Button
			id={id}
			title={localizedTitle}
			disabled
			icon={<widgetMap.Icon>{iconName}</widgetMap.Icon>}
			buttonAttributes={{ "aria-labelledby": cellId ? `${id} ${cellId}` : id }}
		/>
	);
}
