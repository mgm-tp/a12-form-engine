// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.migration;

/**
 * Container for all kinds of findings of a scan
 */
record Finding(String computationPath, Issue issue) {
	public String toString() {
		return String.format(
			"\tComputation [path: %s] refers to potentially non-relevant model elements:%n%s%n",
			computationPath,
			issue
		);
	}
}
