// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com

/**
 * Application configuration for development.
 *
 * Configures configuration and services.
 */
import { ConsoleLoggingStrategy, Settings } from "@com.mgmtp.a12.utils/utils-logging";
import { LogLevel } from "@com.mgmtp.a12.utils/utils-logging/api.js";

class DynamicConsoleLoggingStrategy extends ConsoleLoggingStrategy {
	private static LocalStorageKey = "logLevel";

	private static LogLevelMap: { readonly [key: string]: LogLevel | undefined } = {
		TRACE: LogLevel.TRACE,
		LOG: LogLevel.LOG,
		INFO: LogLevel.INFO,
		WARN: LogLevel.WARN,
		ERROR: LogLevel.ERROR
	};

	private static getLogLevel(): LogLevel | undefined {
		const logLevelName = localStorage.getItem(this.LocalStorageKey);
		return logLevelName ? this.LogLevelMap[logLevelName.toUpperCase()] : undefined;
	}

	constructor() {
		const logLevel = DynamicConsoleLoggingStrategy.getLogLevel();
		super(console, logLevel || LogLevel.WARN);
	}

	digest(
		namespace: string,
		level: LogLevel,
		date: Date,
		message?: unknown,
		...optionalParams: unknown[]
	): void {
		// Enable dynamic log
		const logLevel = DynamicConsoleLoggingStrategy.getLogLevel();
		if (logLevel !== undefined) {
			this.logLevel = logLevel;
		}
		super.digest(namespace, level, date, message, ...optionalParams);
	}
}

Settings.LogStrategy = new DynamicConsoleLoggingStrategy();
