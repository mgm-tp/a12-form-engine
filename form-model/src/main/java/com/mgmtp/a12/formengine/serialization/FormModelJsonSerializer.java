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
package com.mgmtp.a12.formengine.serialization;

import static com.mgmtp.a12.model.header.HeaderModule.HEADER_MODULE;

import com.mgmtp.a12.model.header.Annotation;
import com.mgmtp.a12.model.header.AnnotationImpl;
import com.mgmtp.a12.model.serialization.A12DefaultJsonPrettyPrinter;
import com.mgmtp.a12.model.serialization.JsonSerializer;
import com.mgmtp.a12.model.serialization.ModelSerializationException;

import com.mgmtp.a12.formengine.model.FormModel;
import com.mgmtp.a12.formengine.model.json.EmptyStringToNullConverter;
import com.mgmtp.a12.formengine.model.json.JsonNumberConverter;
import com.mgmtp.a12.formengine.model.json.JsonParserCollectionVisitor;
import com.mgmtp.a12.formengine.model.json.MarkerConverter;
import com.mgmtp.a12.formengine.model.json.PlaceholderIconDeserializer;
import com.mgmtp.a12.formengine.model.json.PlaceholderIconSerializer;
import com.mgmtp.a12.formengine.model.json.RepeatOverviewColumnRefTypeConverter;
import com.mgmtp.a12.formengine.model.json.RepeatOverviewColumnRefTypeDeserializer;
import com.mgmtp.a12.formengine.model.types.AmountSuffixType;
import com.mgmtp.a12.formengine.model.types.AttachmentConfigType;
import com.mgmtp.a12.formengine.model.types.ButtonPanelType;
import com.mgmtp.a12.formengine.model.types.ButtonType;
import com.mgmtp.a12.formengine.model.types.CellType;
import com.mgmtp.a12.formengine.model.types.ConfirmationTextsType;
import com.mgmtp.a12.formengine.model.types.ControlGridNode;
import com.mgmtp.a12.formengine.model.types.ControlGridType;
import com.mgmtp.a12.formengine.model.types.ControlType;
import com.mgmtp.a12.formengine.model.types.CustomCellType;
import com.mgmtp.a12.formengine.model.types.CustomScreenElementType;
import com.mgmtp.a12.formengine.model.types.DatePickerConfigurationType;
import com.mgmtp.a12.formengine.model.types.DefaultRowActionType;
import com.mgmtp.a12.formengine.model.types.DefaultsType;
import com.mgmtp.a12.formengine.model.types.DependentEnumerationConstraint;
import com.mgmtp.a12.formengine.model.types.DependentFieldCaseType;
import com.mgmtp.a12.formengine.model.types.DependentFieldType;
import com.mgmtp.a12.formengine.model.types.DependentGroupCaseType;
import com.mgmtp.a12.formengine.model.types.DependentGroupType;
import com.mgmtp.a12.formengine.model.types.DetachedRepeatType;
import com.mgmtp.a12.formengine.model.types.DmFileReferenceType;
import com.mgmtp.a12.formengine.model.types.DmReferenceType;
import com.mgmtp.a12.formengine.model.types.DmRepositoryReferenceType;
import com.mgmtp.a12.formengine.model.types.DynamicAmountSuffixType;
import com.mgmtp.a12.formengine.model.types.EmbeddedRepeatType;
import com.mgmtp.a12.formengine.model.types.ExpressionCellType;
import com.mgmtp.a12.formengine.model.types.ExpressionRepeatOverviewColumnType;
import com.mgmtp.a12.formengine.model.types.ExternalEnumerationType;
import com.mgmtp.a12.formengine.model.types.FieldBasedRepeatOverviewColumnType;
import com.mgmtp.a12.formengine.model.types.FieldConfigurationEntryType;
import com.mgmtp.a12.formengine.model.types.HideConditionCaseType;
import com.mgmtp.a12.formengine.model.types.InlineRepeatType;
import com.mgmtp.a12.formengine.model.types.MultiColumnSectionType;
import com.mgmtp.a12.formengine.model.types.PlaceholderIconEnumType;
import com.mgmtp.a12.formengine.model.types.RepeatButtonLabelsType;
import com.mgmtp.a12.formengine.model.types.RepeatOverviewColumnRefType;
import com.mgmtp.a12.formengine.model.types.RepeatOverviewColumnType;
import com.mgmtp.a12.formengine.model.types.RepeatType;
import com.mgmtp.a12.formengine.model.types.RowType;
import com.mgmtp.a12.formengine.model.types.ScreenElementRefType;
import com.mgmtp.a12.formengine.model.types.ScreenElementType;
import com.mgmtp.a12.formengine.model.types.ScreenType;
import com.mgmtp.a12.formengine.model.types.SectionType;
import com.mgmtp.a12.formengine.model.types.StaticAmountSuffixType;
import com.mgmtp.a12.formengine.model.types.TextCellType;
import com.mgmtp.a12.formengine.model.visitor.ModelWalker;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.DeserializationFeature;
import tools.jackson.databind.MapperFeature;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.SerializationFeature;
import tools.jackson.databind.annotation.JsonDeserialize;
import tools.jackson.databind.annotation.JsonSerialize;
import tools.jackson.databind.json.JsonMapper;

