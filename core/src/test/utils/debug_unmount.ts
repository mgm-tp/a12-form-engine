// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { useEffect } from "react";

export function useDebugUnmount(id: string): void {
	useEffect(() => {
		// oxlint-disable-next-line no-console
		console.log("mount: " + id);
		return () => {
			// oxlint-disable-next-line no-console
			console.log("unmount: " + id);
		};
	}, [id]);
}
