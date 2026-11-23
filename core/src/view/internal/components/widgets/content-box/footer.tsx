// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX, ReactNode } from "react";
import { useContext } from "react";

import { WidgetMapContext } from "../../../configuration/widget-map-context.js";
import { AriaLevelContext } from "../../content-box/AriaLevelContext.js";

/** @internal */
export interface ContentBoxFooterProps {
	readonly children: ReactNode;
}

/** @internal */
export function ContentBoxFooter(props: ContentBoxFooterProps): JSX.Element {
	const { ariaLevel } = useContext(AriaLevelContext);
	const widgetMap = useContext(WidgetMapContext);

	return (
		<widgetMap.ContentBoxFooter ariaLevel={ariaLevel}>{props.children}</widgetMap.ContentBoxFooter>
	);
}