/**
 * Jackson based JSON (de-)serializer for {@link FormModel}s.
 */
public class FormModelJsonSerializer implements JsonSerializer<FormModel> {

	private static final ObjectMapper OBJECT_MAPPER = initObjectMapper();

	/**
	 * Creates an object mapper with a clean separation of Header and Content configuration. Both configurations
	 * shouldn't cover each other and thus shouldn't be merged. The header config is provided by A12 Base.
	 */
	private static ObjectMapper initObjectMapper() {
		return JsonMapper.builder()
			.changeDefaultPropertyInclusion(incl -> incl.withValueInclusion(Include.NON_EMPTY))
			.changeDefaultVisibility(vc -> vc
				.withVisibility(PropertyAccessor.ALL, Visibility.NONE)
				.withVisibility(PropertyAccessor.FIELD, Visibility.ANY)
			)
			.defaultPrettyPrinter(new A12DefaultJsonPrettyPrinter())
			.enable(SerializationFeature.INDENT_OUTPUT)
			.enable(SerializationFeature.FAIL_ON_EMPTY_BEANS)
			.enable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
			.disable(MapperFeature.SORT_PROPERTIES_ALPHABETICALLY)
			.addMixIn(AttachmentConfigType.class, AttachmentConfigTypeMixin.class)
			.addMixIn(ButtonPanelType.class, ButtonPanelTypeMixin.class)
			.addMixIn(Annotation.class, AnnotationMixin.class)
			.addMixIn(AmountSuffixType.class, AmountSuffixTypeMixin.class)
			.addMixIn(ButtonType.class, ButtonTypeMixin.class)
			.addMixIn(CellType.class, CellTypeMixin.class)
			.addMixIn(ControlGridNode.class, ControlGridNodeMixin.class)
			.addMixIn(ControlGridType.class, ControlGridTypeMixin.class)
			.addMixIn(DatePickerConfigurationType.class, DatePickerConfigurationType.class)
			.addMixIn(ControlType.class, ControlTypeMixin.class)
			.addMixIn(DefaultRowActionType.class, DefaultRowActionTypeMixin.class)
			.addMixIn(DependentEnumerationConstraint.class, DependentEnumerationConstraintMixin.class)
			.addMixIn(DependentFieldCaseType.class, DependentFieldCaseTypeMixin.class)
			.addMixIn(DependentFieldType.class, DependentFieldTypeMixin.class)
			.addMixIn(DependentGroupCaseType.class, DependentGroupCaseTypeMixin.class)
			.addMixIn(DependentGroupType.class, DependentGroupTypeMixin.class)
			.addMixIn(HideConditionCaseType.class, HideConditionCaseTypeMixin.class)
			.addMixIn(DetachedRepeatType.class, DetachedRepeatTypeMixin.class)
			.addMixIn(EmbeddedRepeatType.class, EmbeddedRepeatTypeMixin.class)
			.addMixIn(ExternalEnumerationType.class, ExternalEnumerationTypeMixin.class)
			.addMixIn(FieldBasedRepeatOverviewColumnType.class, FieldBasedRepeatOverviewColumnTypeMixin.class)
			.addMixIn(FieldConfigurationEntryType.class, FieldConfigurationEntryTypeMixin.class)
			.addMixIn(DefaultsType.class, DefaultsTypeMixin.class)
			.addMixIn(DmReferenceType.class, DmReferenceTypeMixin.class)
			.addMixIn(RepeatOverviewColumnType.class, RepeatOverviewColumnTypeMixin.class)
			.addMixIn(RepeatType.class, RepeatTypeMixin.class)
			.addMixIn(RowType.class, RowTypeMixin.class)
			.addMixIn(ScreenElementRefType.class, ScreenElementRefTypeMixin.class)
			.addMixIn(ScreenElementType.class, ScreenElementTypeMixin.class)
			.addMixIn(ScreenType.class, ScreenTypeMixin.class)
			.addMixIn(SectionType.class, SectionTypeMixin.class)
			.addModule(HEADER_MODULE)
			.build();
	}

