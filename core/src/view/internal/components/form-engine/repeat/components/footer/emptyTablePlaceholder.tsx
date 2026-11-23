// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { useContext } from "react";

import { LocalizerContext } from "@com.mgmtp.a12.utils/utils-localization-react/lib/main/index.js";
import { addPrefix } from "@com.mgmtp.a12.widgets/widgets-core/lib/common/main/utils.js";

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
