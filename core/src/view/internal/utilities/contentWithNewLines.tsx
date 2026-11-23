// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX } from "react";
import { Fragment } from "react";

/** @internal */
export interface ContentWithNewLinesProps {
	content: string;
}

/** @internal */
export function ContentWithNewLines(props: ContentWithNewLinesProps): JSX.Element {
	const { content } = props;
	const lines = content.split("\n");
	return (
		<>
			{lines.slice(0, lines.length - 1).map((line, index) => {
				return (
					<Fragment key={index}>
						{line} <br />
					</Fragment>
				);
			})}
			{lines[lines.length - 1]}
		</>
	);
}
