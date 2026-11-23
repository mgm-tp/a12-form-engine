// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX } from "react";
import { useContext } from "react";

import { WidgetMapContext } from "../../../configuration/widget-map-context.js";

export interface SuffixProps {
	suffix?: string;
	truncateSuffix?: boolean;
	id?: string;
}

export function Suffix(props: SuffixProps): JSX.Element | null {
	const widgetMap = useContext(WidgetMapContext);

	return props.suffix ? (
		<widgetMap.TextAffix truncate={props.truncateSuffix} id={props.id}>
			{props.suffix}
		</widgetMap.TextAffix>
	) : null;
}
