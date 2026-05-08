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
package com.mgmtp.a12.model.ui.form.consistency.general;

import com.mgmtp.a12.model.consistency.ConsistencyStatus;
import com.mgmtp.a12.model.consistency.ConsistencyValidator;
import com.mgmtp.a12.model.consistency.Problem;

import org.hamcrest.MatcherAssert;
import org.hamcrest.Matchers;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import java.io.IOException;
import java.util.List;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;

public class ConsistencyCheckerMeliesModelTest extends ConsistencyValidatorTest {

	@BeforeClass
	public void setUp() throws Exception {
		checker =
			new ConsistencyValidator(new FileBasedPicusModelResolver("com/mgmtp/a12/model/ui/form/consistency/general/"));
	}

	@Test
	public void testMeliesModel() throws IOException {
		final ConsistencyStatus status =
			runValidation("com/mgmtp/a12/model/ui/form/consistency/general/ProductForm.json");
		assertThat(status.isValid(), is(true));
	}

	@Test
	public void testMeliesModelWithInvalidPicusModel() throws IOException {
		final ConsistencyStatus status =
			runValidation("com/mgmtp/a12/model/ui/form/consistency/general/ProductFormWithInvalidPicusModel.json");
		assertThat(status.isValid(), is(false));
		// @formatter:off
		assertThat(
			status.problems().get(0).getMessage(),
			equalTo("Model [name: invalid-model] could not be resolved."));
	}

	@Test
	public void testMeliesModelWithPicusRepositoryReference() throws IOException {
		final ConsistencyStatus status =
			runValidation("com/mgmtp/a12/model/ui/form/consistency/general/ProductFormWithPicusRepositoryReference.json");
		assertThat(status.isValid(), is(false));
		assertThat(status.problems().get(0).getMessage(), equalTo("Model [name: product] could not be resolved."));
	}

	@Test
	public void testMeliesModelWithInvalidFieldRefInControlAndFieldConfiguration() throws IOException {
		final ConsistencyStatus status = runValidation(
			"com/mgmtp/a12/model/ui/form/consistency/general/ProductFormWithInvalidFieldRefInControlAndFieldConfiguration.json");
		assertThat(status.isValid(), is(false));
		MatcherAssert.assertThat(
			status.problems(),
			Matchers.hasItem(Matchers.<Problem> hasProperty(
				"message",
				Matchers.equalTo(
					"Element [id: ABC] in control [id: control-223f5] could not be resolved in document model [name: ProductDomain]."))));
		MatcherAssert.assertThat(
			status.problems(),
			Matchers.hasItem(Matchers.<Problem> hasProperty(
				"message",
				Matchers.equalTo(
					"Element [id: G4] in control [id: control-c1269] could not be resolved in document model [name: ProductDomain]."))));
		MatcherAssert.assertThat(
			status.problems(),
			Matchers.hasItem(Matchers.<Problem> hasProperty(
				"message",
				Matchers.equalTo(
					"Element [id: XYZ] in field configuration could not be resolved in document model [name: ProductDomain]."))));
		MatcherAssert.assertThat(
			status.problems(),
			Matchers.hasItem(Matchers.<Problem> hasProperty(
				"message",
				Matchers.equalTo(
					"Element [id: G4] in field configuration could not be resolved in document model [name: ProductDomain]."))));
	}

	@Test
	public void testMeliesModelWithInvalidGroupRefInGroupConfiguration() throws IOException {
		final ConsistencyStatus status = runValidation(
			"com/mgmtp/a12/model/ui/form/consistency/general/ProductFormWithInvalidGroupRefInGroupConfiguration.json");
		assertThat(status.isValid(), is(false));
		assertThat(
			status.problems().get(0).getMessage(),
			equalTo(
				"Group [id: G00] in group configuration could not be resolved in document model [name: ProductDomain]."));
	}

