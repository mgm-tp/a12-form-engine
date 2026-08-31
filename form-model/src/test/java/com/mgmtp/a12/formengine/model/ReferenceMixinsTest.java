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

import com.mgmtp.a12.formengine.model.types.ButtonEnumType;
import com.mgmtp.a12.formengine.model.types.ButtonListType;
import com.mgmtp.a12.formengine.model.types.ButtonPanelType;
import com.mgmtp.a12.formengine.model.types.ButtonType;
import com.mgmtp.a12.formengine.model.types.ControlGridType;
import com.mgmtp.a12.formengine.model.types.ControlType;
import com.mgmtp.a12.formengine.model.types.CustomScreenElementType;
import com.mgmtp.a12.formengine.model.types.DetachedRepeatType;
import com.mgmtp.a12.formengine.model.types.EmbeddedRepeatType;
import com.mgmtp.a12.formengine.model.types.FieldBasedRepeatOverviewColumnType;
import com.mgmtp.a12.formengine.model.types.HeaderFooterType;
import com.mgmtp.a12.formengine.model.types.InlineRepeatType;
import com.mgmtp.a12.formengine.model.types.RepeatOverviewColumnType;
import com.mgmtp.a12.formengine.model.types.RowType;
import com.mgmtp.a12.formengine.model.types.ScopeEnumType;
import com.mgmtp.a12.formengine.model.types.ScreenElementType;
import com.mgmtp.a12.formengine.model.types.ScreenType;
import com.mgmtp.a12.formengine.model.types.SectionType;
import com.mgmtp.a12.formengine.serialization.FormModelJsonSerializer;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;

import org.apache.commons.io.IOUtils;
import org.json.JSONException;
import org.json.JSONObject;
import org.testng.Assert;
import org.testng.annotations.Test;

/**
 * Verifies the six named managed/back-reference pairs declared across the mixins in {@code FormModelJsonSerializer}
 * (buttonParent, rowParent, screenParentDetachedRepeat, screenElementParentScreenElement, screenElementParentScreen,
 * columnParentRepeat). Each pair is checked for both directions: the parent pointer must be linked correctly after
 * deserializing a real FormModel fixture (under {@code reference-mixins/}), and it must be absent from the JSON
 * produced by serializing a genuinely cyclic object graph built via the model's own builders.
 */
public class ReferenceMixinsTest {

	private static final FormModelJsonSerializer SERIALIZER = new FormModelJsonSerializer();

	private static FormModel loadModel(final String resourceName) throws IOException {
		try (InputStream inputStream = ReferenceMixinsTest.class.getResourceAsStream("reference-mixins/" + resourceName)) {
			return SERIALIZER.fromJsonString(IOUtils.toString(inputStream, StandardCharsets.UTF_8));
		}
	}

