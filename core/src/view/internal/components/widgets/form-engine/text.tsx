// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

/** @internal */
import type { JSX } from "react";

export interface HtmlTextProps {
	readonly id?: string;
	readonly content: string;
}

/** @internal */
export function HtmlTextDiv({ id, content }: HtmlTextProps): JSX.Element | null {
	// nosemgrep: typescript.react.security.audit.react-dangerouslysetinnerhtml.react-dangerouslysetinnerhtml
	return <div id={id} dangerouslySetInnerHTML={{ __html: content }} />;
}

/** @internal */
export function HtmlTextSpan({ id, content }: HtmlTextProps): JSX.Element | null {
	// nosemgrep: typescript.react.security.audit.react-dangerouslysetinnerhtml.react-dangerouslysetinnerhtml
	return <span id={id} dangerouslySetInnerHTML={{ __html: content }} />;
}
