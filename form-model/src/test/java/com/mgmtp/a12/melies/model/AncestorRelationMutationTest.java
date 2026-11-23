// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model;

import com.mgmtp.a12.melies.model.types.ObjectFactory;
import com.mgmtp.a12.melies.model.types.ScreenType;
import com.mgmtp.a12.melies.model.types.SectionType;
import com.mgmtp.a12.model.ui.form.serialization.FormModelJsonStreamSerializer;
import org.testng.annotations.Test;

public class AncestorRelationMutationTest {

	private static final ObjectFactory MOF = new ObjectFactory();

	@Test
	public void moveNestedSection() {
		final ModelElements model = ModelElements.load();

		final SectionType newSection = MOF.createSectionType();
		model.outerSection.getScreenElement().remove(model.section);
		newSection.getScreenElement().add(model.section);
	}

	@Test
	public void copyNestedSection() {
		final ModelElements model = ModelElements.load();

		final SectionType newSection = MOF.createSectionType();
		final SectionType sectionCopy = (SectionType) model.section.copy();
		newSection.getScreenElement().add(sectionCopy);
	}

	@Test
	public void moveTopLevelSection() {
		final ModelElements model = ModelElements.load();

		final SectionType newSection = MOF.createSectionType();
		model.screen1.getScreenElements().remove(model.outerSection);
		newSection.withScreenElement(model.outerSection);
	}

	// helper holding tested model elements
	private static class ModelElements {
		private ScreenType screen1;
		private SectionType outerSection;
		private SectionType section;

		public static ModelElements load() {
			final MeliesModel model =
				(MeliesModel) new FormModelJsonStreamSerializer().deserialize(AncestorRelationMutationTest.class.getResourceAsStream(
					"AncestorRelationTestMeliesModel.json"));

			final ModelElements me = new ModelElements();
			me.screen1 = model.getContent().getScreens().get(0);
			me.outerSection = (SectionType) me.screen1.getScreenElements().get(0);
			me.section = (SectionType) me.outerSection.getScreenElement().get(0);
			return me;
		}
	}
}
