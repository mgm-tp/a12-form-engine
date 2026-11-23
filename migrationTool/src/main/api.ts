// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import type { MigrationTool } from "@com.mgmtp.a12.migrationtool/migrationtool-core/types";
import { createMigrationTool } from "@com.mgmtp.a12.migrationtool/migrationtool-core/web";

import { MIGRATION_PARAMETERS } from "./config.js";

export const FormMigrationTool: MigrationTool = createMigrationTool(MIGRATION_PARAMETERS);
