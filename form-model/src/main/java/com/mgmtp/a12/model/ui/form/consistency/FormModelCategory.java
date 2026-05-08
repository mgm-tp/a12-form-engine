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
package com.mgmtp.a12.model.ui.form.consistency;

import com.mgmtp.a12.model.consistency.ConsistencyCategory;

import java.util.Locale;
import java.util.ResourceBundle;

/**
 * Enumeration for error codes. Error messages are read from properties-file to ensure I18N.
 */
public enum FormModelCategory implements ConsistencyCategory {
		PICUS_MISSING_ELEMENT_IN_CONTROL("problem.picus.missingElementInControl"),
		PICUS_MISSING_ELEMENT_IN_OVERVIEW_COLUMN("problem.picus.missingElementInOverviewColumn"),
		PICUS_MISSING_GROUP_IN_OVERVIEW_COLUMN("problem.picus.missingGroupInOverviewColumn"),
		PICUS_MISSING_ELEMENT_IN_FIELD_CONFIGURATION("problem.picus.missingElementInFieldConfiguration"),
		PICUS_MISSING_GROUP_IN_GROUP_CONFIGURATION("problem.picus.missingGroupInGroupConfiguration"),
		PICUS_MISSING_FIELD_IN_DEPENDENT_FIELD_MASTER("problem.picus.missingFieldInDependentFieldMaster"),
		PICUS_MISSING_FIELD_IN_DEPENDENT_GROUP_MASTER("problem.picus.missingFieldInDependentGroupMaster"),
		PICUS_MISSING_FIELD_IN_DEPENDENT_ENUMERATION("problem.picus.missingFieldInDependentEnum"),
		PICUS_MISSING_FIELD_IN_DEPENDENT_ENUMERATION_MASTER("problem.picus.missingFieldInDependentEnumMaster"),
		PICUS_MISSING_FIELD_IN_DEPENDENT_FIELD_CASE("problem.picus.missingFieldInDependentFieldCase"),
		PICUS_MISSING_FIELD_IN_HIDE_CONDITION_MASTER("problem.picus.missingFieldInHideConditionMaster"),
		PICUS_MODEL_DEPENDENT_COMBINATION_ENUM_FIELD("problem.picus.dependent.combinationOfEnumerationAndField"),
		PICUS_MODEL_DEPENDENT_ENUM_DEPENDENT_FIELD_INVALID_TYPE(
			"problem.picus.dependentEnum.dependentFieldInvalidType"),
		PICUS_MODEL_DEPENDENT_ENUM_MASTER_FIELD_INVALID_TYPE("problem.picus.dependentEnum.masterFieldInvalidType"),
		PICUS_MODEL_DEPENDENT_ENUM_INVALID_MASTER_ENUMERATION_VALUE(
			"problem.picus.dependentEnum.invalidMasterEnumerationValue"),
		PICUS_MODEL_DEPENDENT_ENUM_INVALID_DEPENDENT_ENUMERATION_VALUE(
			"problem.picus.dependentEnum.invalidDependentEnumerationValue"),
		PICUS_MODEL_DEPENDENT_ENUM_INVALID_VALUE_FOR_MASTER_CHANGE_ENUMERATION_VALUE(
			"problem.picus.dependentEnum.invalidValueForMasterChangeEnumerationValue"),
		PICUS_MODEL_DEPENDENT_TYPE_MASTER_FIELD_INVALID_TYPE("problem.picus.dependentType.masterFieldInvalidType"),
		PICUS_MODEL_EXPANSION_EXCEPTION("problem.picus.model.expansionException"),
		PICUS_MODEL_HIDE_CONDITION_MASTER_FIELD_INVALID_TYPE("problem.picus.hideCondition.masterFieldInvalidType"),
		PICUS_MODEL_HIDE_CONDITION_INVALID_MASTER_VALUE("problem.picus.hideCondition.invalidMasterValue"),

