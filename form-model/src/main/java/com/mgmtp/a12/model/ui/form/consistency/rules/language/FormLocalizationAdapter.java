// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.model.ui.form.consistency.rules.language;

import com.mgmtp.a12.melies.model.types.MultilingualTextType;
import com.mgmtp.a12.melies.model.types.TextType;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class FormLocalizationAdapter implements LocalizedTextAdapter {

	private final MultilingualTextType formTextType;

	private FormLocalizationAdapter(final MultilingualTextType formTextType) {
		this.formTextType = formTextType;
	}

	public static FormLocalizationAdapter adapterFor(final MultilingualTextType formTextType) {
		return new FormLocalizationAdapter(formTextType);
	}

	@Override
	public Set<LocalizedTextValue> getLocalizedTexts() {
		if (formTextType == null) {
			return Collections.emptySet();
		}
		final List<TextType> texts = formTextType.getText();
		final Set<LocalizedTextValue> convertedValues = new HashSet<>();
		for (final TextType text : texts) {
			final LocalizedTextValue value = new LocalizedTextValue(text.getLocale(), text.getText());
			convertedValues.add(value);
		}
		return convertedValues;
	}

}
