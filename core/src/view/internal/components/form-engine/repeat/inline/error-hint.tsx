// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX } from "react";
import { useContext } from "react";

import { UiStateSelectors } from "../../../../../../back-end/store/internal/selectors/ui-state.js";
import { FormModel } from "../../../../../../models/index.js";
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

	if (FormModel.InlineRepeat.isInstance(repeat) && repeat.multiFileUpload) {
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
