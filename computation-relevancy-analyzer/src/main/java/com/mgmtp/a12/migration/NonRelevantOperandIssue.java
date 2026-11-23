// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.migration;

import java.util.Set;
import java.util.stream.Collectors;

/**
 * An issue for operands of computation that can become not relevant due to a FM dependency.
 */
record NonRelevantOperandIssue(Set<String> elementPaths) implements Issue {
	public String toString() {
		return String.format(
			"\t\tOperands:%n\t\t\t%s",
			elementPaths.stream()
						.filter(path -> isLeastSpecificReference(path, elementPaths))
						.collect(Collectors.joining("," + System.lineSeparator()))
		);
	}

	private boolean isLeastSpecificReference(final String current, final Iterable<String> references) {
		for (final String reference : references) {
			if (!current.equals(reference) && current.startsWith(reference)) {
				return false;
			}
		}
		return true;
	}
}
