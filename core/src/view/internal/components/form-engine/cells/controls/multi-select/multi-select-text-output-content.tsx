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

import { useContext, type JSX } from "react";

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
