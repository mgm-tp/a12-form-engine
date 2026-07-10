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
package com.mgmtp.a12.formengine.consistency.rules.label;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.empty;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.Matchers.hasSize;

import com.mgmtp.a12.model.consistency.ConsistencyProblem;
import com.mgmtp.a12.model.consistency.Problem;

import com.mgmtp.a12.formengine.consistency.FormModelCategory;
import com.mgmtp.a12.formengine.consistency.general.FileBasedDocumentModelResolver;
import com.mgmtp.a12.formengine.consistency.rules.ModelLoader;
import com.mgmtp.a12.formengine.consistency.rules.RuleTestHelper;
import com.mgmtp.a12.formengine.consistency.rules.consistency.LabelConsistencyRule;
import com.mgmtp.a12.formengine.model.FormModel;

import java.util.List;

import org.apache.commons.lang3.ArrayUtils;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

public class LabelConsistencyRuleTest {
	private LabelConsistencyRule labelConsistencyRule;

	@BeforeClass
	public void setUp() {
		labelConsistencyRule = new LabelConsistencyRule();
	}

	@Test
	public void checkValidLabels() throws Exception {
		final FormModel testForm = ModelLoader.loadModel(
                "com/mgmtp/a12/formengine/consistency/rules/label/LabelTestForm.json");
		final FileBasedDocumentModelResolver modelResolver = new FileBasedDocumentModelResolver("com/mgmtp/a12/formengine/consistency/rules/label/");
		final List<Problem> problems = labelConsistencyRule.execute(testForm, RuleTestHelper.createDocumentModelAccess(modelResolver, testForm));
		assertThat(problems, empty());
	}

	/*
	 * This array contains all invalid elements for the models:
	 * InvalidMissingTypeTestForm
	 * InvalidMissingTextTestForm
	 * InvalidBothTextsSetTestForm
	 * InvalidWrongTypeTestForm
	 *
	 * This array can be used to generate the expected error messages without having to list every single message.
	 */
	private String[] invalidElements = new String[] {
		"FormModel SubTitle",
		"button-34e20",
		"button-b2490",
		"button-fb719",
		"button-fa0f6",
		"button-5a552",
		"button-fa5c0",
		"button-6fa2d",
		"button-9b5b3",
		"button-b6663",
		"button-b9d62",
		"button-3105b",
		"button-9c916",
		"section-663bc",
		"controlgrid-fb312",
		"row-3eb5e",
		"control-30412",
		"control-52de2",
		"expressioncell-bc179",
		"section-43246",
		"controlgrid-9556d",
		"row-d7eb7",
		"control-c0d1f",
		"control-fffd1",
		"expressioncell-04ffc",
		"multicolumnsection-23abe",
		"multicolumnsection-03199",
		"buttonpanel-a4902",
		"button-f064d",
		"buttonpanel-e7040",
		"button-4da83",
		"inlinerepeat-9c8d5",
		"fieldbasedrepeatoverviewcolumn-72656",
		"expressionrepeatoverviewcolumn-784f8",
		"RowAction in Repeat inlinerepeat-9c8d5",
		"inlinerepeat-3441d",
		"fieldbasedrepeatoverviewcolumn-be506",
		"expressionrepeatoverviewcolumn-8626d",
		"RowAction in Repeat inlinerepeat-3441d",
		"field_c3f4f",
		"field_5bd39"
	};

	@Test
	public void checkInvalidNoTypeSet() throws Exception {
		final FormModel testForm = ModelLoader.loadModel(
                "com/mgmtp/a12/formengine/consistency/rules/label/InvalidMissingTypeTestForm.json");
		final FileBasedDocumentModelResolver modelResolver = new FileBasedDocumentModelResolver("com/mgmtp/a12/formengine/consistency/rules/label/");
		final List<Problem> problems = labelConsistencyRule.execute(testForm, RuleTestHelper.createDocumentModelAccess(modelResolver, testForm));

		assertThat(problems, hasSize(42));
		for (final String message : getExpectedMessagesForNoTypeSet()) {
			assertThat(problems, hasItem(hasProperty("message", equalTo(message))));
		}
	}