	@Test
	public void testMeliesModelWithInvalidMasterAndCaseDependentField() throws IOException {
		final ConsistencyStatus status = runValidation(
			"com/mgmtp/a12/model/ui/form/consistency/general/ProductFormWithInvalidMasterAndCaseDependentField.json");
		assertThat(status.isValid(), is(false));
		assertThat(
			status.problems().get(0).getMessage(),
			equalTo(
				"Master field [id: XYZ] from dependent field could not be resolved in document model [name: ProductDomain]."));
		assertThat(
			status.problems().get(1).getMessage(),
			equalTo(
				"Case field [id: ABC] from dependent field could not be resolved in document model [name: ProductDomain]."));
	}

	@Test
	public void testMeliesModelWithInvalidMasterFieldInDependentGroup() throws IOException {
		final ConsistencyStatus status = runValidation(
			"com/mgmtp/a12/model/ui/form/consistency/general/ProductFormWithInvalidMasterFieldInDependentGroup.json");
		assertThat(status.isValid(), is(false));
		assertThat(
			status.problems().get(0).getMessage(),
			equalTo(
				"Master field [id: F432] from dependent group could not be resolved in document model [name: ProductDomain]."));
	}

	@Test
	public void testMeliesModelWithStringMasterFieldInDependentGroup() throws IOException {
		final ConsistencyStatus status = runValidation(
			"com/mgmtp/a12/model/ui/form/consistency/general/ProductFormWithStringMasterFieldInDependentGroup.json");
		assertThat(status.isValid(), is(false));
		assertThat(
			status.problems().get(0).getMessage(),
			equalTo(
				"Master field [id: F26] from dependent field or group can be resolved in document model [name: ProductDomain], but has invalid data type [type: String]. Should be [Enumeration] or [Boolean]."));
	}

	@Test
	public void testMeliesModelWithInvalidMasterFieldInDepEnum() throws IOException {
		final ConsistencyStatus status = runValidation(
			"com/mgmtp/a12/model/ui/form/consistency/general/ProductFormWithInvalidMasterFieldInDepEnum.json");
		assertThat(status.isValid(), is(false));
		assertThat(
			status.problems().get(0).getMessage(),
			equalTo(
				"Master field [id: ABC] from dependent enumeration could not be resolved in document model [name: ProductDomain]."));
	}

	@Test
	public void testMeliesModelWithInvalidDependentFieldInDepEnum() throws IOException {
		final ConsistencyStatus status = runValidation(
			"com/mgmtp/a12/model/ui/form/consistency/general/ProductFormWithInvalidDependentFieldInDepEnum.json");
		assertThat(status.isValid(), is(false));
		final List<Problem> problems = status.problems();
		assertThat(
			problems.get(0).getMessage(),
			equalTo(
				"Element [id: F_foobar] in field configuration could not be resolved in document model [name: ProductDomain]."));
		assertThat(
			problems.get(1).getMessage(),
			equalTo(
				"Dependent enumeration defined for field [id: F_foobar] is invalid, since this field could not be resolved in the document model [name: ProductDomain]."));
	}

	@Test
	public void testMeliesModelWithInvalidMasterFieldTypeInDepEnum() throws IOException {
		final ConsistencyStatus status = runValidation(
			"com/mgmtp/a12/model/ui/form/consistency/general/ProductFormWithInvalidMasterFieldTypeInDepEnum.json");
		assertThat(status.isValid(), is(false));
		assertThat(
			status.problems().get(0).getMessage(),
			equalTo(
				"Master field [id: F26] from dependent enumeration can be resolved in document model [name: ProductDomain], but has invalid data type [type: String]. Should be [Enumeration]."));
	}

	@Test
	public void testMeliesModelWithInvalidDependentFieldTypeInDepEnum() throws IOException {
		final ConsistencyStatus status = runValidation(
			"com/mgmtp/a12/model/ui/form/consistency/general/ProductFormWithInvalidDependentFieldTypeInDepEnum.json");
		assertThat(status.isValid(), is(false));
		assertThat(
			status.problems().get(0).getMessage(),
			equalTo(
				"The dependent enumeration field [id: F27] can be resolved in document model [name: ProductDomain], but has invalid data type [type: Boolean]. Should be [Enumeration]."));
	}

