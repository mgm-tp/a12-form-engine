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