	/**
	 * Serializes the model to a JSON string.
	 *
	 * @param model the model to serialize
	 * @return JSON string representation
	 * @throws JacksonException if serialization fails
	 */
	public String toJsonString(final FormModel model) throws JacksonException {
		/*
		 * Pretty print the JSON by adding line breaks after array and object entries and indenting with two spaces to
		 * match our EditorConfig configuration and JSON.stringify.
		 */
		return OBJECT_MAPPER.writerWithDefaultPrettyPrinter().writeValueAsString(model);
	}

	/**
	 * Deserializes a JSON string to a FormModel.
	 *
	 * @param json the JSON string to deserialize
	 * @return the deserialized FormModel
	 * @throws JacksonException if deserialization fails
	 */
	public FormModel fromJsonString(final String json) throws JacksonException {
		final FormModel formModel = OBJECT_MAPPER.readValue(json, FormModel.class);
		fixCollections(formModel);
		return formModel;
	}

	private void fixCollections(final FormModel formModel) {
		new ModelWalker(new JsonParserCollectionVisitor()).acceptModel(formModel);
	}

	@Override
	public String serialize(final FormModel model) throws ModelSerializationException {
		try {
			return toJsonString(model);
		} catch (final JacksonException e) {
			throw new ModelSerializationException(
				"Error trying to serialize model '" + model.getHeader().getId() + "'.", e);
		}
	}

	@Override
	public FormModel deserialize(final String text) throws ModelSerializationException {
		try {
			return fromJsonString(text);
		} catch (final JacksonException e) {
			throw new ModelSerializationException("Error trying to deserialize model.", e);
		}
	}
}

abstract class DefaultsTypeMixin {
	@JsonInclude(JsonInclude.Include.NON_NULL)
	RepeatButtonLabelsType buttonLabels;

	@JsonInclude(JsonInclude.Include.NON_NULL)
	ConfirmationTextsType confirmationTexts;
}

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type")
@JsonSubTypes({
	@JsonSubTypes.Type(value = StaticAmountSuffixType.class, name = "static"),
	@JsonSubTypes.Type(value = DynamicAmountSuffixType.class, name = "dynamic"),
})
@JsonIgnoreProperties({ "type" })
abstract class AmountSuffixTypeMixin {
}

@JsonDeserialize(as = AnnotationImpl.class)
interface AnnotationMixin {
	@JsonInclude(JsonInclude.Include.NON_NULL)
	String getValue();
}

abstract class ButtonPanelTypeMixin {
	@JsonManagedReference(value = "buttonParent")
	List<ButtonType> button;
}

abstract class ButtonTypeMixin {
	@JsonSerialize(converter = MarkerConverter.class)
	boolean showReadonly;

	@JsonBackReference(value = "buttonParent")
	ButtonPanelType parent;
}

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type")
@JsonSubTypes({
	@JsonSubTypes.Type(value = ControlType.class, name = "Control"),
	@JsonSubTypes.Type(value = ExpressionCellType.class, name = "ExpressionCell"),
	@JsonSubTypes.Type(value = TextCellType.class, name = "TextCell"),
	@JsonSubTypes.Type(value = CustomCellType.class, name = "CustomCell")
})
abstract class CellTypeMixin {
}

abstract class ControlGridNodeMixin {

	@JsonBackReference(value = "rowParent")
	ControlGridType parent;
}