	@Test
	public void testMeliesModelWithInvalidMasterEnumerationValue() throws IOException {
		final ConsistencyStatus status = runValidation(
			"com/mgmtp/a12/model/ui/form/consistency/general/ProductFormWithInvalidMasterEnumerationValue.json");
		assertThat(status.isValid(), is(false));
		assertThat(
			status.problems().get(0).getMessage(),
			equalTo(
				"Master field [id: F28] from dependent enumeration can be resolved in document model [name: ProductDomain], but has invalid enumeration value [value: foobar]."));
	}

	@Test
	public void testMeliesModelWithInvalidDependentEnumerationValue() throws IOException {
		final ConsistencyStatus status = runValidation(
			"com/mgmtp/a12/model/ui/form/consistency/general/ProductFormWithInvalidDependentEnumerationValue.json");
		assertThat(status.isValid(), is(false));
		assertThat(
			status.problems().get(0).getMessage(),
			equalTo(
				"Dependent enumeration field [id: F29] can be resolved in document model [name: ProductDomain], but contains an invalid enumeration value [value: foobar]."));
	}

	@Test
	public void testMeliesModelWithInvalidValueForMasterChangeEnumerationValue() throws IOException {
		final ConsistencyStatus status = runValidation(
			"com/mgmtp/a12/model/ui/form/consistency/general/ProductFormWithInvalidValueForMasterChangeEnumerationValue.json");
		assertThat(status.isValid(), is(false));
		assertThat(
			status.problems().get(0).getMessage(),
			equalTo(
				"Dependent enumeration field [id: F29] can be resolved in document model [name: ProductDomain], but contains an invalid enumeration value [value: small] for valueForMasterChange entry."));
	}

	@Test
	public void testMeliesModelWithInvalidFieldInRepeatOverviewColumn() throws IOException {
		final ConsistencyStatus status = runValidation(
			"com/mgmtp/a12/model/ui/form/consistency/general/ProductFormWithInvalidFieldInRepeatOverviewColumn.json");
		assertThat(status.isValid(), is(false));
		MatcherAssert.assertThat(
			status.problems(),
			Matchers.hasItem(Matchers.<Problem> hasProperty(
				"message",
				Matchers.equalTo(
					"Element [id: ABC] in overview column of the repeat type [id: detachedrepeat-80a4e] could not be resolved in document model [name: ProductDomain]."))));
		MatcherAssert.assertThat(
			status.problems(),
			Matchers.hasItem(Matchers.<Problem> hasProperty(
				"message",
				Matchers.equalTo(
					"Element [id: G4] in overview column of the repeat type [id: detachedrepeat-80a4e] could not be resolved in document model [name: ProductDomain]."))));
	}

	@Test
	public void testMeliesModelWithInvalidExternalEnumSettings() throws IOException {
		final ConsistencyStatus status = runValidation(
			"com/mgmtp/a12/model/ui/form/consistency/general/ProductFormWithInvalidExternalEnumSettings.json");
		assertThat(status.isValid(), is(false));
		MatcherAssert.assertThat(
			status.problems(),
			Matchers.hasItem(Matchers.<Problem> hasProperty(
				"message",
				Matchers.equalTo(
					"For the External Enumeration on field [id: F5] 'allow custom value' is set. This is only permitted, when the field's exposition is set to autocomplete."))));
		MatcherAssert.assertThat(
			status.problems(),
			Matchers.hasItem(Matchers.<Problem> hasProperty(
				"message",
				Matchers.equalTo(
					"For the External Enumeration on field [id: F5] 'case sensitive' is set. This is only permitted, when the field's exposition is set to autocomplete."))));
		MatcherAssert.assertThat(
			status.problems(),
			Matchers.hasItem(Matchers.<Problem> hasProperty(
				"message",
				Matchers.equalTo(
					"The form model element [id: control-742dd] refers to a multi select [id: G24, name: stringValueMultiSelectField] with a value field of type String. This is only permitted if an external enumeration is set for the value field."))));
		MatcherAssert.assertThat(
			status.problems(),
			Matchers.hasItem(Matchers.<Problem> hasProperty(
				"message",
				Matchers.equalTo(
					"The form model element [id: fieldbasedrepeatoverviewcolumn-525bf] refers to a multi select [id: G24, name: stringValueMultiSelectField] with a value field of type String. This is only permitted if an external enumeration is set for the value field."))));
	}
}
