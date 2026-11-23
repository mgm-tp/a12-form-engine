// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX } from "react";
import { useContext } from "react";

import { ModelPath } from "@com.mgmtp.a12.base/base-model-api/lib/main/model/index.js";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";
import { localizableFromLocalizationTreeMap } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import {
	DEFAULT_TRANSLATIONS,
	RESOURCE_KEYS
} from "../../../../../../back-end/localization/index.js";
import { UiStateSelectors } from "../../../../../../back-end/store/internal/selectors/ui-state.js";
import { FormModel } from "../../../../../../models/index.js";
import { ComponentMapContext } from "../../../../configuration/componentMap/component-map-context.js";
import { WidgetMapContext } from "../../../../configuration/widget-map-context.js";

import type { RowActionButtonsProps } from "../components/row-actions/standard/StandardRowActionButtons.js";

/** @internal */
export function ErrorHint(props: RowActionButtonsProps): JSX.Element | null {
	const localizer = useContext(LocalizerContext).localizer;

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

	if (FormModel.EmbeddedRepeat.isInstance(repeat)) {
		const filtered = repeat.multiFileUpload
			? errorMessagesForElement
			: errorMessagesForElement.filter(e =>
					repeat.controlGrid.row?.some(r =>
						r.cell?.some(
							c => FormModel.Control.isInstance(c) && ModelPath.equal(e.element, c.elementPath)
						)
					)
				);

		const messages = filtered.map(m => m.errorText);

		const errorText = repeat.multiFileUpload ? (
			<MessageList messages={messages} />
		) : (
			localizer(
				localizableFromLocalizationTreeMap(
					RESOURCE_KEYS.repeat.embeddedRepeat.errorHint,
					DEFAULT_TRANSLATIONS
				)
			)
		);

		return filtered.length > 0 ? <widgetMap.ErrorTooltip text={errorText} /> : null;
	}

	return null;
}