	private String[] getExpectedMessagesForNoTypeSet() {
		String[] messages = new String[invalidElements.length];

		for (int i = 0; i < invalidElements.length; i++) {
			messages[i] = new ConsistencyProblem(
				"InvalidMissingTypeTestForm",
				FormModelCategory.FORM_MODEL_MISSING_LABEL_TYPE,
				null,
				invalidElements[i]
			).getMessage();
		}

		return messages;
	}

	@Test
	public void checkInvalidNoTextSet() throws Exception {
		final FormModel testForm = ModelLoader.loadModel(
                "com/mgmtp/a12/formengine/consistency/rules/label/InvalidMissingTextTestForm.json");
		final FileBasedDocumentModelResolver modelResolver = new FileBasedDocumentModelResolver("com/mgmtp/a12/formengine/consistency/rules/label/");
		final List<Problem> problems = labelConsistencyRule.execute(testForm, RuleTestHelper.createDocumentModelAccess(modelResolver, testForm));

		assertThat(problems, hasSize(42));
		for (final String message : getExpectedMessagesForNoTextSet()) {
			assertThat(problems, hasItem(hasProperty("message", equalTo(message))));
		}
	}

	private String[] getExpectedMessagesForNoTextSet() {
		String[] messages = new String[invalidElements.length];

		for (int i = 0; i < invalidElements.length; i++) {
			messages[i] = new ConsistencyProblem(
				"InvalidMissingTextTestForm",
				FormModelCategory.FORM_MODEL_MISSING_LABEL_TEXT,
				null,
				invalidElements[i]
			).getMessage();
		}

		return messages;
	}

	@Test
	public void checkInvalidBothTextsSet() throws Exception {
		final FormModel testForm = ModelLoader.loadModel(
                "com/mgmtp/a12/formengine/consistency/rules/label/InvalidBothTextsSetTestForm.json");
		final FileBasedDocumentModelResolver modelResolver = new FileBasedDocumentModelResolver("com/mgmtp/a12/formengine/consistency/rules/label/");
		final List<Problem> problems = labelConsistencyRule.execute(testForm, RuleTestHelper.createDocumentModelAccess(modelResolver, testForm));

		assertThat(problems, hasSize(84));
		for (final String message : getExpectedMessagesForBothTextsSet()) {
			assertThat(problems, hasItem(hasProperty("message", equalTo(message))));
		}
	}

	private String[] getExpectedMessagesForBothTextsSet() {
		String[] messages = new String[invalidElements.length];

		for (int i = 0; i < invalidElements.length; i++) {
			messages[i] = new ConsistencyProblem(
				"InvalidBothTextsSetTestForm",
				FormModelCategory.FORM_MODEL_MULTILINGUAL_AND_EXPRESSION_LABEL_SET,
				null,
				invalidElements[i]
			).getMessage();
		}

		return ArrayUtils.addAll(getExpectedMessagesForWrongTypeSet(), messages);
	}

	@Test
	public void checkInvalidWrongTypeSet() throws Exception {
		final FormModel testForm = ModelLoader.loadModel(
                "com/mgmtp/a12/formengine/consistency/rules/label/InvalidWrongLabelTypeTestForm.json");
		final FileBasedDocumentModelResolver modelResolver = new FileBasedDocumentModelResolver("com/mgmtp/a12/formengine/consistency/rules/label/");
		final List<Problem> problems = labelConsistencyRule.execute(testForm, RuleTestHelper.createDocumentModelAccess(modelResolver, testForm));

		assertThat(problems, hasSize(42));
		for (final String message : getExpectedMessagesForWrongTypeSet()) {
			assertThat(problems, hasItem(hasProperty("message", equalTo(message))));
		}
	}

