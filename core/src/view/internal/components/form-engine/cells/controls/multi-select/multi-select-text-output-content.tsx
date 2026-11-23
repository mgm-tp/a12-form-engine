// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { useContext } from "react";
import type { JSX } from "react";

import type { Localizer } from "@com.mgmtp.a12.utils/utils-localization/lib/main/localization/Localizer.js";

import type { FormModelMap } from "../../../../../configuration/engine-configuration.js";
import { WidgetMapContext } from "../../../../../configuration/widget-map-context.js";
import { getLocalizedMultiSelectUiValue } from "../../../../../utilities/multi-select-helper.js";
import type { Value } from "../../../../../utilities/value.js";

/** @internal */
export function getMultiSelectContent(
	value: Value,
	renderConfig: FormModelMap.RenderConfiguration,
	localizer: Localizer,
	commaSeparatedList?: boolean
): JSX.Element | string {
	const uiValues = getLocalizedMultiSelectUiValue(renderConfig.renderOptions, value, localizer);

	if (commaSeparatedList) {
		return uiValues.join(", ");
	} else {
		return uiValues.length > 1 ? <MultiSelectBulletList uiValues={uiValues} /> : uiValues[0];
	}
}

function MultiSelectBulletList(props: { uiValues: string[] }): JSX.Element {
	const { BulletListUnordered, BulletListItem } = useContext(WidgetMapContext);

	return (
		<BulletListUnordered indent={false} type="disc">
			{props.uiValues.map((s, index) => (
				<BulletListItem key={index}>{s}</BulletListItem>
			))}
		</BulletListUnordered>
	);
}