abstract class ControlGridTypeMixin {
	@JsonManagedReference(value = "rowParent")
	List<RowType> row;
}

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type")
@JsonSubTypes({
	@JsonSubTypes.Type(value = RowType.class, name = "Row")
})
abstract class RowTypeMixin {
}

abstract class ControlTypeMixin {
	@JsonSerialize(converter = MarkerConverter.class)
	String readonly;
	@JsonSerialize(converter = MarkerConverter.class)
	String secret;
	@JsonSerialize(converter = MarkerConverter.class)
	String tooltipsOnTop;
	@JsonSerialize(converter = MarkerConverter.class)
	String labelHiddenButRead;
	@JsonSerialize(converter = MarkerConverter.class)
	String autoExpand;
	@JsonSerialize(converter = MarkerConverter.class)
	String truncateSuffix;
}

@JsonInclude(Include.NON_NULL)
abstract class DependentEnumerationConstraintMixin {
	@JsonInclude(Include.NON_EMPTY)
	String valueForMasterChange;
}

// output marker elements as boolean true
@JsonInclude(Include.NON_NULL)
@JsonPropertyOrder({ "masterValue" })
abstract class DependentFieldCaseTypeMixin {

	@JsonInclude(Include.ALWAYS)
	@JsonSerialize(converter = EmptyStringToNullConverter.class)
	String masterValue;
	@JsonSerialize(converter = MarkerConverter.class)
	String notRelevant;
	@JsonSerialize(converter = MarkerConverter.class)
	String readonly;
}

// get rid of underscore
abstract class DependentFieldTypeMixin {
	@JsonProperty("case")
	List<DependentFieldCaseType> _case;
}

// output marker elements as boolean true
@JsonInclude(Include.NON_NULL)
@JsonPropertyOrder({ "masterValue" })
abstract class DependentGroupCaseTypeMixin {

	@JsonSerialize(converter = EmptyStringToNullConverter.class)
	@JsonInclude(value = Include.ALWAYS)
	String masterValue;
	@JsonSerialize(converter = MarkerConverter.class)
	String notRelevant;
	@JsonSerialize(converter = MarkerConverter.class)
	String readonly;
}

// get rid of underscore
abstract class DependentGroupTypeMixin {
	@JsonProperty("case")
	List<DependentGroupCaseType> _case;
}

@JsonInclude(Include.NON_NULL)
@JsonPropertyOrder({ "masterValue" })
abstract class HideConditionCaseTypeMixin {
	@JsonSerialize(converter = EmptyStringToNullConverter.class)
	@JsonInclude(value = Include.ALWAYS)
	String masterValue;
}

abstract class DefaultRowActionTypeMixin {
	@JsonSerialize(converter = MarkerConverter.class)
	String custom;
}

abstract class DetachedRepeatTypeMixin {

	@JsonManagedReference(value = "screenParentDetachedRepeat")
	@JsonProperty(value = "detailScreen")
	ScreenType detailScreen;
}

abstract class EmbeddedRepeatTypeMixin {

	@JsonManagedReference(value = "screenElementParentScreenElement")
	@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type")
	@JsonSubTypes({
		@JsonSubTypes.Type(value = ControlGridType.class, name = "ControlGrid")
	})
	ControlGridType controlGrid;
}

abstract class ExternalEnumerationTypeMixin {
	@JsonSerialize(converter = MarkerConverter.class)
	String customValuesAllowed;
	@JsonSerialize(converter = MarkerConverter.class)
	String caseSensitive;
}

abstract class FieldBasedRepeatOverviewColumnTypeMixin {
	@JsonSerialize(converter = MarkerConverter.class)
	String autoExpand;
	@JsonSerialize(converter = MarkerConverter.class)
	String truncateSuffix;
	@JsonSerialize(converter = MarkerConverter.class)
	String readonly;
	@JsonSerialize(converter = MarkerConverter.class)
	String secret;
}

