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
 * 1. Open-Source License – EUPL v1.2
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
package com.mgmtp.a12.migration;

import com.mgmtp.a12.kernel.md.model.api.IDocumentModel;
import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.MeliesModelUtil;
import com.mgmtp.a12.model.ui.form.serialization.FormModelJsonStreamSerializer;
import org.hamcrest.Description;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasItem;

public class ModelCheckTest {

	@Test
	public void testScanWithoutComputations() {
		final var testModels = loadModels("without-computation", "test-fm.json");

		final var findings = ModelCheck.scanModelTuple(testModels.meliesModel(), testModels.documentModel());
		Assert.assertEquals(findings.size(), 0);
	}

	@Test
	public void testScanWithoutDependencies() {
		final var testModels = loadModels("without-dependencies", "test-fm.json");

		final var findings = ModelCheck.scanModelTuple(testModels.meliesModel(), testModels.documentModel());
		Assert.assertEquals(findings.size(), 0);
	}

	@Test
	public void testScanWithoutIssues() {
		final var testModels = loadModels("without-issues", "test-fm.json");

		final var findings = ModelCheck.scanModelTuple(testModels.meliesModel(), testModels.documentModel());
		Assert.assertEquals(findings.size(), 0);
	}

	@Test
	public void testFindNonRelevantOperands() {
		final var testModels = loadModels("non-relevant-operand", "test-fm.json");

		final var findings = ModelCheck.scanModelTuple(testModels.meliesModel(), testModels.documentModel());
		assertThat(findings.size(), equalTo(2));

		assertThat(
			findings,
			hasItem(
				thatIsNonRelevantOpFindingFor(
					"/root/fieldOperand/computeResult",
					List.of("/root/fieldOperand/operand")
				)
			)
		);
		assertThat(
			findings,
			hasItem(
				thatIsNonRelevantOpFindingFor(
					"/root/groupOperand/computeResultWithGroup",
					List.of("/root/groupOperand/operand")
				)
			)
		);
	}

	@Test
	public void testFindGroupOperandWithNonRelevantChildren() {
		final var testModels = loadModels("non-relevant-child-of-operand", "test-fm.json");

		final var findings = ModelCheck.scanModelTuple(testModels.meliesModel(), testModels.documentModel());
		assertThat(findings.size(), equalTo(1));

		assertThat(
			findings,
			hasItem(
				thatIsGroupOpFindingFor(
					"/root/childOfGroupOperand/computeResultWithChildren",
					List.of("/root/childOfGroupOperand/operand")
				)
			)
		);
	}

	@Test
	public void testFindIssuesInIncludedModel() {
		final var testModels = loadModels("issue-in-included-model", "test-fm.json");

		final var findings = ModelCheck.scanModelTuple(testModels.meliesModel(), testModels.documentModel());
		assertThat(findings.size(), equalTo(2));

		assertThat(
			findings,
			hasItem(
				thatIsNonRelevantOpFindingFor(
					"/root/fieldOperand/computeResult",
					List.of("/root/fieldOperand/operand")
				)
			)
		);
		assertThat(
			findings,
			hasItem(
				thatIsNonRelevantOpFindingFor(
					"/root/groupOperand/computeResultWithGroup",
					List.of("/root/groupOperand/operand")
				)
			)
		);
	}

	private ModelLoader.LoadedModels loadModels(final String dirName, final String fmName) {
		final var formModelPath = "/" + dirName	+ "/" + dirName + "." + fmName;
		final var formModel =
			(MeliesModel) new FormModelJsonStreamSerializer().deserialize(getClass().getResourceAsStream(formModelPath));

		final var dmResolver = new FileBasedDocumentModelResolver(dirName);
		final var dmReference = MeliesModelUtil.getPicusFileReference(formModel);

		final var documentModel = (IDocumentModel) dmResolver.getExpandedModel(dmReference);

		return new ModelLoader.LoadedModels(formModel, documentModel);
	}

	private org.hamcrest.BaseMatcher<Finding> thatIsNonRelevantOpFindingFor(
		final String computationPath,
		final List<String> paths
	) {
		return new NonRelevantOperandIssueMatcher(computationPath, paths);
	}

	private org.hamcrest.BaseMatcher<Finding> thatIsGroupOpFindingFor(
		final String computationPath,
		final List<String> groupPaths
	) {
		return new GroupOperandIssueMatcher(computationPath, groupPaths);
	}

	private static class NonRelevantOperandIssueMatcher extends org.hamcrest.BaseMatcher<Finding> {

		private final List<String> paths;
		private final String computationPath;

		NonRelevantOperandIssueMatcher(final String computationPath, final List<String> paths) {
			this.paths = paths;
			this.computationPath = computationPath;
		}

		@Override
		public boolean matches(final Object o) {
			return o instanceof Finding
				   && ((Finding) o).computationPath().equals(this.computationPath)
				   && ((Finding) o).issue() instanceof NonRelevantOperandIssue
				   && ((NonRelevantOperandIssue) ((Finding) o).issue()).elementPaths().containsAll(this.paths);
		}

		@Override
		public void describeTo(final Description description) {
			// TODO: how to describe?
		}
	}

	private static class GroupOperandIssueMatcher extends org.hamcrest.BaseMatcher<Finding> {

		private final List<String> groupPaths;
		private final String computationPath;

		GroupOperandIssueMatcher(final String computationPath, final List<String> groupPaths) {
			this.groupPaths = groupPaths;
			this.computationPath = computationPath;
		}

		@Override
		public boolean matches(final Object o) {
			return o instanceof Finding
				   && ((Finding) o).computationPath().equals(this.computationPath)
				   && ((Finding) o).issue() instanceof GroupOperandIssue
				   && ((GroupOperandIssue) ((Finding) o).issue()).groups()
																 .stream()
																 .anyMatch(g -> groupPaths.contains(g.groupPath()));
		}

		@Override
		public void describeTo(final Description description) {
			// TODO: how to describe?
		}
	}
}
