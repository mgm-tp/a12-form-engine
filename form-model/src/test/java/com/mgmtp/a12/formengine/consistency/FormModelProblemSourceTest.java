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

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.empty;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;

import java.util.Arrays;
import java.util.List;

import org.testng.annotations.Test;

public class FormModelProblemSourceTest {

	@Test
	public void singleElementSourceInvolvesThatElement() {
		final FormModelProblemSource source = new FormModelProblemSource("control-1");

		assertThat(source.sourceElementId(), is("control-1"));
		assertThat(source.involvedElementIds(), contains("control-1"));
	}

	@Test
	public void involvingReportsThePrimaryElementFirst() {
		final FormModelProblemSource source =
			FormModelProblemSource.involving("control-1", "screen-1", "repeat-1");

		assertThat(source.sourceElementId(), is("control-1"));
		assertThat(source.involvedElementIds(), contains("control-1", "screen-1", "repeat-1"));
	}

	@Test
	public void repeatedElementsAreReportedOnce() {
		final FormModelProblemSource source =
			FormModelProblemSource.involving("repeat-1", "column-1", "repeat-1");

		assertThat(source.involvedElementIds(), contains("repeat-1", "column-1"));
	}

	@Test
	public void elementsWithoutAnIdAreDropped() {
		final FormModelProblemSource source =
			FormModelProblemSource.involving("control-1", null, "", "  ", "screen-1");

		assertThat(source.involvedElementIds(), contains("control-1", "screen-1"));
	}

	@Test
	public void undeterminableElementsLeaveNoInvolvedElements() {
		final FormModelProblemSource source = new FormModelProblemSource(null);

		assertThat(source.sourceElementId(), is(nullValue()));
		assertThat(source.involvedElementIds(), is(empty()));
	}

	@Test
	public void aMissingInvolvedElementListIsReadAsAnEmptyOne() {
		final FormModelProblemSource source = new FormModelProblemSource("control-1", null);

		assertThat(source.sourceElementId(), is("control-1"));
		assertThat(source.involvedElementIds(), is(empty()));
	}

	@Test
	public void involvedElementIdsCannotBeModified() {
		final List<String> mutableIds = Arrays.asList("control-1", "screen-1");
		final FormModelProblemSource source = new FormModelProblemSource("control-1", mutableIds);

		mutableIds.set(1, "screen-2");

		assertThat(source.involvedElementIds(), contains("control-1", "screen-1"));
	}
}
