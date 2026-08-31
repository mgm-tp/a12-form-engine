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
package com.mgmtp.a12.formengine.model;

import com.mgmtp.a12.formengine.model.types.AmountSuffixType;
import com.mgmtp.a12.formengine.model.types.ButtonPanelType;
import com.mgmtp.a12.formengine.model.types.CellType;
import com.mgmtp.a12.formengine.model.types.ControlGridType;
import com.mgmtp.a12.formengine.model.types.ControlType;
import com.mgmtp.a12.formengine.model.types.CustomCellType;
import com.mgmtp.a12.formengine.model.types.CustomScreenElementType;
import com.mgmtp.a12.formengine.model.types.DetachedRepeatType;
import com.mgmtp.a12.formengine.model.types.DynamicAmountSuffixType;
import com.mgmtp.a12.formengine.model.types.EmbeddedRepeatType;
import com.mgmtp.a12.formengine.model.types.ExpressionCellType;
import com.mgmtp.a12.formengine.model.types.InlineRepeatType;
import com.mgmtp.a12.formengine.model.types.MultiColumnSectionType;
import com.mgmtp.a12.formengine.model.types.RowType;
import com.mgmtp.a12.formengine.model.types.ScreenElementType;
import com.mgmtp.a12.formengine.model.types.ScreenType;
import com.mgmtp.a12.formengine.model.types.SectionType;
import com.mgmtp.a12.formengine.model.types.StaticAmountSuffixType;
import com.mgmtp.a12.formengine.model.types.TextCellType;
import com.mgmtp.a12.formengine.serialization.FormModelJsonSerializer;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;

import org.apache.commons.io.IOUtils;
import org.json.JSONException;
import org.json.JSONObject;
import org.testng.Assert;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

/**
 * Verifies every subtype branch of the five reachable {@code @JsonTypeInfo}/{@code @JsonSubTypes} polymorphism
 * hierarchies declared across the mixins in {@code FormModelJsonSerializer} (AmountSuffixType, CellType, RowType,
 * EmbeddedRepeatType's controlGrid property, ScreenElementType). {@code DmReferenceType} is intentionally excluded: it
 * has no field anywhere in {@code FormModel}'s object graph, so it cannot be reached through the public (de)serialize
 * API and appears to be dead mixin configuration. For each branch, both directions are checked independently:
 * deserializing a real FormModel fixture (under {@code polymorphism-mixins/}) must produce the correct concrete Java
 * type, and serializing an instance built via the model's own builders must emit the correct discriminator value.
 */
public class PolymorphismMixinsTest {

	private static final FormModelJsonSerializer SERIALIZER = new FormModelJsonSerializer();

	private static FormModel loadModel(final String resourceName) throws IOException {
		try (InputStream inputStream = PolymorphismMixinsTest.class.getResourceAsStream("polymorphism-mixins/" + resourceName)) {
			return SERIALIZER.fromJsonString(IOUtils.toString(inputStream, StandardCharsets.UTF_8));
		}
	}

	private static FormModel modelWithScreenElements(final ScreenElementType... elements) throws IOException {
		final FormModel model = loadModel("polymorphism-mixins-empty.json");
		model.getContent().withScreens(List.of(new ScreenType().withId("s1").withScreenElements(elements)));
		return model;
	}

	private static JSONObject serializeToTree(final FormModel model) throws JSONException {
		return new JSONObject(SERIALIZER.toJsonString(model));
	}

	private static JSONObject firstScreenElementNode(final JSONObject tree) throws JSONException {
		return tree.getJSONObject("content").getJSONArray("screens").getJSONObject(0)
			.getJSONArray("screenElements").getJSONObject(0);
	}

	private static ScreenElementType firstScreenElement(final FormModel model) {
		return model.getContent().getScreens().getFirst().getScreenElements().getFirst();
	}

	private static void assertDeserializesTo(
		final String discriminator,
		final Class<?> expectedClass,
		final Object deserialized) {
		Assert.assertTrue(
			expectedClass.isInstance(deserialized),
			"'" + discriminator + "' must deserialize to " + expectedClass.getSimpleName() + " but was " + deserialized.getClass());
	}

	@DataProvider
	public Object[][] amountSuffixSubtypes() {
		return new Object[][] {
			{
				"static",
				StaticAmountSuffixType.class,
				"amount-suffix-static.json",
				new StaticAmountSuffixType().withValue("USD")
			},
			{
				"dynamic", DynamicAmountSuffixType.class, "amount-suffix-dynamic.json",
				new DynamicAmountSuffixType().withFieldRef("field1")
			},
		};
	}

	@Test(dataProvider = "amountSuffixSubtypes")
	public void amountSuffixTypeSubtypeRoundtrips(
		final String discriminator, final Class<? extends AmountSuffixType> expectedClass,
		final String resourceName, final AmountSuffixType builtValue) throws IOException, JSONException {
		final FormModel model = loadModel(resourceName);
		final AmountSuffixType deserialized = model.getContent().getAmountSuffix();
		assertDeserializesTo(discriminator, expectedClass, deserialized);

		final FormModel builtModel = loadModel("polymorphism-mixins-empty.json");
		builtModel.getContent().withAmountSuffix(builtValue);
		final JSONObject
			amountSuffixNode =
			serializeToTree(builtModel).getJSONObject("content").getJSONObject("amountSuffix");
		Assert.assertEquals(amountSuffixNode.getString("type"), discriminator);
	}

