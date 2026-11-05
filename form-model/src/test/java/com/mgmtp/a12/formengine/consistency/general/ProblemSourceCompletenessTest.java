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
package com.mgmtp.a12.formengine.consistency.general;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.empty;
import static org.hamcrest.Matchers.everyItem;
import static org.hamcrest.Matchers.instanceOf;
import static org.hamcrest.Matchers.is;

import com.mgmtp.a12.model.consistency.Problem;

import com.mgmtp.a12.formengine.consistency.FormModelProblemSource;
import com.mgmtp.a12.formengine.consistency.FormModelValidator;
import com.mgmtp.a12.formengine.consistency.rules.RuleTestHelper;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.TreeSet;

import org.testng.annotations.BeforeClass;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

/**
 * Verifies that every rule describes the elements its problems are about, so that consumers can rely on the
 * source of a problem being a {@link FormModelProblemSource}.
 */
public class ProblemSourceCompletenessTest extends ConsistencyValidatorTest {

	private static final String FIXTURE_DIRECTORY = "com/mgmtp/a12/formengine/consistency/general/";

	@BeforeClass
	public void setUp() {
		fmValidator = new FormModelValidator(new FileBasedDocumentModelResolver(FIXTURE_DIRECTORY));
	}

	@Test(dataProvider = "formModels")
	public void everyProblemDescribesItsElements(final String modelName) throws IOException {
		final List<Problem> problems = runValidation(modelName);

		assertThat(
			problems.stream().map(Problem::getSource).toList(),
			everyItem(instanceOf(FormModelProblemSource.class)));
		// a source without any involved element leaves consumers with nothing to point at
		assertThat(
			problems.stream()
				.filter(problem -> RuleTestHelper.involvedElementIds(problem).isEmpty())
				.map(Problem::getMessage)
				.toList(),
			is(empty()));
	}

	@DataProvider
	public Object[][] formModels() throws IOException, URISyntaxException {
		final Set<String> formModelNames = new TreeSet<>();
		for (final URL fixtureRoot : Collections.list(getClass().getClassLoader().getResources(FIXTURE_DIRECTORY))) {
			formModelNames.addAll(formModelNamesIn(fixtureRoot));
		}

		return formModelNames.stream()
			.map(name -> new Object[] { FIXTURE_DIRECTORY + name })
			.toArray(Object[][]::new);
	}

	private static List<String> formModelNamesIn(final URL fixtureRoot) throws URISyntaxException {
		if (!"file".equals(fixtureRoot.getProtocol())) {
			return List.of();
		}
		final File[] files = new File(fixtureRoot.toURI())
			.listFiles((directory, name) -> name.startsWith("ProductForm") && name.endsWith(".json"));

		return Arrays.stream(Objects.requireNonNull(files)).map(File::getName).toList();
	}
}