	private static FormModel modelWithScreenElements(final ScreenElementType... elements) throws IOException {
		final FormModel model = loadModel("reference-mixins-empty.json");
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

	@Test
	public void buttonParentReference() throws IOException, JSONException {
		final FormModel model = loadModel("button-parent.json");
		final ButtonPanelType panel = (ButtonPanelType) firstScreenElement(model);
		final ButtonType button = panel.getButton().getFirst();
		Assert.assertSame(button.getParent(), panel, "button.parent must be linked to its panel after deserialize");

		final ButtonPanelType builtPanel = new ButtonPanelType()
			.withId("bp1")
			.withButton(new ButtonType().withId("btn1").withType(ButtonEnumType.EVENT).withName("b1"));
		Assert.assertSame(
			builtPanel.getButton().getFirst().getParent(),
			builtPanel,
			"withButton() must wire a real cycle");

		final JSONObject buttonNode = firstScreenElementNode(serializeToTree(modelWithScreenElements(builtPanel)))
			.getJSONArray("button").getJSONObject(0);
		Assert.assertFalse(buttonNode.has("parent"), "'parent' must not be serialized on a button");
	}

	/**
	 * A {@link ButtonType} can also live in a plain {@link ButtonListType} (subHeaderBox/footerBox major/minor
	 * buttons), which is not annotated with {@code @JsonManagedReference} and never wires up a parent. This is the path
	 * was guarded via {@code @JsonIgnoreProperties({"parent"})} which lead to issues with the Jackson 3.2.1 and was
	 * removed. Now, {@code parent} must stay excluded here purely via {@code @JsonBackReference}, independent of the
	 * buttonPanel reference pairing.
	 */
	@Test
	public void buttonListDoesNotLinkOrLeakParent() throws IOException, JSONException {
		final FormModel model = loadModel("button-list.json");
		final ButtonType button = model.getContent().getSubHeaderBox().getMajorButtons().getButton().getFirst();
		Assert.assertNull(button.getParent(), "a button inside a plain ButtonListType must not have its parent linked");

		final HeaderFooterType builtSubHeaderBox = new HeaderFooterType()
			.withId("subHeaderBox1")
			.withMajorButtons(new ButtonListType()
				.withButton(new ButtonType().withId("btn1").withType(ButtonEnumType.EVENT).withName("b1")
					.withScope(ScopeEnumType.ALWAYS)));
		final FormModel builtModel = loadModel("reference-mixins-empty.json");
		builtModel.getContent().withSubHeaderBox(builtSubHeaderBox);

		final JSONObject
			buttonListNode =
			serializeToTree(builtModel).getJSONObject("content").getJSONObject("subHeaderBox")
				.getJSONObject("majorButtons").getJSONArray("button").getJSONObject(0);
		Assert.assertFalse(
			buttonListNode.has("parent"),
			"'parent' must not be serialized on a button inside a plain button list");
	}

	@Test
	public void rowParentReference() throws IOException, JSONException {
		final FormModel model = loadModel("row-parent.json");
		final ControlGridType grid = (ControlGridType) firstScreenElement(model);
		final RowType row = grid.getRow().getFirst();
		Assert.assertSame(row.getParent(), grid, "row.parent must be linked to its grid after deserialize");
		Assert.assertSame(
			row.getCell().getFirst().getParent(),
			grid,
			"cell.parent must be linked to the grid after deserialize");

		final ControlGridType builtGrid = new ControlGridType()
			.withId("grid1")
			.withRow(new RowType().withId("row1").withCell(new ControlType().withId("c1").withElementRef("field1")));
		Assert.assertSame(builtGrid.getRow().getFirst().getParent(), builtGrid, "withRow() must wire a real cycle");

		final JSONObject gridNode = firstScreenElementNode(serializeToTree(modelWithScreenElements(builtGrid)));
		final JSONObject rowNode = gridNode.getJSONArray("row").getJSONObject(0);
		Assert.assertFalse(rowNode.has("parent"), "'parent' must not be serialized on a row");
		Assert.assertFalse(
			rowNode.getJSONArray("cell").getJSONObject(0).has("parent"),
			"'parent' must not be serialized on a cell");
	}

	@Test
	public void screenParentDetachedRepeatReference() throws IOException, JSONException {
		final FormModel model = loadModel("screen-parent-detached-repeat.json");
		final DetachedRepeatType detachedRepeat = (DetachedRepeatType) firstScreenElement(model);
		Assert.assertSame(
			detachedRepeat.getScreen().getParentScreenElement(), detachedRepeat,
			"detailScreen.parentScreenElement must be linked to its repeat after deserialize");

		final DetachedRepeatType builtRepeat = new DetachedRepeatType()
			.withId("dr1")
			.withDetailScreen(new ScreenType().withId("detail1"));
		Assert.assertSame(
			builtRepeat.getScreen().getParentScreenElement(), builtRepeat,
			"withDetailScreen() must wire a real cycle");

		final JSONObject
			detailScreenNode =
			firstScreenElementNode(serializeToTree(modelWithScreenElements(builtRepeat)))
				.getJSONObject("detailScreen");
		Assert.assertFalse(
			detailScreenNode.has("parentScreenElement"), "'parentScreenElement' must not be serialized on a screen");
	}

	@Test
	public void screenElementParentScreenElementReferenceViaSection() throws IOException, JSONException {
		final FormModel model = loadModel("screen-element-parent-screen-element-via-section.json");
		final SectionType section = (SectionType) firstScreenElement(model);
		final ScreenElementType nested = section.getScreenElement().getFirst();
		Assert.assertSame(
			nested.getParent(),
			section,
			"nested element.parent must be linked to its section after deserialize");
		Assert.assertNull(nested.getParentScreen(), "an element nested in a section must not have parentScreen set");

		final SectionType builtSection = new SectionType()
			.withId("sec1")
			.withScreenElement(new CustomScreenElementType().withId("cse1").withReference("DM"));
		Assert.assertSame(
			builtSection.getScreenElement().getFirst().getParent(), builtSection,
			"withScreenElement() must wire a real cycle");

		final JSONObject nestedNode = firstScreenElementNode(serializeToTree(modelWithScreenElements(builtSection)))
			.getJSONArray("screenElements").getJSONObject(0);
		Assert.assertFalse(nestedNode.has("parent"), "'parent' must not be serialized on a nested screen element");
	}

	@Test
	public void screenElementParentScreenElementReferenceViaEmbeddedRepeatControlGrid()
		throws IOException, JSONException {
		final FormModel model = loadModel("screen-element-parent-screen-element-via-embedded-repeat-control-grid.json");
		final EmbeddedRepeatType embeddedRepeat = (EmbeddedRepeatType) firstScreenElement(model);
		Assert.assertSame(
			embeddedRepeat.getControlGrid().getParent(), embeddedRepeat,
			"controlGrid.parent must be linked to its repeat after deserialize");

		final EmbeddedRepeatType builtRepeat = new EmbeddedRepeatType()
			.withId("er1")
			.withControlGrid(new ControlGridType().withId("grid1"));
		Assert.assertSame(
			builtRepeat.getControlGrid().getParent(),
			builtRepeat,
			"withControlGrid() must wire a real cycle");

		final JSONObject controlGridNode = firstScreenElementNode(serializeToTree(modelWithScreenElements(builtRepeat)))
			.getJSONObject("controlGrid");
		Assert.assertFalse(controlGridNode.has("parent"), "'parent' must not be serialized on a controlGrid");
	}

	@Test
	public void screenElementParentScreenReference() throws IOException, JSONException {
		final FormModel model = loadModel("screen-element-parent-screen.json");
		final ScreenType screen = model.getContent().getScreens().getFirst();
		final ScreenElementType element = screen.getScreenElements().getFirst();
		Assert.assertSame(
			element.getParentScreen(),
			screen,
			"element.parentScreen must be linked to its screen after deserialize");

		final ScreenElementType builtElement = new CustomScreenElementType().withId("cse1").withReference("DM");
		final ScreenType builtScreen = new ScreenType().withId("s1").withScreenElements(builtElement);
		Assert.assertSame(builtElement.getParentScreen(), builtScreen, "withScreenElements() must wire a real cycle");

		final FormModel builtModel = loadModel("reference-mixins-empty.json");
		builtModel.getContent().withScreens(List.of(builtScreen));
		final JSONObject elementNode = firstScreenElementNode(serializeToTree(builtModel));
		Assert.assertFalse(
			elementNode.has("parentScreen"),
			"'parentScreen' must not be serialized on a screen element");
	}

	@Test
	public void columnParentRepeatReference() throws IOException, JSONException {
		final FormModel model = loadModel("column-parent-repeat.json");
		final InlineRepeatType repeat = (InlineRepeatType) firstScreenElement(model);
		final RepeatOverviewColumnType column = repeat.getRepeatOverviewColumn().getFirst();
		Assert.assertSame(column.getParent(), repeat, "column.parent must be linked to its repeat after deserialize");

		final InlineRepeatType builtRepeat = new InlineRepeatType()
			.withId("ir1")
			.withRepeatOverviewColumn(new FieldBasedRepeatOverviewColumnType().withId("col1").withElementRef("field1"));
		Assert.assertSame(
			builtRepeat.getRepeatOverviewColumn().getFirst().getParent(), builtRepeat,
			"withRepeatOverviewColumn() must wire a real cycle");

		final JSONObject columnNode = firstScreenElementNode(serializeToTree(modelWithScreenElements(builtRepeat)))
			.getJSONArray("repeatOverviewColumn").getJSONObject(0);
		Assert.assertFalse(columnNode.has("parent"), "'parent' must not be serialized on a repeat overview column");
	}
}
