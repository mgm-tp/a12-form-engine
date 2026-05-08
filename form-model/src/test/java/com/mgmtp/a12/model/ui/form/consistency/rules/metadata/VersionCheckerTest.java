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
package com.mgmtp.a12.model.ui.form.consistency.rules.metadata;

import org.testng.Assert;
import org.testng.annotations.Test;

public class VersionCheckerTest {

	@Test
	public void testVersionMatcher() {
		Assert.assertTrue(VersionChecker.matchesVersionPattern("1.0.0"));
		Assert.assertTrue(VersionChecker.matchesVersionPattern("2472.0.8746347"));
		Assert.assertTrue(VersionChecker.matchesVersionPattern("234.245245.0"));
		Assert.assertTrue(VersionChecker.matchesVersionPattern("1.0.0-pre.0"));
		Assert.assertTrue(VersionChecker.matchesVersionPattern("76.1.9-rc.3"));

		Assert.assertFalse(VersionChecker.matchesVersionPattern("Hallo"));
		Assert.assertFalse(VersionChecker.matchesVersionPattern("1.0,0"));
		Assert.assertFalse(VersionChecker.matchesVersionPattern("1,0.0"));
		Assert.assertFalse(VersionChecker.matchesVersionPattern("1.0.0.0"));
		Assert.assertFalse(VersionChecker.matchesVersionPattern("1.0.0."));
		Assert.assertFalse(VersionChecker.matchesVersionPattern("1.0.a"));
		Assert.assertFalse(VersionChecker.matchesVersionPattern("1.0.0pre.1"));
		Assert.assertFalse(VersionChecker.matchesVersionPattern("1.0.0-pre1"));
		Assert.assertFalse(VersionChecker.matchesVersionPattern("1.0.0-hello.2"));
		Assert.assertFalse(VersionChecker.matchesVersionPattern("12.9.1-hello"));
	}

	@Test
	public void testCompatibilityCheck() {
		final String testModelVersion = "28.4.2";
		final VersionChecker checker = new VersionChecker(testModelVersion);

		Assert.assertTrue(checker.isModelSchemaVersionCompatible("28.4.0"));
		Assert.assertTrue(checker.isModelSchemaVersionCompatible("28.3.9999"));
		Assert.assertTrue(checker.isModelSchemaVersionCompatible("28.3.0"));
		Assert.assertTrue(checker.isModelSchemaVersionCompatible("28.0.00001"));

		Assert.assertFalse(checker.isModelSchemaVersionCompatible("27.0.0"));
		Assert.assertFalse(checker.isModelSchemaVersionCompatible("27.9.3"));
		Assert.assertFalse(checker.isModelSchemaVersionCompatible("28.4.3"));
		Assert.assertFalse(checker.isModelSchemaVersionCompatible("28.5.0"));
	}

	@Test
	public void testCompatibilityWithPreReleaseTagsCheck() {
		final String testModelVersion = "31.0.0-pre.6";
		final VersionChecker checker = new VersionChecker(testModelVersion);

		Assert.assertTrue(checker.isModelSchemaVersionCompatible("31.0.0-pre.6"));

		Assert.assertFalse(checker.isModelSchemaVersionCompatible("31.0.0-pre.5"));
		Assert.assertFalse(checker.isModelSchemaVersionCompatible("31.0.0-pre.0"));
		Assert.assertFalse(checker.isModelSchemaVersionCompatible("31.0.0-pre.7"));
		Assert.assertFalse(checker.isModelSchemaVersionCompatible("31.0.1-pre.6"));
		Assert.assertFalse(checker.isModelSchemaVersionCompatible("31.1.0-pre.6"));
		Assert.assertFalse(checker.isModelSchemaVersionCompatible("32.0.0-pre.6"));
		Assert.assertFalse(checker.isModelSchemaVersionCompatible("31.0.0-rc.6"));

		Assert.assertFalse(checker.isModelSchemaVersionCompatible("31.0.0"));
		Assert.assertFalse(checker.isModelSchemaVersionCompatible("31.1.0"));
		Assert.assertFalse(checker.isModelSchemaVersionCompatible("31.0.1"));
		Assert.assertFalse(checker.isModelSchemaVersionCompatible("30.0.0"));
	}
}
