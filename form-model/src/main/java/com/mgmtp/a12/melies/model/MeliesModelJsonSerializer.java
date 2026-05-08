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
package com.mgmtp.a12.melies.model;

import com.mgmtp.a12.melies.model.json.EmptyStringToNullConverter;
import com.mgmtp.a12.melies.model.json.RepeatOverviewColumnRefTypeConverter;
import com.mgmtp.a12.melies.model.json.RepeatOverviewColumnRefTypeDeserializer;
import com.mgmtp.a12.melies.model.json.JsonNumberConverter;
import com.mgmtp.a12.melies.model.json.JsonParserCollectionVisitor;
import com.mgmtp.a12.melies.model.json.MarkerConverter;
import com.mgmtp.a12.melies.model.json.PlaceholderIconDeserializer;
import com.mgmtp.a12.melies.model.json.PlaceholderIconSerializer;
import com.mgmtp.a12.melies.model.types.AmountSuffixType;
import com.mgmtp.a12.melies.model.types.AttachmentConfigType;
import com.mgmtp.a12.melies.model.types.ButtonPanelType;
import com.mgmtp.a12.melies.model.types.ButtonType;
import com.mgmtp.a12.melies.model.types.CellType;
import com.mgmtp.a12.melies.model.types.ConfirmationTextsType;
import com.mgmtp.a12.melies.model.types.ControlGridNode;
import com.mgmtp.a12.melies.model.types.ControlGridType;
import com.mgmtp.a12.melies.model.types.ControlType;
import com.mgmtp.a12.melies.model.types.CustomCellType;
import com.mgmtp.a12.melies.model.types.CustomScreenElementType;
import com.mgmtp.a12.melies.model.types.DatePickerConfigurationType;
import com.mgmtp.a12.melies.model.types.DefaultRowActionType;
import com.mgmtp.a12.melies.model.types.DefaultsType;
import com.mgmtp.a12.melies.model.types.DependentEnumerationConstraint;
import com.mgmtp.a12.melies.model.types.DependentFieldCaseType;
import com.mgmtp.a12.melies.model.types.DependentFieldType;
import com.mgmtp.a12.melies.model.types.DependentGroupCaseType;
import com.mgmtp.a12.melies.model.types.DependentGroupType;
import com.mgmtp.a12.melies.model.types.DetachedRepeatType;
import com.mgmtp.a12.melies.model.types.DynamicAmountSuffixType;
import com.mgmtp.a12.melies.model.types.EmbeddedRepeatType;
import com.mgmtp.a12.melies.model.types.ExpressionCellType;
import com.mgmtp.a12.melies.model.types.ExpressionRepeatOverviewColumnType;
import com.mgmtp.a12.melies.model.types.ExternalEnumerationType;
import com.mgmtp.a12.melies.model.types.FieldBasedRepeatOverviewColumnType;
import com.mgmtp.a12.melies.model.types.FieldConfigurationEntryType;
import com.mgmtp.a12.melies.model.types.HideConditionCaseType;
import com.mgmtp.a12.melies.model.types.InlineRepeatType;
import com.mgmtp.a12.melies.model.types.MultiColumnSectionType;
import com.mgmtp.a12.melies.model.types.PicusFileReferenceType;
import com.mgmtp.a12.melies.model.types.PicusReferenceType;
import com.mgmtp.a12.melies.model.types.PicusRepositoryReferenceType;
import com.mgmtp.a12.melies.model.types.PlaceholderIconEnumType;
import com.mgmtp.a12.melies.model.types.RepeatButtonLabelsType;
import com.mgmtp.a12.melies.model.types.RepeatOverviewColumnRefType;
import com.mgmtp.a12.melies.model.types.RepeatOverviewColumnType;
import com.mgmtp.a12.melies.model.types.RepeatType;
import com.mgmtp.a12.melies.model.types.RowType;
import com.mgmtp.a12.melies.model.types.ScreenElementRefType;
import com.mgmtp.a12.melies.model.types.ScreenElementType;
import com.mgmtp.a12.melies.model.types.ScreenType;
import com.mgmtp.a12.melies.model.types.SectionType;
import com.mgmtp.a12.melies.model.types.StaticAmountSuffixType;
import com.mgmtp.a12.melies.model.types.TextCellType;
import com.mgmtp.a12.melies.model.visitor.ModelWalker;
import com.mgmtp.a12.model.header.Annotation;
import com.mgmtp.a12.model.header.AnnotationImpl;
import com.mgmtp.a12.model.header.Header;
import com.mgmtp.a12.model.header.JacksonConfiguration;
import com.mgmtp.a12.model.serialization.A12DefaultJsonPrettyPrinter;

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
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.PrettyPrinter;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.module.SimpleModule;

