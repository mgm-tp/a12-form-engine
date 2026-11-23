// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX } from "react";

/** @internal */
export function getErrorMessages(messages: string[]): JSX.Element | null {
	if (messages.length === 0) {
		return null;
	}

	if (messages.length === 1) {
		return <div>{messages[0]}</div>;
	}

	return (
		<ul>
			{messages.map((errorMessage, index) => {
				return <li key={index}>{errorMessage}</li>;
			})}
		</ul>
	);
}
