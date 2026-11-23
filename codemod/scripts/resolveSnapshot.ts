// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
import { snapshot } from "node:test";

snapshot.setResolveSnapshotPath(fileName => {
	const toSrcDir = fileName?.replace("lib", "src");

	return `${toSrcDir}.snapshot`;
});

snapshot.setDefaultSnapshotSerializers([v => v]);