	private String[] getExpectedMessagesForWrongTypeSet() {
		return new String[] {
			"For the form model element [FormModel SubTitle] the property expressionText is set, but the label type is Multilingual. This is not allowed.",
			"For the form model element [button-34e20] the property expressionText is set, but the label type is Multilingual. This is not allowed.",
			"For the form model element [button-b2490] the property multilingualText is set, but the label type is Expression. This is not allowed.",
			"For the form model element [button-fb719] the property expressionText is set, but the label type is Multilingual. This is not allowed.",
			"For the form model element [button-fa0f6] the property multilingualText is set, but the label type is Expression. This is not allowed.",
			"For the form model element [button-5a552] the property expressionText is set, but the label type is Multilingual. This is not allowed.",
			"For the form model element [button-fa5c0] the property multilingualText is set, but the label type is Expression. This is not allowed.",
			"For the form model element [screen1] the property expressionText is set, but the label type is Multilingual. This is not allowed.",
			"For the form model element [button-6fa2d] the property expressionText is set, but the label type is Multilingual. This is not allowed.",
			"For the form model element [button-9b5b3] the property multilingualText is set, but the label type is Expression. This is not allowed.",
			"For the form model element [button-b6663] the property expressionText is set, but the label type is Multilingual. This is not allowed.",
			"For the form model element [button-b9d62] the property multilingualText is set, but the label type is Expression. This is not allowed.",
			"For the form model element [button-3105b] the property expressionText is set, but the label type is Multilingual. This is not allowed.",
			"For the form model element [button-9c916] the property multilingualText is set, but the label type is Expression. This is not allowed.",
			"For the form model element [section-663bc] the property expressionText is set, but the label type is Multilingual. This is not allowed.",
			"For the form model element [controlgrid-fb312] the property expressionText is set, but the label type is Multilingual. This is not allowed.",
			"For the form model element [row-3eb5e] the property expressionText is set, but the label type is Multilingual. This is not allowed.",
			"For the form model element [control-30412] the property expressionText is set, but the label type is Multilingual. This is not allowed.",
			"For the form model element [control-52de2] the property expressionText is set, but the label type is Multilingual. This is not allowed.",
			"For the form model element [expressioncell-bc179] the property expressionText is set, but the label type is Multilingual. This is not allowed.",
			"For the form model element [section-43246] the property multilingualText is set, but the label type is Expression. This is not allowed.",
			"For the form model element [controlgrid-9556d] the property multilingualText is set, but the label type is Expression. This is not allowed.",
			"For the form model element [row-d7eb7] the property multilingualText is set, but the label type is Expression. This is not allowed.",
			"For the form model element [control-c0d1f] the property multilingualText is set, but the label type is Expression. This is not allowed.",
			"For the form model element [control-fffd1] the property multilingualText is set, but the label type is Expression. This is not allowed.",
			"For the form model element [expressioncell-04ffc] the property multilingualText is set, but the label type is Expression. This is not allowed.",
			"For the form model element [multicolumnsection-23abe] the property expressionText is set, but the label type is Multilingual. This is not allowed.",
			"For the form model element [multicolumnsection-03199] the property multilingualText is set, but the label type is Expression. This is not allowed.",
			"For the form model element [buttonpanel-a4902] the property expressionText is set, but the label type is Multilingual. This is not allowed.",
			"For the form model element [button-f064d] the property expressionText is set, but the label type is Multilingual. This is not allowed.",
			"For the form model element [buttonpanel-e7040] the property multilingualText is set, but the label type is Expression. This is not allowed.",
			"For the form model element [button-4da83] the property multilingualText is set, but the label type is Expression. This is not allowed.",
			"For the form model element [inlinerepeat-9c8d5] the property expressionText is set, but the label type is Multilingual. This is not allowed.",
			"For the form model element [fieldbasedrepeatoverviewcolumn-72656] the property expressionText is set, but the label type is Multilingual. This is not allowed.",
			"For the form model element [expressionrepeatoverviewcolumn-784f8] the property expressionText is set, but the label type is Multilingual. This is not allowed.",
			"For the form model element [RowAction in Repeat inlinerepeat-9c8d5] the property expressionText is set, but the label type is Multilingual. This is not allowed.",
			"For the form model element [inlinerepeat-3441d] the property multilingualText is set, but the label type is Expression. This is not allowed.",
			"For the form model element [fieldbasedrepeatoverviewcolumn-be506] the property multilingualText is set, but the label type is Expression. This is not allowed.",
			"For the form model element [expressionrepeatoverviewcolumn-8626d] the property multilingualText is set, but the label type is Expression. This is not allowed.",
			"For the form model element [RowAction in Repeat inlinerepeat-3441d] the property multilingualText is set, but the label type is Expression. This is not allowed.",
			"For the form model element [field_c3f4f] the property expressionText is set, but the label type is Multilingual. This is not allowed.",
			"For the form model element [field_5bd39] the property multilingualText is set, but the label type is Expression. This is not allowed."
		};
	}

