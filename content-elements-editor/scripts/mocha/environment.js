// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

import { LogLevel } from "@com.mgmtp.a12.utils/utils-logging/api.js";
import { ConsoleLoggingStrategy, Settings } from "@com.mgmtp.a12.utils/utils-logging/index.js";

Settings.LogStrategy = new ConsoleLoggingStrategy(console, LogLevel.LOG);
