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
package com.mgmtp.a12.formengine.consistency.rules.exposition;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.Matchers.hasSize;

import com.mgmtp.a12.model.consistency.Problem;

import com.mgmtp.a12.formengine.consistency.general.FileBasedDocumentModelResolver;
import com.mgmtp.a12.formengine.consistency.rules.ModelLoader;
import com.mgmtp.a12.formengine.consistency.rules.RuleTestHelper;
import com.mgmtp.a12.formengine.model.FormModel;

import java.util.List;

import org.testng.annotations.Test;

public class MarkdownEditorExpositionRuleTest {

	private static final String TEST_PACKAGE = "com/mgmtp/a12/formengine/consistency/rules/exposition/";
	private final MarkdownEditorExpositionRule markdownEditorExpositionRule = new MarkdownEditorExpositionRule();

	@Test
	public void verifyValid() {
		final FormModel productForm = ModelLoader.loadModel(TEST_PACKAGE + "FormModelMarkdownEditorExpositionValid.json");
		final FileBasedDocumentModelResolver modelResolver = new FileBasedDocumentModelResolver(TEST_PACKAGE);
		final List<Problem> problems = markdownEditorExpositionRule.execute(productForm, RuleTestHelper.createDocumentModelAccess(modelResolver, productForm));

		assertThat(problems, hasSize(0));
	}

	@Test
	public void verifyInvalid() {
		final FormModel productForm = ModelLoader.loadModel(TEST_PACKAGE + "FormModelMarkdownEditorExpositionInvalid.json");
		final FileBasedDocumentModelResolver modelResolver = new FileBasedDocumentModelResolver(TEST_PACKAGE);
		final List<Problem> problems = markdownEditorExpositionRule.execute(productForm, RuleTestHelper.createDocumentModelAccess(modelResolver, productForm));

		assertThat(problems, hasSize(8));
		assertThat(problems, hasItem(hasProperty("message", equalTo(
			"The model element [id: field_1, name: field1] has 'isMarkdownEditor' set. 'exposition' must not be set on the same element."))));
		assertThat(problems, hasItem(hasProperty("message", equalTo(
			"The model element [id: field_2, name: field2] has 'markdownAttachmentRepeat' set, but 'isMarkdownEditor' is not set. 'markdownAttachmentRepeat' is only permitted for markdown editor fields."))));
		assertThat(problems, hasItem(hasProperty("message", equalTo(
			"The model element [id: field_2, name: field2] has 'markdownAttachmentRepeat' set to [id: someRepeat], which could not be resolved to a repeat in this form model."))));
		assertThat(problems, hasItem(hasProperty("message", equalTo(
			"The model element [id: field_3, name: field3] lies inside the Document Model group [id: group_rep] of the repeat [id: repeat_self] referenced by its own 'markdownAttachmentRepeat'. This is not supported and breaks the upload at runtime."))));
		// rendered only by another repeat bound to the same group - the group decides, not the repeat instance
		assertThat(problems, hasItem(hasProperty("message", equalTo(
			"The model element [id: field_8, name: field8] lies inside the Document Model group [id: group_rep] of the repeat [id: repeat_self] referenced by its own 'markdownAttachmentRepeat'. This is not supported and breaks the upload at runtime."))));
		assertThat(problems, hasItem(hasProperty("message", equalTo(
			"The model element [id: field_4, name: field4] has 'markdownAttachmentRepeat' set to the repeat [id: repeat_no_multi_file], which is not an inline or embedded repeat configured for multi-file upload."))));
		// like RepeatNestingRule, the form model repeat enclosing the nested attachment repeat is involved as well
		assertThat(
			RuleTestHelper.involvedElementIds(
				problems,
				"The model element [id: field_5, name: field5] has 'markdownAttachmentRepeat' set to the repeat [id: repeat_nested], whose Document Model group lies inside a repeatable group. This is not supported and breaks the upload at runtime."),
			contains("field_5", "repeat_nested", "repeat_parent"));
		assertThat(problems, hasItem(hasProperty("message", equalTo(
			"The form model element [id: field_6, name: field6] references a Document Model element of type 'Number'. 'isMarkdownEditor' is only permitted for fields of type 'String'."))));
	}
}