	@DataProvider
	public Object[][] cellTypeSubtypes() {
		return new Object[][] {
			{
				"Control",
				ControlType.class,
				"cell-control.json",
				new ControlType().withId("c1").withElementRef("field1")
			},
			{ "TextCell", TextCellType.class, "cell-text-cell.json", new TextCellType().withId("tc1").withName("tc") },
			{
				"ExpressionCell", ExpressionCellType.class, "cell-expression-cell.json",
				new ExpressionCellType().withId("ec1").withName("ec").withExpression("\"abc\"")
			},
			{
				"CustomCell",
				CustomCellType.class,
				"cell-custom-cell.json",
				new CustomCellType().withId("cc1").withName("cc")
			},
		};
	}

	@Test(dataProvider = "cellTypeSubtypes")
	public void cellTypeSubtypeRoundtrips(
		final String discriminator, final Class<? extends CellType> expectedClass,
		final String resourceName, final CellType builtCell) throws IOException, JSONException {
		final FormModel model = loadModel(resourceName);
		final ControlGridType grid = (ControlGridType) firstScreenElement(model);
		final CellType deserialized = grid.getRow().getFirst().getCell().getFirst();
		assertDeserializesTo(discriminator, expectedClass, deserialized);

		final ControlGridType builtGrid = new ControlGridType()
			.withId("grid1")
			.withRow(new RowType().withId("row1").withCell(builtCell));
		final JSONObject cellNode = firstScreenElementNode(serializeToTree(modelWithScreenElements(builtGrid)))
			.getJSONArray("row").getJSONObject(0).getJSONArray("cell").getJSONObject(0);
		Assert.assertEquals(cellNode.getString("type"), discriminator);
	}

	@Test
	public void rowTypeDiscriminator() throws IOException, JSONException {
		final FormModel model = loadModel("row-type.json");
		final ControlGridType grid = (ControlGridType) firstScreenElement(model);
		Assert.assertNotNull(grid.getRow().getFirst());

		final ControlGridType builtGrid = new ControlGridType().withId("grid1").withRow(new RowType().withId("row1"));
		final JSONObject rowNode = firstScreenElementNode(serializeToTree(modelWithScreenElements(builtGrid)))
			.getJSONArray("row").getJSONObject(0);
		Assert.assertEquals(rowNode.getString("type"), "Row");
	}

	@Test
	public void embeddedRepeatControlGridDiscriminator() throws IOException, JSONException {
		final FormModel model = loadModel("embedded-repeat-control-grid.json");
		final EmbeddedRepeatType embeddedRepeat = (EmbeddedRepeatType) firstScreenElement(model);
		Assert.assertNotNull(embeddedRepeat.getControlGrid());

		final EmbeddedRepeatType
			builtRepeat =
			new EmbeddedRepeatType().withId("er1").withControlGrid(new ControlGridType().withId("grid1"));
		final JSONObject controlGridNode = firstScreenElementNode(serializeToTree(modelWithScreenElements(builtRepeat)))
			.getJSONObject("controlGrid");
		Assert.assertEquals(controlGridNode.getString("type"), "ControlGrid");
	}

	@DataProvider
	public Object[][] screenElementTypeSubtypes() {
		return new Object[][] {
			{
				"ControlGrid",
				ControlGridType.class,
				"screen-element-control-grid.json",
				new ControlGridType().withId("grid1")
			},
			{ "Section", SectionType.class, "screen-element-section.json", new SectionType().withId("sec1") },
			{
				"MultiColumnSection", MultiColumnSectionType.class, "screen-element-multi-column-section.json",
				new MultiColumnSectionType().withId("mcs1")
			},
			{
				"DetachedRepeat", DetachedRepeatType.class, "screen-element-detached-repeat.json",
				new DetachedRepeatType().withId("dr1").withDetailScreen(new ScreenType().withId("d1"))
			},
			{
				"EmbeddedRepeat", EmbeddedRepeatType.class, "screen-element-embedded-repeat.json",
				new EmbeddedRepeatType().withId("er1").withControlGrid(new ControlGridType().withId("g1"))
			},
			{
				"InlineRepeat",
				InlineRepeatType.class,
				"screen-element-inline-repeat.json",
				new InlineRepeatType().withId("ir1")
			},
			{
				"ButtonPanel",
				ButtonPanelType.class,
				"screen-element-button-panel.json",
				new ButtonPanelType().withId("bp1")
			},
			{
				"CustomScreenElement", CustomScreenElementType.class, "screen-element-custom-screen-element.json",
				new CustomScreenElementType().withId("cse1").withReference("DM")
			},
		};
	}

	@Test(dataProvider = "screenElementTypeSubtypes")
	public void screenElementTypeSubtypeRoundtrips(
		final String discriminator, final Class<? extends ScreenElementType> expectedClass,
		final String resourceName, final ScreenElementType builtElement) throws IOException, JSONException {
		final FormModel model = loadModel(resourceName);
		final ScreenElementType deserialized = firstScreenElement(model);
		assertDeserializesTo(discriminator, expectedClass, deserialized);

		final JSONObject elementNode = firstScreenElementNode(serializeToTree(modelWithScreenElements(builtElement)));
		Assert.assertEquals(elementNode.getString("type"), discriminator);
	}
}
