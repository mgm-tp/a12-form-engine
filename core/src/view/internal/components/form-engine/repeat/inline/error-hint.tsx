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
import { useContext } from "react";

import { UiStateSelectors } from "../../../../../../back-end/store/internal/selectors/ui-state.js";
import { isFormModelInlineRepeat } from "../../../../../../models/internal/FormModelGuards.js";
import { ComponentMapContext } from "../../../../configuration/componentMap/component-map-context.js";
import { WidgetMapContext } from "../../../../configuration/widget-map-context.js";

import { filterErrorMessagesForNonVisibleFields } from "../components/filterErrorMessagesForNonVisibleFields.js";
import type { RowActionButtonsProps } from "../components/row-actions/standard/StandardRowActionButtons.js";

/** @internal */
export function ErrorHint(props: RowActionButtonsProps): JSX.Element | null {
	const row = props.row;
	const config = props.config;
	const errorMessagesForElement = UiStateSelectors.messagesByPath(
		row.path,
		[],
		"error"
	)(config.renderOptions.state);
	const widgetMap = useContext(WidgetMapContext);
	const { MessageList } = useContext(ComponentMapContext);

	const repeat = props.repeat;

	if (isFormModelInlineRepeat(repeat) && repeat.multiFileUpload) {
		const filtered = filterErrorMessagesForNonVisibleFields(
			repeat,
			config.parentPath,
			config.renderOptions.state,
			errorMessagesForElement
		);

		const messages = filtered.map(m => m.errorText);

		return filtered.length > 0 ? (
			<widgetMap.ErrorTooltip text={<MessageList messages={messages} />} />
		) : null;
	}

	return null;
}
