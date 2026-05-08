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

import type { JSX, ReactElement } from "react";
import { useContext } from "react";

import type { DocumentModel } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/api.js";
import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";
import type { Localizer } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";
import type { Column } from "@com.mgmtp.a12.widgets/widgets-core/lib/table/new-api/column.api.js";

import { RESOURCE_KEYS } from "../../../../../../../back-end/localization/index.js";
import { getLocalizedResource } from "../../../../../../../back-end/localization/internal/localize.js";
import { DocumentModelUtils } from "../../../../../../../models/internal/utils/document-model-utils.js";
import type { Inputs } from "../../../../../configuration/engine-configuration.js";
import { WidgetMapContext } from "../../../../../configuration/widget-map-context.js";
import { ContentWithNewLines } from "../../../../../utilities/contentWithNewLines.js";
import { isEmpty } from "../../../../../utilities/value.js";

import { getDisplayLabels } from "../boolean/display-label.js";
import { getMultiSelectContent } from "../multi-select/multi-select-text-output-content.js";

import { useTextOutputProps } from "./text-output-props.js";

/** @internal */
export interface TextOutputProps extends Inputs.InputProps<
	DocumentModel.FieldType | DocumentModel.Group
> {
	readonly displayPartialText?: boolean;
	readonly disableParagraphWrapping?: boolean;
	readonly alignment?: Column.HorizontalAlignment;
}

/** @internal */
export function TextOutput(props: TextOutputProps): ReactElement {
	const { localizer } = useContext(LocalizerContext);
	const { CssEllipsis, TextOutput } = useContext(WidgetMapContext);

	const textOutputProps = useTextOutputProps(props);

	const data = getShownData(props, localizer, props.modelElement.suffix, props.displayPartialText);
	const noData =
		data === undefined
			? getLocalizedResource(RESOURCE_KEYS.textOutput.noData, localizer)
			: undefined;

	return (
		<TextOutput
			{...textOutputProps}
			label={props.modelElement.labelHiddenButRead ? undefined : props.modelElement.label}
			noData={noData !== undefined}
			addonAfter={
				props.modelElement.tooltipsOnTop !== true ? textOutputProps.addonAfter : undefined
			}
			tooltips={props.modelElement.tooltipsOnTop ? textOutputProps.addonAfter : undefined}
			disableParagraphWrapping={props.disableParagraphWrapping}
			alignment={props.alignment}
		>
			{props.displayPartialText && data !== undefined ? (
				<CssEllipsis useTooltip>{data}</CssEllipsis>
			) : (
				(data ?? noData)
			)}
		</TextOutput>
	);
}

function getShownData(
	props: Inputs.InputProps<DocumentModel.FieldType | DocumentModel.Group>,
	localizer: Localizer,
	suffix?: string,
	displayPartialText?: boolean
): JSX.Element | string | undefined {
	if (
		props.documentElementDataType.type === "BooleanType" ||
		props.documentElementDataType.type === "ConfirmType"
	) {
		if (isEmpty(props.value.data)) {
			return undefined;
		}

		const displayValues = getDisplayLabels(props.renderConfiguration.renderOptions, props.value);
		return localizer(
			...(props.value.data === true ? displayValues.checkedOption : displayValues.uncheckedOption)
		);
	} else if (DocumentModelUtils.isMultiSelect(props.documentElement)) {
		if (isEmpty(props.value.data)) {
			return undefined;
		}

		return getMultiSelectContent(
			props.value,
			props.renderConfiguration,
			localizer,
			props.modelElement.showCommaSeparated ?? displayPartialText
		);
	} else {
		if (isEmpty(props.value.ui)) {
			return undefined;
		}

		if (props.modelElement.secret === true) {
			return props.value.ui.replace(/./g, "*");
		}
		const content = suffix !== undefined ? props.value.ui + " " + suffix : props.value.ui;

		return <ContentWithNewLines content={content} />;
	}
}