	@Test
	public void checkInvalidExpressionLabels() throws Exception {
		final FormModel testForm = ModelLoader.loadModel(
                "com/mgmtp/a12/formengine/consistency/rules/label/InvalidExpressionLabelsTestForm.json");
		final FileBasedDocumentModelResolver modelResolver = new FileBasedDocumentModelResolver("com/mgmtp/a12/formengine/consistency/rules/label/");
		final List<Problem> problems = labelConsistencyRule.execute(testForm, RuleTestHelper.createDocumentModelAccess(modelResolver, testForm));

		assertThat(problems, hasSize(72));
		for (final String message : getExpectedMessagesForInvalidExpressionLabels()) {
			assertThat(problems, hasItem(hasProperty("message", equalTo(message))));
		}
	}

	private String[] getExpectedMessagesForInvalidExpressionLabels() {
		return new String[] {
			"FormModel SubTitle expression label [id: InvalidExpressionLabelsTestForm, name: ] is syntactically incorrect: [Expression parse error in: invalid\nmismatched input 'i' expecting {<EOF>, '[', 'kontext', '(', 'case', QUOTE_STRING, NEWPARAGRAPH, NEWLINE}].",
			"Button expression label [id: button-17a98, name: btn1] is syntactically incorrect: [Expression parse error in: invalid\nmismatched input 'i' expecting {<EOF>, '[', 'kontext', '(', 'case', QUOTE_STRING, NEWPARAGRAPH, NEWLINE}].",
			"Button expression label [id: button-1af89, name: btn2] refers to field '/root/invalid' which is not a valid field reference in its evaluation data context '/'.",
			"Button expression label [id: button-ead1a, name: btn3] uses a field reference to group [/root/attachmentGroup, customType: attachment].",
			"Button expression label [id: button-af35e, name: btn1] is syntactically incorrect: [Expression parse error in: invalid\nmismatched input 'i' expecting {<EOF>, '[', 'kontext', '(', 'case', QUOTE_STRING, NEWPARAGRAPH, NEWLINE}].",
			"Button expression label [id: button-19ba9, name: btn2] refers to field '/root/invalid' which is not a valid field reference in its evaluation data context '/'.",
			"Button expression label [id: button-14ff9, name: btn3] uses a field reference to group [/root/attachmentGroup, customType: attachment].",
			"Button expression label [id: button-575a9, name: btn1] is syntactically incorrect: [Expression parse error in: invalid\nmismatched input 'i' expecting {<EOF>, '[', 'kontext', '(', 'case', QUOTE_STRING, NEWPARAGRAPH, NEWLINE}].",
			"Button expression label [id: button-d312f, name: btn2] refers to field '/root/invalid' which is not a valid field reference in its evaluation data context '/'.",
			"Button expression label [id: button-80a23, name: btn3] uses a field reference to group [/root/attachmentGroup, customType: attachment].",
			"Screen expression label [id: screen1, name: Screen1] is syntactically incorrect: [Expression parse error in: invalid\nmismatched input 'i' expecting {<EOF>, '[', 'kontext', '(', 'case', QUOTE_STRING, NEWPARAGRAPH, NEWLINE}].",
			"Button expression label [id: button-e33b5, name: btn] is syntactically incorrect: [Expression parse error in: invalid\nmismatched input 'i' expecting {<EOF>, '[', 'kontext', '(', 'case', QUOTE_STRING, NEWPARAGRAPH, NEWLINE}].",
			"Button expression label [id: button-bfddf, name: btn] is syntactically incorrect: [Expression parse error in: invalid\nmismatched input 'i' expecting {<EOF>, '[', 'kontext', '(', 'case', QUOTE_STRING, NEWPARAGRAPH, NEWLINE}].",
			"Button expression label [id: button-16a57, name: btn] is syntactically incorrect: [Expression parse error in: invalid\nmismatched input 'i' expecting {<EOF>, '[', 'kontext', '(', 'case', QUOTE_STRING, NEWPARAGRAPH, NEWLINE}].",
			"Section expression label [id: section-366d0, name: secSyntaxError] is syntactically incorrect: [Expression parse error in: invalid\nmismatched input 'i' expecting {<EOF>, '[', 'kontext', '(', 'case', QUOTE_STRING, NEWPARAGRAPH, NEWLINE}].",
			"ControlGrid expression label [id: controlgrid-fd2e1, name: cg] is syntactically incorrect: [Expression parse error in: invalid\nmismatched input 'i' expecting {<EOF>, '[', 'kontext', '(', 'case', QUOTE_STRING, NEWPARAGRAPH, NEWLINE}].",
			"Row expression label [id: row-efba9, name: null] is syntactically incorrect: [Expression parse error in: invalid\nmismatched input 'i' expecting {<EOF>, '[', 'kontext', '(', 'case', QUOTE_STRING, NEWPARAGRAPH, NEWLINE}].",
			"Control expression label [id: control-9fe42, name: ] is syntactically incorrect: [Expression parse error in: invalid\nmismatched input 'i' expecting {<EOF>, '[', 'kontext', '(', 'case', QUOTE_STRING, NEWPARAGRAPH, NEWLINE}].",
			"ExpressionCell expression label [id: expressioncell-06fbc, name: expCell] is syntactically incorrect: [Expression parse error in: invalid\nmismatched input 'i' expecting {<EOF>, '[', 'kontext', '(', 'case', QUOTE_STRING, NEWPARAGRAPH, NEWLINE}].",
			"MultiColumnSection expression label [id: multicolumnsection-d5f0e, name: mcs] is syntactically incorrect: [Expression parse error in: invalid\nmismatched input 'i' expecting {<EOF>, '[', 'kontext', '(', 'case', QUOTE_STRING, NEWPARAGRAPH, NEWLINE}].",
			"ButtonPanel expression label [id: buttonpanel-40c75, name: bp] is syntactically incorrect: [Expression parse error in: invalid\nmismatched input 'i' expecting {<EOF>, '[', 'kontext', '(', 'case', QUOTE_STRING, NEWPARAGRAPH, NEWLINE}].",
			"Button expression label [id: button-5ea49, name: btn] is syntactically incorrect: [Expression parse error in: invalid\nmismatched input 'i' expecting {<EOF>, '[', 'kontext', '(', 'case', QUOTE_STRING, NEWPARAGRAPH, NEWLINE}].",
			"DetachedRepeat expression label [id: detachedrepeat-3acf7, name: detached-repeat-rep] is syntactically incorrect: [Expression parse error in: invalid\nmismatched input 'i' expecting {<EOF>, '[', 'kontext', '(', 'case', QUOTE_STRING, NEWPARAGRAPH, NEWLINE}].",
			"FieldOverviewColumn expression label [id: fieldbasedrepeatoverviewcolumn-e4b9e, name: ] is syntactically incorrect: [Expression parse error in: invalid\nmismatched input 'i' expecting {<EOF>, '[', 'kontext', '(', 'case', QUOTE_STRING, NEWPARAGRAPH, NEWLINE}].",
			"ExpressionColumn expression label [id: expressionrepeatoverviewcolumn-15a29, name: expCol] is syntactically incorrect: [Expression parse error in: invalid\nmismatched input 'i' expecting {<EOF>, '[', 'kontext', '(', 'case', QUOTE_STRING, NEWPARAGRAPH, NEWLINE}].",
			"RowAction in Repeat detachedrepeat-3acf7 expression label [id: , name: event] is syntactically incorrect: [Expression parse error in: invalid\nmismatched input 'i' expecting {<EOF>, '[', 'kontext', '(', 'case', QUOTE_STRING, NEWPARAGRAPH, NEWLINE}].",
			"ControlGrid expression label [id: controlgrid-f997f, name: cg] is syntactically incorrect: [Expression parse error in: invalid\nmismatched input 'i' expecting {<EOF>, '[', 'kontext', '(', 'case', QUOTE_STRING, NEWPARAGRAPH, NEWLINE}].",
			"Control expression label [id: control-48137, name: ] is syntactically incorrect: [Expression parse error in: invalid\nmismatched input 'i' expecting {<EOF>, '[', 'kontext', '(', 'case', QUOTE_STRING, NEWPARAGRAPH, NEWLINE}].",
			"Screen expression label [id: screen-3b33a, name: Screen2] refers to field '/root/invalid' which is not a valid field reference in its evaluation data context '/'.",
			"Button expression label [id: button-af1fa, name: btn] refers to field '/root/invalid' which is not a valid field reference in its evaluation data context '/'.",
			"Button expression label [id: button-98cea, name: btn] refers to field '/root/invalid' which is not a valid field reference in its evaluation data context '/'.",
			"Button expression label [id: button-3ee9d, name: btn] refers to field '/root/invalid' which is not a valid field reference in its evaluation data context '/'.",
			"Section expression label [id: section-bce17, name: secFieldRefError] refers to field '/root/invalid' which is not a valid field reference in its evaluation data context '/'.",
			"ControlGrid expression label [id: controlgrid-721c0, name: cg] refers to field '/root/invalid' which is not a valid field reference in its evaluation data context '/'.",
			"Row expression label [id: row-6aaa8, name: null] refers to field '/root/invalid' which is not a valid field reference in its evaluation data context '/'.",
			"Control expression label [id: control-f2b9a, name: ] refers to field '/root/invalid' which is not a valid field reference in its evaluation data context '/'.",
			"ExpressionCell expression label [id: expressioncell-39448, name: expCell] refers to field '/root/invalid' which is not a valid field reference in its evaluation data context '/'.",
			"Control expression label [id: control_04a1a, name: ] refers to field '/root/rep/invalid' which is not a valid field reference in its evaluation data context '/root/rep/'.",
			"MultiColumnSection expression label [id: multicolumnsection-2f75a, name: mcs] refers to field '/root/invalid' which is not a valid field reference in its evaluation data context '/'.",
			"ButtonPanel expression label [id: buttonpanel-1071d, name: bp] refers to field '/root/invalid' which is not a valid field reference in its evaluation data context '/'.",
			"Button expression label [id: button-2560d, name: btn] refers to field '/root/invalid' which is not a valid field reference in its evaluation data context '/'.",
			"DetachedRepeat expression label [id: detachedrepeat-3a151, name: detached-repeat-rep] refers to field '/root/invalid' which is not a valid field reference in its evaluation data context '/'.",
			"FieldOverviewColumn expression label [id: fieldbasedrepeatoverviewcolumn-be176, name: ] refers to field '/root/invalid' which is not a valid field reference in its evaluation data context '/'.",
			"ExpressionColumn expression label [id: expressionrepeatoverviewcolumn-f8a1f, name: expCol] refers to field '/root/invalid' which is not a valid field reference in its evaluation data context '/'.",
			"RowAction in Repeat detachedrepeat-3a151 expression label [id: , name: event] refers to field '/root/rep/invalid' which is not a valid field reference in its evaluation data context '/root/rep/'.",
			"ControlGrid expression label [id: controlgrid-5cd3e, name: cg] refers to field '/root/rep/invalid' which is not a valid field reference in its evaluation data context '/root/rep/'.",
			"Control expression label [id: control-f848b, name: ] refers to field '/root/rep/invalid' which is not a valid field reference in its evaluation data context '/root/rep/'.",
			"Screen expression label [id: screen-ea6fb, name: Screen3] uses a field reference to group [/root/attachmentGroup, customType: attachment].",
			"Button expression label [id: button-60773, name: btn] uses a field reference to group [/root/attachmentGroup, customType: attachment].",
			"Button expression label [id: button-f4d83, name: btn] uses a field reference to group [/root/attachmentGroup, customType: attachment].",
			"Button expression label [id: button-147c5, name: btn] uses a field reference to group [/root/attachmentGroup, customType: attachment].",
			"Section expression label [id: section-3f370, name: secFieldRefToGroupError] uses a field reference to group [/root/attachmentGroup, customType: attachment].",
			"ControlGrid expression label [id: controlgrid-2e5d9, name: cg] uses a field reference to group [/root/attachmentGroup, customType: attachment].",
			"Row expression label [id: row-30e90, name: null] uses a field reference to group [/root/attachmentGroup, customType: attachment].",
			"Control expression label [id: control-673ac, name: ] uses a field reference to group [/root/attachmentGroup, customType: attachment].",
			"ExpressionCell expression label [id: expressioncell-35f0d, name: expCell] uses a field reference to group [/root/attachmentGroup, customType: attachment].",
			"Control expression label [id: control_cd58f, name: ] uses a field reference to group [/root/rep/attachmentGroupRep, customType: attachment].",
			"MultiColumnSection expression label [id: multicolumnsection-68694, name: mcs] uses a field reference to group [/root/attachmentGroup, customType: attachment].",
			"ButtonPanel expression label [id: buttonpanel-d85ad, name: bp] uses a field reference to group [/root/attachmentGroup, customType: attachment].",
			"Button expression label [id: button-1311f, name: btn] uses a field reference to group [/root/attachmentGroup, customType: attachment].",
			"DetachedRepeat expression label [id: detachedrepeat-c7097, name: detached-repeat-rep] uses a field reference to group [/root/attachmentGroup, customType: attachment].",
			"FieldOverviewColumn expression label [id: fieldbasedrepeatoverviewcolumn-fdd5f, name: ] uses a field reference to group [/root/attachmentGroup, customType: attachment].",
			"ExpressionColumn expression label [id: expressionrepeatoverviewcolumn-d6e53, name: expCol] uses a field reference to group [/root/attachmentGroup, customType: attachment].",
			"RowAction in Repeat detachedrepeat-c7097 expression label [id: , name: event] uses a field reference to group [/root/rep/attachmentGroupRep, customType: attachment].",
			"ControlGrid expression label [id: controlgrid-d27a3, name: cg] uses a field reference to group [/root/rep/attachmentGroupRep, customType: attachment].",
			"Control expression label [id: control-6e271, name: ] uses a field reference to group [/root/rep/attachmentGroupRep, customType: attachment].",
			"Field expression label [id: field_fedc8, name: numberField] is syntactically incorrect: [Expression parse error in: invalid\nmismatched input 'i' expecting {<EOF>, '[', 'kontext', '(', 'case', QUOTE_STRING, NEWPARAGRAPH, NEWLINE}].",
			"Field expression label [id: field_9069c, name: numberFieldRep] is syntactically incorrect: [Expression parse error in: invalid\nmismatched input 'i' expecting {<EOF>, '[', 'kontext', '(', 'case', QUOTE_STRING, NEWPARAGRAPH, NEWLINE}].",
			"Field expression label [id: field_c3f4f, name: booleanField] refers to field '/root/invalid' which is not a valid field reference in its evaluation data context '/'.",
			"Field expression label [id: field_1ac74, name: booleanFieldRep] refers to field '/root/rep/invalid' which is not a valid field reference in its evaluation data context '/root/rep/'.",
			"Field expression label [id: field_e417c, name: dateFieldRep] uses a field reference to group [/root/rep/attachmentGroupRep, customType: attachment].",
			"Field expression label [id: field_5bd39, name: dateField] uses a field reference to group [/root/attachmentGroup, customType: attachment]."
		};
	}

