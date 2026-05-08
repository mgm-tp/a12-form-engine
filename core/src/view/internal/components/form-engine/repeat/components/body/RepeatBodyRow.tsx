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

import { useContext } from "react";

import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";
import type { Styleable } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/base-props.js";

import { createLocalizableFactory } from "../../../../../../../back-end/localization/internal/localization.js";
import { ModelSelectors } from "../../../../../../../back-end/store/internal/selectors/models.js";
import type { EngineStore } from "../../../../../../../back-end/store/internal/store.js";
import { DocumentPath } from "../../../../../../../models/internal/utils/document-utils.js";
import type { FormModelMap } from "../../../../../configuration/engine-configuration.js";
import { TableWidgetMapContext } from "../../table-widget-map.js";

import type { DefaultRowActionResult } from "../row-actions/DefaultRowActionResult.js";
import type { RepeatRow } from "../tableColumnTypes.js";

import { onBlurRow } from "./onBlur.js";

/** @internal */
export interface BodyRowProps extends Styleable {
	readonly config: FormModelMap.RenderConfiguration;
	readonly repeatState?: EngineStore.Repeat.Entry;
	readonly row: RepeatRow;
	readonly rowIndex: number;
	readonly id: string;
	readonly focus?: boolean;
	readonly highlighted?: boolean;
	readonly defaultRowAction?: DefaultRowActionResult;
	readonly totalNumberOfRows: number;
	readonly readonly: boolean;
}

/** @internal */
export function RepeatBodyRow(props: BodyRowProps): React.ReactNode {
	const { id, defaultRowAction, highlighted, row, rowIndex, style, className } = props;

	const localizerCtx = useContext(LocalizerContext);

	const onBlur: React.FocusEventHandler<HTMLElement> = event => {
		onBlurRow({ event, config: props.config, row: props.row });
	};

	const onClick: React.MouseEventHandler<HTMLElement> = () => {
		const { defaultRowAction, config } = props;
		const { parentPath: repeatFormModelPath } = config;
		if (defaultRowAction) {
			defaultRowAction.triggerAction(props.row.path, repeatFormModelPath);
		}
	};

	const onFocus: React.FocusEventHandler<HTMLElement> = () => {
		const { config, repeatState } = props;
		const { renderOptions, parentPath: repeatFormModelPath } = config;
		const newRow = repeatState ? repeatState.newRow : undefined;

		if (newRow && !DocumentPath.equal(props.row.path, newRow.rowPath)) {
			renderOptions.eventHandlers.repeat.onLeaveRepeatRow(newRow.rowPath, repeatFormModelPath);
		}
	};

	const title: (
		defaultRowAction?: DefaultRowActionResult
	) => string | undefined = defaultRowAction => {
		if (defaultRowAction) {
			const localizableFactory = createLocalizableFactory(
				ModelSelectors.documentModel()(props.config.renderOptions.state),
				ModelSelectors.formModel()(props.config.renderOptions.state)
			);

			return localizerCtx.localizer(...defaultRowAction.getLocalizables(localizableFactory));
		}
		return undefined;
	};

	const { bodyRowRenderer } = useContext(TableWidgetMapContext);

	return bodyRowRenderer({
		id: id,
		onFocus,
		onBlur,
		onClick: defaultRowAction ? onClick : undefined,
		interactive: defaultRowAction !== undefined,
		highlighted,
		row,
		rowIndex,
		style,
		className,
		title: title(defaultRowAction)
	});
}
