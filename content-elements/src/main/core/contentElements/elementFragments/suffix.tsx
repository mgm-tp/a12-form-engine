// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX } from "react";
import { useContext } from "react";

import { WidgetMapContext } from "../../widgetMap/widgetMap-context.js";

/**
 * @internal
 */
export interface SuffixProps {
	suffix?: string;
	truncateSuffix?: boolean;
	id?: string;
}

/**
 * @internal
 */
export function Suffix(props: SuffixProps): JSX.Element | null {
	const { TextAffix } = useContext(WidgetMapContext);

	return props.suffix ? (
		<TextAffix truncate={props.truncateSuffix} id={props.id}>
			{props.suffix}
		</TextAffix>
	) : null;
}
