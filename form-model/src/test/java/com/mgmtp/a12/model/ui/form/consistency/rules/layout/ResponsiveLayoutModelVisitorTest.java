// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.layout;

import org.testng.annotations.Test;

import com.mgmtp.a12.melies.model.MeliesModel;
import com.mgmtp.a12.melies.model.visitor.ModelWalker;
import com.mgmtp.a12.model.ui.form.consistency.rules.ModelLoader;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;



public class ResponsiveLayoutModelVisitorTest {

	@Test
	public void checkResponsiveLayoutModelVisitorTrue() {
		final ResponsiveLayoutModelVisitor visitor = new ResponsiveLayoutModelVisitor();
		final ModelWalker walker = new ModelWalker(visitor);

		final MeliesModel modelWithResponsiveLayouts = ModelLoader.loadModel(
			"com/mgmtp/a12/model/ui/form/consistency/rules/layout/responsiveLayoutVisitorTestTrueFormModel.json");

		walker.acceptModel(modelWithResponsiveLayouts);
		assertThat(visitor.hasResponsiveLayouts(), is(true));
	}

	@Test
	public void checkResponsiveLayoutModelVisitorFalse() {
		final ResponsiveLayoutModelVisitor visitor = new ResponsiveLayoutModelVisitor();
		final ModelWalker walker = new ModelWalker(visitor);

		final MeliesModel modelWithoutResponsiveLayouts = ModelLoader.loadModel(
			"com/mgmtp/a12/model/ui/form/consistency/rules/layout/responsiveLayoutVisitorTestFalseFormModel.json");

		walker.acceptModel(modelWithoutResponsiveLayouts);
		assertThat(visitor.hasResponsiveLayouts(), is(false));
	}
}