import java.io.IOException;
import java.util.List;

/**
 * Jackson based JSON (de-)serializer.
 */
public class MeliesModelJsonSerializer {

	private static final PrettyPrinter PRETTY_PRINTER = new A12DefaultJsonPrettyPrinter();
	private static final ObjectMapper OBJECT_MAPPER = initObjectMapper();

	/**
	 * Creates an object mapper with a clean separation of Header and Content configuration. Both configurations
	 * shouldn't cover each other and thus shouldn't be merged. The header config is provided by the BASE product.
	 *
	 * @return
	 */
	private static ObjectMapper initObjectMapper() {

		final ObjectMapper formModelObjectMapper = new ObjectMapper()
			.setDefaultPropertyInclusion(Include.NON_EMPTY)
			.setVisibility(PropertyAccessor.ALL, Visibility.NONE)
			.setVisibility(PropertyAccessor.FIELD, Visibility.ANY)
			.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false)
			.enable(SerializationFeature.INDENT_OUTPUT)
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
			.addMixIn(PicusReferenceType.class, PicusReferenceTypeMixin.class)
			.addMixIn(RepeatOverviewColumnType.class, RepeatOverviewColumnTypeMixin.class)
			.addMixIn(RepeatType.class, RepeatTypeMixin.class)
			.addMixIn(RowType.class, RowTypeMixin.class)
			.addMixIn(ScreenElementRefType.class, ScreenElementRefTypeMixin.class)
			.addMixIn(ScreenElementType.class, ScreenElementTypeMixin.class)
			.addMixIn(ScreenType.class, ScreenTypeMixin.class)
			.addMixIn(SectionType.class, SectionTypeMixin.class);

		final ObjectMapper headerObjectMapper = JacksonConfiguration.configureMixins(new ObjectMapper());
		final SimpleModule module = new SimpleModule()
			.addSerializer(Header.class, new JsonSerializer<Header>() {

				@Override
				public void serialize(final Header value, final JsonGenerator gen, final SerializerProvider serializers)
					throws IOException {
					headerObjectMapper.writer().writeValue(gen, value);
				}
			})
			.addDeserializer(Header.class, new JsonDeserializer<Header>() {

				@Override
				public Header deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
					return headerObjectMapper.readValue(p, Header.class);
				}
			});

		return formModelObjectMapper.registerModule(module);
	}

	public String toJsonString(final MeliesModel model) throws JsonProcessingException {

		/*
		 * Pretty print the json by adding line breaks after array and object entries and indenting with two spaces to
		 * match our EditorConfig configuration and JSON.stringify.
		 */
		return OBJECT_MAPPER.writer(PRETTY_PRINTER).writeValueAsString(model);
	}

	public MeliesModel fromJsonString(final String json) throws JsonProcessingException {
		final MeliesModel meliesModel = OBJECT_MAPPER.readValue(json, MeliesModel.class);
		fixCollections(meliesModel);
		return meliesModel;
	}

	private void fixCollections(final MeliesModel meliesModel) {
		new ModelWalker(new JsonParserCollectionVisitor()).acceptModel(meliesModel);
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

@JsonIgnoreProperties({ "parent" })
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
	@JsonSubTypes.Type(value = PicusFileReferenceType.class, name = "PicusFileReference"),
	@JsonSubTypes.Type(value = PicusRepositoryReferenceType.class, name = "PicusRepositoryReference")
})
abstract class PicusReferenceTypeMixin {
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
