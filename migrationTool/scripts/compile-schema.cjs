// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
const { execSync } = require("node:child_process");

// CI builds need the compiled JSON schema; local dev skips it to save time.
// Both branches are static literals (no external input), so shell interpolation is safe here.
const command = process.env.CI ? "migration-tool-utils compile" : "migration-tool-utils compile --no-schema";
execSync(command, { stdio: "inherit" });
