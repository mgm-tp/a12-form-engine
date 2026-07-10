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

import type { HTMLAttributes, ReactElement } from "react";
import { useContext } from "react";

import type { ModelPath } from "@com.mgmtp.a12.base/base-model-api";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react";

import type { LocalizableFactory } from "../../../../../../../../back-end/localization/internal/localization.js";
import { UiId } from "../../../../../../../../back-end/utils/internal/generateUiId.js";
import { InternalDocumentPath } from "../../../../../../../../models/internal/utils/document-utils.js";
import { ComponentMapContext } from "../../../../../../configuration/componentMap/component-map-context.js";
import { DefaultRepeatButtonNames } from "../../../../../../configuration/engine-configuration.js";
import type { FormModelMap } from "../../../../../../configuration/engine-configuration.js";
import { WidgetMapContext } from "../../../../../../configuration/widget-map-context.js";
import { isStandardRowActionDisabled } from "../../../../../../utilities/enablements/disabled-row-actions.js";
import { isStandardRowActionHidden } from "../../../../../../utilities/enablements/hidden-row-actions.js";
import { MenuContext } from "../../MenuContext.js";
import type { RepeatRow } from "../../tableColumnTypes.js";
import { isFormModelRepeat } from "../../../../../../../../models/index.js";
import type { FormModel } from "../../../../../../../../models/internal/form-model.js";

import { getScreenReaderCellId } from "../getScreenReaderCellId.js";

import type { GetTitle } from "./GetTitle.js";

/** @internal */
export function DeleteRepeatRowAction(props: {
	repeat: FormModel.Repeat;
	row: RepeatRow;
	repeatFormModelPath: ModelPath;
	repeatReadonly?: boolean;
	renderOptions: FormModelMap.RenderOptions;
	localizableFactory: LocalizableFactory;
	getTitle: GetTitle;
}): ReactElement | null {
	const { row, repeatFormModelPath, renderOptions, getTitle, localizableFactory, repeat } = props;

	const rowPath = row.path;

	const { ConfirmationButton } = useContext(ComponentMapContext);
	const widgetMap = useContext(WidgetMapContext);
	const renderAsListItem = useContext(MenuContext).renderAsListItem;
	const localizer = useContext(LocalizerContext).localizer;

	const hidden = isStandardRowActionHidden({
		byRow: renderOptions.config.enablements?.byRow ?? {},
		eventName: DefaultRepeatButtonNames.delete,
		rowIndex: InternalDocumentPath.rowIndex(rowPath),
		state: renderOptions.state,
		repeat,
		enabledInModel: repeat.enableRemove,
		repeatReadonly: props.repeatReadonly
	});

	if (hidden) {
		return null;
	}

	const id = UiId.generateForRowActionButton({
		uiIdPrefix: props.renderOptions.config.uiIdPrefix,
		repeat: props.repeat,
		rowIndex: rowPath[rowPath.length - 1].index,
		eventType: "remove",
		buttonType: renderAsListItem ? "list-item" : "button"
	});

	if (isFormModelRepeat(repeat)) {
		const confirmButtonLabel = getTitle("REMOVE");
		const cancelButtonLabel = getTitle("CANCEL");

		const deletionConfirmationTitle = localizer(
			...localizableFactory.componentConfirmationTitles(repeat, repeatFormModelPath, "REMOVE")
		);

		const deletionConfirmationText = localizer(
			...localizableFactory.componentConfirmationMessages(repeat, repeatFormModelPath, "REMOVE")
		);

		const disabled = isStandardRowActionDisabled({
			byRow: renderOptions.config.enablements?.byRow ?? {},
			eventName: DefaultRepeatButtonNames.delete,
			rowIndex: InternalDocumentPath.rowIndex(rowPath),
			state: renderOptions.state,
			repeat
		});

		const cellId = getScreenReaderCellId(repeat, row, props.renderOptions.config.uiIdPrefix);

		const buttonAttributes = {
			"aria-labelledby": cellId ? `${id} ${cellId}` : id
		} satisfies HTMLAttributes<HTMLButtonElement>;

		return (
			<ConfirmationButton
				id={id}
				key={"delete"}
				title={confirmButtonLabel}
				labelForContextMenuItem={confirmButtonLabel}
				confirmButtonDestructive={true}
				disabled={disabled}
				confirmationDialogTitle={deletionConfirmationTitle}
				action={() => {
					renderOptions.eventHandlers.repeat.removeRow(rowPath, repeatFormModelPath);
				}}
				confirmButtonLabel={confirmButtonLabel ? confirmButtonLabel : ""}
				cancelButtonLabel={cancelButtonLabel ? cancelButtonLabel : ""}
				confirmationMessage={deletionConfirmationText ? deletionConfirmationText : ""}
				icon={<widgetMap.Icon>delete</widgetMap.Icon>}
				buttonAttributes={buttonAttributes}
			/>
		);
	}

	throw new Error("Expected Repeat Element");
}
