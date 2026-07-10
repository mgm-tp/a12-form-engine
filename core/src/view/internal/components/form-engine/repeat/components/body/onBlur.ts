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

import { ModelSelectors } from "../../../../../../../back-end/store/internal/selectors/models.js";
import { UiId } from "../../../../../../../back-end/utils/internal/generateUiId.js";
import type { FormModel } from "../../../../../../../models/index.js";
import { findElementByFormModelPath } from "../../../../../../../models/index.js";
import type { FormModelMap } from "../../../../../configuration/engine-configuration.js";

import type { RepeatRow } from "../tableColumnTypes.js";

/** @internal */
export function onBlurRow(options: {
	readonly row: RepeatRow;
	readonly config: FormModelMap.RenderConfiguration;
	readonly event: React.FocusEvent<HTMLElement>;
}): void {
	const { row, config, event } = options;
	const { renderOptions, parentPath: repeatFormModelPath } = config;

	const activeElement =
		event.relatedTarget === null || !(event.relatedTarget instanceof Element)
			? document.activeElement
			: event.relatedTarget;

	const modelElement = findElementByFormModelPath(
		ModelSelectors.formModel()(config.renderOptions.state),
		repeatFormModelPath
	)! as FormModel.Repeat;
	const tableId = UiId.generateForRepeatTable({
		id: modelElement.id,
		uiIdPrefix: options.config.renderOptions.config.uiIdPrefix
	});
	const repeatElement = document.getElementById(tableId);
	if (!repeatElement?.contains(activeElement)) {
		// Will be handled by leave table
		return;
	}

	if (!event.currentTarget.contains(activeElement) && shouldBlur(activeElement)) {
		renderOptions.eventHandlers.repeat.onLeaveRepeatRow(row.path, repeatFormModelPath);
	}
}

/** @internal */
export function onBlurTable(
	config: FormModelMap.RenderConfiguration,
	repeat: FormModel.Repeat
): (event: React.FocusEvent<HTMLElement>) => void {
	return event => {
		const { renderOptions, parentPath: repeatFormModelPath } = config;

		const activeElement =
			event.relatedTarget === null || !(event.relatedTarget instanceof Element)
				? document.activeElement
				: event.relatedTarget;

		// clicking the add button immediately results in a new (focussed) row,
		// so the table should not be considered "left" in this case
		const repeatAddButtonClicked =
			activeElement?.id ===
			UiId.generateForAddButton({
				repeat,
				uiIdPrefix: config.renderOptions.config.uiIdPrefix
			});

		if (
			!event.currentTarget.contains(activeElement) &&
			!repeatAddButtonClicked &&
			shouldBlur(activeElement)
		) {
			renderOptions.eventHandlers.repeat.onLeaveTable(repeatFormModelPath);
		}
	};
}

function shouldBlur(activeElement: Element | null): boolean {
	// Check if there is a picker which contains the active element
	const pickerWrappers = document.querySelectorAll(`[id$="picker-wrapper"]`);
	const pickerWrapperOpen = Array.from(pickerWrappers).some(pickerWrapper =>
		pickerWrapper?.contains(activeElement)
	);

	// Check if a auto-complete dropdown which contains the active element
	const autoCompletes = document.querySelectorAll(`[id$="-dropdown"]`);
	const autoCompleteOpen = Array.from(autoCompletes).some(autoComplete =>
		autoComplete?.contains(activeElement)
	);

	const confirmations = document.querySelectorAll(`[data-role$="modal-overlay"]`);
	const confirmationOpen = Array.from(confirmations).some(confirmation =>
		confirmation?.contains(activeElement)
	);

	const contextMenu = document.querySelectorAll(`[data-role$="attached-portal"]`);
	const contextMenuOpen = Array.from(contextMenu).some(confirmation =>
		confirmation?.contains(activeElement)
	);

	return !pickerWrapperOpen && !autoCompleteOpen && !confirmationOpen && !contextMenuOpen;
}
