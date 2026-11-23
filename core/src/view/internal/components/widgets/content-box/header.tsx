// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { useContext } from "react";
import type { JSX, ReactElement } from "react";

import { WidgetMapContext } from "../../../configuration/widget-map-context.js";

import type { HtmlTextProps } from "../form-engine/text.js";

/** @internal */
export interface ContentBoxHeaderProps {
	readonly title: string;
	readonly subtitle?: ReactElement<HtmlTextProps> | string;
	readonly ariaLevel?: number;
}

/** @internal */
export function ContentBoxHeader(props: ContentBoxHeaderProps): JSX.Element {
	const { ContentBoxTitle, ContentBoxSubtitle } = useContext(WidgetMapContext);

	return (
		<>
			<ContentBoxTitle text={props.title} ariaLevel={props.ariaLevel} role="heading" />
			{props.subtitle && <ContentBoxSubtitle text={props.subtitle} role="heading" />}
		</>
	);
}
