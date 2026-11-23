// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.migration;

import java.util.Set;
import java.util.stream.Collectors;

/**
 * An issue for a group operand of a computation that has one or more descendants which can become not relevant.
 */
record GroupOperandIssue(Set<GroupExpander.ExpandedGroup> groups) implements Issue {

	public String toString() {
		return String.format(
			"\t\tThe following operands of type 'group' contain potentially non-relevant elements:%n\t\t\t%s%n",
			groups.stream().map(Object::toString).collect(Collectors.joining("," + System.lineSeparator() + "\t\t\t"))
		);
	}
}