		FORM_MODEL_INCOMPATIBLE_LOCALES("problem.form.locales.incompatible"),
		FORM_MODEL_WRONG_VERSION("problem.form.wrongVersion"),
		FORM_MODEL_WRONG_VERSION_PATTERN("problem.form.wrongVersionPattern"),
		FORM_MODEL_WRONG_LOCALE("problem.form.locale"),
		FORM_MODEL_WRONG_STYLE("problem.form.style"),
		FORM_MODEL_WRONG_LAYOUT_SUM("problem.form.layout.sum"),
		FORM_MODEL_WRONG_LAYOUT_COLUMNS("problem.form.layout.columns"),
		FORM_MODEL_WRONG_LAYOUT_OFFSET_SUM("problem.form.layout.offset.sum"),
		FORM_MODEL_WRONG_LAYOUT_SPAN_SUM("problem.form.layout.span.sum"),
		FORM_MODEL_WRONG_COLUMN_INDEX("problem.form.column.index"),
		FORM_MODEL_WRONG_SCREEN_REFERENCE("problem.form.screen.reference"),
		FORM_MODEL_NO_SCREEN_REFERENCE("problem.form.no.screen.reference"),
		FORM_MODEL_BUTTON_INVALID_LABEL_HIDDEN_SET("problem.form.button.invalid.label.hidden.set"),
		FORM_MODEL_NAVIGATION_BUTTON_MISSING_TARGET("problem.form.navigation.button.missing.target"),
		FORM_MODEL_NAVIGATION_BUTTON_WRONG_TARGET_VALUE("problem.form.navigation.button.wrong.target.value"),
		FORM_MODEL_NAVIGATION_BUTTON_EVENT_SET("problem.form.navigation.button.event.set"),
		FORM_MODEL_EVENT_BUTTON_TARGET_SET("problem.form.event.button.target.set"),
		FORM_MODEL_CONTROL_INDEX_MISSING("problem.form.control.index.missing"),
		FORM_MODEL_CONTROL_INDEX_EXISTS("problem.form.control.index.exists"),
		FORM_MODEL_CONTROL_INDEX_NUMERIC_VALUE_NOT_INT("problem.form.control.index.numeric.value.not.int"),
		FORM_MODEL_CONTROL_INDEX_SEMANTIC_VALUE_NO_INDEX_FIELD(
			"problem.form.control.index.semantic.value.no.index.field"),
		FORM_MODEL_CONTROL_ROOT_CONTEXT_WRONG("problem.form.control.context.wrong.root"),
		FORM_MODEL_CONTROL_REPEAT_CONTEXT_WRONG("problem.form.control.context.wrong.repeat"),
		FORM_MODEL_DEPENDENT_CONTROL_PARENT("problem.form.dependent.control.parent"),
		FORM_MODEL_DEPENDENT_CONTROL_REFERENCE("problem.form.dependent.control.reference"),
		FORM_MODEL_DEPENDENT_CONTROL_DIFFERENT_TOP_LEVEL_SCREEN("problem.form.dependent.control.different.top.level.screen"),
		FORM_MODEL_DEPENDENT_CONTROL_INDEXED_DIFFERENT_SCREEN("problem.form.dependent.control.indexed.different.screen"),
		FORM_MODEL_DEPENDENT_CONTROL_INCOMPATIBLE_CONTEXT("problem.form.dependent.control.incompatible.context"),
		FORM_MODEL_FIELD_CYCLE_REFERENCE("problem.form.field.cycle.reference"),
		FORM_MODEL_CUSTOM_ROW_ACTIONS_MISSING_EVENT("problem.form.custom.row.action.missing.event"),
		FORM_MODEL_INVALID_GROUP_REF("problem.form.repeat.invalid.groupref"),
		FORM_MODEL_INVALID_NESTING_PARENT("problem.form.repeat.invalid.nesting.parent"),
		FORM_MODEL_INVALID_NESTING_REPEATABLE_BETWEEN("problem.form.repeat.repeatable.between"),
		FORM_MODEL_INVALID_NESTING_REPEATABLE_PARENT("problem.form.repeat.repeatable.parent"),
		FORM_MODEL_NON_REPEATABLE_REPEAT_GROUP("problem.form.repeat.group.nonrepeatable"),
		FORM_MODEL_EXPRESSION_SYNTAX("problem.form.expression.syntax"),
		FORM_MODEL_EXPRESSION_FIELDREF("problem.form.expression.fieldref"),
		FORM_MODEL_EXPRESSION_INVALID_GROUP_REF("problem.form.expression.groupref"),
		FORM_MODEL_EXPRESSION_FIELDREF_TO_GROUP("problem.form.expression.fieldref.to.group"),
		FORM_MODEL_FIELD_COLUMN_ELEMENTREF("problem.form.field.column.elementref"),
		FORM_MODEL_UNKNOWN_ELEMENTREF("problem.form.unknown.elementref"),
		FORM_MODEL_COLUMN_WIDTH_TOO_SMALL("problem.form.repeat.column.width.tooSmall"),
		FORM_MODEL_COLUMN_WIDTH_TOO_MANY_DECIMAL_PLACES("problem.form.repeat.column.width.tooManyDecimalPlaces"),
		FORM_MODEL_EXTERNAL_ENUM_INVALID_ALLOW_CUSTOM_VALUE(
			"problem.form.external.enumeration.invalid.allow.custom.value"),
		FORM_MODEL_EXTERNAL_ENUM_INVALID_CASE_SENSITIVE("problem.form.external.enumeration.invalid.case.sensitive"),
		FORM_MODEL_DUPLICATE_ELEMENT_NAME("problem.form.duplicate.element.name"),
		FORM_MODEL_SECRET_AREA_LINE_BREAKS("problem.form.secret.area.line.breaks"),
		FORM_MODEL_AUTO_EXPAND_INVALID("problem.form.auto.expand.invalid"),
		FORM_MODEL_DEFAULT_ROW_ACTION_UNSUPPORTED_EVENT("problem.form.defaultrowaction.not.supported.event"),
		FORM_MODEL_DEFAULT_ROW_ACTION_MISSING_CUSTOM_EVENT("problem.form.defaultrowaction.missing.customevent"),
		FORM_MODEL_DEFAULT_ROW_ACTION_WITH_CONFIRMATION("problem.form.defaultrowaction.with.confirmation"),
		FORM_MODEL_DEPENDENT_FIELD_CASE_INCOMPATIBLE_FIELDTYPE(
			"problem.form.dependentfield.case.incompatible.fieldtype"),
		FORM_MODEL_DEPENDENT_FIELD_ON_METADATA("problem.form.dependentfield.metadata"),
		FORM_MODEL_EXTERNAL_ENUM_ON_METADATA("problems.form.external.enumeration.metadata"),
		FORM_MODEL_PLACEHOLDER_INVALID_DATATYPE("problems.form.placeholder.invalid"),
		FORM_MODEL_DATATYPE_EXPOSITION_MISMATCH("problem.form.datatype.exposition.mismatch"),
		FORM_MODEL_EXPOSITION_ONLY_ALLOWED_FOR_COLUMNS("problem.form.exposition.onlyAllowedForColumns"),
		FORM_MODEL_ENABLE_SELECT_ALL_INVALID_DATATYPE("problems.form.enableSelectAll.invalid"),
		FORM_MODEL_ENABLE_SELECT_ALL_INVALID_EXPOSITION("problems.form.enableSelectAll.invalidExposition"),
		FORM_MODEL_REPEAT_VIRTUAL_SCROLLING_PAGING("problems.form.repeat.infinitescrolling.paging"),
		FORM_MODEL_REPEAT_VIRTUAL_SCROLLING_CONFIG("problems.form.repeat.infinitescrolling.config"),
		FORM_MODEL_REPEAT_VIRTUAL_SCROLLING_NO_ROW_HEIGHT(
			"problems.form.repeat.infinitescrolling.noRowHeight"),
		FORM_MODEL_REPEAT_NUMBER_OF_INITIAL_ROWS_INVALID("problems.form.repeat.numberOfInitialRows.invalid"),
		FORM_MODEL_REPEAT_NUMBER_OF_INITIAL_ROWS_TOO_BIG("problems.form.repeat.numberOfInitialRows.tooBig"),
		FORM_MODEL_ACTION_COLUMN_WIDTH_TOO_SMALL("problem.form.repeat.actioncolumn.width.tooSmall"),
		FORM_MODEL_ACTION_COLUMN_WIDTH_TOO_MANY_DECIMAL_PLACES(
			"problem.form.repeat.actioncolumn.width.tooManyDecimalPlaces"),
		FORM_MODEL_MISSING_LABEL_TYPE("problem.form.label.missing.type"),
		FORM_MODEL_MISSING_LABEL_TEXT("problem.form.label.missing.text"),
		FORM_MODEL_WRONG_LABEL_TYPE("problem.form.label.wrong.type"),
		FORM_MODEL_MULTILINGUAL_AND_EXPRESSION_LABEL_SET("problem.form.label.inconsistent"),
		FORM_MODEL_DEPENDENT_CONTROL_NO_SCREEN_ELEMENT("problem.form.dependent.control.noScreenElement"),
		FORM_MODEL_DUPLICATE_IDS("problem.form.ids.duplicate"),
		FORM_MODEL_REPEAT_SHOW_COMMA_SEPARATED_ROW_HEIGHT_GIVEN("problem.form.repeat.column.showCommaSeparated.rowHeightGiven"),
		FORM_MODEL_REPEAT_SHOW_COMMA_SEPARATED_NO_MULTI_SELECT_COLUMN("problem.form.repeat.column.showCommaSeparated.noMultiSelectColumn"),
		FORM_MODEL_REPEAT_SHOW_COMMA_SEPARATED_UNNECESSARY("problem.form.repeat.column.showCommaSeparated.unnecessary"),
		FORM_MODEL_REPEAT_SHOW_SUMMARY_INVALID_TYPE("problem.form.repeat.column.showSummary.invalidType"),
		FORM_MODEL_SETTINGS_ROLES_MISSING("problem.form.settings.roles.missing"),
		FORM_MODEL_REPEAT_THUMBNAIL_COLUMN_INVALID_ELEMENT("problem.form.repeat.column.thumbnailColumn.invalidElement"),
		FORM_MODEL_REPEAT_MULTI_FILE_UPLOAD_NO_ATTACHMENT_COLLECTION("problem.form.repeat.multiFileUpload.noAttachmentCollection"),
		FORM_MODEL_REPEAT_MULTI_FILE_UPLOAD_UNUSED_OPTIONS("problem.form.repeat.multiFileUpload.unusedCoptions"),
		FORM_MODEL_REPEAT_MULTI_FILE_UPLOAD_NO_ELEMENT_REF("problem.form.repeat.multiFileUpload.noElementRef"),
		FORM_MODEL_STRING_VALUE_MULTI_SELECT_NO_EXTERNAL_ENUM_SET("problem.form.stringValueMultiSelect.noExternalEnumerationSet"),
		FORM_MODEL_AUTOCOMPLETE_ONLY_ALLOWED_FOR_STRING_FIELDS("problem.form.autoComplete.invalidElement"),
		FORM_MODEL_AMOUNT_SUFFIX_INVALID_TYPE("problem.form.amountSuffix.invalidField"),
		FORM_MODEL_AMOUNT_SUFFIX_FIELD_MISSING("problem.form.amountSuffix.missingField"),
		FORM_MODEL_HIDE_CONDITION_NO_CASES("problem.form.hideCondition.noCases"),
		FORM_MODEL_HIDE_CONDITION_INVALID_MASTER_FIELD_GRANULARITY("problem.form.hideCondition.invalidMasterFieldGranularity");

	private String keyValue;

	FormModelCategory(final String keyValue) {
		this.keyValue = keyValue;
	}

	@Override
	public String getKeyValue() {
		return keyValue;
	}

	@Override
	public String getLocalizedMessage(final Locale locale, final String keyValue) {
		final ResourceBundle bundle =
			ResourceBundle.getBundle("com.mgmtp.a12.model.ui.form.consistency.i18n.ErrorMessages", locale);
		return bundle.getString(keyValue);
	}
}
