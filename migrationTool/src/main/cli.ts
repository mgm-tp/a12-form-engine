#!/usr/bin/env node
// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { createMigrationCLI } from "@com.mgmtp.a12.migrationtool/migrationtool-core/cli";

import { MIGRATION_PARAMETERS } from "./config.js";

createMigrationCLI(MIGRATION_PARAMETERS);
