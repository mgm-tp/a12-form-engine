// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { JSX, PropsWithChildren } from "react";

export function MockComponent(
	props: { id?: string; dataRole: string } & PropsWithChildren
): JSX.Element {
	return (
		<div id={props.id} data-role={props.dataRole} tabIndex={0}>
			{props.children}
		</div>
	);
}
