// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency;

import java.util.Locale;
import java.util.Optional;

import org.testng.Assert;
import org.testng.annotations.Test;

import com.mgmtp.a12.kernel.md.model.a12internal.LocalizedTextMapBuilder;
import com.mgmtp.a12.kernel.md.model.api.IDescribed;
import com.mgmtp.a12.kernel.md.model.api.ILocalizedTextMap;

public class DocumentModelHelperTest {


	@Test
	public void testGetInternalDescription() {
		
		final String expectedString = "My internal description";

		final IDescribed described = new IDescribed() {
			
			private final ILocalizedTextMap internalDescription = new LocalizedTextMapBuilder()
				.add(Locale.ENGLISH, expectedString)
				.build();
			private final ILocalizedTextMap externalDescription = new LocalizedTextMapBuilder().build();
			
			@Override
			public ILocalizedTextMap getInternalDescription() {
				return internalDescription;
			}
			
			@Override
			public ILocalizedTextMap getExternalDescription() {
				return externalDescription;
			}
		};
		
		
		final String actualString = DocumentModelHelper.getInternalDescription(described, Optional.of(Locale.ENGLISH));
		Assert.assertEquals(actualString, expectedString);
	}
}