abstract class FieldConfigurationEntryTypeMixin {
	@JsonSerialize(converter = MarkerConverter.class)
	String readonly;
	@JsonSerialize(converter = MarkerConverter.class)
	String secret;
	@JsonSerialize(converter = MarkerConverter.class)
	String enableSelectAll;
}

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type")
@JsonSubTypes({
	@JsonSubTypes.Type(value = ExpressionRepeatOverviewColumnType.class, name = "ExpressionRepeatOverviewColumn"),
	@JsonSubTypes.Type(value = FieldBasedRepeatOverviewColumnType.class, name = "FieldBasedRepeatOverviewColumn")
})
abstract class RepeatOverviewColumnTypeMixin {

	@JsonBackReference(value = "columnParentRepeat")
	RepeatType parent;

	@JsonSerialize(converter = JsonNumberConverter.class)
	Float width;
}

abstract class RepeatTypeMixin {

	@JsonSerialize(converter = RepeatOverviewColumnRefTypeConverter.class)
	@JsonDeserialize(converter = RepeatOverviewColumnRefTypeDeserializer.class)
	RepeatOverviewColumnRefType initialSorting;

	@JsonSerialize(converter = RepeatOverviewColumnRefTypeConverter.class)
	@JsonDeserialize(converter = RepeatOverviewColumnRefTypeDeserializer.class)
	RepeatOverviewColumnRefType screenReaderColumnRef;

	@JsonManagedReference(value = "columnParentRepeat")
	List<RepeatOverviewColumnType> repeatOverviewColumn;

	@JsonInclude(JsonInclude.Include.NON_NULL)
	RepeatButtonLabelsType buttonLabels;

	@JsonInclude(JsonInclude.Include.NON_NULL)
	ConfirmationTextsType confirmationTexts;
}

abstract class ScreenElementRefTypeMixin {

	@JsonInclude(Include.ALWAYS)
	@JsonSerialize(converter = EmptyStringToNullConverter.class)
	@JsonProperty(value = "masterValue")
	String masterValue;
}

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type")
@JsonSubTypes({
	@JsonSubTypes.Type(value = ControlGridType.class, name = "ControlGrid"),
	@JsonSubTypes.Type(value = SectionType.class, name = "Section"),
	@JsonSubTypes.Type(value = MultiColumnSectionType.class, name = "MultiColumnSection"),
	@JsonSubTypes.Type(value = DetachedRepeatType.class, name = "DetachedRepeat"),
	@JsonSubTypes.Type(value = EmbeddedRepeatType.class, name = "EmbeddedRepeat"),
	@JsonSubTypes.Type(value = InlineRepeatType.class, name = "InlineRepeat"),
	@JsonSubTypes.Type(value = ButtonPanelType.class, name = "ButtonPanel"),
	@JsonSubTypes.Type(value = CustomScreenElementType.class, name = "CustomScreenElement")
})
abstract class ScreenElementTypeMixin {

	@JsonBackReference(value = "screenElementParentScreenElement")
	ScreenElementType parent;

	@JsonBackReference(value = "screenElementParentScreen")
	ScreenType parentScreen;

	@JsonSerialize(converter = MarkerConverter.class)
	String readonly;

	@JsonInclude(Include.NON_NULL)
	String hostDocumentModelPath;
}

abstract class SectionTypeMixin {

	@JsonManagedReference(value = "screenElementParentScreenElement")
	@JsonProperty("screenElements")
	List<ScreenElementType> screenElement;
	@JsonSerialize(converter = MarkerConverter.class)
	String collapsible;
	@JsonSerialize(converter = MarkerConverter.class)
	String initiallyCollapsed;
}

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type")
@JsonSubTypes({
	@JsonSubTypes.Type(value = DmFileReferenceType.class, name = "DmFileReference"),
	@JsonSubTypes.Type(value = DmRepositoryReferenceType.class, name = "DmRepositoryReference")
})
abstract class DmReferenceTypeMixin {
}

@JsonIgnoreProperties({ "type" })
abstract class ScreenTypeMixin {

	@JsonBackReference(value = "screenParentDetachedRepeat")
	DetachedRepeatType parentScreenElement;

	@JsonManagedReference(value = "screenElementParentScreen")
	@JsonInclude(Include.ALWAYS)
	List<ScreenElementType> screenElements;
}

abstract class AttachmentConfigTypeMixin {
	@JsonSerialize(converter = PlaceholderIconSerializer.class)
	@JsonDeserialize(converter = PlaceholderIconDeserializer.class)
	PlaceholderIconEnumType placeholderIcon;
}
