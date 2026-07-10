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
package com.mgmtp.a12.formengine.consistency.rules.layout;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;

import com.mgmtp.a12.formengine.consistency.rules.ModelLoader;
import com.mgmtp.a12.formengine.model.FormModel;
import com.mgmtp.a12.formengine.model.visitor.ModelWalker;

import org.testng.annotations.Test;



public class ResponsiveLayoutModelVisitorTest {

	@Test
	public void checkResponsiveLayoutModelVisitorTrue() {
		final ResponsiveLayoutModelVisitor visitor = new ResponsiveLayoutModelVisitor();
		final ModelWalker walker = new ModelWalker(visitor);

		final FormModel modelWithResponsiveLayouts = ModelLoader.loadModel(
                "com/mgmtp/a12/formengine/consistency/rules/layout/responsiveLayoutVisitorTestTrueFormModel.json");

		walker.acceptModel(modelWithResponsiveLayouts);
		assertThat(visitor.hasResponsiveLayouts(), is(true));
	}

	@Test
	public void checkResponsiveLayoutModelVisitorFalse() {
		final ResponsiveLayoutModelVisitor visitor = new ResponsiveLayoutModelVisitor();
		final ModelWalker walker = new ModelWalker(visitor);

		final FormModel modelWithoutResponsiveLayouts = ModelLoader.loadModel(
                "com/mgmtp/a12/formengine/consistency/rules/layout/responsiveLayoutVisitorTestFalseFormModel.json");

		walker.acceptModel(modelWithoutResponsiveLayouts);
		assertThat(visitor.hasResponsiveLayouts(), is(false));
	}
}