	@Test
	public void checkInvalidContextWithoutFieldReferences() throws Exception {
		final FormModel testForm = ModelLoader.loadModel(
                "com/mgmtp/a12/formengine/consistency/rules/label/InvalidContextWithoutFieldReferenceTestForm.json");
		final FileBasedDocumentModelResolver modelResolver = new FileBasedDocumentModelResolver("com/mgmtp/a12/formengine/consistency/rules/label/");
		final List<Problem> problems = labelConsistencyRule.execute(testForm, RuleTestHelper.createDocumentModelAccess(modelResolver, testForm));

		assertThat(problems, hasSize(3));
		for (final String message : getExpectedMessagesForInvalidContextWithoutFieldReferences()) {
			assertThat(problems, hasItem(hasProperty("message", equalTo(message))));
		}
	}

	private String[] getExpectedMessagesForInvalidContextWithoutFieldReferences() {
		return new String[] {
			"Section expression label [id: section_52628, name: testElements] refers to group '/does_not_exist' which is not a valid group reference in its evaluation data context '/'.",
			"ControlGrid expression label [id: controlgrid_59610, name: testGrid] refers to field '/root/does_not_exist' which is not a valid field reference in its evaluation data context '/'.",
			"Field expression label [id: field_ef8c7, name: stringField] refers to group '/does_not_exist' which is not a valid group reference in its evaluation data context '/'."
		};
	}
}
