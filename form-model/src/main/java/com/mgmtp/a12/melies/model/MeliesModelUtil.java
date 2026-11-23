// SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
// Copyright (c) 2012-2026 mgm technology partners GmbH
// See LICENSE file for details. For commercial licensing: a12-license@mgm-tp.com
package com.mgmtp.a12.melies.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IBooleanType;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IConfirmType;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.ICustomFieldType;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IEnumerationType;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IStringType;
import com.mgmtp.a12.melies.model.internal.DocumentModelUtils;
import com.mgmtp.a12.melies.model.types.ExpositionPresentationEnumType;
import com.mgmtp.a12.model.ui.form.consistency.DocumentModelHelper;
import org.apache.commons.collections4.CollectionUtils;

import com.mgmtp.a12.kernel.md.model.api.IElement;
import com.mgmtp.a12.kernel.md.model.api.IField;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.IFieldType;
import com.mgmtp.a12.kernel.md.model.api.fieldtypes.INumberType;
import com.mgmtp.a12.melies.model.locale.LocaleConverter;
import com.mgmtp.a12.melies.model.types.FieldConfigurationEntryType;
import com.mgmtp.a12.melies.model.types.FieldConfigurationType;
import com.mgmtp.a12.melies.model.types.GroupConfigurationEntryType;
import com.mgmtp.a12.melies.model.types.GroupConfigurationType;
import com.mgmtp.a12.melies.model.types.MultilingualTextType;
import com.mgmtp.a12.melies.model.types.ScreenElementType;
import com.mgmtp.a12.melies.model.types.ScreenType;
import com.mgmtp.a12.melies.model.types.TextType;

/**
 * Convenience methods for accessing data structures. Used by Melies tool.
 */
public abstract class MeliesModelUtil {

	private MeliesModelUtil() {
	}

	public static String getPicusFileReference(final MeliesModel model) {
		if (CollectionUtils.isNotEmpty(model.getHeader().getModelReferences())) {
			return model.getHeader().getModelReferences().get(0).getReference();
		}
		return null;
	}

	public static FieldConfigurationEntryType getFieldConfiguration(
		final FieldConfigurationType config, final String uid
	) {
		for (final FieldConfigurationEntryType field : config.getField()) {
			if (uid.equals(field.getElementRef())) {
				return field;
			}
		}
		return null;
	}

	public static GroupConfigurationEntryType getGroupConfiguration(
		final GroupConfigurationType config, final String uid
	) {
		for (final GroupConfigurationEntryType field : config.getGroup()) {
			if (uid.equals(field.getGroupRef())) {
				return field;
			}
		}
		return null;
	}

	public static List<ScreenElementType> getScreenElement(final ScreenType screenType) {
		if (screenType != null && screenType.isScreenElementsSet()) {
			return screenType.getScreenElements();
		} else {
			return null;
		}
	}

	public static List<ScreenElementType> ensureScreenElement(final ScreenType screenType) {
		if (getScreenElement(screenType) == null) {
			screenType.setScreenElements(new ArrayList<>());
		}
		return screenType.getScreenElements();
	}

	public static MultilingualTextType getSuffix(final IElement element, final MeliesModel model) {
		MultilingualTextType suffix = null;
		final List<String> locales = LocaleConverter.convert(model.getHeader().getLocales());

		if (element instanceof IField) {
			final IFieldType dataType = ((IField) element).getEffectiveType().orElse(null);
			if (dataType instanceof INumberType) {
				final Optional<String> optionalTrait = ((INumberType) dataType).getTrait();
				if (optionalTrait.isPresent()) {
					final String trait = optionalTrait.get();

					final List<TextType> values = new ArrayList<TextType>();
					String suffixValue = null;

					if ("percent".equals(trait)) {
						suffixValue = "%";
					} else if ("permille".equals(trait)) {
						suffixValue = "‰";

					}

					if(suffixValue != null) {
						for(String locale : locales) {
							final TextType textType = new TextType();
							textType.setLocale(locale);
							textType.setText(suffixValue);
							values.add(textType);
						}

						suffix = new MultilingualTextType().withText(values);
					}

				}
			}
		}

		return suffix;
	}

	public static ExpositionPresentationEnumType getExpositionWithDefault(final IElement element, final FieldConfigurationEntryType fieldConfig) {
		if (fieldConfig.isExpositionSet()) {
			return fieldConfig.getExposition();
		}
		if (element instanceof IField field) {
			final IFieldType dataType = field.getEffectiveType().orElse(null);
			return switch (dataType) {
				case IBooleanType type -> ExpositionPresentationEnumType.BOOLEAN_SELECT;
				case IConfirmType type -> ExpositionPresentationEnumType.CHECKBOX;
				case IEnumerationType type -> ExpositionPresentationEnumType.COMPACT;
				default -> null;
			};
		} else if (DocumentModelHelper.isMultiSelectGroup(element)) {
			return ExpositionPresentationEnumType.AUTOCOMPLETE;
		} else if (DocumentModelHelper.isAttachmentGroup(element)) {
			return ExpositionPresentationEnumType.FULL;
		}
		return null;
	}
}
