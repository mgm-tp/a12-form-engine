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

import { useContext } from "react";

import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react";
import { addPrefix } from "@com.mgmtp.a12.widgets/widgets-core";

import { RESOURCE_KEYS } from "../../../../../../../back-end/localization/index.js";
import { getLocalizedResource } from "../../../../../../../back-end/localization/internal/localize.js";
import type { FormModelMap } from "../../../../../configuration/engine-configuration.js";
import { WidgetMapContext } from "../../../../../configuration/widget-map-context.js";

import { RepeatUtils } from "../repeat-utils.js";

interface EmptyTablePlaceholderProps {
	config: FormModelMap.RenderConfiguration;
	isRepeatWithFilterExpression: boolean;
	totalNumberOfRows: number;
	totalNumberOfProcessedDataRows: number;
}

/** @internal */
export function EmptyTablePlaceholder(props: EmptyTablePlaceholderProps) {
	const {
		config,
		isRepeatWithFilterExpression,
		totalNumberOfRows,
		totalNumberOfProcessedDataRows
	} = props;

	const localizer = useContext(LocalizerContext).localizer;
	const { Message } = useContext(WidgetMapContext);

	const isTableEmptyByFiltering = RepeatUtils.isTableEmptyByFiltering(
		totalNumberOfRows,
		totalNumberOfProcessedDataRows,
		isRepeatWithFilterExpression,
		config
	);

	const key = isTableEmptyByFiltering
		? RESOURCE_KEYS.repeat.empty.filtered
		: RESOURCE_KEYS.repeat.empty.entries;
	const text = getLocalizedResource(key, localizer);

	if (text === undefined) {
		return null;
	}

	return (
		<Message
			key="emptyplaceholder_1"
			className={addPrefix("-u-height-full -u-flex -u-justify-center")}
		>
			{text}
		</Message>
	);
}
