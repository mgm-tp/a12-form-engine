/*
 * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
 *
 * Copyright (c) 2012-2026 mgm technology partners GmbH
 *
 * Dual License
 * ------------
 * This source file is part of the mgm A12 Platform and available under
 * a choice of two different licenses:
 *
 * 1. Open-Source License - EUPL v1.2
 *    You may redistribute and/or modify this file under the terms of the
 *    European Union Public License, version 1.2 - see https://eupl.eu/.
 *
 * 2. Commercial License
 *    Alternatively, you may obtain a commercial license from
 *    mgm technology partners GmbH, that permits use of this software
 *    under different terms (including support and maintenance services).
 *
 *    Please contact a12-license@mgm-tp.com for more information.
 *
 * You must select and comply with exactly one of the above license options.
 *
 * Warranty Disclaimer (applies to either option)
 * ----------------------------------------------
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF ANY KIND,
 * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE
 * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.
 */
package com.mgmtp.a12.formengine.consistency;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Stream;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

/**
 * Identifies the form model elements a consistency problem was reported for.
 *
 * @param sourceElementId id of the element the problem is primarily reported for, i.e. the first entry of
 * 	{@code involvedElementIds}. May be {@code null} if a check cannot determine the element it reports about.
 * @param involvedElementIds ids of all elements involved in the problem, the primary element first. Blank ids are
 * 	dropped and repeated ids are reported once, so this list is empty for a problem whose elements could not be
 * 	determined. Elements that are only identified by the document model element they are configured for - field and
 * 	group configurations - contribute that document model element id. May be {@code null}, which is read as an
 * 	empty list.
 */
public record FormModelProblemSource(String sourceElementId, List<String> involvedElementIds) {

	public FormModelProblemSource {
		involvedElementIds = CollectionUtils.emptyIfNull(involvedElementIds)
			.stream()
			.filter(StringUtils::isNotBlank)
			.distinct()
			.toList();
	}

	/**
	 * Creates a source for a problem that involves a single element.
	 *
	 * @param sourceElementId id of the involved element
	 */
	public FormModelProblemSource(final String sourceElementId) {
		this(sourceElementId, Collections.singletonList(sourceElementId));
	}

	/**
	 * Creates a source for a problem that involves the given elements, the primary element first.
	 *
	 * @param sourceElementId id of the element the problem is primarily reported for
	 * @param furtherInvolvedElementIds ids of the remaining involved elements, in the order they appear in the
	 * 	problem message
	 * @return the source describing all involved elements
	 */
	public static FormModelProblemSource involving(
		final String sourceElementId,
		final String... furtherInvolvedElementIds
	) {
		return new FormModelProblemSource(
			sourceElementId,
			Stream.concat(Stream.of(sourceElementId), Arrays.stream(furtherInvolvedElementIds)).toList()
		);
	}
}
