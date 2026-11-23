// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { useState } from "react";

/**
 * @internal
 *
 * force re-rendering using a counter state.
 */
export function useForceUpdate(): () => void {
	const [, setRevision] = useState(0);
	return () => {
		setRevision(r => r + 1);
	};
}
